# CSS In/Out-Processing Tracker

A lightweight, browser-based tool for Commander's Support Staff (CSS) personnel to manage in-processing and out-processing requirements for unit members. Runs entirely client-side — no backend, no server, no database. All data lives in the browser's `localStorage`.

## Features

- **Personnel records** — Track in-processing and out-processing actions for any number of personnel
- **Configurable checklist library** — 40+ preloaded standard AF items across MPF, Finance, Medical, Security, Training, CSS, Logistics, Mission, and Legal categories. Select which apply per person; add custom items as needed.
- **Word/Excel checklist import** — Upload existing `.docx` or `.xlsx` checklists. The system auto-detects column headers, parses tables and lists, infers fields (item name, category, POC, suspense days, in/out applicability), and shows an editable preview before merging into the library. Duplicates are detected by name.
- **Dashboard with RYG status** — At-a-glance view of every active record. Red (overdue), Amber (due within 7 days), Green (on track)
- **Due-date notifications panel** — Filter by overdue or due-soon
- **Email draft generation** — Builds ready-to-send reminder emails. Copy to clipboard or open in your default mail client (Outlook, etc.)
- **Bulk email export** — Generate all email drafts for the active notification list as a single `.txt` file
- **Per-person status reports** — Printable / save-as-PDF status reports grouped by category, with summary statistics
- **Import / Export** — Back up your entire dataset to JSON; restore on another machine or browser

## Importing Existing Checklists

From the **Checklist Library** tab, click **⬆ Import Checklist (Word/Excel)**, then drop a file or browse. The system handles:

**Excel (`.xlsx`, `.xls`)**
- Auto-detects the header row (anywhere in the first 10 rows)
- Maps columns to fields by header keywords (Item, Name, Requirement, Category, POC, Office, Suspense, Days, In/Out, etc.)
- Lets you manually adjust the column mapping before preview
- Parses every data row, inferring Applies-To from text like "In", "Out", "Both", "Departure", "Arrival"
- Extracts numeric suspense values from cells like `7`, `14 days`, `NLT 5 days`

**Word (`.docx`)**
- **Tables:** Treats first row as headers, maps columns the same way as Excel
- **Bulleted/numbered lists:** Each list item becomes a checklist entry; preceding headings become category names
- **Plain paragraphs:** Falls back to lines marked with checkbox glyphs (☐, □), bullets (•, -, *), or numbered prefixes (1., 2))

**Preview Step**
- Every parsed item appears in an editable table — change names, categories, applies-to, suspense, POC
- Uncheck rows to exclude them
- Select All / Deselect All shortcuts
- Duplicates (by case-insensitive name match) are skipped on merge

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g., `css-processing-tracker`).
2. Add `index.html` and `app.js` to the repo root.
3. Commit and push.
4. In GitHub: **Settings → Pages → Source:** select `Deploy from a branch`, choose `main` / `(root)`, save.
5. Wait ~1 minute. Your app is live at `https://<your-username>.github.io/css-processing-tracker/`.

That's it. No build step, no dependencies.

## Data & Privacy

All data is stored in the browser's `localStorage`. This means:

- Data never leaves your device
- Data is tied to the browser + machine you used to enter it
- Clearing browser data will wipe your records — **export regularly** using the "Export Data" button
- To share data between machines or users, export from one and import on the other

## File Structure

```
/
├── index.html    # UI shell, styles
├── app.js        # All application logic
└── README.md
```

## Default Checklist Library

The library ships with common items. You can edit, delete, or add custom ones from the **Checklist Library** tab. Categories included:

- **MPF** — vMPF, records review, CAC, DEERS, DEROS
- **Finance** — In/out-processing, travel voucher, BAH/BAS
- **Medical** — PHA, dental, records transfer, immunizations, PDHRA
- **Security** — Clearance verification, DISS/JPAS, NDA, out-brief
- **Training** — OJT/CFETP, ancillary, CBTs, CDC, records transfer
- **CSS** — In/out-briefs, sponsor, commander's office call, First Sergeant counseling
- **Logistics** — Housing, TMO/HHG, vehicle registration, travel orders
- **Mission** — Readiness brief, GTC, mobility gear, key turn-in
- **Legal** — POA, will/SGLI

Suspense values are days from the report date (in-processing) or before the departure date (out-processing).

## Browser Support

Modern Chromium (Edge, Chrome), Firefox, Safari. Not designed for IE.

## License

Internal use — adjust as needed for your organization.
