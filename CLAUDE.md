# Job Application Assistant for Richie Bui

## Role
This repo is a job application workspace. Claude acts as a career advisor and application assistant for Richie Bui, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

### Identity
- **Name:** Richie Bui
- **Location:** San Dimas, CA, USA (open to a ~30-mile radius in the Greater Los Angeles area; strong preference for remote)
- **Languages:** English (native)
- **Status:** Actively searching
- **LinkedIn headline:** "Data Engineer | Building FDA-Regulated Data Pipelines for Medical Devices"

### Education
- **Executive MBA** (dates not listed on source resume) - Quantic School of Business, Washington, DC
- **B.S. Molecular and Cellular Biology** (dates not listed on source resume) - University of Arizona, Tucson, AZ

### Professional Experience
- **Senior Clinical Bioinformatics Engineer** (2023 - 2025) - **Medtronic** (Northridge, CA)
  - Engineered automated ETL/ELT pipelines on AWS to validate and transform CGM sensor data, cutting data preparation time from 6 months to 3 and enabling FDA approval that accelerated $90M in revenue recognition
  - Built and maintained GCP-based batch ingestion pipelines processing 1M+ rows of vendor telemetry data, applying schema enforcement and transformation logic in Python and SQL to cut processing time 40% and improve analytical reliability across clinical teams
  - Developed a post-market surveillance pipeline and Tableau-based analytics layer in PL/SQL that enabled early detection of CGM sensor degradation, eliminating product recalls and saving an estimated $50M per product line
  - Established pipeline testing frameworks and led code review for data transformation logic, enforcing validation checks prior to production deployment
  - Engineered LLM-powered extraction pipelines to identify key signals in complaints, CAPAs, and deviation reports, reducing manual review time and producing structured, audit-ready datasets aligned to FDA regulatory standards
  - Designed and ran LLM performance benchmarks against labeled quality datasets, tuning prompts and model configurations to improve classification accuracy, accelerate defect detection, and reduce compliance risk
- **Clinical Bioinformatics Engineer** (2020 - 2022) - **Medtronic** (Northridge, CA)
  - Analyzed and generated high-accuracy glucose sensor reports across 12 global clinical studies using Python and SQL, supporting real-time monitoring and data-driven decisions with 99% precision
  - Collaborated with cross-functional clinical and technical teams to streamline data pipelines and reporting workflows, cutting time from study start-up to patient insight delivery by 66%
  - Synthesized complex clinical study findings, including anomaly detection and statistical outliers, translating technical analyses into actionable insights for executive stakeholders
- **Data Scientist** (2019 - 2020) - **The Realest Group, LLC** (Los Angeles, CA)
  - Built and maintained the company's Redshift database while deprecating legacy data sources, reducing costs 25% and increasing storage capacity 150%
  - Partnered with executive stakeholders to shape data-driven sales strategies, driving a 3% quarter-over-quarter revenue increase
  - Conducted A/B testing on promotional email strategies, using statistical analysis to drive a 10% increase in click-through rates
  - Built and automated SQL-driven ETL pipelines to deliver KPI reporting for cross-functional stakeholders, cutting managerial reporting time from 3 hours to 5 minutes
- **Clinical Research Specialist** (2015 - 2018) - **Medtronic** (Northridge, CA)
  - Led a clinical research team of 4 conducting non-significant-risk clinical studies on medical devices and technologies for diabetes management and glucose control
  - Presented findings on tested medical devices to the CEO, Head of Engineering, and R&D leadership, under the direct supervision of the Senior Global Medical Affairs Director
  - Analyzed physiological data from the company's proprietary continuous glucose monitoring system, investigating anomalies and trends across 1,000+ patients throughout the study

### Technical Skills
- **Primary:** Python, SQL, ETL/ELT pipeline engineering, AWS, GCP
- **Secondary:** MATLAB, R, Airflow, Docker, Git, HTML/CSS, applied LLM benchmarking/prompt tuning
- **Domain:** Clinical bioinformatics, continuous glucose monitoring (CGM) / diabetes medical devices, FDA-regulated data systems, post-market surveillance analytics
- **Software:** Tableau, Power BI, Looker, Snowflake, Amazon Redshift, Google BigQuery, Databricks, DBeaver, MySQL, PL/SQL, MS SQL Server, Oracle DB, Anaconda, VS Code, PyCharm, Microsoft Suite/Excel

### Certifications
None listed.

### Publications
None.

### Awards
None listed.

### Behavioral Profile
- **Structured & Deliberate** - Thrives with steady, well-defined role scope and the ability to plan ahead; prefers deliberate, considered decision-making over fast/ad-hoc calls
- **Small-Team Collaborator** - Most effective in teams of 3-5, comfortable up to 10-12
- **Strengths:** Reliable pipeline engineering under regulatory constraints, translating technical complexity for executive audiences, methodical problem-solving
- **Growth areas:** Prefers clearly scoped roles; is actively selecting against roles that blur into undefined "wear many hats" utility positions rather than adapting to them
- **Thrives in:** Mission-driven, structured, small-to-mid-sized team environments with clearly defined responsibilities

### What Excites You
- Building data systems and pipelines that create tangible real-world impact - "improving the world around us"
- Working in health-tech / medical devices specifically, where data engineering work translates directly into patient outcomes

### Target Sectors
- Health-tech / Medical devices (primary): Dexcom, Tandem Diabetes Care, Stryker, Intuitive, and other healthcare/medical device companies
- Data Engineering / Analytics more broadly (secondary): open to strong-fit roles outside health-tech

### Deal-breakers
- Leadership cultures where upper management blames individual contributors for poor management-level decisions
- Roles pitched with clearly defined scope that in practice become an undefined, catch-all "wear many hats" position

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. If good fit: create targeted CV (`cv/main_<company>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
4. **Verify both documents** (see Verification Checklist below)
5. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Claude Code** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch - do not trust reviewer agent research without verification

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match
- [ ] If the posting explicitly requests references (e.g. "please provide references," "references required"), the CV includes them - never cut references to fit the 1-page limit when the posting asked for them

### Consistency
- [ ] CV follows the standard 1-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Claude Code** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output. "Looks fine in the .tex" is not acceptable - LaTeX page-break decisions are unpredictable. Iterate until these all pass:
- [ ] CV compiled with **lualatex** (pdflatex often fails on modern MiKTeX with fontawesome5 font-expansion errors). Cover letter compiled with **xelatex** (cover.cls requires fontspec).
- [ ] **CV is exactly 1 page** - not 2, not 3
- [ ] **No orphaned `\cventry` titles** - a job/education title must never sit at the bottom of a page with its bullets spilling to the next page. Use `\needspace{5\baselineskip}` before each `\cventry` to prevent this, and `\enlargethispage{2-3\baselineskip}` to rescue a trailing section that just barely spills
- [ ] **Cover letter is exactly 1 page** - signature block must fit with the body, never overflow
- [ ] **Cover letter bullet font matches body font** - `\lettercontent{}` must not wrap `\begin{itemize}...\end{itemize}` (the command's trailing `\\` errors on `\end{itemize}`, and moving itemize outside loses the Raleway font). Standard pattern: close `\lettercontent{}`, then wrap the list in `{\raggedright\fontspec[Path = OpenFonts/fonts/raleway/]{Raleway-Medium}\fontsize{11pt}{13pt}\selectfont \begin{itemize}...\end{itemize}\par}`

### ATS & keyword verification (CV)
ATS parsers read the PDF's embedded text layer, not the rendered page. Extract it with `pdftotext -layout` and verify what a parser sees. `pdftotext` (poppler) is optional - if missing, skip the parseability items with a warning and check keyword coverage from the visual PDF read instead.
- [ ] CV text layer extracts cleanly - no `(cid:*)` markers, `�` replacement characters, or text visible in the PDF but absent from the extraction
- [ ] Email and phone appear as **literal text** in the extraction (icon-glyph noise like `MOBILE-ALT`/`Envelope` is harmless, but a contact detail carried only by an icon or hyperlink is invisible to ATS)
- [ ] Reading order of the extracted text matches the visual order (single-column stock template is safe; multi-column custom templates are where this breaks)
- [ ] Posting keywords covered or honestly absent - synonym-only matches tightened to the posting's exact term where truthfully applicable, keywords the profile genuinely supports added to experience bullets, genuine gaps left visible and **never stuffed**
