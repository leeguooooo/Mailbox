---
name: mailbox-cli
displayName: "Mailbox CLI"
version: 0.0.0
description: "Node.js CLI for multi-account IMAP/SMTP email management. Send, read, search, and delete emails with structured JSON output. Use when the user needs to check inbox, send mail, list accounts, manage email folders, or automate email workflows programmatically."
keywords:
  - mailbox
  - email
  - imap
  - smtp
  - cli
  - automation
  - openclaw
  - agent
  - sync
  - inbox
---

# Mailbox CLI

Multi-account email management via CLI with structured JSON output.

## Install

```bash
npm install -g @leeguoo/mailbox-cli
mailbox --help
```

## Common Commands

```bash
# List configured accounts
mailbox account list --json

# List recent unread emails
mailbox email list --unread-only --limit 20 --json

# Read a specific email
mailbox email show <uid> --account-id <id> --json

# Delete an email (dry-run first, then confirm)
mailbox email delete <uid> --account-id <id> --folder INBOX --dry-run --json
mailbox email delete <uid> --account-id <id> --folder INBOX --confirm --json
```

## Automation Rules

- Always use `--json` and validate the top-level `success` / `error` fields.
- `error` is structured: `{ code, message, detail? }`.
- Destructive commands default to dry-run unless `--confirm` is provided.
- Always include `--account-id` for destructive operations.

## Workflow: Safe Destructive Operation

1. Run the command with `--dry-run` to preview the action.
2. Parse JSON output — check `success` is `true` and review affected items.
3. Re-run with `--confirm` to execute.
4. Verify the result by checking `success` in the response.

## References

- Full JSON contract: `docs/CLI_JSON_CONTRACT.md`
- AI integration guide: `docs/AI_SKILL_MAILBOX_CLI.md`
