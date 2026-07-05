/**
 * Loads questions.csv and populates ATTACHED_CONFIG.questions.
 *
 * CSV columns: id, section, group, type, required, text, options
 *   - options: pipe-separated answer choices  (e.g. "True for me|Not true for me")
 *   - required: literal string "true" or "false"
 *   - Text containing commas must be wrapped in double quotes (standard CSV)
 *   - Double quotes inside a quoted field are escaped by doubling: ""like this""
 *
 * Usage:
 *   loadQuestionsCSV('questions.csv', function(err, questions) {
 *     if (err) { ... }
 *     ATTACHED_CONFIG.questions = questions;
 *     // continue initialisation
 *   });
 */

function loadQuestionsCSV(url, callback) {
  fetch(url)
    .then(function (r) {
      if (!r.ok) throw new Error('Could not load ' + url + ' (HTTP ' + r.status + ')');
      return r.text();
    })
    .then(function (text) {
      try { callback(null, parseQuestionsCSV(text)); }
      catch (e) { callback(e, null); }
    })
    .catch(function (e) { callback(e, null); });
}

function parseQuestionsCSV(text) {
  var lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
  var headers = parseCSVLine(lines[0]);
  var questions = [];

  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;

    var vals = parseCSVLine(line);
    var row = {};
    headers.forEach(function (h, j) { row[h.trim()] = (vals[j] !== undefined ? vals[j] : '').trim(); });

    if (!row.id) continue;

    questions.push({
      id:       row.id,
      section:  row.section,
      group:    row.group,
      type:     row.type || 'radio',
      required: row.required === 'true',
      text:     row.text,
      options:  row.options ? row.options.split('|') : []
    });
  }

  return questions;
}

function parseCSVLine(line) {
  var fields = [], current = '', inQuote = false;

  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (c === '"') {
      if (inQuote && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (c === ',' && !inQuote) {
      fields.push(current);
      current = '';
    } else {
      current += c;
    }
  }

  fields.push(current);
  return fields;
}
