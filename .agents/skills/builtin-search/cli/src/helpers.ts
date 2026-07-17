// Data source: builtin.com's server-rendered job listing and detail pages.
// robots.txt disallows /jobs*?search= and most industry/location query filters
// for generic bots, but plain listing pages (/jobs, /jobs/remote, /jobs?page=N)
// are allowed. So this CLI never sends a keyword/location/industry query to the
// server — it fetches an allowed listing page and filters --query/--location/
// --remote/--jobage client-side over the results already on that page.

export const LISTING_URL = "https://builtin.com/jobs"
export const REMOTE_LISTING_URL = "https://builtin.com/jobs/remote"
export const DETAIL_BASE_URL = "https://builtin.com"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

/** Fetch HTML with exponential backoff on 429/5xx. Returns "" on a 404. */
export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  companyUrl: string | null
  location: string | null
  date: string | null
  url: string
  workMode: string | null
  salary: string | null
  seniority: string | null
}

export interface JobDetail extends JobCard {
  description: string | null
  categories: string | null
  applyUrl: string | null
}

function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function clean(html: string): string {
  return decodeHtmlEntities(stripTags(html))
}

/** Pull the first `<span ...>text</span>` following an icon class name, within a bounded window. */
function iconField(chunk: string, iconClass: string): string | null {
  const re = new RegExp(`${iconClass}[\\s\\S]{0,200}?<span[^>]*>([^<]+)<\\/span>`, "i")
  const m = chunk.match(re)
  return m ? clean(m[1]) || null : null
}

/**
 * Parse the listing page: one `<div id="job-card-<id>" ...>` per posting.
 * We split on that marker and parse each chunk independently so one malformed
 * card cannot break the rest.
 */
export function parseJobCards(html: string): JobCard[] {
  const results: JobCard[] = []
  const chunks = html.split(/<div id="job-card-(\d+)"/).slice(1)

  // .split() with a capturing group interleaves [id, chunk, id, chunk, ...]
  for (let i = 0; i < chunks.length; i += 2) {
    const id = chunks[i]
    const chunk = chunks[i + 1]
    if (!id || !chunk) continue

    const titleMatch = chunk.match(
      /data-id="job-card-title"\s+data-alias="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i,
    )
    if (!titleMatch) continue
    const urlPath = titleMatch[1]
    const title = clean(titleMatch[2])
    if (!title) continue

    const companyMatch = chunk.match(
      /data-id="company-title"[^>]*>(?:\s*<span>)?([\s\S]*?)(?:<\/span>)?<\/a>/i,
    )
    const company = companyMatch ? clean(companyMatch[1]) || null : null
    const companyHrefMatch = chunk.match(/href="(\/company\/[^"]+)"/i)
    const companyUrl = companyHrefMatch ? `${DETAIL_BASE_URL}${companyHrefMatch[1]}` : null

    const dateMatch = chunk.match(/fa-clock[^"]*"[^>]*><\/i>([^<]+)<\/span>/i)
    const date = dateMatch ? clean(dateMatch[1]) || null : null

    results.push({
      id,
      title,
      company,
      companyUrl,
      location: iconField(chunk, "fa-location-dot"),
      date,
      url: `${DETAIL_BASE_URL}${urlPath}`,
      workMode: iconField(chunk, "fa-house-building"),
      salary: iconField(chunk, "fa-sack-dollar"),
      seniority: iconField(chunk, "fa-trophy"),
    })
  }

  return results
}

/** Parse a single job's detail page. */
export function parseJobDetail(html: string, id: string, url: string): JobDetail {
  const titleMatch = html.match(/<h1[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h1>/i)
  const title = titleMatch ? clean(titleMatch[1]) : "(untitled)"

  const companyMatch = html.match(/href="\/company\/[^"]+"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i)
  const company = companyMatch ? clean(companyMatch[1]) || null : null
  const companyHrefMatch = html.match(/href="(\/company\/[^"]+)"/i)
  const companyUrl = companyHrefMatch ? `${DETAIL_BASE_URL}${companyHrefMatch[1]}` : null

  const dateMatch = html.match(/font-barlow fs-md fw-regular">Posted ([^<]+)<\/span>/i)
  const date = dateMatch ? clean(dateMatch[1]) || null : null

  const categoriesMatch = html.match(/font-barlow fw-medium mb-md">([^<]+)<\/div>/i)
  const categories = categoriesMatch ? clean(categoriesMatch[1]) || null : null

  let description: string | null = null
  const descMatch = html.match(
    /id="job-post-body-\d+"[^>]*>([\s\S]*?)<button\s+@click="toggleJobExpanded"/i,
  )
  if (descMatch) {
    const withBreaks = descMatch[1]
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
    description = decodeHtmlEntities(stripTags(withBreaks)).replace(/\n{3,}/g, "\n\n").trim() || null
  }

  return {
    id,
    title,
    company,
    companyUrl,
    location: iconField(html, "fa-location-dot"),
    date,
    url,
    workMode: iconField(html, "fa-house-building"),
    salary: iconField(html, "fa-sack-dollar"),
    seniority: iconField(html, "fa-trophy"),
    description,
    categories,
    applyUrl: url,
  }
}

/** Convert BuiltIn's relative posting time ("39 Minutes Ago", "2 Days Ago") to an integer day count. Unknown/unparseable text returns null (never excluded by a --jobage filter). */
export function relativeTimeToDays(text: string | null): number | null {
  if (!text) return null
  const t = text.toLowerCase()
  if (/just posted|today/.test(t)) return 0
  if (/yesterday/.test(t)) return 1
  const m = t.match(/(\d+)\s*(minute|hour|day|week|month|year)/)
  if (!m) return null
  const n = parseInt(m[1], 10)
  switch (m[2]) {
    case "minute":
    case "hour":
      return 0
    case "day":
      return n
    case "week":
      return n * 7
    case "month":
      return n * 30
    case "year":
      return n * 365
    default:
      return null
  }
}

export interface ClientFilters {
  query?: string
  location?: string
  remote?: string // "remote" | "hybrid" | "onsite"
  jobage?: number
}

/** Apply --query/--location/--remote/--jobage client-side (never sent to the server). */
export function matchesFilters(card: JobCard, filters: ClientFilters): boolean {
  if (filters.query) {
    const q = filters.query.toLowerCase()
    if (!card.title.toLowerCase().includes(q)) return false
  }
  if (filters.location) {
    if (!(card.location || "").toLowerCase().includes(filters.location.toLowerCase())) return false
  }
  if (filters.remote) {
    const mode = (card.workMode || "").toLowerCase()
    const wanted = filters.remote.toLowerCase() === "onsite" ? "on-site" : filters.remote.toLowerCase()
    if (mode && !mode.includes(wanted) && !(wanted === "on-site" && mode.includes("onsite"))) return false
  }
  if (filters.jobage !== undefined && filters.jobage < 9999) {
    const days = relativeTimeToDays(card.date)
    if (days !== null && days > filters.jobage) return false
  }
  return true
}
