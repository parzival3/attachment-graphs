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
    }

    mount(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error('Questionnaire: container not found — "' + containerId + '"');
        }
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
                message: 'Please respond to this question before continuing.'
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
        var introParas = (c.intro || '').split('\n')
            .filter(function (p) { return p.trim(); })
            .map(function (p) { return '<p>' + p + '</p>'; })
            .join('');

        this.container.innerHTML =
            '<div class="q-card q-intro-card">' +
            '  <h1 class="q-intro-title">' + this._esc(c.title) + '</h1>' +
            '  <div class="q-intro-text">' + introParas + '</div>' +
            '  <div class="q-layout-toggle">' +
            '    <button class="q-layout-btn' + (this.layout === 'paged' ? ' active' : '') + '" data-layout="paged">&#9654; Step by step</button>' +
            '    <button class="q-layout-btn' + (this.layout === 'scroll' ? ' active' : '') + '" data-layout="scroll">&#9776; All at once</button>' +
            '  </div>' +
            '  <div class="q-intro-actions">' +
            '    <button class="btn-primary q-begin-btn">Begin &rarr;</button>' +
            '  </div>' +
            '</div>';

        // Layout toggle
        this.container.querySelectorAll('.q-layout-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                self.layout = btn.dataset.layout;
                self.container.querySelectorAll('.q-layout-btn').forEach(function (b) {
                    b.classList.toggle('active', b === btn);
                });
            });
        });

        this.container.querySelector('.q-begin-btn')
            .addEventListener('click', function () { self.next(); });
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
        var nextLabel   = isLast        ? 'See Results &rarr;'
                        : isOptional    ? 'Skip &rarr;'
                        :                 'Continue &rarr;';

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
            '    <p class="q-text">' + this._esc(q.text) + '</p>' +
            '    <div class="q-input-area">' + this._renderInput(q) + '</div>' +
            '    <div class="q-error" style="display:none;"></div>' +
            '  </div>' +
            '  <div class="q-nav">' +
            '    <button class="btn-secondary q-prev-btn"' + (this.step === 0 ? ' style="visibility:hidden"' : '') + '>&larr; Back</button>' +
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
        html += '<p class="q-scroll-meta">' + this._total + ' questions — fill in at your own pace</p>';

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
                '    <p class="q-text">' + self._esc(q.text) + '</p>' +
                '  </div>' +
                '  <div class="q-input-area">' + self._renderInput(q) + '</div>' +
                '  <div class="q-error" style="display:none;"></div>' +
                '</div>';
        });

        if (currentSection !== null) html += '</div>'; // close last section

        html +=
            '<div class="q-scroll-submit">' +
            '  <button class="btn-primary q-submit-btn">See Results &rarr;</button>' +
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
                    err.textContent = 'Please answer this question.';
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
