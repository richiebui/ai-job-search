---
framework_version: 1.0.0
---

# CV Templates and Tailoring Guide

<!-- SETUP: Section ordering and bullet-count rules below are generic framework guidance; nothing in this file is populated by /setup. -->

## Template: LaTeX moderncv (Banking Style)

All CVs use the moderncv LaTeX package with the "banking" style and "blue" color scheme.

**Output file:** `cv/main_<company>.tex`
**Compile with:** **lualatex** on MiKTeX/TeX Live. pdflatex often fails on modern MiKTeX installs with `fontawesome5` font-expansion errors; lualatex handles the same sources cleanly.
**Master reference:** `cv/main_example.tex` (comprehensive CV with all competencies, experience, and achievements - use as source when building targeted CVs)

### Compile command

```bash
cd cv && lualatex -interaction=nonstopmode main_<company>.tex
```

Expected output: `Output written on main_<company>.pdf (1 page, ...)`. Any page count other than 1 is a failure that must be fixed before presenting to the user - see "Page Budget" below for how to satisfy the bullet-count floors without a 2nd page (drop the least-relevant role, not the bullet floors).

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

% No profile statement / summary paragraph - the CV goes straight from the
% header into Core Competencies. This gives Professional Experience the
% room it needs for the bullet-count floors below.
%
% 1. Core Competencies / Skills section
% 2. Professional Experience section
% 3. Education section
% 4. References (single line; cut first if space is tight)
%
% Languages/Publications/Honors and Awards are optional - include only the
% ones directly relevant to the target role, slotted in after Education and
% before References. See "Recommended Section Order" below for the full
% placement rule.

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

### No Profile Statement / Summary

The CV does **not** include a profile statement, elevator pitch, or summary paragraph. Go straight from `\makecvtitle` into Core Competencies. This is a deliberate space trade: the bullet-count floors in "Professional Experience" below (3-5 for the most recent role, 3+ minimum for every other role) take priority over an introductory paragraph, and there usually isn't room for both on one page.

If a reviewer or the user asks for a short positioning line, it belongs in the cover letter's opening paragraph, not the CV - the cover letter already carries that "why this role, why me" framing.

### Core Competencies / Skills Section (Best Practice)
Reorder and emphasize based on the role. Use bold category labels.

List **3-4 key competencies** in bullet format, tailored to the specific job, each on a single rendered line: a bold category label followed by a short comma-separated list of concrete tools/scope, not a full explanatory clause. ("**Cloud Data Platforms**: AWS, GCP, Snowflake" fits one line; "**Cloud Data Platforms**: building and scaling ingestion and transformation pipelines across AWS, GCP, and Snowflake" wraps to two and blows the budget below.) If a competency needs more than that to land, it belongs in a Professional Experience bullet instead, where there is room to state the value it added.

### Education
- Always include your highest degrees
- For senior roles, keep education brief (dates and titles only) - one line per degree
- Include thesis topics only when directly relevant to the target role; otherwise omit to save space

### Professional Experience
- Rewrite bullet points to emphasize aspects most relevant to the target role
- **Bullet-count floors (hard minimums, not targets to shrink under space pressure):** the most recent role gets 3-5 bullets; every *included* role gets a **minimum of 3 bullets each**, regardless of how far back it is. Do not collapse a role to 1-2 bullets or a combined "Earlier Experience" line to hit these floors within 1 page - drop the role entirely instead. See "How many roles to include" below.
- **Emphasize measurable results** where possible: "Reduced processing time by X%", "Model adopted by the team"

### How many roles to include (1-page + bullet floors, together)

The bullet-count floors above apply per role *shown* - they say nothing about how many roles to show. When the full work history doesn't fit 1 page at 3+ bullets per role, **include fewer roles**, not thinner ones:

1. Start from the most recent role and work backward, including each role at its full bullet floor (3-5 for the most recent, 3+ for the rest).
2. Stop including older roles once the CV would no longer fit 1 page with the next one added. Never drop the most recent 1-2 roles to make room for an older one.
3. When choosing which of two similarly-old roles to cut, prefer keeping the one with higher relevance to the posting or that the cover letter specifically leans on (see "Relevance-weighted cutting" below) - age alone is not the only signal.
4. A dropped role does not need to be mentioned at all in this tailored CV. It still exists in `01-candidate-profile.md` and `cv/main_example.tex` (the comprehensive master reference) and can resurface in a future application where it is more relevant.

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
Add `\enlargethispage{2-3\baselineskip}` before the late section to stretch page 1 by a few lines. This is the standard LaTeX rescue for near-miss overflows - reserve it for genuine near-misses (roughly 1.02 pages), not as a substitute for cutting content or dropping a role.

**Problem: 2+ pages with substantial content past page 1**
Do not compress geometry or `\vspace`, and do not cut a role's bullets below its floor (3 minimum). Instead: cut Skills/Publications/Awards/Languages/References first (see "Relevance-weighted cutting" below), then, if the overflow is still more than a role's worth of content, **drop the least-relevant included role entirely** rather than thinning every role's bullets below the floor - see "How many roles to include" above.

**Problem: content finishes with a lot of empty space on the page (feels thin)**
Restore the highest-relevance item that was previously cut, or add back a role that was dropped - a 1-page CV with a mostly-blank bottom third looks incomplete.

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

The CV **must** fit on exactly 1 page when compiled. The Professional Experience bullet-count floors (3-5 for the most recent role, 3+ minimum for every *included* role) are hard requirements that must never be cut below to force a fit - the lever for reconciling floors with the 1-page limit is **how many roles you include**, not how thin each one is. There is no profile statement competing for space (see "No Profile Statement / Summary" above). Use these limits for everything else:

| Section | Max budget |
|---------|-----------|
| Skills | 3-4 items, single line each |
| Most recent role | 3-5 bullets (hard floor: never fewer than 3) |
| Every other included role | 3+ bullets each (hard floor: never fewer than 3, no matter how old the role) |
| Education | 2 entries, one line each |
| Publications | 1-2 entries, only if directly relevant - otherwise omit |
| Awards | 1-2 entries, single line each, only if directly relevant - otherwise omit |
| References | "Available upon request." (single line) - cut first if space is tight |

**Cut order when the page overflows:** References, then Awards/Publications/Languages, then Skills (down to 3 items), then low-relevance bullets *above* each role's floor (see "Relevance-weighted cutting" below). If the CV still doesn't fit 1 page after all of that, **drop the least-relevant/oldest included role entirely** (see "How many roles to include" above) rather than cutting any remaining role below its 3-bullet floor. Reducing `\vspace` or geometry scale to force-fit content is never the fix.

## Relevance-weighted cutting (the right way to shrink a CV)

**Cut by signal, not by section.** Static priority lists ("remove oldest education first, then shorten the earliest role...") are wrong when a relevant "lower-priority" item is competing with an irrelevant "higher-priority" item. An older-role bullet that speaks directly to the posting is worth more than a recent-role bullet that does not.

For every candidate line, score three things:

1. **Relevance to THIS posting** — does the line hit a named tool, keyword, or stated responsibility in the job ad?
2. **Uniqueness** — is it the only place this claim appears, or is it duplicated elsewhere in the CV?
3. **Narrative load** — does the cover letter depend on it? If cutting the line would force you to rewrite a cover-letter paragraph, it is load-bearing.

Cut the lowest-total-score line first, regardless of which section it sits in.

### Practical order of cuts (easiest → last resort)

1. **Redundancy.** If an achievement appears in both Core Competencies AND a role bullet, the Core Competencies version is usually the cleaner cut (the experience bullet is more concrete evidence).
2. **Whole optional sections with no direct relevance.** Publications, Awards, and Languages are the first full sections to drop - cut them entirely before touching anything else, including References.
3. **References**, per its own carve-out above (cut it unless the posting explicitly asked for references).
4. **Skills, down to 3 items.** Drop the least keyword-dense competency line before touching any experience bullet.
5. **Low-relevance experience bullets *above the floor*.** Once every included role is down to its 3-bullet floor, the only remaining cuttable content is a bullet *beyond* the floor (i.e. bullet 4 or 5 on the most recent role) that does not touch posting keywords.
6. **Drop the least-relevant whole role (last resort).** If the CV still doesn't fit 1 page after every cut above, drop the oldest or lowest-relevance included role entirely rather than thinning any role below its 3-bullet floor - see "How many roles to include" above. Never drop the most recent 1-2 roles to make room for an older one.

### Pitfalls to avoid

- Do not mechanically cut from the bottom of a static section list without checking relevance. "Cut the oldest role first" is wrong if that role is literally about the skill the posting asks for - in that case, drop a different, less relevant role instead.
- Do not cut the one concrete example the cover letter leans on. Relevance is measured against the cover letter you wrote, not just the job posting — interviewers will have read both. If dropping a role would remove the cover letter's only concrete example, keep that role and drop a different one instead.
- **Never cut a role's bullets below the 3-bullet floor to force a 1-page fit.** Drop the whole role instead. Prefer `\enlargethispage{2-3\baselineskip}` on a late section for genuine near-misses (roughly 1.02 pages); reserve role-dropping for real overflow.

## Recommended Section Order

The section order varies by role type:

**For technical / data science / ML roles:**
1. Core competencies / Skills
2. Professional Experience (reverse chronological)
3. Education (reverse chronological)
4. Languages / Publications / Awards (only the ones kept - see below)
5. References (single line; cut first if space is tight)

**For domain-specific / specialist roles:**
1. Core competencies / Skills
2. Education (reverse chronological) - credentials are a key qualifier
3. Professional Experience (reverse chronological)
4. Languages / Publications / Awards (only the ones kept - see below)
5. References (single line; cut first if space is tight)

There is no profile statement / elevator pitch step - see "No Profile Statement / Summary" above. Languages, Publications, and Awards are optional sections - include only the ones that are directly relevant to the target role and that fit within budget; omit the rest entirely rather than shrinking all of them to fit. When one is kept, it always slots in after Education and Professional Experience and before References, in the same relative order listed above (Languages, then Publications, then Awards) if more than one is kept - never between Skills and Experience.
