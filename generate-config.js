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
 * The JSON is validated first; a bad edit (unknown tag, missing text, duplicate
 * id) fails with a clear message instead of shipping a broken questionnaire.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const JSON_FILE = path.join(ROOT, 'attachment-reflection-questions.json');
const CONFIG_FILE = path.join(ROOT, 'attachment-reflection-config.js');

const BEGIN = '  // ── GENERATED FROM attachment-reflection-questions.json — do not edit by hand ──';
const END = '  // ── END GENERATED ──';

// Per-question defaults for this questionnaire; the JSON only overrides them.
const DEFAULT_TYPE = 'checkbox';
const DEFAULT_REQUIRED = false;

function fail(msg) {
  console.error('generate-config: ' + msg);
  process.exit(1);
}

function validate(data) {
  if (!data || typeof data !== 'object') fail('JSON root must be an object');
  if (!Array.isArray(data.questions)) fail('"questions" must be an array');
  if (!data.tendencies || typeof data.tendencies !== 'object') {
    fail('"tendencies" must be an object');
  }

  const validTags = Object.keys(data.tendencies);
  if (!validTags.length) fail('"tendencies" is empty — define at least one');

  const seen = new Set();
  data.questions.forEach(function (q, qi) {
    const where = 'question ' + (qi + 1) + (q && q.id ? ' (' + q.id + ')' : '');
    if (!q || typeof q !== 'object') fail(where + ': must be an object');
    if (!q.id) fail(where + ': missing "id"');
    if (seen.has(q.id)) fail(where + ': duplicate id "' + q.id + '"');
    seen.add(q.id);
    if (!q.text) fail(where + ': missing "text"');
    if (!Array.isArray(q.options) || !q.options.length) {
      fail(where + ': "options" must be a non-empty array');
    }
    q.options.forEach(function (o, oi) {
      const ow = where + ' option ' + (oi + 1);
      if (!o || typeof o !== 'object') fail(ow + ': must be an object');
      if (!o.text) fail(ow + ': missing "text"');
      if (!o.tag) fail(ow + ': missing "tag"');
      if (validTags.indexOf(o.tag) === -1) {
        fail(ow + ': unknown tag "' + o.tag + '" (valid: ' + validTags.join(', ') + ')');
      }
    });
  });

  Object.keys(data.tendencies).forEach(function (tag) {
    const t = data.tendencies[tag];
    ['label', 'color', 'title', 'text'].forEach(function (k) {
      if (!t || !t[k]) fail('tendency "' + tag + '": missing "' + k + '"');
    });
  });
}

// Emit a JS string literal (single-quoted) with proper escaping.
function jsStr(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function render(data) {
  const lines = [];
  lines.push(BEGIN);

  // questions
  lines.push('  questions: [');
  data.questions.forEach(function (q, qi) {
    const type = q.type || DEFAULT_TYPE;
    const required = q.required === undefined ? DEFAULT_REQUIRED : !!q.required;
    lines.push('    {');
    lines.push('      id: ' + jsStr(q.id) + ', type: ' + jsStr(type) + ', required: ' + required + ',');
    lines.push('      text: ' + jsStr(q.text) + ',');
    lines.push('      options: [');
    q.options.forEach(function (o) {
      lines.push('        { text: ' + jsStr(o.text) + ', tag: ' + jsStr(o.tag) + ' },');
    });
    lines.push('      ]');
    lines.push('    }' + (qi < data.questions.length - 1 ? ',' : ''));
  });
  lines.push('  ],');
  lines.push('');

  // tendencies
  lines.push('  tendencies: {');
  const tags = Object.keys(data.tendencies);
  tags.forEach(function (tag, ti) {
    const t = data.tendencies[tag];
    lines.push('    ' + tag + ': {');
    lines.push('      label: ' + jsStr(t.label) + ',');
    lines.push('      color: ' + jsStr(t.color) + ',');
    lines.push('      hlBg:  ' + jsStr(t.hlBg || t.color) + ',');
    lines.push('      title: ' + jsStr(t.title) + ',');
    lines.push('      text:  ' + jsStr(t.text));
    lines.push('    }' + (ti < tags.length - 1 ? ',' : ''));
  });
  lines.push('  },');

  lines.push(END);
  return lines.join('\n');
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

  validate(data);
  const block = render(data);

  const config = fs.readFileSync(CONFIG_FILE, 'utf8');
  const beginIdx = config.indexOf(BEGIN);
  const endIdx = config.indexOf(END);

  let next;
  if (beginIdx !== -1 && endIdx !== -1) {
    // Replace the existing generated region (in place).
    next = config.slice(0, beginIdx) + block + config.slice(endIdx + END.length);
  } else {
    fail(
      'markers not found in ' + path.basename(CONFIG_FILE) + '. Expected the ' +
      'questions/tendencies region to be delimited by the GENERATED markers.'
    );
  }

  if (next !== config) {
    fs.writeFileSync(CONFIG_FILE, next);
    console.log(
      'generate-config: wrote ' + data.questions.length + ' questions, ' +
      Object.keys(data.tendencies).length + ' tendencies into ' +
      path.basename(CONFIG_FILE)
    );
  } else {
    console.log('generate-config: config already up to date');
  }
}

main();
