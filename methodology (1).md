# Methodology
## AI-Native Kitchen Hiring Workflow

---

## What Makes This AI-Native

This workflow is not a keyword search, an ATS filter, or a chatbot wrapper.
It uses a large language model as a **domain reasoning engine** — a system
that applies genuine culinary industry knowledge to evaluate candidates
against role-specific criteria, at scale, consistently.

The distinction matters because traditional resume screening tools match
patterns (words, titles, years of experience). This workflow matches
*meaning* — understanding that a line cook at Le Rock is a different
candidate than a line cook at a hotel restaurant, even if their titles
and years of experience are identical.

---

## Four Reasoning Capabilities

### 1. Restaurant Research at Scale

Every resume contains restaurant names that require individual research
to evaluate. Claude has deep knowledge of the culinary reputation, volume
profile, price point, chef pedigree, and concept type of thousands of
restaurants — and applies that knowledge instantly to every candidate.

What would take a chef-owner 20 minutes per resume (Googling restaurants,
reading reviews, cross-referencing chef backgrounds) takes Claude seconds.
And it does it consistently across every application in the stack, without
fatigue, bias from the last resume reviewed, or memory of what the first
candidate looked like.

### 2. Domain Knowledge Encoding

The prompt encodes real hiring expertise — specific restaurant benchmarks,
an understanding of what high-volume means in a culinary context, the
distinction between fine dining and upscale casual, and the difference
between a title and actual responsibility.

This knowledge lives in the prompt, not in a database. It can be updated
instantly: add a new benchmark restaurant, change the cover count, shift
the concept from French-American to Italian-American, and the entire
evaluation rubric updates in seconds.

### 3. Structured Output from Unstructured Input

Resumes arrive in inconsistent formats — PDFs, Word docs, email bodies,
bullet points, paragraphs, LinkedIn copy-pastes, handwritten notes
photographed and emailed. Claude normalizes and evaluates all of them
against a consistent rubric regardless of format.

The Resume Analyzer tool extends this by extracting text from PDF,
Word (.docx), and plain text files before analysis, making even
formatted resumes machine-readable without manual transcription.

### 4. Contextual Judgment Over Pattern Matching

A candidate who worked at Le Rock (high-volume French brasserie,
Rockefeller Center, James Beard Award team) scores very differently from
one who worked at a hotel restaurant with "French cuisine" in the concept
description — even though both might trigger a keyword match for "French
restaurant."

Claude understands the difference. And it explains its reasoning
transparently in every analysis, so the operator can agree, disagree,
or probe further.

---

## How the Prompt Was Developed

The prompt was built iteratively through a live hiring session in which
20+ candidate resumes were analyzed in real time. Each resume revealed
new calibration needs:

**Round 1 — Baseline**
Initial prompt focused on NYC restaurant experience and years in the
industry. Output was too generic — hotel restaurants and tasting menu
kitchens were being scored too high relative to upscale casual bistros.

**Round 2 — Volume calibration**
Added explicit language about 200-cover à la carte pace and why hotel,
club, and tasting menu kitchens are less directly relevant. Scores
recalibrated appropriately.

**Round 3 — Benchmark anchoring**
Added specific benchmark restaurants (Le Rock, Monkey Bar, Gallagher's,
Happy Cooking group) so Claude had a concrete reference frame for the
target concept. Analysis became sharper and more differentiated.

**Round 4 — Interview question output**
Added the "one key interview question" field after noticing that gaps
and overlapping dates kept appearing across candidates. Surfacing a
targeted question for each resume proactively saves time in the
interview process and prevents generic screening calls.

**Round 5 — Structured JSON output (Resume Analyzer tool)**
For the Resume Analyzer dashboard, the prompt was adapted to return
structured JSON, enabling dynamic rendering of scores, tags, bars, and
expandable cards. This is the same analytical logic as the text prompt,
delivered in a format that powers a visual interface. The tool also
added support for PDF, Word (.docx), and plain text file extraction,
candidate name auto-detection, date stamping, and manual name and phone
fields stored locally in the browser.

---

## Iterative Prompt Engineering Principle

The core principle demonstrated by this development process:

> Build with real data. Refine based on output quality.
> Encode learnings back into the prompt.

Each refinement required a real resume, a real piece of output that
missed something, and a specific addition to the prompt that fixed it.
No refinement was theoretical. All were grounded in actual use.

This is the correct way to develop prompts for domain-specific
applications: not from first principles, but from production data.

---

## What This Is Not

**Not a hiring decision engine.**
The output is one input to a hiring decision — not the decision itself.
The score and analysis inform the chef or operator; they do not replace
judgment. A 9/10 candidate still gets an interview. A 4/10 candidate
might still get a call if something about the resume catches the
operator's eye.

**Not a replacement for the interview.**
The key interview question generated for each candidate is designed to
surface the one thing the resume cannot answer. The analysis identifies
the gap; the interview fills it.

**Not objective in an absolute sense.**
The scoring rubric reflects the specific values and priorities of this
hiring context — high-volume, upscale casual, New American and French,
NYC. A candidate who scores a 4 here might score a 9 for a different
concept. The prompt should always be calibrated to the specific role
and concept before use.

---

## Responsible Use

See `responsible_ai_notes.md` for full guidance on privacy, bias
considerations, and appropriate use of AI-assisted hiring tools.
