---
title: Contributing
description: How to help with Stashix. Report bugs, suggest features, improve the documentation, work on the code, or report a security issue privately.
weight: 50
icon: fa-solid fa-handshake-angle
menus:
  main:
    identifier: docs-contributing
    parent: docs
    weight: 50
    params:
      icon: fa-solid fa-handshake-angle
---

Stashix is free software under the
[GNU AGPL v3 or later](https://github.com/aroy-art/stashix/blob/main/LICENSE),
and help of any size is welcome.

## Report a bug or suggest a feature {#issues}

Open an issue on the
[Stashix repository](https://github.com/aroy-art/stashix/issues/new/choose).
For a bug, include your Stashix version, how you installed it, what you did,
and what happened instead. The server log (`docker compose logs stashix`)
usually helps.

Don't report security problems in a public issue. See
[Reporting security issues](security/).

## Improve the documentation {#docs}

This site lives in its own
[repository](https://github.com/Aroy-Art/Stashix-Site). Every docs page has an
**Edit this page** link that opens its source on GitHub, where you can propose
a change as a pull request.

## Work on the code {#code}

To run Stashix from source, follow the
[development instructions](https://github.com/aroy-art/stashix#development) in
the README. It needs Elixir, Erlang/OTP, PostgreSQL and a few system tools.

Sign off each commit to certify you wrote it or have the right to submit it
under the project's licence (the
[Developer Certificate of Origin](https://developercertificate.org/)):

```bash
git commit -s
```

- [Reporting security issues](security/): how to report a vulnerability privately.
{.cards}
