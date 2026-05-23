# Methodology
## AI-Native Culinary Hiring Workflow | Version 3.0

This document explains how the hiring workflow was designed, how the
prompt was developed, and the reasoning behind the scoring approach.

---

## The Problem This Solves

Hiring for a Casual American restaurant in NYC with 80 seats requires
evaluating candidates quickly and consistently. A typical Craigslist or
Culinary Agents posting generates 30–80 applications for a single role.
Reading each resume carefully, cross-referencing restaurant names, and
forming a consistent judgment across all candidates is time-consuming and
prone to bias — earlier resumes get more attention, fatigue sets in,
and criteria drift.

This workflow uses Claude (Anthropic's AI) to apply a consistent
evaluation rubric to every resume and return a scored, structured
assessment. The hiring manager reviews the output rather than the raw
resume, dramatically reducing the time from application to phone screen.

---

## Design Principles

### 1. Concept-Specific Scoring

Generic resume scoring does not work for culinary hiring. A 9/10 candidate
for a steakhouse may be a 5/10 for a Casual American concept. The prompt
was designed specifically for:

- **Concept:** Casual American, ingredient-driven, seasonal
- **Format:** 80-seat independent restaurant, two seatings, ~100–160 covers/night
- **Market:** New York City independent restaurant scene
- **Culture:** Chef-driven, team-oriented, scratch kitchen

All scoring criteria are calibrated to these specifics. If the concept
changes, the prompt and scoring guide should be updated accordingly.

### 2. Structured Output

The AI returns structured assessments — score, recommendation, strengths,
red flags, cuisine alignment, volume fit, leadership level, and a suggested
interview question. This structure makes it possible to compare candidates
side by side and build a ranked stack.

### 3. Human Review Required

The AI output is a first-pass filter, not a hiring decision. Every score
above 6 receives a human review before the candidate is contacted.
Every score below 5 is reviewed before a final pass decision.

The AI surfaces the information. The hiring manager decides.

---

## Prompt Development

The prompt went through five rounds of refinement:

**Round 1 — Basic scoring**
Initial prompt asked for a 1–10 score and brief summary. Output was
useful but inconsistent — different candidates got different levels of
detail, and the criteria were implicit rather than explicit.

**Round 2 — Explicit criteria**
Added the eight structured sections (fit score, relevant experience,
red flags, cuisine alignment, volume, leadership, interview question,
recommendation). Output became consistent and comparable across candidates.

**Round 3 — Concept specificity**
Added benchmark restaurants and Casual American cuisine criteria. The AI
began correctly weighting experience at Estela, Gramercy Tavern, and
similar concepts more heavily than hotel or chain experience. This was
the most important improvement.

**Round 4 — Tenure pattern recognition**
Added explicit instructions to flag short tenures, overlapping dates,
and unexplained gaps. The AI began surfacing timeline concerns that
human reviewers sometimes missed when skimming.

**Round 5 — Structured JSON output (Resume Analyzer tool)**
For the Resume Analyzer dashboard, the prompt was adapted to return
structured JSON, enabling dynamic rendering of scores, tags, bars, and
expandable cards. This is the same analytical logic as the text prompt,
delivered in a format that powers a visual interface. The tool also
added support for PDF, Word (.docx), and plain text file extraction,
candidate name auto-detection, date stamping, and manual name and phone
fields stored locally in the browser.

---

## Integration Sources

The workflow accepts resumes from three sources:

### Craigslist via Dedicated Email Inbox
Candidates responding to a Craigslist job posting send their application
to a dedicated email address for job applications.
The Gmail integration reads that inbox and extracts resume text from
email bodies for analysis. PDF attachments require the drag-and-drop
analyzer tool.

### Culinary Agents Job Board API
When a candidate applies to a posted position on Culinary Agents, their
application data flows into the analyzer via the Culinary Agents Job Board
API. This requires a one-time setup with the restaurant's Culinary Agents
account manager through the Culinary Agents integrations team and an active paid
employer account with API access enabled.

### Manual Entry
Any resume — from email, referral, walk-in, or any other source — can
be pasted into the text field or uploaded as a PDF or Word document
for immediate analysis.

---

## What This Workflow Does Not Replace

- Reference checks
- In-person tasting or trail shifts
- Gut instinct from an experienced hiring manager
- Conversations about compensation, schedule, and culture fit

The workflow compresses the early screening stage. Everything after
the phone screen remains a human process.

---

## Version History

| Version | Change |
|---------|--------|
| 1.0 | Basic prompt + manual copy-paste workflow |
| 2.0 | Structured eight-section output; Gmail integration added |
| 3.0 | Concept updated to Casual American 80-seat NYC restaurant; Craigslist email API and Culinary Agents API integrations added; Resume Analyzer tool rebuilt with JSON output and multi-source candidate stack |
