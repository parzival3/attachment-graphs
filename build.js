#!/usr/bin/env node
/**
 * Build step for the Attachment Reflection questionnaire.
 *
 * Inlines the local CSS/JS (any <link>/<script> tagged with the `inline`
 * attribute in the source HTML) into self-contained HTML files in dist/.
 * The jsPDF <script> on the results page has no `inline` attribute, so it
 * stays a remote CDN reference.
 *
 * Source files stay split for easy editing; run `npm run build` to produce
 * the hostable single-file versions.
 */
const fs = require('fs');
const path = require('path');
const { inlineSource } = require('inline-source');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');

const PAGES = [
  'attachment-reflection.html',
  'attachment-reflection-results.html',
];

async function build() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const page of PAGES) {
    const html = await inlineSource(path.join(ROOT, page), {
      rootpath: ROOT,
      compress: false,   // keep output readable / debuggable
      // Only inline assets explicitly tagged with `inline`; never fetch remote.
      ignore: [],
    });
    const dest = path.join(OUT, page);
    fs.writeFileSync(dest, html, 'utf8');
    console.log('built', path.relative(ROOT, dest));
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
