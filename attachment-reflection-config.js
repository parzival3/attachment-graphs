/**
 * Attachment Style Reflection — "How Do You Create Connection?"
 * Written by Pia Torp, piatorp.dk
 *
 * Each option carries a tendency tag:
 *   S  = Secure
 *   A  = Anxious / Ambivalent
 *   Av = Avoidant / Withdrawn
 *   D  = Disorganised / Conflicted
 *
 * Scoring is performed in attachment-reflection-results.html.
 * Users may select multiple options per question (checkbox type).
 */

var REFLECTION_CONFIG = {

  id:          'attachment-reflection',
  title:       'How Do You Create Connection?',
  subtitle:    'Attachment Style Reflection',
  resultsPage: 'attachment-reflection-results.html',

  intro: [
    'This reflection is designed to help you become more aware of how you create closeness, safety and connection in your intimate relationships.',
    'It is not a diagnosis, and it does not place you in a fixed category. Most people contain more than one attachment strategy. Your way of relating may also change depending on the relationship, your life situation, your stress level and how emotionally safe you feel.',
    'For each question, choose all the answers that feel true for you. There are no right or wrong answers.',
    'The purpose of this reflection is to help you notice your relational patterns with more compassion and clarity.'
  ].join('\n'),

  sections: {},
  scoring:  [],

  questions: [
    {
      id: 'q1', type: 'checkbox', required: false,
      text: 'When I feel emotionally close to someone, I usually feel:',
      options: [
        { text: 'Calm and safe',                                              tag: 'S'  },
        { text: 'Happy, but also a little afraid of losing the connection',   tag: 'A'  },
        { text: 'Uncomfortable or slightly overwhelmed',                      tag: 'Av' },
        { text: 'Unsure whether I can fully trust it',                        tag: 'D'  },
        { text: 'Both longing for closeness and wanting to pull away',        tag: 'D'  }
      ]
    },
    {
      id: 'q2', type: 'checkbox', required: false,
      text: 'When my partner or someone close to me becomes distant, I tend to:',
      options: [
        { text: 'Ask directly what is happening',                tag: 'S'  },
        { text: 'Become anxious and need reassurance',           tag: 'A'  },
        { text: 'Think about it constantly',                     tag: 'A'  },
        { text: 'Withdraw and pretend it does not affect me',    tag: 'Av' },
        { text: 'Become angry, cold or shut down',               tag: 'D'  },
        { text: 'Feel confused and unsafe',                      tag: 'D'  }
      ]
    },
    {
      id: 'q3', type: 'checkbox', required: false,
      text: 'In conflict, my first impulse is usually to:',
      options: [
        { text: 'Stay present and try to understand',    tag: 'S'  },
        { text: 'Explain myself quickly',                tag: 'S'  },
        { text: 'Seek contact and reassurance',          tag: 'A'  },
        { text: 'Defend myself',                         tag: 'A'  },
        { text: 'Withdraw or become silent',             tag: 'Av' },
        { text: 'Attack, criticise or protest',          tag: 'D'  },
        { text: 'Freeze or lose access to my words',     tag: 'D'  }
      ]
    },
    {
      id: 'q4', type: 'checkbox', required: false,
      text: 'When I need comfort, I usually:',
      options: [
        { text: 'Can ask for it directly',                               tag: 'S'  },
        { text: 'Hope the other person notices',                         tag: 'A'  },
        { text: 'Become frustrated if they do not understand me',        tag: 'A'  },
        { text: 'Tell myself I should manage alone',                     tag: 'Av' },
        { text: 'Feel ashamed of needing anything',                      tag: 'D'  },
        { text: 'Want comfort, but do not fully trust it when it comes', tag: 'D'  }
      ]
    },
    {
      id: 'q5', type: 'checkbox', required: false,
      text: 'When someone depends on me emotionally, I often feel:',
      options: [
        { text: 'Touched and open',               tag: 'S'  },
        { text: 'Responsible and needed',         tag: 'S'  },
        { text: 'Pressured or trapped',           tag: 'Av' },
        { text: 'Afraid of disappointing them',   tag: 'A'  },
        { text: 'Unsure what they expect from me',tag: 'D'  },
        { text: 'Overwhelmed and wanting space',  tag: 'Av' }
      ]
    },
    {
      id: 'q6', type: 'checkbox', required: false,
      text: 'My greatest fear in close relationships is often:',
      options: [
        { text: 'Losing the person',                    tag: 'A'  },
        { text: 'Not being important enough',           tag: 'A'  },
        { text: 'Being rejected or abandoned',          tag: 'A'  },
        { text: 'Being controlled or swallowed up',     tag: 'Av' },
        { text: 'Being criticised or not good enough',  tag: 'D'  },
        { text: 'Being hurt if I trust too much',       tag: 'D'  }
      ]
    },
    {
      id: 'q7', type: 'checkbox', required: false,
      text: 'When I feel insecure in love, I tend to move:',
      options: [
        { text: 'Toward the other person',                        tag: 'A'  },
        { text: 'Away from the other person',                     tag: 'Av' },
        { text: 'Back and forth between closeness and distance',  tag: 'D'  },
        { text: 'Into overthinking',                              tag: 'A'  },
        { text: 'Into self-protection',                           tag: 'Av' },
        { text: 'Into protest, anger or silence',                 tag: 'D'  }
      ]
    },
    {
      id: 'q8', type: 'checkbox', required: false,
      text: 'In my body, relational insecurity often feels like:',
      options: [
        { text: 'Tightness in the chest',              tag: 'A'  },
        { text: 'Restlessness',                        tag: 'A'  },
        { text: 'A knot in the stomach',               tag: 'A'  },
        { text: 'Numbness',                            tag: 'Av' },
        { text: 'Tension in the jaw, shoulders or belly', tag: 'D' },
        { text: 'Heaviness or collapse',               tag: 'D'  },
        { text: 'A need to do something immediately',  tag: 'A'  }
      ]
    },
    {
      id: 'q9', type: 'checkbox', required: false,
      text: 'What I most long for in relationships is:',
      options: [
        { text: 'To feel safe and chosen',                          tag: 'S'  },
        { text: 'To feel free and not pressured',                   tag: 'Av' },
        { text: 'To be understood without having to fight for it',  tag: 'A'  },
        { text: 'To be close without losing myself',                tag: 'D'  },
        { text: 'To be able to trust love',                         tag: 'D'  },
        { text: 'To feel that I matter',                            tag: 'A'  }
      ]
    },
    {
      id: 'q10', type: 'checkbox', required: false,
      text: 'What I am slowly learning about myself is:',
      options: [
        { text: 'I may seek closeness when I feel afraid',                    tag: 'A'  },
        { text: 'I may withdraw when I feel overwhelmed',                     tag: 'Av' },
        { text: 'I may protest when I do not feel important',                 tag: 'A'  },
        { text: 'I may become independent when I actually need comfort',      tag: 'Av' },
        { text: 'I may confuse danger with intimacy',                         tag: 'D'  },
        { text: 'I may need more safety before I can be fully open',          tag: 'D'  }
      ]
    }
  ],

  // ── Tendency definitions ──────────────────────────────────────────────────
  // Color, label and interpretation text for each tag.
  // Edit the text here to update what appears on the results page.
  tendencies: {
    S: {
      label: 'Secure',
      color: '#7a9e8a',
      hlBg:  '#eef5f1',
      title: 'Secure tendencies',
      text:  'You are often able to stay emotionally present, ask for what you need, listen to the other person and repair after conflict. You may still become triggered, but you usually have access to reflection and connection again.'
    },
    A: {
      label: 'Anxious / Ambivalent',
      color: '#c77f5a',
      hlBg:  '#fdf0e8',
      title: 'Anxious / Ambivalent tendencies',
      text:  'You may become very activated when you feel distance, uncertainty or emotional disconnection. You may seek reassurance, think a lot about the relationship, or feel a strong need to restore closeness quickly.'
    },
    Av: {
      label: 'Avoidant / Withdrawn',
      color: '#6b8fa8',
      hlBg:  '#e8f0f5',
      title: 'Avoidant / Withdrawn tendencies',
      text:  'You may protect yourself by pulling back, becoming rational, staying silent or managing things alone. Closeness may feel important, but emotional pressure can feel overwhelming or intrusive.'
    },
    D: {
      label: 'Disorganised / Conflicted',
      color: '#9b82a8',
      hlBg:  '#f2eef5',
      title: 'Disorganised / Conflicted tendencies',
      text:  'You may both long for closeness and fear it. You may move between reaching out and pulling away, or between protest and shutdown. This often reflects earlier experiences where connection was also linked with fear, unpredictability or pain.'
    }
  },

  closing: 'Your attachment strategy was once an intelligent adaptation. It helped you stay connected, protected or emotionally safe. In adult relationships, the work is not to get rid of yourself, but to understand your protective movements and slowly build more secure ways of reaching for connection.'
};
