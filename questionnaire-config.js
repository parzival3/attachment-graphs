/**
 * Cross-Cultural Couple Questionnaire — Configuration
 * Ported from: docs.google.com/forms/d/17hKc1oSiiHJElJj5HEvRasIWvM4hBKm6vtY7aIPrxCc
 */

var QUESTIONNAIRE_CONFIG = {
    id: 'cross-cultural-couple',
    title: 'Cross-Cultural Couple Questionnaire',
    intro: [
        'This questionnaire is designed to support reflection and dialogue in relationships where partners come from different cultural or family backgrounds.',
        'It explores how culture, language, family norms and emotional patterns can influence everyday life, intimacy, and conflict between partners.',
        'This questionnaire is part of a broader body of work on cross-cultural relationships. All responses are treated confidentially.',
        'Further information: www.piatorp.dk'
    ].join('\n'),

    resultsPage: 'results.html',

    sections: {
        background:    { title: 'Background & Orientation' },
        communication: { title: 'Communication & Conflict' },
        family:        { title: 'Cultural Identity & Family Values' },
        cultural:      { title: 'Cultural Traditions & Understanding' },
        reflection:    { title: 'Reflection & Meaning' }
    },

    questions: [
        {
            id: 'q1',
            section: 'background',
            type: 'text',
            text: 'What is your cultural background — country or countries you primarily identify with?',
            required: false,
            placeholder: 'e.g. Danish / Turkish'
        },
        {
            id: 'q2',
            section: 'background',
            type: 'radio',
            text: 'How long have you been in this relationship?',
            required: false,
            options: ['Less than 1 year', '1–3 years', '3–7 years', 'More than 7 years']
        },
        {
            id: 'q3',
            section: 'background',
            type: 'radio',
            text: 'Do you currently live in the same country you grew up in?',
            required: false,
            options: ['Yes', 'Partly', 'No']
        },
        {
            id: 'q4',
            section: 'communication',
            type: 'scale',
            text: 'During disagreements, talking more usually improves the situation.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q5',
            section: 'communication',
            type: 'scale',
            text: 'We often misunderstand each other, even when we talk about simple everyday matters.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q6',
            section: 'communication',
            type: 'scale',
            text: 'When we disagree, emotions escalate quickly.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q7',
            section: 'family',
            type: 'scale',
            text: 'My family\'s values strongly influence how I think a relationship should work.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q8',
            section: 'family',
            type: 'scale',
            text: 'My partner\'s family expectations feel unfamiliar or difficult for me.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q9',
            section: 'family',
            type: 'scale',
            text: 'Loyalty to family sometimes creates tension in our relationship.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q10',
            section: 'cultural',
            type: 'scale',
            text: 'I sometimes underestimate how meaningful certain customs are for my partner.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q11',
            section: 'cultural',
            type: 'scale',
            text: 'Cultural traditions have caused misunderstandings or conflict between us.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q12',
            section: 'cultural',
            type: 'scale',
            text: 'I feel that I understand the emotional meaning behind my partner\'s cultural traditions.',
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            minLabel: 'Strongly disagree',
            maxLabel: 'Strongly agree'
        },
        {
            id: 'q13',
            section: 'reflection',
            type: 'textarea',
            text: 'What do you find most challenging about navigating cultural differences in your relationship?',
            required: false,
            placeholder: 'Write freely — there are no right or wrong answers.'
        },
        {
            id: 'q14',
            section: 'reflection',
            type: 'textarea',
            text: 'What do you find most enriching or meaningful about being in a cross-cultural relationship?',
            required: false,
            placeholder: 'Write freely — there are no right or wrong answers.'
        }
    ],

    // ── Scoring ──────────────────────────────────────────────
    // Each Likert answer (1–5) is normalised to –1…+1 via (value – 3) / 2.
    // invert:true applies (6 – value) first so agreement becomes low score.

    scoring: [
        // Communication (+1 = expressive/open, –1 = withdrawn)
        { questionId: 'q4', dimensionId: 'communication', invert: false },
        { questionId: 'q5', dimensionId: 'communication', invert: true  },

        // Conflict (+1 = calm/contained, –1 = escalatory)
        { questionId: 'q6', dimensionId: 'conflict', invert: true },

        // Family & Loyalty (+1 = family-oriented, –1 = independent)
        { questionId: 'q7', dimensionId: 'familyLoyalty', invert: false },
        { questionId: 'q9', dimensionId: 'familyLoyalty', invert: false },

        // Cultural Attunement (+1 = deep understanding, –1 = cultural distance)
        { questionId: 'q8',  dimensionId: 'culturalAttunement', invert: true  },
        { questionId: 'q10', dimensionId: 'culturalAttunement', invert: true  },
        { questionId: 'q11', dimensionId: 'culturalAttunement', invert: true  },
        { questionId: 'q12', dimensionId: 'culturalAttunement', invert: false }
    ],

    // ── Dimensions (used for tension lines) ─────────────────

    dimensions: [
        {
            id: 'communication',
            label: 'Communication Style',
            leftLabel: 'Withdrawn / Silent',
            rightLabel: 'Expressive / Open'
        },
        {
            id: 'conflict',
            label: 'Conflict Dynamics',
            leftLabel: 'Escalatory',
            rightLabel: 'Calm / Contained'
        },
        {
            id: 'familyLoyalty',
            label: 'Family & Loyalty',
            leftLabel: 'Independent',
            rightLabel: 'Family-Oriented'
        },
        {
            id: 'culturalAttunement',
            label: 'Cultural Attunement',
            leftLabel: 'Cultural Distance',
            rightLabel: 'Deep Understanding'
        }
    ],

    // ── Interpretation texts ─────────────────────────────────
    // Three bands per dimension: low (–1…–0.34), mid (–0.33…0.33), high (0.34…1)

    interpretation: {
        communication: [
            {
                min: -1.0, max: -0.34,
                title: 'Communication under pressure',
                text: 'Your responses suggest that communication in this relationship can feel strained, particularly during conflict. Misunderstandings may be frequent, and it\'s not always clear whether more talking helps. This is very common in cross-cultural relationships, where language and emotional expression styles can differ in subtle but significant ways.'
            },
            {
                min: -0.33, max: 0.33,
                title: 'Mixed communication patterns',
                text: 'Your communication dynamic appears balanced — moments of genuine connection sit alongside moments of frustration. Cross-cultural couples often navigate a learning curve around how to express needs, disagreement, and care across different cultural scripts.'
            },
            {
                min: 0.34, max: 1.0,
                title: 'Open communication',
                text: 'Your responses indicate a relatively open, communicative dynamic in your relationship. You tend to feel that talking through difficulties is helpful, and misunderstandings seem manageable. This is a meaningful strength to build on.'
            }
        ],

        conflict: [
            {
                min: -1.0, max: -0.34,
                title: 'High emotional intensity',
                text: 'Your responses suggest that disagreements tend to escalate emotionally. In cross-cultural couples, different cultural scripts for expressing frustration or seeking resolution can amplify misattunements. Recognising this pattern is an important first step.'
            },
            {
                min: -0.33, max: 0.33,
                title: 'Variable conflict patterns',
                text: 'Your conflict dynamic appears mixed — sometimes contained, sometimes intense. Cultural differences in how conflict is "supposed to look" — direct, indirect, or mediated through family — may play a role here.'
            },
            {
                min: 0.34, max: 1.0,
                title: 'Relatively contained conflict',
                text: 'Your responses suggest you are able to navigate disagreements with relative calm. Staying regulated during conflict is a significant resilience factor — it creates space for actual dialogue rather than reactive exchange.'
            }
        ],

        familyLoyalty: [
            {
                min: -1.0, max: -0.34,
                title: 'Independent orientation',
                text: 'Family loyalties and values appear to have a relatively lower active influence in your relationship currently. You may experience a greater sense of autonomy from family-of-origin expectations — though cultural pressures can resurface at key life moments.'
            },
            {
                min: -0.33, max: 0.33,
                title: 'Moderate family influence',
                text: 'Family values and loyalties play a moderate role in your relationship. Some tension exists around different family expectations, but there is also room to negotiate what feels right for the two of you.'
            },
            {
                min: 0.34, max: 1.0,
                title: 'Strong family orientation',
                text: 'Family values and loyalties appear to be a significant presence in your relationship. Navigating different cultural family norms — around loyalty, involvement, and obligation — is one of the most complex dimensions of cross-cultural partnership.'
            }
        ],

        culturalAttunement: [
            {
                min: -1.0, max: -0.34,
                title: 'Cultural distance',
                text: 'Your responses suggest that some cultural distance remains — customs, emotional meanings, and family traditions may still feel unfamiliar or be a source of friction. This is a common and understandable position, particularly in earlier stages of cross-cultural partnership.'
            },
            {
                min: -0.33, max: 0.33,
                title: 'Cultural understanding in progress',
                text: 'Cultural understanding in your relationship appears to be an active, ongoing process — genuine curiosity coexists with areas of remaining distance or misunderstanding. This is a productive and honest middle ground.'
            },
            {
                min: 0.34, max: 1.0,
                title: 'Strong cultural attunement',
                text: 'Your responses indicate meaningful cultural attunement — you appear to understand and value the emotional significance behind your partner\'s cultural traditions. This is a genuine foundation for navigating difference with empathy and curiosity.'
            }
        ]
    }
};
