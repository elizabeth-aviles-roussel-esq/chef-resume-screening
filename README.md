# STACKED™ — Kitchen Hiring, Ranked

© 2026 STACKED — Kitchen Hiring, Ranked. All rights reserved.

> **Proprietary software. All rights reserved. Unauthorized use, copying, or distribution is strictly prohibited. See <LICENSE> for full terms.**

-----

I-Native Culinary Hiring Workflow

### Version 3.0 | Casual American · 80 Seats · New York City

An AI-powered resume screening workflow built for independent restaurant
hiring. Calibrated for a Casual American restaurant in NYC with 80 seats.

-----

## What This Is

A structured system for screening culinary candidates using Claude
(Anthropic’s AI). It applies a consistent rubric to every resume and
returns a scored, structured assessment — fit score, cuisine alignment,
tenure flags, leadership level, and a suggested interview question.

The goal: get from 60 applications to a ranked shortlist of 10
candidates in under an hour, without losing important signals in the noise.

-----

## The Concept This Is Built For

- **Cuisine:** Casual American — seasonal, ingredient-driven, scratch kitchen
- **Format:** 80 seats, two seatings, ~100–160 covers per night
- **Market:** New York City independent restaurant scene
- **Benchmark restaurants:** Gramercy Tavern, Estela, Loring Place,
  ABC Kitchen, Olmsted, Vic’s, The Dutch, Cafe Clover, Claudette,
  Lighthouse Brooklyn, Frenchette, Gage & Tollner

If your concept is different, update `prompt_template.txt` and
`scoring_guide.md` before using this workflow.

-----

## Files in This Repository

|File                       |What it is                                                                        |
|---------------------------|----------------------------------------------------------------------------------|
|`README.md`                |This document                                                                     |
|`index.html`               |Standalone browser app — full resume analyzer, no build step required             |
|`resume-analyzer.jsx`      |React component version of the analyzer for Claude.ai artifacts                   |
|`prompt_template.txt`      |Copy-paste prompt for manual resume analysis                                      |
|`scoring_guide.md`         |How scores are assigned and what they mean                                        |
|`methodology.md`           |How the workflow was designed and iterated                                        |
|`gmail_pipeline_notes.md`  |Email infrastructure setup — Craigslist inbox, Gmail forwarding, Claude connection|
|`responsible_ai_notes.md`  |Data handling, limitations, and bias considerations                               |
|`enterprise_translation.md`|How to adapt the workflow for different concepts or multi-unit operations         |
|`sample_analysis.md`       |Real example output for a Lead Line Cook candidate                                |
|`chef_one_pager.html`      |One-page reference card for chefs and operators                                   |
|`pricing.html`             |Subscription, per-hire, and implementation fee pricing page                       |

-----

## How to Use It

### Option 1 — Manual (no setup required)

1. Open Claude at claude.ai
1. Open `prompt_template.txt` and copy the prompt
1. Fill in the role and any custom details
1. Paste a resume at the bottom
1. Read the output and score the candidate
1. Repeat for each applicant

Takes about 90 seconds per resume.

### Option 2 — Resume Analyzer Tool

The `resume-analyzer.jsx` file is a React artifact that runs inside
Claude.ai. It accepts resumes from three sources:

**Manual entry or file upload**
Paste resume text or drag and drop a PDF or Word document.
The tool extracts text and sends it through the scoring prompt automatically.

**Craigslist via dedicated email inbox**
Point a dedicated email address at your Craigslist job posting
The Gmail integration reads that
inbox and queues incoming applications for analysis automatically.

**Culinary Agents Job Board API**
When a candidate applies to your Culinary Agents posting, their
application is routed into the analyzer via the Culinary Agents API.
Requires a one-time setup with the Culinary Agents integrations team and
an active paid employer account.

All three sources feed into a single ranked candidate stack, sorted
by score. One view of every applicant across every channel.

-----

## Integration Setup

### Craigslist Email Inbox

1. Create a dedicated email address for culinary job applications
   (Google Workspace, Gmail, or any provider)
1. In your Craigslist job posting, set replies to go to that address
1. Connect your Gmail account to Claude.ai via the Gmail integration
   in Settings → Integrations
1. In the Resume Analyzer tool, enter the dedicated email address
   and click “Fetch Applications”

**Important:** The Gmail connection reads email on demand — it does not
monitor automatically. Click “Fetch Applications” each time you want
to pull new applicants.

### Culinary Agents API

1. Contact Culinary Agents to request API access for your employer account
1. Request API access for your employer account
1. Provide your webhook endpoint (generated in the Resume Analyzer tool)
1. Culinary Agents will configure your account to route applications
   to the endpoint automatically

One-time setup. After configuration, all new CA applications appear
in the candidate stack without any manual steps.

-----

## Limitations

- The AI evaluates what is written — not what is true. References remain essential.
- Restaurant knowledge has a training cutoff. Verify unfamiliar names independently.
- The rubric is calibrated for this specific concept. Different concept = update the prompt.
- PDF attachments in Craigslist emails cannot be opened via Gmail MCP.
  Use the drag-and-drop analyzer for attachment-based resumes.
- True real-time automation (analyze every resume the moment it arrives)
  requires a custom backend. Zapier and Make.com workflows can bridge this gap.

-----

## Version History

|Version|Change                                                                                                                                                                  |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|1.0    |Basic manual prompt workflow                                                                                                                                            |
|2.0    |Eight-section structured output; Gmail / Craigslist integration                                                                                                         |
|3.0    |Concept updated to Casual American 80-seat NYC; Culinary Agents API integration added; Resume Analyzer rebuilt with multi-source candidate stack and JSON scoring output|