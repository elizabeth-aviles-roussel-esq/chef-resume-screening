# Enterprise Translation Guide
## AI-Native Culinary Hiring Workflow | Version 3.0

This document explains how to adapt the workflow for restaurant groups,
multi-unit operators, or consulting engagements beyond the single-unit
Casual American 80-seat context this version is built for.

---

## When to Use This Guide

This workflow was designed for a specific concept: a Casual American
restaurant in NYC with 80 seats. If you are using it for:

- A different cuisine type (Italian, Japanese, steakhouse, etc.)
- A different format (fast casual, hotel F&B, private club, catering)
- A different market (outside NYC)
- A restaurant group hiring across multiple concepts simultaneously

...you will need to adapt the core files. This document explains what to
change and what stays the same.

---

## What Is Concept-Agnostic (Keep As-Is)

The following elements of the workflow apply regardless of concept:

- The eight-section output structure (score, experience, red flags,
  alignment, volume, leadership, interview question, recommendation)
- The 1–10 scoring scale and tier labels
- The tenure pattern evaluation logic
- The responsible AI notes and data handling practices
- The GitHub file structure and upload order
- The Resume Analyzer tool interface and candidate stack display

---

## What Requires Updating Per Concept

### `prompt_template.txt`

Update these fields:

| Field | What to change |
|-------|----------------|
| Concept description | Replace "Casual American restaurant in NYC with 80 seats" |
| Benchmark restaurants | Replace with 5–8 restaurants that represent your target concept |
| Cover count | Update to match your format |
| Cuisine alignment section | Replace Casual American criteria with concept-specific criteria |

**Example — updating for a wood-fired Italian concept:**

> I am hiring a [ROLE] for a wood-fired Italian restaurant in NYC with
> 110 seats. The concept is rustic, regional Italian — handmade pasta,
> wood-fired proteins, simple antipasti. Benchmark restaurants for this
> style include Lilia, Don Angie, Rezdôra, Misi, L'Artusi, and Via Carota.

### `scoring_guide.md`

Update the cuisine alignment section to reflect:
- What counts as a strong concept match
- What benchmark restaurants carry weight
- What cuisine backgrounds transfer well vs. poorly
- Any technique-specific requirements (e.g., wood fire, live fire,
  fermentation, raw bar, pastry depth)

### `sample_analysis.md`

Replace the sample analysis with one from a real candidate evaluated
for the new concept. This keeps the documentation honest and makes
the rubric concrete for anyone reading the repo.

### `README.md`

Update the "The Concept This Is Built For" section and the benchmark
restaurant list.

---

## Multi-Concept Operations

If you are hiring across multiple concepts simultaneously (e.g., a
restaurant group with a Casual American flagship, a casual wine bar, and
a private dining room), run separate instances of the prompt for each
concept rather than trying to combine criteria into one prompt.

A single unified prompt for multiple concepts will produce diluted,
less accurate scores. The specificity of the rubric is what makes the
output useful.

**Recommended structure for a group:**

```
/kitchen-hire-new-american/    ← this repo, as-is
/kitchen-hire-wine-bar/        ← separate repo or branch, adapted prompt
/kitchen-hire-private-dining/  ← separate repo or branch, adapted prompt
```

---

## Scaling Beyond 80 Seats

The volume calibration in this workflow assumes roughly 100–160 covers
per night (two seatings, 80 seats). For higher-volume formats:

| Format | Adjust scoring for |
|--------|-------------------|
| 150+ seat restaurant | Weight high-volume line experience more heavily |
| Hotel F&B | Add banquet and multi-outlet experience as a criterion |
| Fast casual | Reprioritize speed and systems over technique depth |
| Private club | Weight consistency and member-relationship skills |

The scoring scale itself does not change — only the criteria that
determine where a candidate falls on it.

---

## Pricing This as a Service

If you are using this workflow as part of a culinary staffing or
consulting engagement, the typical service model includes:

- **Setup:** Configuring the prompt, scoring guide, and integrations
  for the client's specific concept
- **Per-hire screening:** Running candidates through the workflow and
  delivering ranked shortlists
- **Integration setup:** Connecting Craigslist email and/or
  Culinary Agents API for the client's accounts
- **Ongoing calibration:** Updating the rubric as the client's hiring
  criteria evolve

Refer to the pricing proposal documents for current rate structures.
