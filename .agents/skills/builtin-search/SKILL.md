---
name: builtin-search
version: 1.0.0
description: >
  Use this skill to search live tech/startup job listings on builtin.com
  (United States). Covers software, data, engineering, product, design, and
  other tech-adjacent roles at startups and tech companies. Trigger phrases:
  find a tech job, software job search, developer jobs, engineering vacancies,
  data jobs, startup jobs, "are there any <tech role> jobs on builtin",
  look up this builtin job posting.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/builtin-search/cli/src/cli.ts *)
---

# BuiltIn (builtin.com) Search Skill

Search live tech/startup job listings from **builtin.com**, a US tech-focused job
board. No authentication, no API key, and **zero runtime dependencies** — it runs
with just `bun`.

> This is a US-market worked example of the repo's job-portal-skill pattern,
> alongside the country-agnostic `linkedin-search` and `freehire-search` skills.

## ⚠️ robots.txt-constrained filtering

builtin.com's `robots.txt` disallows keyword-search, industry, and major-metro
query parameters for generic bots (only named search engines get an exception).
This skill respects that: it only ever requests the allowed plain listing pages
(`/jobs`, `/jobs/remote`, `?page=N`) and applies `--query`/`--location`/`--remote`/
`--jobage` **client-side** over whatever page comes back — it never sends your
search terms to the server as a request parameter.

Practical consequence: one `search` call scans **one page** (~25 postings). A
narrow keyword may return zero matches on page 1 — that's not a bug, it's the
same as scrolling a results list by hand and not seeing your term yet. Try a
few `--page` values, or broaden `--query`.

## When to use this skill

- Search for US tech/startup job openings by keyword, location substring, or remote/hybrid/onsite mode
- Filter by recency (posted within N days, parsed from BuiltIn's relative timestamps)
- Get the full description of a specific BuiltIn job listing

## Commands

### Search job listings

```bash
bun run .agents/skills/builtin-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keyword filter, matched client-side against the job title.
- `--location <text>` / `-l <text>` — location substring filter, matched client-side (e.g. `"Remote"`, `"San Jose"`, `"New York"`).
- `--jobage <days>` — posted within N days (parsed from relative timestamps like `"3 Days Ago"`). Postings with an unparseable date are kept, not excluded.
- `--remote <mode>` — `remote`, `hybrid`, or `onsite`. `remote` fetches the dedicated `/jobs/remote` listing (an allowed path); `hybrid`/`onsite` filter client-side.
- `--page <n>` — 1-indexed BuiltIn listing page (~25 results/page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/builtin-search/cli/src/cli.ts detail <url> [--format json|plain]
```

**Requires the full job URL** from a search result's `url` field (e.g.
`https://builtin.com/job/data-engineer/12345678`) — unlike LinkedIn, BuiltIn's
routing requires the exact slug; a bare numeric id 404s.

## Usage examples

```bash
# Data engineer roles, page 1
bun run .agents/skills/builtin-search/cli/src/cli.ts search -q "data engineer" --format table

# Remote python roles
bun run .agents/skills/builtin-search/cli/src/cli.ts search --remote remote -q "python" --format table

# Roles in/near New York, posted in the last week
bun run .agents/skills/builtin-search/cli/src/cli.ts search -l "New York" --jobage 7 --format table

# Full details for a specific job (use the url from a search result)
bun run .agents/skills/builtin-search/cli/src/cli.ts detail https://builtin.com/job/data-engineer/12345678 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing a result's `url` to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

Search JSON is `{ "meta": { "count", "page" }, "results": [...] }`; each result
carries `id`, `title`, `company`, `companyUrl`, `location`, `date`, `url`,
`workMode`, `salary`, `seniority` (missing values are `null`). All errors are
written to **stderr** as `{ "error": "...", "code": "..." }` and the process
exits with code `1`.

## Notes

- Data is from builtin.com's server-rendered listing/detail pages — no
  credentials required.
- `date` is BuiltIn's relative posting time (e.g. `"39 Minutes Ago"`, `"Reposted
  22 Hours Ago"`), not an ISO timestamp — the CLI converts it to an approximate
  day count internally for `--jobage`.
- `salary` and `seniority` are frequently `null` — not every posting includes them.
- Only tech/startup roles are covered; BuiltIn's non-tech coverage is thin.
- See `url-reference.md` for the full robots.txt policy trail and HTML anchors.
