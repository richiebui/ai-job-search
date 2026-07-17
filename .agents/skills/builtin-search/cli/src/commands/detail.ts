import { DETAIL_BASE_URL, htmlFetch, parseJobDetail, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

/**
 * Accept a full builtin.com job URL (/job/<slug>/<id>). Unlike LinkedIn,
 * BuiltIn's routing requires the exact slug — a bare numeric id with a
 * placeholder slug 404s — so `search` results' `url` field must be passed
 * through as-is rather than just the id.
 */
function normalizeIdAndUrl(input: string): { id: string; url: string } | null {
  const urlMatch = input.match(/^https?:\/\/(?:www\.)?builtin\.com(\/job\/[^/?#]+\/(\d+))/i)
  if (urlMatch) return { id: urlMatch[2], url: `${DETAIL_BASE_URL}${urlMatch[1]}` }
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const parsed = normalizeIdAndUrl(opts.id)
  if (!parsed) {
    writeError(
      `Could not parse a job URL from "${opts.id}" — BuiltIn requires the full builtin.com/job/<slug>/<id> URL (copy it from a search result's "url" field); a bare numeric id will 404 because the slug is part of the route`,
      "BAD_ID",
    )
    return 1
  }
  try {
    const html = await htmlFetch(parsed.url)
    if (!html) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const job = parseJobDetail(html, parsed.id, parsed.url)

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"} · ${job.workMode || "—"}`,
        "",
        job.salary ? `Salary: ${job.salary}` : "",
        job.seniority ? `Seniority: ${job.seniority}` : "",
        job.categories ? `Categories: ${job.categories}` : "",
        "",
        job.description || "(no description)",
        "",
        `URL: ${job.url}`,
      ].filter((l) => l !== "")
      process.stdout.write(lines.join("\n") + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
