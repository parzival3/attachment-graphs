#!/usr/bin/env node
/**
 * Generate the questions + tendencies of the Attachment Reflection config from
 * the editable data file `attachment-reflection-questions.json`.
 *
 * Edit questions/answers in the JSON, then run `npm run generate` (or
 * `npm run build`, which runs this first). The generated block is written back
 * into `attachment-reflection-config.js` between the GENERATED markers, so the
 * plain (un-built) source page keeps working when opened directly.
 *
 * The data is internationalized: every user-facing string is an object keyed by
 * locale, e.g. { "en": "...", "da": "..." }. The JSON is validated first; a bad
 * edit (unknown tag, missing text, duplicate id, missing translation) fails with
 * a clear message instead of shipping a broken questionnaire.
 */
const fs = require('fs');
const path = require('path');

// This script lives in build/; the reflection data + config live in reflection/.
const REFLECTION_DIR = path.join(__dirname, '..', 'reflection');
const JSON_FILE = path.join(REFLECTION_DIR, 'attachment-reflection-questions.json');
const CONFIG_FILE = path.join(REFLECTION_DIR, 'attachment-reflection-config.js');

const BEGIN = '  // ── GENERATED FROM attachment-reflection-questions.json — do not edit by hand ──';
const END = '  // ── END GENERATED ──';

// Per-question defaults for this questionnaire; the JSON only overrides them.
const DEFAULT_TYPE = 'checkbox';
const DEFAULT_REQUIRED = false;

function fail(msg) {
  console.error('generate-config: ' + msg);
  process.exit(1);
}

function main() {
  let raw;
  try {
    raw = fs.readFileSync(JSON_FILE, 'utf8');
  } catch (e) {
    fail('cannot read ' + path.basename(JSON_FILE) + ': ' + e.message);
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    fail('invalid JSON in ' + path.basename(JSON_FILE) + ': ' + e.message);
  }

  const locales = validate(data);
  const block = render(data);

  const config = fs.readFileSync(CONFIG_FILE, 'utf8');
  const beginIdx = config.indexOf(BEGIN);
  const endIdx = config.indexOf(END);

  if (beginIdx === -1 || endIdx === -1) {
    fail(
      'markers not found in ' + path.basename(CONFIG_FILE) + '. Expected the ' +
      'generated region to be delimited by the GENERATED markers.'
    );
  }

  const next = config.slice(0, beginIdx) + block + config.slice(endIdx + END.length);

  if (next !== config) {
    fs.writeFileSync(CONFIG_FILE, next);
    console.log(
      'generate-config: wrote ' + data.questions.length + ' questions, ' +
      Object.keys(data.tendencies).length + ' tendencies, locales [' +
      locales.join(', ') + '] into ' + path.basename(CONFIG_FILE)
    );
  } else {
    console.log('generate-config: config already up to date');
  }
}

// ── Validation ─────────────────────────────────────────────────────────────

function validate(data) {
  if (!data || typeof data !== 'object') fail('JSON root must be an object');

  const locales = Array.isArray(data.locales) ? data.locales : null;
  if (!locales || !locales.length) fail('"locales" must be a non-empty array, e.g. ["en","da"]');
  if (!data.defaultLocale || locales.indexOf(data.defaultLocale) === -1) {
    fail('"defaultLocale" must be one of the declared locales (' + locales.join(', ') + ')');
  }

  if (!Array.isArray(data.questions)) fail('"questions" must be an array');
  if (!data.tendencies || typeof data.tendencies !== 'object') fail('"tendencies" must be an object');

  const validTags = Object.keys(data.tendencies);
  if (!validTags.length) fail('"tendencies" is empty — define at least one');

  // Every user-facing string must be a locale object with all declared locales.
  function checkLocalized(value, where) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      fail(where + ': must be a localized object with keys ' + locales.join(', '));
    }
    locales.forEach(function (loc) {
      if (typeof value[loc] !== 'string' || value[loc].trim() === '') {
        fail(where + ': missing "' + loc + '" translation');
      }
    });
  }

  // Top-level localized strings.
  ['intro', 'privacyNote', 'closing'].forEach(function (k) {
    if (!(k in data)) fail('missing top-level "' + k + '"');
    checkLocalized(data[k], k);
  });
  if (!data.meta) fail('missing "meta"');
  ['title', 'subtitle'].forEach(function (k) { checkLocalized(data.meta[k], 'meta.' + k); });

  // UI strings.
  if (!data.ui || typeof data.ui !== 'object') fail('"ui" must be an object of UI strings');
  Object.keys(data.ui).forEach(function (k) { checkLocalized(data.ui[k], 'ui.' + k); });

  // Questions + options (options need unique ids so answers are language-neutral).
  const seenQ = new Set();
  const seenOpt = new Set();
  data.questions.forEach(function (q, qi) {
    const where = 'question ' + (qi + 1) + (q && q.id ? ' (' + q.id + ')' : '');
    if (!q || typeof q !== 'object') fail(where + ': must be an object');
    if (!q.id) fail(where + ': missing "id"');
    if (seenQ.has(q.id)) fail(where + ': duplicate id "' + q.id + '"');
    seenQ.add(q.id);
    checkLocalized(q.text, where + ' text');
    if (!Array.isArray(q.options) || !q.options.length) fail(where + ': "options" must be a non-empty array');
    q.options.forEach(function (o, oi) {
      const ow = where + ' option ' + (oi + 1);
      if (!o || typeof o !== 'object') fail(ow + ': must be an object');
      if (!o.id) fail(ow + ': missing "id" (needed so answers stay language-neutral)');
      if (seenOpt.has(o.id)) fail(ow + ': duplicate option id "' + o.id + '"');
      seenOpt.add(o.id);
      checkLocalized(o.text, ow + ' text');
      if (!o.tag) fail(ow + ': missing "tag"');
      if (validTags.indexOf(o.tag) === -1) {
        fail(ow + ': unknown tag "' + o.tag + '" (valid: ' + validTags.join(', ') + ')');
      }
    });
  });

  // Tendencies.
  validTags.forEach(function (tag) {
    const t = data.tendencies[tag];
    if (!t.color) fail('tendency "' + tag + '": missing "color"');
    ['label', 'title', 'text'].forEach(function (k) { checkLocalized(t[k], 'tendency "' + tag + '" ' + k); });
  });

  return locales;
}

// ── Rendering ──────────────────────────────────────────────────────────────

// Embed a JS value as a JSON.parse(...) call. Using JSON.parse keeps the nested
// localized objects exact and avoids hand-writing fragile nested JS literals.
// The JSON text is single-quoted; escape backslashes and single quotes.
function jsonLiteral(value) {
  const json = JSON.stringify(value);
  return "JSON.parse('" + json.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "')";
}

function render(data) {
  // Normalize questions: apply type/required defaults, keep id/text/options/tag.
  const questions = data.questions.map(function (q) {
    return {
      id: q.id,
      type: q.type || DEFAULT_TYPE,
      required: q.required === undefined ? DEFAULT_REQUIRED : !!q.required,
      text: q.text,
      options: q.options.map(function (o) {
        return { id: o.id, text: o.text, tag: o.tag };
      })
    };
  });

  const lines = [];
  lines.push(BEGIN);
  lines.push('  locales: ' + jsonLiteral(data.locales) + ',');
  lines.push('  defaultLocale: ' + jsonLiteral(data.defaultLocale) + ',');
  lines.push('  meta: ' + jsonLiteral(data.meta) + ',');
  lines.push('  ui: ' + jsonLiteral(data.ui) + ',');
  lines.push('  intro: ' + jsonLiteral(data.intro) + ',');
  lines.push('  privacyNote: ' + jsonLiteral(data.privacyNote) + ',');
  lines.push('  closing: ' + jsonLiteral(data.closing) + ',');
  lines.push('  questions: ' + jsonLiteral(questions) + ',');
  lines.push('  tendencies: ' + jsonLiteral(data.tendencies) + ',');
  lines.push(END);
  return lines.join('\n');
}

main();
