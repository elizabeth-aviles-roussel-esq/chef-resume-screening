# Email Pipeline Setup
## AI-Native Kitchen Hiring Workflow

This document covers the full email infrastructure for receiving, routing,
and analyzing resumes using the AI hiring workflow.

---

## Architecture Overview

```
Job postings (Craigslist, culinary boards, word of mouth)
        │
        ▼
Dedicated hiring inbox  ←──  Forwarding rules from other accounts
(hiring.[yourconcept]@gmail.com)
        │
        ├── Email body resumes → Copy/paste into Claude or analyzer tool
        └── PDF attachments   → Download → Drop into PDF Analyzer tool
                                           │
                                           ▼
                                  Scored analysis in seconds
```

---

## Step 1 — Create the Dedicated Hiring Inbox

Create a new Gmail account used exclusively for receiving resumes.
Example format: `hiring.[yourconcept]@gmail.com`

**Why a separate account:**
- Keeps candidate data separate from personal correspondence
- Allows you to connect it to Claude without exposing personal email
- Makes it easy to hand off to a manager or partner
- Clean search history — every email in this inbox is a candidate

Share this address on all job postings. Do not use your personal Gmail.

---

## Step 2 — Forward Resumes from Existing Accounts

### Gmail → Hiring Inbox

1. In your original Gmail: Settings → See all settings
2. Filters and Blocked Addresses → Create new filter
3. Set criteria: Subject contains `resume` (or your job title keyword)
4. Click Continue → Check "Forward it to" → Enter hiring inbox address
5. **Critical:** Check "Also apply filter to matching conversations"
   before clicking "Create filter"

**Note:** The "Also apply to matching conversations" checkbox is a
one-time retroactive trigger. It fires when you save, then resets.
This is by design — not a bug. Check the hiring inbox and Spam folder
within 5–30 minutes of saving.

### Yahoo → Hiring Inbox

Yahoo does not support subject-line filtering combined with external
forwarding in a single rule. Options:

**Option A — Forward all mail:**
Settings → More Settings → Mailboxes → Forward → Enter hiring inbox

**Option B — Manual forwarding:**
Search Yahoo for "resume" → select matching emails → forward individually

**Option C — Gmail import:**
In the hiring Gmail: Settings → Accounts and Import → Import mail and
contacts → Enter Yahoo credentials. Imports everything (no filtering),
but pulls all existing mail in bulk.

---

## Step 3 — Connect Hiring Inbox to Claude

1. Open claude.ai → Settings → Connections (location varies by version)
2. Find Gmail → Connect
3. Sign in with the **hiring inbox Gmail** specifically
4. Grant the requested permissions

**Important:** Claude does not monitor your inbox passively or run in
the background. It reads email only when you explicitly ask it to in
a conversation. The connection gives Claude access on demand — nothing
is read, indexed, or stored without your initiation.

---

## Step 4 — Using Claude to Search the Inbox

Once connected, prompt Claude directly in a conversation:

> "Check the hiring inbox for any resume emails received in the last
> week and analyze each one for a lead line cook role at a Casual American restaurant in NYC with 80 seats."

Claude will:
1. Search the connected Gmail for resume-related emails
2. Read any email body text (cover letters, pasted resumes)
3. Identify attached files (PDFs, Word docs, text files) by name
4. Analyze body text directly; flag attachments for the Resume Analyzer tool

**Current limitation:** Claude can read email body text via the Gmail
connection but cannot open PDF, Word, or text attachments directly. Use the
Resume Analyzer tool (resume-analyzer.jsx) for attachment processing.

---

## Step 5 — File Attachment Workflow

For resumes that arrive as attachments — PDF, Word (.docx), or plain text (.txt):

```
Email arrives in hiring inbox
        │
Open email → download attachment (one click)
        │
        What format?
   ┌────┼────┐
  PDF  .docx  .txt
   │     │     │
   └─────┴─────┘
         │
Open resume-analyzer.jsx in Claude
         │
Drag file onto drop zone
         │
Automatic text extraction + analysis
         │
Scored candidate card appears in dashboard
```

The Resume Analyzer tool supports all three formats:
- **PDF** — extracted via PDF.js, runs entirely in-browser
- **Word (.docx)** — extracted via Mammoth.js, runs entirely in-browser
- **Plain text (.txt)** — read via FileReader, runs entirely in-browser
- **Pasted text** — paste directly for email body resumes

No file content is stored by the tool. Text is sent to the Claude API
for analysis only.

---

## Limitations and Workarounds

| Limitation | Workaround |
|-----------|------------|
| Gmail MCP cannot open attachments | Use Resume Analyzer tool for PDF, Word, and TXT files |
| Gmail filter doesn't retroactively forward | Check "also apply to matching conversations" on save |
| Yahoo has no subject+forward combined rule | Use Gmail import or forward all mail |
| Claude doesn't run in background | Initiate inbox check manually each session |
| True automation requires custom backend | Use Zapier or Make to connect Gmail to Claude API |

---

## True Automation (Advanced)

For operators who want every resume analyzed automatically the moment
it arrives — without manually initiating a Claude session — a custom
backend workflow is required:

**Tools:** Zapier, Make (formerly Integromat), or custom script

**Workflow:**
1. Gmail trigger fires when new email matches "resume" filter
2. Extract email body and/or download attachment
3. Send content to Claude API with hiring prompt
4. Store scored analysis in a Google Sheet or Airtable
5. Optional: send Slack or SMS notification with score + summary

This is buildable but requires API access (Anthropic API key) and basic
workflow automation setup. Contact for implementation support.
