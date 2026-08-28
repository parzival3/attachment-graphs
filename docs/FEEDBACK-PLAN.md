# Attachment Reflection — Feedback Implementation Plan

Plan of changes based on Pia's feedback on the first survey ("How Do You Create
Connection?" / Attachment Style Reflection).

**Status:** Well-defined items implemented (✅). Items needing Pia's decision are
left open and raised in a draft email (see `DRAFT-EMAIL-PIA.md`).

All changes are in `attachment-reflection-config.js` unless noted otherwise.

Tags: `S` = Secure, `A` = Anxious/Ambivalent, `Av` = Avoidant/Withdrawn, `D` = Disorganised/Conflicted

---

## 1. Add more "secure" response options in later questions

Later questions (fear, insecurity, body reactions, learning about oneself) have
few or no clearly secure answers, which can push relatively secure people into
A/Av/D options. Add secure options such as:

- [ ] **q6 (greatest fear):** add a secure-leaning option, e.g.
      "I can feel afraid, but I usually believe we can find our way back." → `S`
- [ ] **q7 (when insecure, I move):** add
      "I try to pause, notice what is happening in me, and reach for contact more clearly." → `S`
- [ ] **q8 (in my body):** add
      "I may feel activated, but I can usually return to my breath and body." → `S`
- [ ] **q10 (learning about myself):** add
      "I can learn to ask more clearly for what I need." → `S`

> Note: exact wording/placement per question to be confirmed with Pia.

## 2. Reconsider "Explain myself quickly" (q3)

Currently scored `S`. Explaining quickly can be a protective/anxious strategy.
Split into two options:

- [ ] Change to "Slow down and try to share what is happening in me." → `S`
- [ ] Add "Explain myself quickly so the distance does not grow." → `A`

## 3. Reconsider "Responsible and needed" (q5)

Currently scored `S`. Can reflect a caretaking pattern.

- [ ] Replace with "Able to care without losing myself." → `S`
      (optionally keep "Responsible and needed" but retag as `A`/caretaking — confirm with Pia)

## 4. Keep the word "Disorganised" — soften the framing

Keep the term (used by Dan Siegel et al.) but explain it gently.

- [ ] Confirm label wording. Pia's preference is **option 1: "Disorganised / conflicted"**
      (which we already use as the label). Options considered:
  1. "Disorganised / conflicted"  ← Pia's preferred
  2. "Disorganised attachment patterns"
  3. "Disorganised or fearful attachment strategies"
- [ ] Add a gentle explanatory note (in `tendencies.D.text` and/or intro) that
      "disorganised" describes the attachment *system* becoming conflicted —
      longing for and fearing closeness at once — not the person being
      disorganised. Current `D.text` already leans this way; expand slightly.
- [ ] Accept overlap between Anxious/Ambivalent and Disorganised — no need to make
      categories rigid. (Mostly a scoring/interpretation stance, not a code change.)

## 5. Add a question about repair after conflict

- [ ] New question: "After a conflict, I usually…"
  - "Try to repair and understand what happened." → `S`
  - "Need reassurance before I can feel close again." → `A`
  - "Prefer to move on and not talk too much about it." → `Av`
  - "Feel ashamed or afraid that something has been damaged." → `D`
  - "Want closeness, but find it hard to trust the repair." → `D` (Disorganised/Ambivalent)

## 6. Add a question about receiving love and care

- [ ] New question: "When someone shows me love or care, I often…"
  - "Can take it in and feel moved." → `S`
  - "Need more signs that it is real." → `A`
  - "Feel uncomfortable or want to change the subject." → `Av`
  - "Want it, but do not fully trust it." → `D` (Disorganised/Ambivalent)
  - "Feel both longing and fear." → `D`

## 7. Language consistency (British vs American English)

Currently British ("Disorganised", "criticise").

- [ ] **Decision needed from Pia:** British or American English?
- [ ] If American: change "Disorganised" → "Disorganized", "criticise" → "criticize"
      throughout config + `tendencies` labels/titles/text + results page + HTML.
- [ ] If British: change "Toward" → "Towards" in **q7** for consistency.

## 8. Small formatting fix

- [ ] `attachment-reflection-config.js` q5: add a space before `tag` in
      `{ text: 'Unsure what they expect from me',tag: 'D' }` →
      `{ text: 'Unsure what they expect from me', tag: 'D' }`

---

## Open questions to confirm with Pia before implementing

1. British vs American English (blocks item 7).
2. Final wording for each new secure option (item 1).
3. Whether "Responsible and needed" is removed or kept-and-retagged (item 3).
4. Exact placement/numbering of the two new questions (items 5 & 6) — likely
   after q3 (repair) and near q9 (receiving care), or appended at the end.

## Note on the large survey

Pia will revert separately. Idea raised: parts of it may target singles / be too
long; consider splitting into sections for different target groups. To discuss later.
