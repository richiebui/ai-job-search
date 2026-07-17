# BuiltIn (builtin.com) URL Reference

Server-rendered listing and detail pages. No official public API found.

## robots.txt policy (checked 2026-07-16)

`User-agent: *` (the bucket a generic CLI's User-Agent falls under) disallows:

- `/search/`, `/jobs*?search=`, `/jobs*?trending*` — keyword search
- `/jobs/*<industry>-industry` (machine-learning, analytics, business-intelligence,
  sales, and ~25 more industry facets)
- `/jobs*seattle`, `/jobs*san-francisco`, `/jobs*boston`, `/jobs*austin`,
  `/jobs*colorado`, `/jobs*los-angeles`, `/jobs*chicago`, `/jobs*new-york-city` —
  the eight major-metro location facets
- `/jobs/office*`, `/jobs/*size`, `/jobs/*other`, `/jobs/*not-specified`, `/jobs/*mid-level`
  — office-type / company-size / seniority facets

And explicitly **allows** `/jobs*?page=` (a more specific rule than the general
`Disallow: *?page=` it overrides). `/jobs/remote` is not matched by any Disallow rule.

**Consequence for this skill:** only two request shapes are ever made —
`GET https://builtin.com/jobs?page=<n>` and `GET https://builtin.com/jobs/remote?page=<n>`
(page param omitted for page 1). Every other filter (`--query`, `--location`,
`--remote hybrid|onsite`, `--jobage`) is matched against the parsed results of
whichever page was fetched — never sent to the server as a request parameter.

Verified live from the user's own network (not just a proxy/fetch service) —
both listing paths return **200 OK** with real, server-rendered job cards, no
CAPTCHA or bot-detection wall encountered.

## Listing page

```
GET https://builtin.com/jobs?page=<n>
GET https://builtin.com/jobs/remote?page=<n>
```

`page` omitted or `1` returns the first page. Each posting renders as a
`<div id="job-card-<id>" data-id="job-card" ...>` block containing:

| Field | Anchor |
|-------|--------|
| id | the numeric id in `id="job-card-<id>"` |
| title + url | `<a ... data-id="job-card-title" data-alias="/job/<slug>/<id>">title</a>` |
| company + companyUrl | `<a href="/company/<slug>" data-id="company-title"><span>Name</span></a>` |
| date | text following the `fa-clock` icon (relative, e.g. `"39 Minutes Ago"`, `"3 Days Ago"`) |
| workMode | text following the `fa-house-building` icon (`Remote` / `Hybrid` / `On-site`) |
| location | text following the `fa-location-dot` icon |
| salary | text following the `fa-sack-dollar` icon (absent on many postings) |
| seniority | text following the `fa-trophy` icon (absent on many postings) |

## Detail page

```
GET https://builtin.com/job/<slug>/<id>
```

**The slug is not decorative** — unlike LinkedIn, a placeholder slug 404s. Always
use the full URL from a `search` result's `url` field.

| Field | Anchor |
|-------|--------|
| title | `<h1 ...><span ...>title</span></h1>` |
| company | `<a href="/company/<slug>" ...><h2 ...>Name</h2></a>` |
| date | `Posted <relative time>` inside a `font-barlow fs-md fw-regular` span |
| location / workMode / salary / seniority | same icon-anchored pattern as the listing card |
| categories | the `font-barlow fw-medium mb-md` div, bullet-separated (`Cloud • Security • ...`) |
| description | the `id="job-post-body-<id>"` div, up to the `toggleJobExpanded` button — full HTML, tags stripped |

No distinct "apply" URL was found on the page (BuiltIn's own "Easy Apply" flow
runs in-page); `applyUrl` is set to the canonical job page URL.

## Notes

- Dates are relative strings, not timestamps — `relativeTimeToDays()` in `helpers.ts`
  converts them to an approximate day count for `--jobage` filtering.
- Some postings carry a `"Reposted "` prefix on the relative time (e.g. `"Reposted 22 Hours Ago"`) — the age-parsing regex matches the trailing number+unit regardless of prefix.
- If BuiltIn changes its class names (`fa-location-dot`, `data-id="job-card-title"`, etc.), update the anchors in `cli/src/helpers.ts`.
