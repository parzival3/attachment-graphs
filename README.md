# Attachment Graphs

A small suite of self-hosted, API-free questionnaire tools and diagrams for the
psychotherapy practice at [piatorp.dk](https://www.piatorp.dk).

Everything runs client-side in the browser. There is no backend: a completed
questionnaire encodes its answers into the URL hash (base64 JSON) and redirects
to a results page that decodes and renders them. Nothing is stored or sent
anywhere.

Live site: https://parzival3.github.io/attachment-graphs/

## What's in here

The repository contains four independent tools plus the shared code they build on:

| Folder | Tool |
|--------|------|
| `reflection/` | **Attachment Reflection** — "How Do You Create Connection?" A step-by-step reflection whose questions live in an editable JSON file. This is the actively maintained tool. |
| `attached/` | **Attachment Style Self-Assessment** (ECR-R based). Questions load from `questions.csv`. |
| `survey/` | **Cross-Cultural Couple Questionnaire**, with results plotted on the attachment/tension diagrams. |
| `diagrams/` | Standalone canvas diagrams (attachment "infinity curve" and relational-tension lines) used by the tools and by `index.html`. |
| `shared/` | The questionnaire engine (`questionnaire-framework.js`), shared stylesheet (`questionnaire.css`) and the CSV loader. |
| `vendor/` | Third-party libraries bundled locally (jsPDF, for PDF export). |
| `build/` | Build tooling (see below). |
| `docs/` | Project notes and history. |

`index.html` (repo root) is the landing page and demos the diagrams.

Each questionnaire is two pages — an entry page and a results page — that live
in the same folder and reference each other with plain relative links. Shared
assets are referenced with `../shared/…` and `../vendor/…`.

## Running locally

No build step is needed to work on the source. Serve the repo root with any
static server and open a page:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/reflection/attachment-reflection.html
```

## Editing the Attachment Reflection questions

The questions, answer options and result categories for the Attachment
Reflection live in one data file:

    reflection/attachment-reflection-questions.json

Add, remove or re-tag options there — no JavaScript required.

```jsonc
{
  "questions": [
    {
      "id": "q1",
      "text": "When I feel emotionally close to someone, I usually feel:",
      "options": [
        { "text": "Calm and safe", "tag": "S" },
        { "text": "Uncomfortable or slightly overwhelmed", "tag": "Av" }
      ]
    }
  ],
  "tendencies": {
    "S": { "label": "Secure", "color": "#7a9e8a", "hlBg": "#eef5f1",
           "title": "Secure tendencies", "text": "..." }
  }
}
```

- Each option's `tag` must be a key defined in `tendencies` (`S`, `A`, `Av`, `D`).
- Questions default to multi-select checkboxes and are optional. Add `"type"` or
  `"required"` on a question only to override that.

After editing, run:

```bash
npm run generate
```

This validates the JSON — an unknown tag, missing text or duplicate id fails
with a clear message — and writes the questions into the `GENERATED` block of
`reflection/attachment-reflection-config.js`. Do not hand-edit that block; it is
overwritten on every generate.

### Regenerating automatically on commit (optional)

A committed git hook can run the generation for you: whenever the questions JSON
is part of a commit, it regenerates the config and stages it into the same
commit, so the committed config can never drift from the data. Enable it once
per clone:

```bash
./install-hooks.sh        # sets core.hooksPath -> .githooks
```

The hook is a no-op for commits that do not touch the questions JSON, and it
only ever stages the generated config.

## Building the single-file version

The Attachment Reflection can be built into self-contained HTML files that
inline all of their CSS, JavaScript and the jsPDF library — a single file per
page with no runtime network dependencies, easy to host anywhere or hand to
another developer.

```bash
npm install       # one-time: installs the inline-source build dependency
npm run build     # regenerates the config, then writes:
                  #   dist/attachment-reflection.html
                  #   dist/attachment-reflection-results.html
```

`npm run build` runs the generate step first, so the built output always
reflects the latest JSON. The built files have no external dependencies at all;
the questionnaire and the PDF download work offline. `dist/` is git-ignored.

Assets are inlined only where the source HTML tags them with the `inline`
attribute, which is why only the two reflection pages are bundled.

## Deployment and releases

Two GitHub Actions workflows handle publishing:

- **`deploy.yml`** — on every push to `main`, builds the single-file reflection
  pages and publishes the whole site (all tools plus `index.html`) to GitHub
  Pages, overlaying the built self-contained pages over the split source ones.
- **`release.yml`** — on a version tag (`vX.Y.Z`), builds the pages, zips them
  as `attachment-reflection.zip` and attaches it to a GitHub Release as a
  shareable download.

To cut a release:

```bash
git tag -a v1.2.0 -m "..."
git push origin v1.2.0
```

## Requirements

- A modern browser (Chrome, Firefox, Safari, Edge).
- Node.js is required only for the build/generate tooling, not to run the pages.

## License

MIT.
