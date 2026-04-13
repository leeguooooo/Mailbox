---
name: mailbox
description: "OpenClaw skill for reading and managing email via the mailbox CLI. List accounts, read inbox, show emails, delete messages, run digests, and monitor mailboxes. Use when the user asks to check email, read messages, clean inbox, run email digests, or automate mailbox operations."
---

# Mailbox CLI (OpenClaw Skill)

Use the mailbox CLI to read and manage email. Returns structured JSON outputs and optional text summaries. OpenClaw handles channel delivery and scheduling.

## Requirements

- mailbox CLI installed (`npm install -g mailbox-cli`)
- Credentials in `~/.config/mailbox/auth.json`

## Commands

```bash
# List accounts
mailbox account list --json

# List recent emails
mailbox email list --limit 20 --json

# Show a specific email (plain text, no HTML)
mailbox email show <uid> --account-id <id> --preview --no-html --json

# Delete an email (always dry-run first)
mailbox email delete <uid> --account-id <id> --folder INBOX --dry-run --json
mailbox email delete <uid> --account-id <id> --folder INBOX --confirm --json

# Run digest or monitor
mailbox digest run --json
mailbox monitor run --json

# Quick inbox summary (human-readable)
mailbox inbox --limit 15 --text
```

## Safety Rules

- Always use `--json` for automation and check the `success` field.
- Include `--account-id` for destructive operations.
- Destructive operations default to dry-run unless `--confirm` is provided.
- Always run `--dry-run` before mutating, then `--confirm` after reviewing.

## Output Contract

- JSON response always includes `success` (boolean) and `error` fields.
- `error` is an object: `{ code, message, detail? }`.
- Exit codes: `0` success, `1` operation failed, `2` invalid usage.
