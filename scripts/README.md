# Scripts

This directory contains build helpers for the Node CLI rewrite.

Key scripts:

- `scripts/build_binary.js`: builds a `pkg`-based `mailbox` binary and copies it
  into the appropriate `mailbox-cli/packages/<platform>/bin/` directory. It
  resolves dependencies from the CLI workspace package and runs the MCP smoke
  test before copying the artifact.
- `scripts/mcp_smoke_test.js`: sends MCP `initialize` and `tools/list` requests
  to a built binary so release builds fail before publishing a broken MCP
  executable.
- `scripts/unsubscribe.mjs`: bulk unsubscribe helper. Reads `account_id<TAB>from_substring`
  lines from stdin or a file, extracts each sender's `List-Unsubscribe` header,
  sends mailto unsubscribes via SMTP and opens https one-click links in your
  browser. Pass `--dry-run` to preview without acting.

Legacy:

- Older Python workflow scripts and HTTP API helpers have been removed. If you
  need historical context, see `docs/archive/`.
