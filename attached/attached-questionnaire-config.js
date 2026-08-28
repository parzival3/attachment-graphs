/**
 * Attachment Style Self-Assessment — Configuration
 * Adapted from Levine & Heller, "Attached" (2010).
 * Original questionnaire adapted from the ECR-R (Fraley, Waller & Brennan, 2000).
 *
 * Questions are loaded at runtime from questions.csv — edit that file to
 * add, remove, or reorder questions without touching any JavaScript.
 *
 * CSV columns: id, section, group, type, required, text, options
 *   section : "self" (Part 1) or "partner" (Part 2)
 *   group   : A = Anxious, B = Secure, C = Avoidant (self)
 *             pA = Avoidant partner, pB = Secure partner, pC = Anxious partner
 *   options : pipe-separated answer choices, e.g. "True for me|Not true for me"
 *
 * Scoring is performed in attached-results.html from rawAnswers.
 */

var ATTACHED_CONFIG = {
    id: 'attached-self-assessment',
    title: 'Attachment Style Self-Assessment',
    intro: [
        'This questionnaire explores your attachment style — how you typically feel and behave in close relationships.',
        'Part 1 (42 statements): Mark each statement as "True for me" or "Not true for me."',
        'Part 2 (33 items, optional): Rate how true each description is of your current partner or date.',
        'At the end, your results will be shown on an attachment diagram.',
        'Adapted from Levine & Heller, "Attached" (2010), based on the ECR-R Questionnaire (Fraley, Waller & Brennan, 2000).'
    ].join('\n'),

    resultsPage: 'attached-results.html',

    sections: {
        self:    { title: 'Part 1 — Your Attachment Style' },
        partner: { title: 'Part 2 — Your Partner\'s Attachment Style (optional)' }
    },

    scoring: [],

    // Populated at runtime from questions.csv by csv-loader.js
    questions: []
};
