/**
 * Attachment Style Self-Assessment — Configuration
 * Adapted from Levine & Heller, "Attached" (2010).
 * Original questionnaire adapted from the ECR-R (Fraley, Waller & Brennan, 2000).
 *
 * Part 1 (Figure 1): 42 TRUE / NOT TRUE statements about yourself.
 *   group 'A' = Anxious style items
 *   group 'B' = Secure style items
 *   group 'C' = Avoidant style items
 *
 * Part 2 (Figure 3): 33 items rating your partner on a 1–3 scale (optional).
 *   group 'pA' = Avoidant partner characteristics
 *   group 'pB' = Secure partner characteristics
 *   group 'pC' = Anxious partner characteristics
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

    questions: [

        // ── Part 1: 42 statements (original book order, interleaved A/B/C) ──

        {
            id: 'p1_01', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'I often worry that my partner will stop loving me.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_02', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'I find it easy to be affectionate with my partner.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_03', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'I fear that once someone gets to know the real me, s/he won\'t like who I am.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_04', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'I find that I bounce back quickly after a breakup. It\'s weird how I can just put someone out of my mind.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_05', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'When I\'m not involved in a relationship, I feel somewhat anxious and incomplete.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_06', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'I find it difficult to emotionally support my partner when s/he is feeling down.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_07', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'When my partner is away, I\'m afraid that s/he might become interested in someone else.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_08', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'I feel comfortable depending on romantic partners.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_09', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'My independence is more important to me than my relationships.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_10', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'I prefer not to share my innermost feelings with my partner.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_11', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'When I show my partner how I feel, I\'m afraid s/he will not feel the same about me.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_12', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'I am generally satisfied with my romantic relationships.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_13', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'I don\'t feel the need to act out much in my romantic relationships.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_14', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'I think about my relationships a lot.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_15', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'I find it difficult to depend on romantic partners.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_16', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'I tend to get very quickly attached to a romantic partner.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_17', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'I have little difficulty expressing my needs and wants to my partner.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_18', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'I sometimes feel angry or annoyed with my partner without knowing why.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_19', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'I am very sensitive to my partner\'s moods.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_20', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'I believe most people are essentially honest and dependable.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_21', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'I prefer casual sex with uncommitted partners to intimate sex with one person.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_22', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'I\'m comfortable sharing my personal thoughts and feelings with my partner.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_23', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'I worry that if my partner leaves me I might never find someone else.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_24', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'It makes me nervous when my partner gets too close.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_25', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'During a conflict, I tend to impulsively do or say things I later regret, rather than be able to reason about things.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_26', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'An argument with my partner doesn\'t usually cause me to question our entire relationship.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_27', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'My partners often want me to be more intimate than I feel comfortable being.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_28', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'I worry that I\'m not attractive enough.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_29', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'Sometimes people see me as boring because I create little drama in relationships.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_30', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'I miss my partner when we\'re apart, but then when we\'re together I feel the need to escape.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_31', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'When I disagree with someone, I feel comfortable expressing my opinions.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_32', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'I hate feeling that other people depend on me.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_33', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'If I notice that someone I\'m interested in is checking out other people, I don\'t let it faze me. I might feel a pang of jealousy, but it\'s fleeting.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_34', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'If I notice that someone I\'m interested in is checking out other people, I feel relieved — it means s/he\'s not looking to make things exclusive.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_35', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'If I notice that someone I\'m interested in is checking out other people, it makes me feel depressed.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_36', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'If someone I\'ve been dating begins to act cold and distant, I may wonder what\'s happened, but I\'ll know it\'s probably not about me.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_37', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'If someone I\'ve been dating begins to act cold and distant, I\'ll probably be indifferent; I might even be relieved.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_38', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'If someone I\'ve been dating begins to act cold and distant, I\'ll worry that I\'ve done something wrong.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_39', section: 'self', group: 'A', type: 'radio', required: true,
            text: 'If my partner was to break up with me, I\'d try my best to show her/him what s/he is missing (a little jealousy can\'t hurt).',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_40', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'If someone I\'ve been dating for several months tells me s/he wants to stop seeing me, I\'d feel hurt at first, but I\'d get over it.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_41', section: 'self', group: 'C', type: 'radio', required: true,
            text: 'Sometimes when I get what I want in a relationship, I\'m not sure what I want anymore.',
            options: ['True for me', 'Not true for me']
        },
        {
            id: 'p1_42', section: 'self', group: 'B', type: 'radio', required: true,
            text: 'I won\'t have much of a problem staying in touch with my ex (strictly platonic) — after all, we have a lot in common.',
            options: ['True for me', 'Not true for me']
        },

        // ── Part 2: 33 items rating your partner (1 = Very untrue, 3 = Very true) ──
        // group pA = Avoidant partner  |  pB = Secure  |  pC = Anxious

        {
            id: 'p2A_01', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Sends mixed signals — seems distant and aloof yet vulnerable at the same time; sometimes very interested and then cold.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_02', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Values his/her independence greatly — looks down on dependency and "neediness."',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_03', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Devalues you or previous partners — even if only jokingly.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_04', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Uses distancing strategies — emotional or physical (e.g., prefers sleeping at home, taking vacations alone, or leaving plans deliberately unclear).',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_05', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Emphasises boundaries — makes you feel certain friends, family, or spaces are strictly off-limits.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_06', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Has an unrealistically romantic view of how a relationship should be — idealises a past relationship but is vague about what went wrong.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_07', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Mistrustful — fears being taken advantage of or trapped by partner.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_08', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Has a rigid view of relationships and uncompromising rules — strong preference for a certain "type," or certain that it\'s best never to marry.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_09', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'During a disagreement, needs to get away or "explodes" — shuts down entirely or walks out in fury.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_10', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Doesn\'t make intentions clear — leaves you guessing about feelings (e.g., never says "I love you"; makes long-term plans without including you).',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2A_11', section: 'partner', group: 'pA', type: 'radio', required: false,
            text: 'Has difficulty talking about what is going on between you — certain topics are off-limits; asking about the relationship\'s future makes you feel uncomfortable.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },

        {
            id: 'p2B_01', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Reliable and consistent — phones when s/he says s/he will; follows through on plans and explains if s/he can\'t.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_02', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Makes decisions with you — discusses plans and doesn\'t decide unilaterally.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_03', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Flexible view of relationships — not looking for a particular "type"; open to different living arrangements or agreements.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_04', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Communicates relationship issues well — tells you what is bothering him/her rather than acting out or expecting you to guess.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_05', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Can reach compromise during arguments — genuinely tries to understand what is really bothering you.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_06', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Not afraid of commitment or dependency — doesn\'t worry that closeness means being trapped or taken advantage of.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_07', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Doesn\'t view the relationship as hard work — open to starting something new even when life is demanding.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_08', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Closeness creates further closeness — after emotional or revealing conversations, reassures you and stays present rather than pulling back.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_09', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Introduces friends and family early on — wants to make you part of his/her life.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_10', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Naturally expresses feelings for you — tells you early how s/he feels and says "I love you" generously.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2B_11', section: 'partner', group: 'pB', type: 'radio', required: false,
            text: 'Doesn\'t play games — no strategic distance, no calculated silence to keep you on your toes.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },

        {
            id: 'p2C_01', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Wants a lot of closeness early — suggests moving in together, joint vacations, or constant contact from the start.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_02', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Expresses insecurities — worries about rejection, asks a lot about your past partners, fears you\'ll lose interest.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_03', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Unhappy when not in a relationship — seems desperate to find someone; dates can feel like auditions for the "future spouse" role.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_04', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Plays games to keep your attention — acts distant if you haven\'t called, pretends to be unavailable, tries to make you more interested.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_05', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Has difficulty explaining what\'s bothering him/her — expects you to pick up on subtle cues rather than saying directly.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_06', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Acts out instead of resolving conflict — threatens to leave but later backs down; accumulates hurts without expressing them.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_07', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Has a hard time not making things about himself/herself — interprets your tiredness or busyness as personal rejection.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_08', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Lets you set the tone of the relationship so as not to get hurt — mirrors your level of interest rather than taking the initiative.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_09', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Preoccupied with the relationship — hashes out every date detail with friends; calls or texts excessively, or goes silent as a defensive move.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_10', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Fears that small acts will ruin the relationship — worries about having come across badly or said too much.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        },
        {
            id: 'p2C_11', section: 'partner', group: 'pC', type: 'radio', required: false,
            text: 'Suspicious that you may be unfaithful — checks messages, tracks whereabouts, or goes through belongings.',
            options: ['1 — Very untrue', '2 — Moderately true', '3 — Very true']
        }
    ]
};
