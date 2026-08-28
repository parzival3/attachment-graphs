/**
 * Questionnaire Framework
 * Generic, config-driven questionnaire engine — no external dependencies.
 *
 * Usage:
 *   const q = new Questionnaire(config);
 *   q.mount('containerId');
 *
 * Layout modes:
 *   'paged'  (default) — one question at a time, with Back/Continue navigation
 *   'scroll' — all questions on one scrollable page, submitted at the end
 *   Set config.layout to choose the default; user can also toggle on the intro screen.
 *
 * On completion, redirects to config.resultsPage + '#' + base64-encoded payload.
 * Results can be decoded with Questionnaire.fromHash(hash).
 */

class Questionnaire {
    constructor(config) {
        this.config = config;
        this.answers = {};
        this.step = -1;  // -1 = intro screen
        this.layout = config.layout || 'paged';
        this.container = null;
        this._total = config.questions.length;
        this.locale = this._resolveLocale();
    }

    // ── Internationalization ─────────────────────────────────
    // Locale is resolved from a saved choice, then the browser, falling back to
    // the config's defaultLocale. Only locales the config declares are honored.
    _resolveLocale() {
        var supported = this.config.locales || [this.config.defaultLocale || 'en'];
        var fallback = this.config.defaultLocale || supported[0] || 'en';

        var saved = null;
        try { saved = window.localStorage.getItem('reflection-locale'); } catch (e) {}
        if (saved && supported.indexOf(saved) !== -1) return saved;

        var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
        for (var i = 0; i < supported.length; i++) {
            if (nav.indexOf(supported[i].toLowerCase()) === 0) return supported[i];
        }
        return fallback;
    }

    setLocale(loc) {
        var supported = this.config.locales || [];
        if (supported.indexOf(loc) === -1) return;
        this.locale = loc;
        try { window.localStorage.setItem('reflection-locale', loc); } catch (e) {}
        document.documentElement.setAttribute('lang', loc);
        this._render();
    }

    // Resolve a localized value ({en, da, …}) to the active locale, with a
    // fallback to defaultLocale. Plain strings pass through unchanged so the
    // engine still works with non-localized configs.
    L(value) {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        if (value[this.locale] != null) return value[this.locale];
        var def = this.config.defaultLocale;
        if (def && value[def] != null) return value[def];
        var keys = Object.keys(value);
        return keys.length ? value[keys[0]] : '';
    }

    // Look up a UI string by key from config.ui, resolved to the active locale.
    t(key) {
        var ui = this.config.ui || {};
        return ui[key] != null ? this.L(ui[key]) : key;
    }

    mount(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error('Questionnaire: container not found — "' + containerId + '"');
        }
        document.documentElement.setAttribute('lang', this.locale);
        this._render();
    }

    next() {
        if (this.step === -1) {
            this.step = 0;
            this._render();
            return;
        }

        var q = this.config.questions[this.step];
        var value = this.answers[q.id];

        if (q.required !== false) {
            var validation = this._validate(q, value);
            if (!validation.valid) {
                this._showError(validation.message);
                return;
            }
        }

        this._clearError();

        if (this.step < this._total - 1) {
            this.step++;
            this._render();
        } else {
            this._complete();
        }
    }

    prev() {
        if (this.step > 0) {
            this.step--;
            this._render();
        } else if (this.step === 0) {
            this.step = -1;
            this._render();
        }
    }

    getResults() {
        return {
            dimensions: this._computeScores(),
            rawAnswers: Object.assign({}, this.answers),
            locale: this.locale,
            timestamp: new Date().toISOString()
        };
    }

    static fromHash(hash) {
        try {
            var json = decodeURIComponent(escape(atob(hash)));
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    }

    // ── Private ──────────────────────────────────────────────

    _computeScores() {
        var totals = {};
        var counts = {};
        var self = this;

        this.config.scoring.forEach(function (rule) {
            var raw = parseInt(self.answers[rule.questionId]);
            if (isNaN(raw)) return;

            var eff = rule.invert ? (6 - raw) : raw;
            var norm = (eff - 3) / 2;

            if (totals[rule.dimensionId] === undefined) {
                totals[rule.dimensionId] = 0;
                counts[rule.dimensionId] = 0;
            }
            totals[rule.dimensionId] += norm;
            counts[rule.dimensionId]++;
        });

        var result = {};
        Object.keys(totals).forEach(function (dimId) {
            result[dimId] = counts[dimId] > 0 ? totals[dimId] / counts[dimId] : 0;
        });

        // Ensure all declared dimensions exist (default to 0)
        if (this.config.dimensions) {
            this.config.dimensions.forEach(function (dim) {
                if (!(dim.id in result)) result[dim.id] = 0;
            });
        }

        return result;
    }

    _validate(question, value) {
        if (value === undefined || value === null || value === '') {
            return {
                valid: false,
                message: this.t('answerPrompt')
            };
        }
        return { valid: true };
    }

    _showError(message) {
        var err = this.container.querySelector('.q-error');
        if (err) {
            err.textContent = message;
            err.style.display = 'block';
        }
    }

    // scope: optional element to search within (defaults to container)
    _clearError(scope) {
        var root = scope || this.container;
        var err = root.querySelector('.q-error');
        if (err) {
            err.textContent = '';
            err.style.display = 'none';
        }
    }

    _complete() {
        var payload = this.getResults();
        var json = JSON.stringify(payload);
        var encoded = btoa(unescape(encodeURIComponent(json)));

        if (this.config.onComplete) {
            this.config.onComplete(payload);
        }

        var target = (this.config.resultsPage || 'results.html') + '#' + encoded;
        window.location.href = target;
    }

    _getSectionTitle() {
        if (this.step < 0 || !this.config.sections) return '';
        var q = this.config.questions[this.step];
        if (!q || !q.section) return '';
        var section = this.config.sections[q.section];
        return section ? section.title : '';
    }

    _isNewSection() {
        if (this.step <= 0) return true;
        var current = this.config.questions[this.step];
        var prev = this.config.questions[this.step - 1];
        return !current || !prev || current.section !== prev.section;
    }

    _render() {
        if (this.step === -1) {
            this._renderIntro();
        } else if (this.layout === 'scroll') {
            this._renderScroll();
        } else {
            this._renderQuestion();
        }
        if (this.layout !== 'scroll') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    _renderIntro() {
        var c = this.config;
        var self = this;
        var title = this.L(c.meta && c.meta.title ? c.meta.title : c.title);
        var introParas = this.L(c.intro).split('\n')
            .filter(function (p) { return p.trim(); })
            .map(function (p) { return '<p>' + self._esc(p) + '</p>'; })
            .join('');
        var privacy = this.L(c.privacyNote);

        this.container.innerHTML =
            '<div class="q-card q-intro-card">' +
            this._renderLangSwitch() +
            '  <h1 class="q-intro-title">' + this._esc(title) + '</h1>' +
            '  <div class="q-intro-text">' + introParas + '</div>' +
            '  <div class="q-intro-actions">' +
            '    <button class="btn-primary q-begin-btn">' + this._esc(this.t('start')) + ' &rarr;</button>' +
            '  </div>' +
            (privacy ? '  <p class="q-privacy-note">' + this._esc(privacy) + '</p>' : '') +
            '</div>';

        this._bindLangSwitch();

        this.container.querySelector('.q-begin-btn')
            .addEventListener('click', function () { self.next(); });
    }

    // EN/DA (or more) language switch, shown only when the config declares more
    // than one locale.
    _renderLangSwitch() {
        var locales = this.config.locales || [];
        if (locales.length < 2) return '';
        var self = this;
        var buttons = locales.map(function (loc) {
            var active = loc === self.locale ? ' active' : '';
            return '<button class="q-lang-btn' + active + '" data-locale="' + loc + '">' +
                   loc.toUpperCase() + '</button>';
        }).join('');
        return '<div class="q-lang-switch">' + buttons + '</div>';
    }

    _bindLangSwitch() {
        var self = this;
        this.container.querySelectorAll('.q-lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                self.setLocale(btn.dataset.locale);
            });
        });
    }

    _renderQuestion() {
        var q = this.config.questions[this.step];
        var progress = Math.round(((this.step + 1) / this._total) * 100);
        var sectionTitle = this._getSectionTitle();
        var showSection = this._isNewSection() && sectionTitle;
        var isLast = this.step === this._total - 1;

        // Radio/scale questions auto-advance on selection so no Continue needed.
        // Optional radio questions show a Skip button so the user can move on
        // without answering. Text/textarea always need an explicit button.
        var isAutoInput = q.type === 'radio' || q.type === 'scale';
        var isOptional  = q.required === false;
        var showNextBtn = !isAutoInput || isOptional;
        var isCheckbox  = q.type === 'checkbox';
        var nextLabel   = isLast                    ? this._esc(this.t('seeResults')) + ' &rarr;'
                        : isOptional && !isCheckbox ? this._esc(this.t('skip')) + ' &rarr;'
                        :                             this._esc(this.t('continue')) + ' &rarr;';

        var html =
            '<div class="q-card">' +
            '  <div class="q-progress-bar">' +
            '    <div class="q-progress-fill" style="width:' + progress + '%"></div>' +
            '  </div>' +
            '  <div class="q-step-info">' +
            '    <span class="q-step-count">' + (this.step + 1) + ' / ' + this._total + '</span>' +
            '  </div>' +
            (showSection ? '  <div class="q-section-label">' + this._esc(sectionTitle) + '</div>' : '') +
            '  <div class="q-question">' +
            '    <p class="q-text">' + this._esc(this.L(q.text)) + '</p>' +
            '    <div class="q-input-area">' + this._renderInput(q) + '</div>' +
            '    <div class="q-error" style="display:none;"></div>' +
            '  </div>' +
            '  <div class="q-nav">' +
            '    <button class="btn-secondary q-prev-btn"' + (this.step === 0 ? ' style="visibility:hidden"' : '') + '>&larr; ' + this._esc(this.t('back')) + '</button>' +
            (showNextBtn ? '    <button class="btn-primary q-next-btn">' + nextLabel + '</button>' : '') +
            '  </div>' +
            '</div>';

        this.container.innerHTML = html;

        this._bindInputEvents(q);

        var self = this;
        var nextBtn = this.container.querySelector('.q-next-btn');
        if (nextBtn) nextBtn.addEventListener('click', function () { self.next(); });

        var prevBtn = this.container.querySelector('.q-prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', function () { self.prev(); });
        }

        // Allow pressing Enter to advance on text inputs
        if (q.type === 'text') {
            var input = this.container.querySelector('#input-' + q.id);
            if (input) {
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') self.next();
                });
            }
        }
    }

    // ── Scroll mode ─────────────────────────────────────────

    _renderScroll() {
        var c = this.config;
        var self = this;

        var html = '<div class="q-scroll-wrapper">';
        html += '<p class="q-scroll-meta">' +
            this._esc(this.t('scrollMeta').replace('{n}', this._total)) + '</p>';

        var currentSection = null;
        c.questions.forEach(function (q, i) {
            var sectionKey = q.section || '__none__';

            if (sectionKey !== currentSection) {
                if (currentSection !== null) html += '</div>'; // close previous section
                currentSection = sectionKey;
                var sectionTitle = c.sections && c.sections[sectionKey] ? c.sections[sectionKey].title : '';
                html += '<div class="q-scroll-section">';
                if (sectionTitle) {
                    html += '<div class="q-section-label q-scroll-section-label">' + self._esc(sectionTitle) + '</div>';
                }
            }

            html +=
                '<div class="q-scroll-item" id="sq-' + q.id + '">' +
                '  <div class="q-scroll-item-header">' +
                '    <span class="q-scroll-num">' + (i + 1) + '</span>' +
                '    <p class="q-text">' + self._esc(self.L(q.text)) + '</p>' +
                '  </div>' +
                '  <div class="q-input-area">' + self._renderInput(q) + '</div>' +
                '  <div class="q-error" style="display:none;"></div>' +
                '</div>';
        });

        if (currentSection !== null) html += '</div>'; // close last section

        html +=
            '<div class="q-scroll-submit">' +
            '  <button class="btn-primary q-submit-btn">' + this._esc(this.t('seeResults')) + ' &rarr;</button>' +
            '</div>' +
            '</div>';

        this.container.innerHTML = html;

        // Bind each question's inputs scoped to its own item element
        c.questions.forEach(function (q) {
            var scope = self.container.querySelector('#sq-' + q.id);
            self._bindInputEvents(q, scope);
        });

        this.container.querySelector('.q-submit-btn')
            .addEventListener('click', function () { self._submitScroll(); });
    }

    _submitScroll() {
        var self = this;
        var missing = [];

        // Clear previous inline errors
        this.container.querySelectorAll('.q-scroll-item').forEach(function (el) {
            el.classList.remove('q-scroll-item--error');
            var err = el.querySelector('.q-error');
            if (err) { err.textContent = ''; err.style.display = 'none'; }
        });

        this.config.questions.forEach(function (q) {
            if (q.required !== false) {
                var validation = self._validate(q, self.answers[q.id]);
                if (!validation.valid) missing.push(q);
            }
        });

        if (missing.length > 0) {
            missing.forEach(function (q) {
                var item = self.container.querySelector('#sq-' + q.id);
                if (!item) return;
                item.classList.add('q-scroll-item--error');
                var err = item.querySelector('.q-error');
                if (err) {
                    err.textContent = self.t('answerPrompt');
                    err.style.display = 'block';
                }
            });
            // Scroll to first unanswered question
            var first = this.container.querySelector('.q-scroll-item--error');
            if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        this._complete();
    }

    // ── Input rendering ──────────────────────────────────────

    _renderInput(q) {
        switch (q.type) {
            case 'text':     return this._renderTextInput(q);
            case 'radio':    return this._renderRadioInput(q);
            case 'scale':    return this._renderScaleInput(q);
            case 'textarea': return this._renderTextareaInput(q);
            case 'checkbox': return this._renderCheckboxInput(q);
            default:         return '';
        }
    }

    _renderTextInput(q) {
        var val = this.answers[q.id] || '';
        return '<input type="text" class="q-text-input" id="input-' + q.id + '"' +
               ' value="' + this._esc(val) + '"' +
               ' placeholder="' + (q.placeholder || 'Your answer…') + '"' +
               ' autocomplete="off">';
    }

    _renderRadioInput(q) {
        var current = this.answers[q.id];
        var self = this;
        var opts = (q.options || []).map(function (opt) {
            var isSelected = current === opt;
            return '<label class="q-radio-option' + (isSelected ? ' selected' : '') + '">' +
                   '  <input type="radio" name="' + q.id + '" value="' + self._esc(opt) + '"' +
                   (isSelected ? ' checked' : '') + '>' +
                   '  <span class="q-radio-label">' + self._esc(opt) + '</span>' +
                   '</label>';
        });
        return '<div class="q-radio-group">' + opts.join('') + '</div>';
    }

    _renderScaleInput(q) {
        var current = this.answers[q.id];
        var min = q.scaleMin || 1;
        var max = q.scaleMax || 5;
        var buttons = [];

        for (var i = min; i <= max; i++) {
            var isSelected = current === String(i);
            buttons.push(
                '<label class="q-scale-btn' + (isSelected ? ' selected' : '') + '">' +
                '  <input type="radio" name="' + q.id + '" value="' + i + '"' +
                (isSelected ? ' checked' : '') + '>' +
                '  <span>' + i + '</span>' +
                '</label>'
            );
        }

        return '<div class="q-scale">' +
               '  <div class="q-scale-labels">' +
               '    <span>' + this._esc(q.minLabel || 'Strongly disagree') + '</span>' +
               '    <span>' + this._esc(q.maxLabel || 'Strongly agree') + '</span>' +
               '  </div>' +
               '  <div class="q-scale-buttons">' + buttons.join('') + '</div>' +
               '</div>';
    }

    _renderCheckboxInput(q) {
        var current = this.answers[q.id] || [];
        var self = this;
        var opts = (q.options || []).map(function (opt, i) {
            // Store the option's stable id (or index) as the value so answers are
            // language-neutral; display the localized text.
            var val = self._optionValue(opt, i);
            var label = self.L(typeof opt === 'object' ? opt.text : opt);
            var isChecked = current.indexOf(val) !== -1;
            return '<label class="q-checkbox-option' + (isChecked ? ' selected' : '') + '">' +
                   '  <input type="checkbox" name="' + q.id + '" value="' + self._esc(val) + '"' +
                   (isChecked ? ' checked' : '') + '>' +
                   '  <span class="q-checkbox-label">' + self._esc(label) + '</span>' +
                   '</label>';
        });
        return '<div class="q-checkbox-group">' + opts.join('') + '</div>';
    }

    // The language-neutral key stored for a chosen option.
    _optionValue(opt, index) {
        if (opt && typeof opt === 'object') {
            return opt.id != null ? opt.id : String(index);
        }
        return opt;  // legacy string option
    }

    _renderTextareaInput(q) {
        var val = this.answers[q.id] || '';
        return '<textarea class="q-textarea" id="input-' + q.id + '"' +
               ' rows="4" placeholder="' + (q.placeholder || 'Your thoughts…') + '">' +
               this._esc(val) +
               '</textarea>';
    }

    // scope: optional element to search within for inputs (defaults to container).
    // Passing each question's own scroll-item element prevents radio changes from
    // clearing the "selected" class on other questions in scroll mode.
    _bindInputEvents(q, scope) {
        var self = this;
        var root = scope || this.container;

        if (q.type === 'text') {
            var input = root.querySelector('#input-' + q.id);
            if (input) {
                input.addEventListener('input', function (e) {
                    self.answers[q.id] = e.target.value;
                    self._clearError(root);
                });
                // Auto-focus only in paged mode (scroll mode has many inputs)
                if (!scope) setTimeout(function () { input.focus(); }, 50);
            }

        } else if (q.type === 'textarea') {
            var ta = root.querySelector('#input-' + q.id);
            if (ta) {
                ta.addEventListener('input', function (e) {
                    self.answers[q.id] = e.target.value;
                    self._clearError(root);
                });
            }

        } else if (q.type === 'checkbox') {
            var checkboxes = root.querySelectorAll('input[name="' + q.id + '"]');
            checkboxes.forEach(function (cb) {
                cb.addEventListener('change', function () {
                    var checked = [];
                    root.querySelectorAll('input[name="' + q.id + '"]:checked')
                        .forEach(function (c) { checked.push(c.value); });
                    self.answers[q.id] = checked;
                    self._clearError(root);
                    cb.closest('.q-checkbox-option').classList.toggle('selected', cb.checked);
                });
            });

        } else if (q.type === 'radio' || q.type === 'scale') {
            var radios = root.querySelectorAll('input[name="' + q.id + '"]');
            radios.forEach(function (radio) {
                radio.addEventListener('change', function (e) {
                    self.answers[q.id] = e.target.value;
                    self._clearError(root);

                    // Scoped to `root` so other questions aren't affected
                    root.querySelectorAll('.q-radio-option, .q-scale-btn')
                        .forEach(function (el) { el.classList.remove('selected'); });
                    e.target.closest('.q-radio-option, .q-scale-btn').classList.add('selected');

                    // Auto-advance in paged mode — brief pause so the selection is visible
                    if (!scope) {
                        setTimeout(function () { self.next(); }, 320);
                    }
                });
            });
        }
    }

    // Minimal HTML escaping for user-supplied text in attributes/text nodes
    _esc(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}
