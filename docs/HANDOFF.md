# Project Handoff — piatorp.dk Questionnaire Tools

**Owner:** Pia Torp, psychotherapist (piatorp.dk)  
**Repo:** https://github.com/parzival3/attachment-graphs  
**Live site:** https://parzival3.github.io/attachment-graphs/

---

## What this project is

A self-hosted, API-free questionnaire suite for a psychotherapist. No backend — all state lives in the URL hash (base64-encoded JSON). Designed to match the warm beige/terracotta visual identity of piatorp.dk.

---

## Files overview

| File | Purpose |
|------|---------|
| `questionnaire-framework.js` | Generic config-driven questionnaire engine (`Questionnaire` class). Supports `radio`, `scale`, `textarea`, `checkbox` question types. Auto-advances on radio/scale selection. On completion encodes answers as `btoa(unescape(encodeURIComponent(JSON.stringify(payload))))` and redirects to `config.resultsPage#<hash>`. |
| `questionnaire.css` | Shared stylesheet for all questionnaire pages. CSS custom properties define the full color palette at the top. |
| `csv-loader.js` | Utilities: `loadQuestionsCSV(url, cb)`, `parseQuestionsCSV(text)`, `parseCSVLine(line)`. Used by the attachment questionnaire to load questions from `questions.csv`. |
| `questions.csv` | All 75 questions for the ECR-R attachment questionnaire. Columns: `id, section, group, type, required, text, options` (options pipe-separated). |

### Questionnaire 1 — Attachment Style Self-Assessment (ECR-R based)

| File | Purpose |
|------|---------|
| `attached-questionnaire.html` | Entry page. Loads `questions.csv`, supports `?demo` URL param for instant test results. |
| `attached-questionnaire-config.js` | Config shell (questions loaded from CSV at runtime). Scoring keys for Anxious/Secure/Avoidant axes. |
| `attached-results.html` | Results page. Plots self and partner on an attachment lemniscate diagram. Shows score boxes with colored pills. PDF export via jsPDF (UMD v2.5.1). Diagram is horizontally and vertically centered on page 1; text sections on page 2+. |
| `attachment-diagram.js` | Canvas-based lemniscate/infinity curve diagram class. |

**Scoring logic (attached-results.html):**
- Part 1 (self): `rawAnswers[q.id] === 'True'` → count per group (A/B/C)
- Part 2 (partner): `{'False':1,'Moderately true':2,'True':3}[rawAnswers[q.id]]`
- Y-axis: `(countC - countB) / 14 * 0.9` (pure Anxious → top, pure Avoidant → bottom)

### Questionnaire 2 — Attachment Style Reflection ("How Do You Create Connection?")

| File | Purpose |
|------|---------|
| `attachment-reflection.html` | Entry page. No CSV — questions are inline in config. |
| `attachment-reflection-config.js` | 10 multi-select (checkbox) questions. Each option has a `tag`: `S` (Secure), `A` (Anxious/Ambivalent), `Av` (Avoidant/Withdrawn), `D` (Disorganised/Conflicted). Also defines tendency labels, colors, interpretation texts, and closing note. |
| `attachment-reflection-results.html` | Results page. Tallies tags across all selected options, shows bar chart by tendency, collapsible interpretation cards, Pia's closing text, and collapsible answer review. |

**Results encoding:** `rawAnswers[q.id]` is an array of selected option text strings (e.g. `["Calm and safe", "Happy, but also a little afraid"]`).

---

## Color palette (questionnaire.css)

```css
--bg:           #F2EDE8
--surface:      #FEFDFB
--border:       #D4C9BD
--text-dark:    #2C2520
--text-mid:     #6B5F52
--text-light:   #9B8F82
--accent:       #C77F5A   /* terracotta */
--accent-light: #FDF0E8
--btn-bg:       #5A4840
--btn-text:     #FEFDFB
```

Tendency colors (in `attachment-reflection-config.js`):
- Secure `#7a9e8a`, Anxious `#c77f5a`, Avoidant `#6b8fa8`, Disorganised `#9b82a8`

PDF palette (in `attached-results.html`, object `P`):
- `selfAccent: '#C77F5A'`, `partnerAccent: '#6B8FA8'`

---

## Deployment

GitHub Pages, auto-deploys on push to `main`. No build step — all vanilla JS/HTML/CSS.

---

## Pending / future work

- **Rename** "Cross-Cultural Couple Questionnaire" title throughout (Pia mentioned this)
- **Design integration** with piatorp.dk — font, header/footer, possibly iframe embed
- **PDF export** for the reflection questionnaire (currently no PDF in `attachment-reflection-results.html`)
- **Demo mode** for the reflection questionnaire (similar to `?demo` on the attachment questionnaire)
- **Website integration strategy** — decide between standalone pages vs iframe embed on piatorp.dk

---

## Known quirks

- jsPDF loaded from CDN (`unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js`) in `attached-results.html`
- Base64 URL hash uses `btoa(unescape(encodeURIComponent(...)))` to handle Danish characters
- The `?demo` param in `attached-questionnaire.html` fills a fixed Anxious-self + Secure-partner profile and redirects directly to results — useful for testing without completing all 75 questions
