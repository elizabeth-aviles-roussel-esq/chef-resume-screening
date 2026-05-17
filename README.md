# AI-Native Hiring Workflow: Resume Fit Analysis with Claude

A practical, prompt-engineering-based workflow for analyzing job applications at scale — built for a real restaurant hiring scenario, adaptable to any domain.

---

## Overview

This project documents an AI-native hiring workflow that uses Claude (Anthropic) as a **domain reasoning engine** to evaluate job applicants against role-specific criteria. Unlike keyword-matching ATS tools, this approach encodes genuine hiring expertise directly into a structured prompt, enabling nuanced analysis of resume quality, restaurant pedigree, volume experience, and leadership fit.

The workflow was developed iteratively through a real hiring process for a **high-volume upscale casual New American and French restaurant in NYC doing 200 covers per night**, where domain knowledge matters enormously — knowing that experience at Le Rock signals different skills than experience at a neighborhood bar requires actual culinary industry understanding, not keyword frequency.

---

## The Problem

Small and mid-sized hospitality operators face a compounding challenge when hiring kitchen staff. Unlike corporate roles where credentials are standardized, culinary hiring depends almost entirely on **where someone has worked and what that kitchen represents**. A line cook at Le Rock (a high-volume French brasserie at Rockefeller Center from James Beard Award-winning chefs) is a fundamentally different candidate than a line cook at a hotel bar, even though both resumes might read identically to an untrained eye.

The problem is that **operators currently have no scalable way to research every restaurant on every resume**. This workflow solves that — bringing restaurant research, domain expertise, and consistent evaluation criteria to every resume, at scale, in seconds.

---

## Workflow Architecture

```
Resumes arrive → Dedicated hiring inbox → Claude reads & analyzes → Scored dashboard
     │                    │                        │                       │
  Email body          PDF attached           API call with              Ranked list
  Craigslist          Word doc               hiring prompt              Interview Qs
  LinkedIn            Plain text             + domain context           Red flags
```

### Three ways resumes enter the system

1. **Email body** — Applicant pastes their resume into an email
2. **PDF attachment** — Applicant attaches a resume file
3. **Direct paste** — Operator copies and pastes text directly into the Claude interface

---

## Email Infrastructure Setup

### Step 1 — Create a Dedicated Hiring Inbox

Create a new Gmail account used exclusively for receiving resumes (e.g., `hiring.yourconcept@gmail.com`). Share this address publicly on job postings — Craigslist, culinary job boards, word of mouth.

**Do not use your personal Gmail for this.** Keeping the hiring inbox separate protects your privacy and makes it easier to connect to Claude without exposing personal correspondence.

### Step 2 — Set Up Forwarding from Existing Accounts

If you already receive resumes at another email address (Gmail or Yahoo), forward them to the hiring inbox.

**Gmail forwarding filter:**
1. Settings → See all settings → Filters and Blocked Addresses → Create new filter
2. Set subject contains: `resume` (or your job title)
3. Action: Forward to `hiring.yourconcept@gmail.com`
4. Check **"Also apply filter to matching conversations"** immediately before saving — this checkbox triggers a one-time retroactive forward and then resets

**Yahoo forwarding:**
Yahoo does not support subject-line filtering combined with external forwarding. Options:
- Enable full forwarding: Settings → More Settings → Mailboxes → Forward
- Or manually forward individual resume emails

**Note on bulk forwarding:** Gmail's "Also apply to matching conversations" is the most reliable bulk trigger. The checkbox resets after each save — this is by design. Check your hiring inbox and Spam folder shortly after saving.

### Step 3 — Connect the Hiring Inbox to Claude

In Claude.ai:
1. Settings → Connections (location may vary by app version)
2. Find Gmail → Connect
3. Sign in with the **hiring inbox** Gmail account specifically
4. Grant the requested permissions

Claude can now search and read emails from this inbox on demand. **Claude does not monitor your inbox passively** — it only reads email when you explicitly ask it to in a conversation.

---

## The PDF Analyzer Tool

Because Gmail MCP connections can read email body text but cannot open PDF attachments directly, a companion tool handles PDF-to-analysis conversion.

### What it does

- Accepts **PDF, Word (.docx), and plain text (.txt)** resume files via drag-and-drop or file picker
- Also accepts pasted plain text (for email body resumes or copied LinkedIn profiles)
- Extracts text from PDF using PDF.js (runs entirely in-browser, no upload required)
- Sends extracted text to the Claude API with the full hiring prompt
- Returns a scored, structured analysis in seconds
- Tracks multiple candidates in a single session, sorted by fit score
- Displays experience bars, tags, red flag indicators, and a targeted interview question per candidate
- Auto-extracts candidate name and derives initials; stamps date analyzed
- **Manual name and phone number fields** on each card — entered locally, never sent to the API

### How to use it

1. Open the `resume-analyzer.jsx` artifact in Claude
2. Drag a PDF resume onto the drop zone — or click to browse — or use "Paste text instead" for email body resumes
3. Claude analyzes the resume against the hiring criteria
4. Repeat for each candidate; the dashboard builds as you go
5. Candidates are automatically ranked by fit score (1–10)

### Recommended workflow

```
Resume arrives in hiring inbox
        │
   What format?
   ┌─────┼─────┐
  PDF  .docx  .txt / email body
   │     │       │
   └─────┴───────┘
         │
   Drop into analyzer tool
   (or paste text directly)
         │
         ▼
   Scored analysis appears
         │
   Copy key interview Q
         │
   Reply to candidate
```

---

## The Prompt

```
I am hiring a [Lead Line Cook / Sous Chef / Chef de Cuisine] for a 
high-volume upscale casual New American and French restaurant in NYC 
doing 200 covers per night. The concept is upscale casual — think 
elevated bistro fare, refined but approachable, not fine dining tasting 
menus. Benchmark restaurants for this style include Le Rock, Monkey Bar, 
Oceana, Gallagher's, Little Park, and the Happy Cooking group (Joseph 
Leonard, Perla, Bar Sardine).

Please analyze the following resume and rate the candidate's fit on a 
scale of 1-10, then provide a brief assessment covering:

1. Overall fit score (1-10)
2. Relevant experience — List any upscale, chef-driven, or high-volume 
   NYC restaurants and explain their significance. Flag specifically any 
   experience at French brasseries, American bistros, or high-volume 
   neighborhood restaurants
3. Red flags — Note any gaps, overlapping dates, very short tenures, or 
   low-caliber experience
4. Cuisine alignment — How well does their background match upscale casual 
   New American and French cooking specifically. Fine dining tasting menu 
   experience is less relevant than brasserie or bistro experience
5. Volume experience — Specific evidence of kitchens doing comparable or 
   higher cover counts. Note that 200 covers nightly is serious volume 
   requiring speed, consistency, and stamina. Hotel restaurants, private 
   clubs, and tasting menu restaurants are generally lower volume and less 
   directly relevant
6. Leadership level — Are they suited for line cook, sous chef, or chef 
   de cuisine based on their history
7. One key interview question — The most important thing to clarify based 
   on gaps or concerns in this resume

[PASTE RESUME HERE]
```

---

## Scoring Guide

| Score | Action |
|-------|--------|
| 8–10 | Strong candidate — interview immediately |
| 6–7 | Solid background — worth a conversation |
| 4–5 | Some relevant experience but gaps — consider for line cook only |
| 1–3 | Not a fit — pass |

---

## Why This Is AI-Native

This is not a wrapper around a keyword search. It uses an LLM as a **domain reasoning engine** in four meaningful ways:

**1. Restaurant research at scale**
Every resume contains restaurant names that require individual research to evaluate. Claude knows the culinary reputation, volume profile, price point, and chef pedigree of thousands of restaurants — and applies that knowledge instantly to every candidate. What would take an operator 20 minutes per resume takes Claude seconds, and it does it consistently across every application in the stack.

**2. Domain knowledge encoding**
The prompt encodes real hiring expertise — specific restaurant benchmarks, an understanding of what high-volume means in a culinary context, and the distinction between fine dining and upscale casual. This knowledge lives in the prompt, not a database.

**3. Structured output from unstructured input**
Resumes arrive in inconsistent formats — PDFs, Word docs, email bodies, bullet points, paragraphs. Claude normalizes and evaluates all of them against a consistent rubric regardless of format.

**4. Contextual judgment over pattern matching**
A candidate who worked at Le Rock (high-volume French brasserie at Rockefeller Center) scores very differently from one who worked at a private members club, even though both might have "line cook" and "French cuisine" on their resume. Claude understands why — and explains its reasoning transparently so the operator can agree or disagree.

---

## How the Prompt Was Developed

The prompt was built iteratively through a live hiring session, during which 20+ candidate resumes were analyzed in real time. Each resume revealed new calibration needs:

- Early analysis showed that hotel restaurants and tasting menu kitchens were being over-valued relative to high-volume casual operations — the prompt was updated to explicitly deprioritize them
- Specific benchmark restaurants (Le Rock, Monkey Bar, Gallagher's, Happy Cooking group) were added after several rounds of analysis to give Claude a concrete reference frame for the target concept
- The 200-cover benchmark was added as a concrete volume signal after observing that "high volume" without context was being interpreted inconsistently
- The "one key interview question" output was added after noticing that gaps and overlapping dates kept appearing — surfacing these proactively saves time in the interview process

This iterative, use-case-driven development process is itself a demonstration of effective AI workflow design: **build with real data, refine based on output quality, encode learnings back into the prompt.**

---

## Privacy Considerations

- Keep candidates anonymized in analysis sessions where possible
- Do not include SSNs, home addresses, or references' personal contact information in prompts
- Conversations on Claude.ai may be reviewed by Anthropic depending on plan and privacy settings — check Settings → Privacy to manage data usage preferences
- The dedicated hiring inbox approach keeps candidate data separate from personal correspondence
- PDF text extraction in the analyzer tool runs in-browser — resume content is sent to the Claude API but is not stored by the tool itself

---

## Limitations

- **Claude does not run in the background.** The Gmail connection is on-demand only — Claude reads email when you ask, not automatically when messages arrive
- **PDF attachments in Gmail** cannot be opened directly via the Gmail MCP connection — use the PDF Analyzer tool for attachment processing
- **True automation** (analyze every resume the moment it arrives) requires a custom backend connecting Gmail webhooks to the Claude API via a tool like Zapier, Make, or a custom script — this is buildable but beyond the native Claude.ai interface

---

## Files

| File | Description |
|------|-------------|
| `README.md` | This document |
| `resume-analyzer.jsx` | React artifact — PDF drag-and-drop resume analyzer with Claude API integration |
