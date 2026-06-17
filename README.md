# Mailbox CLI

CLI-first email management for multi-account IMAP/SMTP with a local sync cache.

Primary interface: the `mailbox` CLI (Node.js implementation). This repo ships
prebuilt platform binaries via npm (no Python required for end users).

## Supported Providers

- 163 Mail (mail.163.com / mail.126.com)
- QQ Mail (mail.qq.com)
- Gmail (mail.google.com)
- Outlook/Hotmail
- Custom IMAP servers

## Install

### From GitHub Releases (recommended — no npm, no Node)

```bash
curl -fsSL https://raw.githubusercontent.com/leeguooooo/Mailbox/main/install.sh | sh
mailbox --help
```

Downloads the prebuilt binary for your platform (macOS arm64/x64, Linux x64) from the
[latest GitHub Release](https://github.com/leeguooooo/Mailbox/releases/latest), verifies its
checksum, and installs to `~/.local/bin`. Pin a version with `MAILBOX_VERSION=v2.11.2`, or
change the dir with `MAILBOX_INSTALL_DIR=...`.

### npm (deprecated)

```bash
npm install -g @leeguoo/mailbox-cli   # may lag the GitHub Releases; prefer the installer above
```

The npm registry is no longer the primary channel — releases ship as GitHub Release binaries.

### As an AI Skill (Claude Code / Cursor / etc.)

```bash
# Project scope — installs into ./.claude/skills/mailbox (or ./.cursor/skills/...):
npx skills add leeguooooo/Mailbox --skill mailbox

# User scope — installs into ~/.claude/skills/mailbox:
npx skills add leeguooooo/Mailbox --skill mailbox -g
```

The skill assumes the CLI is on `PATH` (install via the `curl … install.sh | sh` above).
For the biggest speedup also run `mailbox daemon install` once.

### MCP server (Claude Desktop / Code / Cursor)

```bash
mailbox mcp config --json   # prints a paste-ready mcpServers entry
```

### From source (development)

```bash
pnpm install
pnpm test

# build a local platform binary into mailbox-cli/packages/<platform>/bin/mailbox
pnpm build:binary
```

## Configure accounts

```bash
mkdir -p ~/.config/mailbox
cp examples/accounts.example.json ~/.config/mailbox/auth.json
```

Config locations:

- Credentials: `~/.config/mailbox/auth.json`
- Other settings: `~/.config/mailbox/config.toml`

## Common commands

```bash
# CLI help
mailbox --help

# list accounts
mailbox account list --json

# list unread emails (cache by default; --from filters cache-side)
mailbox email list --unread-only --limit 20 --json
mailbox email list --account-id my_account_id --from "newsletter" --json

# show one email (response includes list_unsubscribe when the header is set)
mailbox email show 123456 --account-id my_account_id --json

# mark read (use --dry-run to validate first)
mailbox email mark 123456 --read --account-id my_account_id --folder INBOX --dry-run --json
mailbox email mark 123456 --read --account-id my_account_id --folder INBOX --confirm --json

# delete
mailbox email delete 123456 --account-id my_account_id --folder INBOX --confirm --json

# bulk mutate by sender or subject (no UID list needed)
mailbox email mark --from "support@npmjs.com" --read --confirm --account-id my_account_id --json
mailbox email delete --from "newsletter" --account-id my_account_id --json    # dry-run preview
mailbox email delete --subject "[ad]" --account-id my_account_id --confirm --json
```

### Cache + sync

- Cache DB default: `~/.local/share/mailbox/email_sync.db`
- Listing uses cache by default where possible. Add `--live` to force IMAP.

```bash
mailbox sync status --json
mailbox sync force --json
mailbox sync init
mailbox sync daemon
```

## AI usage guide

If you're integrating this CLI into an AI agent, start here:

- `docs/AI_SKILL_MAILBOX_CLI.md`

## OpenClaw integration

This repo includes an OpenClaw skill at `skills/mailbox/SKILL.md`.

OpenClaw loads skills from:
- `<workspace>/skills`
- `~/.openclaw/skills`

Quick link helper (symlink into `~/.openclaw/skills`):

```bash
./scripts/link_openclaw_skill.sh
```

Force replace an existing link:

```bash
./scripts/link_openclaw_skill.sh --force
```

To use this repo without copying files, add the repo skills directory to
`skills.load.extraDirs` in `~/.openclaw/openclaw.json`:

```json
{
  "skills": {
    "load": {
      "extraDirs": [
        "/path/to/mcp-email-service/skills"
      ]
    }
  }
}
```

OpenClaw handles channel delivery and scheduling; mailbox returns structured
JSON outputs and optional text summaries.

Verify OpenClaw picked up the skill:

```bash
openclaw skills list --eligible
openclaw skills check
```

## Contract

- `docs/CLI_JSON_CONTRACT.md`
---

> Built by **leeguooooo** — field notes on AI agents, reverse engineering & Cloudflare Workers at **[blog.misonote.com](https://blog.misonote.com)** · follow on **[X @leeguooooo](https://x.com/leeguooooo)**
