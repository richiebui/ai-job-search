# Search Queries for Job Scraper

<!-- SETUP: Customize these queries based on your skills, target roles, and location -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first. This fork is configured for the **United States**, not Denmark: the four Danish demo portals (jobbank, jobdanmark, jobindex, jobnet) are installed but disabled (`enabled: false` in their SKILL.md) so `/scrape` skips them. Active portals are `linkedin-search` (US-filtered via `--location`), `freehire-search` (US-filtered via `--country US`), and `builtin-search` (US tech/startup board, added via `/add-portal`). You do **not** need a matching `site:` line below for those CLIs to run.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails.

## Search Sites

Primary (US job boards):
- **linkedin.com/jobs** - LinkedIn job listings (US); covered by `linkedin-search` CLI
- **freehire.dev** - tech/software job aggregator (US); covered by `freehire-search` CLI
- **builtin.com** - US tech/startup job board; covered by `builtin-search` CLI (client-side keyword filtering — see its SKILL.md)

Secondary (company career pages via Google) - primary target companies (health-tech/medical device):
- Dexcom, Tandem Diabetes Care, Stryker, Intuitive, and other healthcare/medical device companies
- Direct Google searches with `site:` filters for these and other known target companies

## Query Categories

Queries are grouped by priority. Each query should be combined with your location terms (Los Angeles / San Dimas, CA, or "Remote") where the site supports it.

### Priority 1: Data Engineering

Primary and most desired career direction.

```
site:linkedin.com/jobs "Data Engineer" Los Angeles
site:linkedin.com/jobs "Data Engineer" Remote
"Data Engineer" ETL Python SQL AWS Los Angeles OR Remote
```

### Priority 2: Health-Tech / Medical Device Data Engineering

Domain expertise: clinical bioinformatics, FDA-regulated data pipelines, medical devices.

```
"Data Engineer" OR "Bioinformatics Engineer" medical device FDA Los Angeles OR Remote
site:linkedin.com/jobs "Data Engineer" Dexcom
site:linkedin.com/jobs "Data Engineer" Tandem Diabetes Care
site:linkedin.com/jobs "Data Engineer" Stryker
site:linkedin.com/jobs "Data Engineer" Intuitive
```

### Priority 3: Adjacent Roles (Data Scientist / Data Analyst / Analytics Engineer)

Adjacent roles to pivot into.

```
site:linkedin.com/jobs "Data Scientist" Snowflake OR Databricks Los Angeles OR Remote
site:linkedin.com/jobs "Data Analyst" SQL Tableau Los Angeles OR Remote
site:linkedin.com/jobs "Analytics Engineer" Los Angeles OR Remote
```

### Priority 4: Broader Data / Bioinformatics Roles

Wider net.

```
site:linkedin.com/jobs "Data Manager" Los Angeles OR Remote
"Bioinformatics Engineer" Python SQL Remote
site:linkedin.com/jobs Snowflake OR Redshift OR BigQuery data engineer Los Angeles OR Remote
```

## Location Filter

When evaluating results, verify the job location is within reasonable commute distance from home, or fully remote. Acceptable areas:
- San Dimas, CA and surrounding San Gabriel Valley / Greater Los Angeles area
- Anywhere within a ~30-mile radius of San Dimas, CA
- Fully remote (US) - strongly preferred
- Borderline: Greater LA locations beyond 30 miles but within a reasonable extended commute
- Too far: any role requiring relocation outside Southern California that is not remote

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries
