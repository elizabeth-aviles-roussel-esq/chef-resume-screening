# Responsible AI Notes
## AI-Native Kitchen Hiring Workflow

---

## Overview

AI-assisted hiring tools raise legitimate questions about bias, privacy,
fairness, and accountability. This document addresses those questions
directly and provides guidance for responsible use of this workflow.

---

## What This Tool Does and Does Not Do

**Does:**
- Research restaurant reputations and assess culinary pedigree
- Score candidates against a defined rubric of volume experience,
  cuisine alignment, and leadership trajectory
- Surface red flags in resume formatting, timeline gaps, or title inflation
- Generate targeted interview questions based on resume-specific gaps
- Rank candidates against each other within a session

**Does not:**
- Make hiring decisions
- Access any information not in the resume text provided
- Consider protected characteristics (name, age, gender, nationality,
  disability, family status) — these do not appear in the scoring rubric
- Store candidate data between sessions
- Share candidate information with third parties

---

## Bias Considerations

### Where bias can enter

**1. In the training data**
Claude's knowledge of restaurant reputation reflects the culinary
industry as documented — which skews toward well-reviewed, press-covered,
urban restaurants. Smaller, immigrant-owned, or outer-borough restaurants
may be underweighted in reputation assessments relative to their actual
culinary quality.

**Mitigation:** When a restaurant is flagged as "unknown" or low-tier,
ask Claude to search for it before accepting the assessment. A restaurant
Claude doesn't recognize is not necessarily a low-quality kitchen.

**2. In the prompt design**
The prompt encodes specific benchmarks (Le Rock, Monkey Bar, etc.)
that reflect one definition of "upscale casual NYC." This is intentional
and appropriate for this use case — but it means the rubric is not
neutral. It favors certain career paths and certain restaurant networks.

**Mitigation:** This is a feature, not a bug, for hiring to a specific
concept. But acknowledge that it may disadvantage candidates with
equally strong skills from different culinary traditions or geographies.

**3. In how you use the output**
A candidate who scores a 4 is not a bad cook. They are a potentially
less direct fit for this specific concept. Using the score as a final
judgment rather than a first filter is a misuse of the tool.

**Mitigation:** Always interview candidates the tool flags as strong.
Don't let a lower score substitute for a conversation with a candidate
who catches your eye for other reasons.

---

## Privacy

### What data is shared

When you use this workflow:
- Resume text (entered manually or extracted from PDF, Word, or TXT
  files) is sent to the Anthropic Claude API for analysis
- Anthropic's data handling is governed by their privacy policy at
  anthropic.com/privacy
- Claude.ai conversations may be reviewed by Anthropic for safety and
  quality purposes depending on your plan settings

**What is never sent to the API:**
The manual name and phone number fields in the Resume Analyzer tool
are stored only in your browser session. They are typed in locally
after analysis is complete and are never transmitted to any server.

### Recommended practices

- **Anonymize where possible.** You do not need to include a candidate's
  name, phone number, home address, or references' contact information
  in the analysis prompt. The analysis is based on work history, not
  identity.
- **Use the dedicated hiring inbox.** Keeping candidate communications
  in a separate Gmail account reduces the risk of personal data
  commingling with other business or personal correspondence.
- **Do not store transcripts containing candidate PII.** If you export
  or share conversation outputs, remove identifying information.
- **Check your Claude plan settings.** Pro and Team plans offer options
  to limit data usage for model training. Review these settings at
  claude.ai → Settings → Privacy.

### Legal considerations

This workflow is designed for use in the United States for restaurant
hiring. If you are hiring candidates who are EU-based, GDPR may apply
and you should consult with a legal advisor before using AI tools in
your hiring process. Emerging US state privacy laws (California CCPA,
others) may also impose requirements — consult legal counsel if
operating at scale.

---

## Accountability

**The hiring decision belongs to you.**
This tool provides a scored analysis, not a hiring recommendation. The
chef, operator, or hiring manager reviewing the output is accountable
for the decision — not the AI.

**The interview question is a starting point.**
The "one key interview question" generated per candidate is a suggestion
based on visible resume gaps. It is not a comprehensive interview guide.
Add your own questions. Trust your instincts in the room.

**Disclose AI use if asked.**
If a candidate asks whether AI tools were used in reviewing their
application, answer honestly. There is no reason to be evasive, and
transparency builds trust.

---

## Appropriate Use Summary

| Use | Appropriate |
|-----|-------------|
| First-pass screening of resume stack | ✅ Yes |
| Researching restaurant pedigree | ✅ Yes |
| Generating targeted interview questions | ✅ Yes |
| Ranking candidates for interview scheduling | ✅ Yes |
| Making a final hire/no-hire decision without interview | ❌ No |
| Screening based on name, photo, or demographic inference | ❌ No |
| Sharing full candidate analysis with third parties | ❌ Without consent |
| Using scores as binding thresholds (e.g., "never interview below 7") | ❌ Not recommended |
