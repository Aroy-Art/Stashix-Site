// Post-build step: strip CSS rules no built page or script can use.
//
// Runs on Hugo's output (default: public/) after `hugo --minify`. Every HTML
// page and every JS bundle is scanned for class names, so classes the theme's
// scripts add at runtime survive as long as they appear as literal strings.
// Classes the scripts assemble from pieces are safelisted below.
//
// The theme links its stylesheets with SRI hashes, so after rewriting a file
// the matching integrity="sha256-…" values in every HTML page are updated too;
// a stale hash would make the browser refuse the stylesheet.
//
// Usage: node scripts/purge-css.mjs [public-dir]

import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import postcss from 'postcss';
import { PurgeCSS } from 'purgecss';

const root = process.argv[2] ?? 'public';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}

const sri = (text) =>
  'sha256-' + createHash('sha256').update(text).digest('base64');

// PurgeCSS drops a whole rule when any class inside a selector list such as
// :is(.a,.b,.c) is unused, even though the rule still matches through the
// others. The theme's preset styles (e.g. ink's square corners) are written
// that way, so leave those rules alone.
const SELECTOR_LIST = /:(is|where|has|not)\(/;

function protectSelectorLists(css) {
  const ast = postcss.parse(css);
  ast.walkRules((rule) => {
    if (SELECTOR_LIST.test(rule.selector)) {
      rule.before(postcss.comment({ text: 'purgecss ignore' }));
    }
  });
  return ast.toString();
}

const files = await walk(root);
const html = files.filter((f) => f.endsWith('.html'));
const js = files.filter((f) => f.endsWith('.js'));
const cssFiles = files.filter((f) => f.endsWith('.css'));

const originals = new Map();
const attributeNames = new Set();
for (const file of cssFiles) {
  const text = await readFile(file, 'utf8');
  originals.set(file, text);
  for (const [, name] of text.matchAll(/\[\s*([a-zA-Z_][\w-]*)/g)) {
    attributeNames.add(name);
  }
}

const results = await new PurgeCSS().purge({
  content: [...html, ...js],
  css: cssFiles.map((file) => ({
    raw: protectSelectorLists(originals.get(file)),
  })),
  // Keep @font-face, @keyframes and custom properties: they are cheap and
  // referenced indirectly (font-family names, animation names, var()).
  fontFace: false,
  keyframes: false,
  variables: false,
  // Keep every attribute selector. The theme drives presets, dark mode and
  // shell state through data-* attributes set at runtime ([data-td-preset=ink],
  // [data-bs-theme=dark], …), which no static scan can see reliably.
  dynamicAttributes: [...attributeNames],
  safelist: {
    standard: [
      // Bootstrap/theme state classes toggled by script.
      'show', 'showing', 'hiding', 'collapsing', 'collapsed', 'fade',
      'active', 'disabled', 'open', 'is-open', 'is-active',
    ],
    // Class names the theme builds by concatenation (oink assets/js).
    greedy: [
      /^td-tabs--/, /^td-blog-gallery-/, /^td-expo-/, /^td-appearance/,
    ],
  },
});

const integrity = new Map();
let before = 0;
let after = 0;

for (const [i, file] of cssFiles.entries()) {
  const original = originals.get(file);
  // Drop any "purgecss ignore" markers PurgeCSS left behind.
  const ast = postcss.parse(results[i].css);
  ast.walkComments((comment) => comment.remove());
  const purged = ast.toString();
  before += Buffer.byteLength(original);
  after += Buffer.byteLength(purged);
  if (purged === original) continue;
  await writeFile(file, purged);
  integrity.set(sri(original), sri(purged));
  console.log(
    `purge-css: ${relative(root, file)} ${original.length} -> ${purged.length} bytes`,
  );
}

if (integrity.size > 0) {
  for (const file of html) {
    const text = await readFile(file, 'utf8');
    let next = text;
    for (const [from, to] of integrity) next = next.replaceAll(from, to);
    if (next !== text) await writeFile(file, next);
  }
}

console.log(
  `purge-css: ${cssFiles.length} stylesheets, ${before} -> ${after} bytes`,
);
