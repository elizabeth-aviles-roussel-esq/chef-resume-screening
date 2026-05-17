# Enterprise Translation
## AI-Native Kitchen Hiring Workflow

This document translates the culinary hiring workflow into enterprise
and consulting frameworks, for audiences evaluating AI-native workflow
design across industries.

---

## The Pattern This Demonstrates

The kitchen hiring workflow is a specific instance of a generalizable
pattern in AI-native workflow design:

**Domain expertise → Prompt encoding → Consistent structured output
→ Human decision with AI context**

This pattern appears across industries wherever:
- Evaluation requires contextual judgment, not just data matching
- The input is unstructured (documents, text, free-form submissions)
- The volume makes manual expert review impractical at scale
- The decision has downstream consequences (hiring, underwriting, triage)

---

## Enterprise Analogies by Domain

### Financial Services — Credit and Underwriting
- **Analog:** Evaluating loan applications against risk criteria
- **What transfers:** Encoding underwriting standards into prompt;
  researching counterparty/company reputation at scale; structured
  output feeding decisioning workflow
- **What's different:** Regulatory requirements around explainability
  and bias testing are more stringent; human-in-the-loop requirements
  may be mandated

### Legal — Contract Review and Due Diligence
- **Analog:** Screening contracts or corporate filings against a
  specific risk rubric
- **What transfers:** Domain knowledge encoding; structured red flag
  identification; consistent output format regardless of document
  format or quality
- **What's different:** Privilege considerations; accuracy thresholds
  are higher; attorney review requirement before any action

### Healthcare — Clinical Documentation Review
- **Analog:** Reviewing patient records against eligibility criteria
  for a specific program or intervention
- **What transfers:** Unstructured-to-structured normalization; rubric
  encoding; consistent scoring at scale
- **What's different:** HIPAA; accuracy and liability considerations;
  clinical validation requirements

### Retail / CPG — Vendor and Supplier Qualification
- **Analog:** Evaluating supplier applications against sourcing criteria
  (certifications, volume capacity, geographic fit, pricing tier)
- **What transfers:** Scoring rubric; multi-criteria evaluation;
  structured output for procurement team review
- **What's different:** More structured inputs (certifications are
  binary); less need for contextual interpretation

---

## Design Principles for Enterprise Adaptation

### 1. Calibrate before deploying
The culinary prompt was refined through 20+ live resumes before it
produced reliable output. Enterprise applications should budget for
a similar calibration phase with domain experts reviewing outputs
and providing refinement feedback before scaling.

### 2. Encode human expertise, not just criteria
The most important prompts are not lists of requirements — they are
the judgment calls that experienced practitioners make intuitively.
In the kitchen workflow, this is knowing that Le Rock means something
different from a hotel restaurant. In other domains, this is knowing
what a real audit finding looks like versus a formatting error, or
what a genuinely distressed balance sheet looks like versus seasonal
variation. Interview domain experts to surface these implicit rules
before writing the prompt.

### 3. Separate scoring from decision
The workflow produces a score and an analysis, not a decision. This
separation is deliberate and important for enterprise contexts where:
- Regulatory requirements mandate human review
- The AI output is one signal among many
- Accountability for decisions must remain with a human

### 4. Build for the unstructured edge cases
The most valuable property of this approach is that it handles
documents that no keyword search would catch. In enterprise contexts,
budget significant time for testing on edge cases: incomplete
documents, unusual formats, non-standard terminology, multilingual
inputs. These are where LLM-based approaches outperform rule-based
ones most clearly.

### 5. Version and track prompts like code
Every refinement to the prompt changes the output. In production
enterprise deployments, prompts should be versioned, tested against
a benchmark set of known inputs, and deployed with change management
discipline — just like code.

---

## AI Maturity Model Positioning

This workflow represents **Level 3 — Augmented Decision-Making**
in a standard AI maturity model:

| Level | Description | Example |
|-------|-------------|---------|
| 1 — Descriptive | AI summarizes existing data | Dashboard reporting |
| 2 — Diagnostic | AI identifies patterns and anomalies | Fraud flag |
| **3 — Augmented** | **AI provides scored analysis; human decides** | **This workflow** |
| 4 — Predictive | AI forecasts outcomes | Churn prediction |
| 5 — Autonomous | AI decides and acts | Fully automated underwriting |

Level 3 is the highest maturity level appropriate for high-stakes
hiring, underwriting, or qualification decisions without additional
validation infrastructure. It delivers significant efficiency gains
(minutes per document to seconds) while maintaining human accountability.

---

## Productization Pathways

This workflow demonstrates three distinct pathways to enterprise product:

**1. Internal tool (operator-facing)**
The current form — a prompt template and analyzer tool used directly
by the hiring manager or operator. Lowest development cost, highest
flexibility, no third-party dependency.

**2. White-labeled SaaS (hospitality-specific)**
A dedicated web application for restaurant operators: submit resumes,
get scored analyses, track candidates, export shortlists. Target market:
independent restaurant groups, culinary staffing agencies, hotel F&B
operations. Revenue model: per-analysis or subscription.

**3. API integration (staffing platforms)**
Integrate the scoring engine into existing culinary staffing platforms
(Qwick, Hyer, culinary job boards) as an embedded evaluation layer.
Revenue model: licensing or per-call pricing.

Each pathway uses the same core prompt logic. The differentiation is
in the interface, the infrastructure, and the go-to-market.
