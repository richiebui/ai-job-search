#!/usr/bin/env bun
// Self-contained CLI for searching tech/startup jobs on builtin.com.
// No external CLI framework, so it runs anywhere `bun` is available with zero
// install beyond the repo clone.
//
// robots.txt disallows keyword/industry/major-city query filters for generic
// bots, so this CLI only ever requests allowed listing pages (/jobs, /jobs/remote,
// ?page=N) and applies --query/--location/--remote/--jobage client-side over
// whatever page it fetches. See ../url-reference.md for the full policy trail.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `builtin-cli — search tech/startup jobs on builtin.com

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <url> [--format json|plain]

SEARCH FLAGS
  --query, -q <text>      Keyword filter, matched client-side against the job title.
  --location, -l <text>   Location substring filter, matched client-side (e.g. "Remote", "San Jose").
  --remote <mode>         remote | hybrid | onsite. "remote" fetches the dedicated
                          /jobs/remote listing; hybrid/onsite filter client-side.
  --jobage <days>         Posted within N days (parsed from BuiltIn's relative
                          timestamps, e.g. "3 Days Ago"). Postings with an
                          unparseable age are kept, not excluded.
  --page <n>              1-indexed BuiltIn listing page (~25 results/page). Default 1.
  --limit, -n <n>         Cap results emitted (client-side).
  --format <fmt>          json (default) | table | plain.

NOTE: builtin.com's robots.txt disallows keyword/industry/major-city query
parameters for generic bots. All filtering above happens client-side over an
allowed listing page — it does not send your keywords to the server. This
means one \`search\` call scans one page (~25 postings); a narrow --query may
need a few --page calls to find matches, same as scrolling a results list by hand.

NOTE: \`detail\` requires the FULL job URL from a search result's "url" field
(e.g. https://builtin.com/job/data-engineer/12345678), not a bare numeric id —
unlike LinkedIn, BuiltIn's routing requires the exact slug.

EXAMPLES
  bun run src/cli.ts search -q "data engineer" --format table
  bun run src/cli.ts search --remote remote -q "python" --page 1 --format table
  bun run src/cli.ts search -l "New York" --jobage 7 --format table
  bun run src/cli.ts detail https://builtin.com/job/data-engineer/12345678 --format plain
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  if (cmd === "search") {
    const fmt = (flags.format as string) || "json"

    const parseIntFlag = (name: string, raw: string | boolean | string[]): number | null => {
      const val = parseInt(raw as string, 10)
      if (isNaN(val)) {
        process.stderr.write(JSON.stringify({ error: `--${name} must be a number, got "${raw}"`, code: "BAD_ARG" }) + "\n")
        return null
      }
      return val
    }

    if (flags.jobage !== undefined) {
      const v = parseIntFlag("jobage", flags.jobage)
      if (v === null) return 1
      flags.jobage = String(v)
    }
    if (flags.page !== undefined) {
      const v = parseIntFlag("page", flags.page)
      if (v === null) return 1
      flags.page = String(v)
    }
    if (flags.limit !== undefined) {
      const v = parseIntFlag("limit", flags.limit)
      if (v === null) return 1
      flags.limit = String(v)
    }

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : 9999,
      remote: typeof flags.remote === "string" ? flags.remote : undefined,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : undefined,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) {
      process.stderr.write(JSON.stringify({ error: "detail requires an <id|url>", code: "NO_ID" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: DetailOpts = {
      id,
      format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"],
    }
    return runDetail(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main().then((code) => process.exit(code))
