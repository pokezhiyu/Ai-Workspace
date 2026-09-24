# Content Design and Internationalization

Content is part of the interface. Agents must design words, labels, errors, empty states, and localization behavior deliberately.

## Content Design Principles

- Start with user task and context.
- Use plain language and familiar vocabulary.
- Put the most important information first.
- Prefer specific verbs for actions.
- Avoid jargon unless the target user uses it.
- Write labels that predict the result of the action.
- Use consistent terminology across screens.
- Make errors explain what happened, why if useful, and how to recover.

## Voice and Tone

Define:

- Voice: stable brand personality.
- Tone: adapts to user emotion and risk.
- Vocabulary: preferred terms, banned terms, product naming.
- Reading level: simpler for broad audiences, precise for expert tools.

## Microcopy Patterns

- Button: verb + object when ambiguity exists, e.g. "Invite teammate".
- Empty state: what is missing, why it matters, first action.
- Error: problem + recovery + support if needed.
- Success: confirm outcome and next step.
- Loading: set expectation if longer than a moment.
- Permission: explain access requirement and request path.

## Inclusive Language

Avoid stereotypes, unnecessary gendering, ableist wording, and culturally narrow examples. Do not imply blame when users make mistakes.

## Internationalization Checklist

- Text expansion: allow 30-50% longer strings where possible.
- RTL/bidirectional layout: mirror layout where appropriate; do not mirror icons with fixed meaning.
- Dates/times: use locale-aware formatting and time zones.
- Numbers/currency: use locale-aware separators, symbols, precision.
- Names: do not require Western first/last assumptions unless legally required.
- Addresses/phones: support regional formats.
- Plurals/gender: avoid concatenated strings that cannot translate correctly.
- Sorting/search: consider accents, scripts, and transliteration.
- Images/icons: avoid culture-specific metaphors unless validated.
- Legal/regulatory copy: localize with qualified review.

## Content Handoff

Include final copy, alternatives, character limits, translation keys, dynamic variables, fallback text, and error states.
