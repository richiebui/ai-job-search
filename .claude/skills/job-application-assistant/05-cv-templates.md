---
framework_version: 1.0.0
---

# CV Templates and Tailoring Guide

<!-- SETUP: Profile statements and section ordering are personalized by running /setup -->

## Template: LaTeX moderncv (Banking Style)

All CVs use the moderncv LaTeX package with the "banking" style and "blue" color scheme.

**Output file:** `cv/main_<company>.tex`
**Compile with:** **lualatex** on MiKTeX/TeX Live. pdflatex often fails on modern MiKTeX installs with `fontawesome5` font-expansion errors; lualatex handles the same sources cleanly.
**Master reference:** `cv/main_example.tex` (comprehensive CV with all competencies, experience, and achievements - use as source when building targeted CVs)

### Compile command

```bash
cd cv && lualatex -interaction=nonstopmode main_<company>.tex
```

Expected output: `Output written on main_<company>.pdf (1 page, ...)`. Any page count other than 1 is a failure that must be fixed before presenting to the user.

## Document Structure

```latex
\documentclass[11pt,a4paper,sans]{moderncv}
\moderncvstyle{banking}
\moderncvcolor{blue}

% Force both first and last name AND section headings to render in moderncv
% blue (color1). Default banking on lualatex+MiKTeX leaves these black, which
% looks inconsistent with the rest of the blue accent scheme.
\renewcommand*{\firstnamestyle}[1]{{\fontsize{34}{36}\bfseries\upshape\color{color1}#1}}
\renewcommand*{\lastnamestyle}[1]{{\fontsize{34}{36}\bfseries\upshape\color{color1}#1}}
\renewcommand*{\sectionstyle}[1]{{\sectionfont\color{color1}#1}}

\usepackage[utf8]{inputenc}
\usepackage{hyperref}
\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,
    urlcolor=blue,
    pdftitle={[YOUR_NAME] - CV},
    pdfpagemode=FullScreen,
}
\usepackage[scale=0.77]{geometry}
\usepackage{import}

% Personal data
\name{[FIRST_NAME]}{[LAST_NAME]}
\address{[YOUR_ADDRESS]}{}{}
\phone[mobile]{[YOUR_PHONE]}
\email{[YOUR_EMAIL]}
\extrainfo{\href{[YOUR_LINKEDIN_URL]}{LinkedIn}, \href{[YOUR_GITHUB_URL]}{GitHub}}

\begin{document}
\makecvtitle

% 1. Profile statement (2-3 lines, tailored per role)
% 2. Core Competencies / Skills section
% 3. Professional Experience section
% 4. Education section
% 5. References (single line; cut first if space is tight)
%
% On a 1-page CV, Languages/Publications/Honors and Awards are optional -
% include only the ones directly relevant to the target role, slotted in
% after Education and before References. See "Recommended Section Order"
% below for the full placement rule.

\end{document}
```

### Color overrides

The three `\renewcommand*` lines in the preamble are required on lualatex+MiKTeX. Without them the firstname, lastname, and section headings render in black even though `\moderncvcolor{blue}` is set, which looks inconsistent with the rest of the blue accent scheme (links, bullet markers, contact icons). The override forces all three to use `color1` (moderncv's accent colour, which becomes blue under `\moderncvcolor{blue}`). Both names render bold; if you prefer the firstname in regular weight, change the firstnamestyle override from `\bfseries` to `\mdseries`. Don't drop the override - on most modern installs the defaults render visibly wrong.

### Spacing inside itemize lists (important)

**Do not place `\vspace{...}` between `\item` entries in an `itemize` list.** Even though the source looks symmetric, this pattern occasionally produces a noticeably oversized gap before a single item: the inter-item `\vspace` creates a paragraph break that interacts unpredictably with the list's internal `\itemsep`, so LaTeX renders one of the gaps wider than the rest. Remove the inter-item `\vspace` and let `itemize` use its native uniform spacing.

```latex
% WRONG - intermittently produces an oversized gap before one bullet
\begin{itemize}
\item \textbf{Foo}: ...
\vspace{1pt}
\item \textbf{Bar}: ...
\vspace{1pt}
\item \textbf{Baz}: ...
\end{itemize}

% RIGHT - uniform spacing using the list's native itemsep
\begin{itemize}
\item \textbf{Foo}: ...
\item \textbf{Bar}: ...
\item \textbf{Baz}: ...
\end{itemize}
```

Two related patterns are fine and should be kept:
- `\vspace{1pt}` immediately after `\section{...}` (between section heading and first item) - this is between the heading and the list, not between list items.
- `\vspace{3pt}` between top-level `\cventry` blocks in Professional Experience or Education - this gives breathing room between roles and renders consistently.

## Section-by-Section Tailoring

### Profile Statement / Elevator Pitch (Best Practice)
This is the most important section to customize. It appears right after `\makecvtitle`.

Write 2-3 lines that function as an "elevator pitch": a concise, compelling introduction explaining why you're qualified for *this specific role*. Focus on what the employer gains from hiring you. Keep it tight - on a 1-page CV this section competes directly with Professional Experience for space.

**Create 2-3 profile statement templates for your main role types:**

**For Data Engineering roles:**
> Data engineer with 8+ years building FDA-regulated, production-grade ETL/ELT pipelines across AWS and GCP, cutting data processing time up to 40-50% while enabling regulatory approvals worth $90M+ in revenue. Combines strong Python/SQL engineering with hands-on applied-LLM experience for audit-ready compliance extraction.

**For Data Scientist / Data Analyst roles:**
> Data scientist/analyst spanning clinical bioinformatics and commercial analytics, from LLM-based classification benchmarks to Redshift-backed KPI reporting that cut manual reporting time from hours to minutes. Skilled at translating technical findings into decision-ready insights for executives.

### Core Competencies / Skills Section (Best Practice)
Reorder and emphasize based on the role. Use bold category labels.

List **3-4 key competencies** in bullet format, tailored to the specific job, each on a single rendered line: a bold category label followed by a short comma-separated list of concrete tools/scope, not a full explanatory clause. ("**Cloud Data Platforms**: AWS, GCP, Snowflake" fits one line; "**Cloud Data Platforms**: building and scaling ingestion and transformation pipelines across AWS, GCP, and Snowflake" wraps to two and blows the budget below.) If a competency needs more than that to land, it belongs in a Professional Experience bullet instead, where there is room to state the value it added.

### Education
- Always include your highest degrees
- For senior roles, keep education brief (dates and titles only) - one line per degree
- Include thesis topics only when directly relevant to the target role; otherwise omit to save space

### Professional Experience
- Rewrite bullet points to emphasize aspects most relevant to the target role
- Use 3 bullets for the most recent role, 2 for the previous role, 1 (or a combined one-line "Earlier Experience" entry) for older roles
- **Emphasize measurable results** where possible: "Reduced processing time by X%", "Model adopted by the team"

### Handling Employment Gaps (Best Practice)
If there is a gap in your employment history:
- The gap should be explained matter-of-factly if needed
- Describe how professional development continued during the gap
- Frame as deliberate skill-building and career repositioning

### Publications
- On a 1-page CV, include only if directly relevant to the target role - otherwise omit the section entirely
- If included, select 1-2 most relevant publications, not the full list
- Include a Google Scholar link if applicable

### Honors and Awards
- On a 1-page CV, include only if directly relevant to the target role - otherwise omit the section entirely
- If included, keep format brief, one line each

### References
- **Before cutting or omitting this section, re-check the posting for an explicit reference requirement** (e.g. "please provide 2-3 professional references," "references required upon application"). If the posting asks for references, honor it - list them (or keep the "Available upon request." line, at minimum) even under space pressure; cut elsewhere first.
- If the posting does not mention references, omit named references entirely on a 1-page CV - a single "Available upon request." line is the default, and even that line is a cut candidate if space is tight
- **Do not attach reference letters** - employers typically contact references directly

## Compile-and-Inspect Loop (MANDATORY)

After writing the CV and before presenting to the user, always compile and visually inspect the PDF. Iterate until the layout is clean. Workflow:

1. Run `lualatex -interaction=nonstopmode main_<company>.tex`
2. Check the output page count: must be exactly 1
3. Read the PDF via the Read tool and visually inspect the page
4. Check for **orphaned entries**: a `\cventry` title line must never sit alone at the bottom with its bullets pushed past the page edge

### Fixing common page-break problems

**Problem: entry title near the page edge, bullets pushed off**
Add `\needspace{5\baselineskip}` immediately before the problematic `\cventry`:
```latex
\needspace{5\baselineskip}
\item{\cventry{YEAR--YEAR}{Role Title}{Organization}{Location}{}{...}}
```
Include `\usepackage{needspace}` in the preamble.

**Problem: a trailing section (e.g. References) spills to page 2 by a near-miss margin**
Add `\enlargethispage{2-3\baselineskip}` before the late section to stretch page 1 by a few lines. This is the standard LaTeX rescue for near-miss overflows - reserve it for genuine near-misses (roughly 1.02 pages), not as a substitute for cutting content.

**Problem: 2 pages with substantial content on page 2**
Cut content — do not compress geometry or `\vspace`. See "Relevance-weighted cutting" below for the rule.

**Problem: content finishes with a lot of empty space on the page (feels thin)**
Restore the highest-relevance item that was previously cut, or a `\cventry` from an earlier role — a 1-page CV with a mostly-blank bottom third looks incomplete.

## ATS Parseability

Most employers run CVs through an ATS before a human sees them, and the ATS reads the PDF's embedded **text layer**, not the rendered page. A CV can pass visual inspection and still extract as garbage. After the layout passes the compile-and-inspect loop, verify the text layer:

```bash
cd cv && pdftotext -layout main_<company>.pdf main_<company>.txt
```

`pdftotext` comes from [poppler](https://poppler.freedesktop.org/), not the TeX distribution - it is an **optional** dependency. If it is not installed, skip the mechanical check with a warning and rely on the visual PDF read for keyword coverage.

What to check in the extraction:

- **Contact details as literal text.** The stock template's fontawesome contact icons extract as glyph names (`MOBILE-ALT`, `Envelope`) - harmless noise, because the actual address and number are printed beside them. The failure mode is a contact detail carried *only* by an icon or a hyperlink (like the `LinkedIn` link text, whose URL is not in the text layer): invisible to an ATS. The email address must always appear as printed text.
- **No garbled output.** `(cid:NNN)` markers or `�` characters mean a font is embedded without a Unicode mapping - an ATS sees the same garbage. This shows up with unusual fonts in custom templates, not with the stock moderncv setup under lualatex.
- **Reading order.** The stock banking style is single-column, so extraction order matches visual order. Custom templates (via `/add-template`) with sidebars or multi-column layouts can interleave unrelated lines; if extraction order is scrambled, the user is trading ATS compatibility for looks and should be told.
- **Keyword coverage.** Match the posting's required/preferred terms against the extracted text, in the posting's language. Prefer the posting's exact term over a synonym when it is truthfully applicable - ATS matching is often literal. Never add a keyword the profile does not support.

## Page Budget - Hard 1-Page Limit

The CV **must** fit on exactly 1 page when compiled. Use these content limits as a guide:

| Section | Max budget |
|---------|-----------|
| Profile statement | 2-3 lines |
| Skills | 3-4 items, single line each |
| Most recent role | 3 bullets |
| Previous role | 2 bullets |
| Older roles | 1 bullet each, or one combined "Earlier Experience" line |
| Education | 2 entries, one line each |
| Publications | 1-2 entries, only if directly relevant - otherwise omit |
| Awards | 1-2 entries, single line each, only if directly relevant - otherwise omit |
| References | "Available upon request." (single line) - cut first if space is tight |

**If in doubt, cut rather than squeeze.** Reducing `\vspace` or geometry scale to force-fit content makes the CV look cramped. A 1-page limit means Publications, Awards, and even References are the first things to drop entirely, not just shrink - see "Relevance-weighted cutting" below.

## Relevance-weighted cutting (the right way to shrink a CV)

**Cut by signal, not by section.** Static priority lists ("remove oldest education first, then shorten the earliest role...") are wrong when a relevant "lower-priority" item is competing with an irrelevant "higher-priority" item. An older-role bullet that speaks directly to the posting is worth more than a recent-role bullet that does not.

For every candidate line, score three things:

1. **Relevance to THIS posting** — does the line hit a named tool, keyword, or stated responsibility in the job ad?
2. **Uniqueness** — is it the only place this claim appears, or is it duplicated elsewhere in the CV?
3. **Narrative load** — does the cover letter depend on it? If cutting the line would force you to rewrite a cover-letter paragraph, it is load-bearing.

Cut the lowest-total-score line first, regardless of which section it sits in.

### Practical order of cuts (easiest → last resort)

1. **Redundancy.** If an achievement appears in both Core Competencies AND a role bullet, the Core Competencies version is usually the cleaner cut (the experience bullet is more concrete evidence).
2. **Profile-statement fluff.** A sentence that just restates what Publications or Skills will show. ("Peer-reviewed publications on X..." is already a Publications entry — profile can claim it once and stop.)
3. **Low-relevance experience bullets.** A bullet about work that does not touch posting keywords, wherever it sits. This cuts across sections before touching the structural list.
4. **Low-relevance supporting content.** An older-role bullet that does not speak to the target role. A certification that does not touch the posting's stack. A single-native-language Languages section (omit it entirely rather than condense - it rarely carries signal on a 1-page CV).
5. **Whole sections with no direct relevance.** Publications, Awards, and References are the first full sections to drop on a 1-page CV - cut them entirely before touching experience bullets.
6. **Last-resort structural cuts.** Oldest education entry, tightening an older role to a single combined line, dropping Core Competencies to 3 items. These only happen if the relevance-weighted cuts above have already been exhausted.

### Pitfalls to avoid

- Do not mechanically cut from the bottom of a static section list without checking relevance. "Cut the oldest role first" is wrong if that role is literally about the skill the posting asks for.
- Do not cut the one concrete example the cover letter leans on. Relevance is measured against the cover letter you wrote, not just the job posting — interviewers will have read both.
- Do not cut to fit if the fit is borderline (1.02 pages). Prefer `\enlargethispage{2-3\baselineskip}` on a late section for near-misses; reserve content cuts for genuine overflow (a page 2 that holds more than a single trailing section).

## Recommended Section Order

The section order varies by role type:

**For technical / data science / ML roles:**
1. Profile statement / elevator pitch
2. Core competencies / Skills
3. Professional Experience (reverse chronological)
4. Education (reverse chronological)
5. Languages / Publications / Awards (only the ones kept - see below)
6. References (single line; cut first if space is tight)

**For domain-specific / specialist roles:**
1. Profile statement / elevator pitch
2. Core competencies / Skills
3. Education (reverse chronological) - credentials are a key qualifier
4. Professional Experience (reverse chronological)
5. Languages / Publications / Awards (only the ones kept - see below)
6. References (single line; cut first if space is tight)

On a 1-page CV, Languages, Publications, and Awards are optional sections - include only the ones that are directly relevant to the target role and that fit within budget; omit the rest entirely rather than shrinking all of them to fit. When one is kept, it always slots in at position 5, after Education and Professional Experience and before References, in the same relative order listed above (Languages, then Publications, then Awards) if more than one is kept - never between Skills and Experience.
