# builtin-cli

CLI for searching **tech/startup jobs on builtin.com** across the US.

**Data source**: builtin.com's server-rendered `/jobs` and `/jobs/remote` listing pages, plus individual `/job/<slug>/<id>` detail pages.
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls TypeScript dev types.

> **robots.txt note.** builtin.com's `robots.txt` disallows keyword (`?search=`), industry, and
> major-city query filters for generic bots — only plain listing pages (`/jobs`, `/jobs/remote`,
> `?page=N`) are allowed. This CLI honors that: it never sends your `--query`/`--location`/`--remote`
> filters to the server as a request parameter. Instead it fetches an allowed listing page and
> matches your filters against the results client-side. One `search` call scans one page
> (~25 postings) — a narrow `--query` may need a few `--page` calls to turn up a match, the same
> way scrolling a results list by hand would.

## Installation

```bash
cd .agents/skills/builtin-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `search` | Fetch a listing page and filter it client-side |
| `detail` | Fetch full detail for a single job listing (requires the full URL) |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All errors are written to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
# Data/software roles, page 1 of the general firehose
bun run src/cli.ts search -q "data engineer" --format table

# Remote python roles
bun run src/cli.ts search --remote remote -q "python" --format table

# Roles in/near New York, posted in the last week
bun run src/cli.ts search -l "New York" --jobage 7 --format table

# Full detail for one job (use the "url" field from a search result — bare
# numeric ids 404 because BuiltIn's routing requires the exact slug)
bun run src/cli.ts detail https://builtin.com/job/data-engineer/12345678 --format plain
```

See `../SKILL.md` for the full flag reference and the robots.txt policy note.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keyword filter, matched client-side against the job title. |
| `--location` | `-l` | Location substring filter, matched client-side (e.g. `"Remote"`, `"San Jose"`). |
| `--remote` | | `remote` \| `hybrid` \| `onsite`. `remote` fetches `/jobs/remote`; hybrid/onsite filter client-side. |
| `--jobage` | | Posted within N days, parsed from BuiltIn's relative timestamps ("3 Days Ago"). Unparseable dates are kept, not excluded. |
| `--page` | | 1-indexed BuiltIn listing page (~25 results/page). Default 1. |
| `--limit` | `-n` | Cap results emitted. |
| `--format` | | `json` \| `table` \| `plain`. |
