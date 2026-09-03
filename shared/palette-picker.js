/* =========================================================
   Palette picker — TEMPORARY exploration aid
   =========================================================
   Lets Pia try background/chrome palettes on the live site and
   remember her choice (localStorage), so she can decide what she
   likes without a new deploy per experiment.

   The palettes themselves are CSS `[data-theme]` blocks in
   shared/questionnaire.css. This file only:
     1. applies the saved theme to <html data-theme>, and
     2. renders a small fixed button group to switch.

   It is a LOCAL VIEW PREFERENCE ONLY: it never touches the result
   link hash or the PDF, so a shared result link looks the same for
   everyone regardless of what palette is being previewed.

   ── HOW TO REMOVE once a palette is locked in ──
     1. Copy the chosen [data-theme="…"] values into :root in
        shared/questionnaire.css (making it the permanent default).
     2. Delete this file.
     3. Delete the two <script> refs to it (the inline early-apply
        snippet in <head> and the <script src> at end of body) in
        attachment-reflection.html and attachment-reflection-results.html.
     4. Delete the [data-theme] blocks from questionnaire.css.
   ========================================================= */
(function () {
  var KEY = 'reflection-palette';

  // Palettes offered. 'warm' is the current default (the :root values),
  // so it carries no data-theme attribute. The rest map to CSS blocks.
  var PALETTES = [
    { id: 'warm',       label: 'Warm',  swatch: '#c77f5a' },
    { id: 'light-blue', label: 'Blue',  swatch: '#5a86a8' },
    { id: 'sage',       label: 'Sage',  swatch: '#6f9080' },
    { id: 'blush',      label: 'Blush', swatch: '#b07079' }
  ];

  function saved() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(id) {
    try { window.localStorage.setItem(KEY, id); } catch (e) {}
  }

  // Apply a palette by setting (or clearing) <html data-theme>.
  function apply(id) {
    var root = document.documentElement;
    if (!id || id === 'warm') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', id);
  }

  // Early-apply: run immediately so the saved palette is in place
  // before first paint (this script is also referenced inline in <head>).
  apply(saved());

  // Build the switcher UI once the DOM is ready.
  function build() {
    if (document.getElementById('palette-picker')) return;
    var current = saved() || 'warm';

    var box = document.createElement('div');
    box.id = 'palette-picker';
    box.setAttribute('style',
      'position:fixed;bottom:14px;right:14px;z-index:9999;display:none;' +
      'gap:6px;align-items:center;padding:7px 9px;border-radius:99px;' +
      'background:rgba(255,255,255,0.92);box-shadow:0 2px 10px rgba(0,0,0,0.18);' +
      'backdrop-filter:blur(4px);font:12px \'Segoe UI\',Arial,sans-serif;');

    var caption = document.createElement('span');
    caption.textContent = 'Palette:';
    caption.setAttribute('style', 'color:#6b5f52;margin-right:2px;');
    box.appendChild(caption);

    PALETTES.forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.title = p.label;
      btn.setAttribute('aria-label', p.label);
      btn.dataset.palette = p.id;
      var selected = p.id === current;
      btn.setAttribute('style',
        'width:22px;height:22px;border-radius:50%;cursor:pointer;padding:0;' +
        'background:' + p.swatch + ';' +
        'border:2px solid ' + (selected ? '#2c2520' : 'rgba(0,0,0,0.15)') + ';' +
        'outline:none;transition:transform 0.1s;');
      btn.addEventListener('click', function () {
        apply(p.id);
        store(p.id);
        // refresh selected rings
        box.querySelectorAll('button[data-palette]').forEach(function (b) {
          var sel = b.dataset.palette === p.id;
          b.style.borderColor = sel ? '#2c2520' : 'rgba(0,0,0,0.15)';
        });
      });
      box.appendChild(btn);
    });

    document.body.appendChild(box);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
}());
