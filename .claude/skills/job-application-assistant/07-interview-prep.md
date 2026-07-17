---
framework_version: 1.0.0
---

# Interview Preparation Guide

<!-- SETUP: STAR examples are personalized by running /setup based on your actual experience -->

## STAR Format

Structure answers as: **Situation** (context), **Task** (your responsibility), **Action** (what you did), **Result** (outcome).

Keep answers to 1-2 minutes. Be specific. End with what you learned or would do differently.

## Ready-Made STAR Examples

### 1. FDA Approval Acceleration via ETL Redesign (Data Engineering / Regulatory Impact)
**S:** Medtronic's CGM sensor data validation process required manual, months-long data preparation before FDA submissions could proceed, delaying revenue recognition on device approvals.
**T:** As Senior Clinical Bioinformatics Engineer, responsible for redesigning the pipeline to validate and transform CGM sensor data faster without compromising regulatory rigor.
**A:** Engineered automated ETL/ELT pipelines on AWS that handled schema validation and transformation programmatically, replacing manual steps.
**R:** Cut data preparation time from 6 months to 3, directly enabling FDA approval that accelerated $90M in revenue recognition.
**Use for:** "Tell me about a time you had significant business impact", "Describe a project with regulatory/compliance constraints"

### 2. Post-Market Surveillance Pipeline Preventing Recalls (Proactive Problem-Solving)
**S:** CGM sensor degradation issues could go undetected until they became large-scale quality incidents requiring product recalls.
**T:** Build a system to catch sensor degradation trends early using clinical telemetry data.
**A:** Developed a post-market surveillance pipeline and Tableau-based analytics layer in PL/SQL to detect early degradation signals.
**R:** Eliminated product recalls, saving an estimated $50M per product line.
**Use for:** "Tell me about a time you prevented a major problem before it happened", "Describe how you use data to drive proactive decisions"

### 3. LLM-Powered Compliance Extraction (Applying New Technology)
**S:** Manual review of complaints, CAPAs, and deviation reports for regulatory compliance was slow and inconsistent.
**T:** Explore whether LLMs could reliably extract key structured signals from unstructured compliance text.
**A:** Engineered LLM-powered extraction pipelines, then designed and ran performance benchmarks against labeled quality datasets, tuning prompts and model configurations for classification accuracy.
**R:** Reduced manual review time, produced structured audit-ready datasets aligned to FDA standards, and reduced compliance risk.
**Use for:** "Tell me about a time you introduced a new technology or tool", "Describe how you evaluate whether an AI/ML solution is production-ready"

### 4. Cross-Functional Reporting Speedup at The Realest Group (Efficiency / Ownership)
**S:** Managerial KPI reporting relied on manual, multi-hour processes to compile cross-functional data, and the company's core data infrastructure (legacy sources feeding a growing Redshift setup) needed consolidation.
**T:** As the company's sole data scientist, own and modernize the core data infrastructure and reporting automation.
**A:** Built and automated SQL-driven ETL pipelines feeding KPI reports, while rebuilding the Redshift database and deprecating legacy sources.
**R:** Cut managerial reporting time from 3 hours to 5 minutes, reduced costs 25%, and increased storage capacity 150%.
**Use for:** "Tell me about a time you improved a process", "Describe a time you owned a system end-to-end with limited resources"

### 5. Leading a Clinical Research Team (Leadership / Executive Communication)
**S:** Medtronic needed non-significant-risk clinical studies conducted on diabetes management devices, with findings reported to top leadership.
**T:** As Clinical Research Specialist, lead a team of 4 running the studies and translate findings for an executive audience.
**A:** Directed the research team's day-to-day study execution, analyzed physiological data across 1,000+ patients, and prepared/delivered findings directly to the CEO, Head of Engineering, and R&D leadership.
**R:** Gave leadership clear, credible evidence to guide device development decisions.
**Use for:** "Tell me about a time you led a team", "Describe presenting technical findings to senior executives"

<!-- Add more STAR examples as needed. Aim for 4-6 covering different competencies. -->

## Common Tough Questions

### "Why did you leave [previous company]?"
> [PREPARE YOUR ANSWER - be honest, forward-looking, no negativity about former employer]

### "You don't have [specific skill/experience]."
> [PREPARE YOUR ANSWER - acknowledge the gap, bridge to adjacent experience, show willingness to learn]

### "Where do you see yourself in 5 years?"
> [PREPARE YOUR ANSWER - show ambition aligned with the role's growth path]

### "What's your biggest weakness?"
> [PREPARE YOUR ANSWER - genuine weakness with concrete mitigation strategy]

### "Why this company specifically?"
> Customize per company. Must reference: specific projects, company values, market position, or team structure. Never give a generic answer.

## Questions You Should Ask Interviewers

### About the Role
- "What does a typical week look like in this role?"
- "What would success look like in the first 6 months?"
- "What's the biggest challenge the team is facing right now?"

### About the Team
- "How big is the team, and how do you divide work?"
- "What does the development/project lifecycle look like, from idea to production?"
- "How do you onboard new team members?"

### About Tech & Growth
- "What's your current tech stack for [relevant area]?"
- "Is there room to grow into more architectural or strategic decisions?"
- "How does the team stay current with new tools and methods?"

### About Culture (use these to prevent disappointment)
- "How would you describe the team culture?"
- "What does professional development look like here?"
- "Is there flexibility for remote/hybrid work?"
- "What's the balance between development/new projects and maintenance work?"
- "How would you describe the leadership style in this team?"
- "What do people who thrive here have in common?"

## Phone/Video Interview Tips
- Have STAR examples written out (use this file)
- Keep a glass of water nearby
- Smile when speaking (it changes your tone)
- Ask for clarification if a question is vague
- It's OK to take 5 seconds to think before answering
- End with: "Is there anything else you'd like to know about my background?"

## After the Application (Best Practice)

### Follow-Up Etiquette
- **Don't call to "stand out"** or to learn more about the role post-submission - this risks a negative impression
- If the employer specified a timeline, respect it and wait
- If no timeline was given and significant time has passed (2+ weeks), a brief call to ask about status is acceptable
- If you have genuinely new, relevant information to share, a short follow-up is fine

### Thank-You Notes
- When you receive any update (interview invitation, rejection, or status update), send a brief thank-you message
- Express appreciation for their time and the process
- Keep it short (2-3 sentences)

## Roleplay Guidelines
When the user asks for interview practice:
1. Ask which role/company to simulate
2. Start with easy warm-up questions ("Tell me about yourself")
3. Progress to role-specific technical questions
4. Include 1-2 behavioral questions using the competencies from the job posting
5. End with a tough question or curveball
6. After each answer, give brief feedback: what worked, what to sharpen
7. Suggest which STAR example would work best for each question
