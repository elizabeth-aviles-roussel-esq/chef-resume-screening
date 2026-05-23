# Responsible AI Notes
## AI-Native Culinary Hiring Workflow | Version 3.0

This document covers the ethical considerations, data handling practices,
and known limitations of using AI in the culinary hiring process.

---

## What the AI Does

The AI reads resume text and applies a scoring rubric calibrated for a
Casual American restaurant in NYC with 80 seats. It returns a structured
assessment covering fit score, cuisine alignment, tenure patterns,
leadership level, and a suggested interview question.

The AI does not make hiring decisions. It produces a structured first-pass
review that a human hiring manager evaluates before any candidate is
contacted.

---

## What Data Is Shared

When you use this workflow:

- Resume text (entered manually or extracted from PDF, Word, or plain
  text files) is sent to the Anthropic Claude API for analysis
- Anthropic's data handling is governed by their privacy policy at
  anthropic.com/privacy
- Claude.ai conversations may be reviewed by Anthropic for safety and
  quality purposes depending on your plan settings

**What is never sent to the API:**
The manual name and phone number fields in the Resume Analyzer tool
are stored only in your browser session and are never transmitted
to the Anthropic API or any third party.

**Craigslist email integration:**
When using the Gmail integration to pull Craigslist application responses,
email content is read via the Gmail MCP connection and the resume text
is passed to the Claude API for analysis. The full email — including
any personal information in the sender's signature or body — is
processed. Use a dedicated inbox for this purpose and do not forward
personal correspondence through the tool.

**Culinary Agents integration:**
Application data received via the Culinary Agents Job Board API is
processed through the analyzer in the same way as manually entered
resumes. Candidate data is not stored beyond the current browser session.

---

## Known Limitations

### The AI does not know NYC restaurants it was not trained on

The model's knowledge of NYC restaurants has a training cutoff date.
New openings, closures, or ownership changes may not be reflected in
its assessments. If a restaurant's significance is unclear in the output,
verify it independently.

### The AI cannot detect tone or intent

A resume that is well-formatted and uses the right vocabulary will
score higher than one with the same experience described poorly.
The AI evaluates what is written, not what is true. References remain
essential for senior hires.

### Overlapping dates are flagged but not explained

The AI will note when dates on a resume appear to overlap, but it
cannot determine whether this reflects multiple simultaneous jobs
(common in the NYC kitchen world), a data entry error, or an attempt
to obscure a gap. Always ask the candidate directly.

### The scoring rubric is concept-specific

The rubric is calibrated for a Casual American restaurant in NYC with
80 seats. If your concept, market, or format changes significantly,
the prompt and scoring guide should be updated. Applying this rubric
to a different concept type will produce unreliable scores.

---

## Bias Considerations

AI systems can reflect and amplify biases present in their training data.
In culinary hiring, this may manifest as:

- **Name-based assumptions:** The AI may draw inferences about a
  candidate based on the apparent origin of their name. Review
  assessments where name-based reasoning appears to be influencing
  the score.

- **Prestige bias:** The model may over-weight famous restaurant
  names and under-weight smaller but high-quality concepts. A cook
  from a respected neighborhood restaurant may be underscored relative
  to someone from a famous but poorly-run kitchen.

- **Recency bias:** The model may give more weight to recent experience
  than older experience. For candidates with long careers, verify
  that early formative experience is being appropriately considered.

Hiring managers should review every candidate's raw resume alongside
the AI assessment, particularly for candidates scoring in the 5–7 range
where the judgment call is closest.

---

## Legal Considerations

This workflow is an internal efficiency tool, not a regulated automated
decision system. However:

- Do not use AI scores as the sole basis for rejecting a candidate
- Do not store AI assessments alongside protected class information
- Ensure all candidates for the same role are evaluated using the
  same criteria and prompt version
- Document your hiring process in the same way you would without AI

If you have questions about AI use in hiring under applicable law,
consult qualified legal counsel.

---

## Feedback and Iteration

If the AI consistently misscores a category of candidate — for example,
undervaluing strong candidates from non-NYC markets, or overvaluing
fine dining experience for a line cook role — update the prompt and
scoring guide and note the change in the version history in methodology.md.

The workflow improves through iteration. Track which AI-recommended
candidates perform well after hiring to calibrate future scoring.
