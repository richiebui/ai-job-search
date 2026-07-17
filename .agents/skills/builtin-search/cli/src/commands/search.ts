import {
  LISTING_URL,
  REMOTE_LISTING_URL,
  htmlFetch,
  parseJobCards,
  matchesFilters,
  writeError,
  type JobCard,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  jobage: number
  remote?: string // "remote" | "hybrid" | "onsite"
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

function buildUrl(opts: SearchOpts): string {
  // Only ever request allowed paths (robots.txt disallows /jobs*?search= and
  // most location/industry filters) — /jobs/remote is the one filtered path
  // that IS allowed, so we use it when the caller wants remote roles. Every
  // other filter (--query, --location, --remote hybrid/onsite, --jobage) is
  // applied client-side in matchesFilters over whatever this page returns.
  const base = opts.remote?.toLowerCase() === "remote" ? REMOTE_LISTING_URL : LISTING_URL
  return opts.page > 1 ? `${base}?page=${opts.page}` : base
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 38).padEnd(38)
    const company = (c.company || "—").slice(0, 22).padEnd(22)
    const loc = (c.location || "—").slice(0, 22).padEnd(22)
    const mode = (c.workMode || "—").slice(0, 8).padEnd(8)
    const date = c.date || "—"
    return `${c.id.padEnd(9)} ${title} ${company} ${loc} ${mode} ${date}`
  })
  const header =
    "ID".padEnd(9) +
    " " +
    "TITLE".padEnd(38) +
    " " +
    "COMPANY".padEnd(22) +
    " " +
    "LOCATION".padEnd(22) +
    " " +
    "MODE".padEnd(8) +
    " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const html = await htmlFetch(buildUrl(opts))
    let cards = parseJobCards(html)
    cards = cards.filter((c) =>
      matchesFilters(c, {
        query: opts.query,
        location: opts.location,
        remote: opts.remote,
        jobage: opts.jobage,
      }),
    )
    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.workMode || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: opts.page }, results: cards },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
