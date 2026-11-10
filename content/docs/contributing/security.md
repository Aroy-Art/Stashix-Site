---
title: Reporting security issues
linkTitle: Security
description: How to report a security vulnerability in Stashix privately, through GitHub or by email, and what to include in the report.
weight: 10
---

If you find a security problem in Stashix or on stashix.net, report it
privately so it can be fixed before it is public. Don't open a public issue,
pull request or discussion about it.

## How to report {#report}

Use either of these:

- **GitHub:** open a
  [private security advisory](https://github.com/aroy-art/stashix/security/advisories/new)
  on the Stashix repository. Only the maintainers can see it.
- **Email:** write to
  [security@stashix.net](mailto:security@stashix.net).

The same contacts are listed in
[`/.well-known/security.txt`](/.well-known/security.txt).

## What to include {#include}

- The Stashix version, and how it is installed (Docker Compose or from source).
- What the problem is and what an attacker could do with it.
- Steps to reproduce it, or a proof of concept.
- Whether the problem needs an account on the server, and with which role.

## What happens next {#next}

You'll get a reply to confirm the report has been received. Once a fix is
ready it ships in a release, and the
[release notes](/blog/release/) say what was fixed. Tell us if you'd like to
be credited.

Stashix is maintained by volunteers and is not yet at version 1.0, so there is
no bug bounty.
