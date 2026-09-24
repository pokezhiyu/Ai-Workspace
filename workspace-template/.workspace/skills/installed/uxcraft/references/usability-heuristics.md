# Usability Heuristics and Expert Review

Use this reference for heuristic reviews, cognitive walkthroughs, UX audits, and quick diagnosis when user testing is unavailable.

## Nielsen's 10 Usability Heuristics

1. Visibility of system status: show loading, progress, saved state, errors, sync, and feedback.
2. Match between system and real world: use user language and natural task order.
3. User control and freedom: undo, cancel, back, edit, exit, and recover.
4. Consistency and standards: consistent labels, components, locations, platform conventions.
5. Error prevention: prevent destructive mistakes and invalid input before they happen.
6. Recognition rather than recall: visible options, defaults, examples, history, and contextual help.
7. Flexibility and efficiency: shortcuts, saved preferences, bulk actions, power-user paths.
8. Aesthetic and minimalist design: remove irrelevant content and reduce competing hierarchy.
9. Help users recognize, diagnose, and recover from errors: specific messages and next steps.
10. Help and documentation: accessible help where users need it.

## Norman Interaction Principles

- Affordances: controls suggest what they do.
- Signifiers: labels, icons, shape, and placement communicate action.
- Feedback: every action has a visible, timely response.
- Mapping: control placement matches outcome.
- Constraints: the UI prevents impossible or dangerous actions.
- Conceptual model: users can predict what happens next.

## Practical Cognitive Rules

- Reduce cognitive load with grouping, defaults, progressive disclosure, and plain language.
- Prefer recognition over memory.
- Use Fitts's Law pragmatically: important targets should be large and easy to reach.
- Use Hick's Law pragmatically: too many equal choices slow decisions.
- Use serial position: important actions belong at memorable start/end positions.
- Avoid change blindness by making important changes explicit.

## Severity Rating

Rate each issue:

- Critical: blocks task, causes data loss, legal/security/accessibility failure, or deceptive outcome.
- High: many users fail or require support; severe accessibility or conversion issue.
- Medium: creates confusion, delay, avoidable errors, or inconsistent behavior.
- Low: polish issue that reduces confidence but does not block completion.

## Heuristic Review Output

For each finding include:

- Location.
- Violated heuristic.
- Evidence or rationale.
- Severity.
- User impact.
- Recommended fix.
- Acceptance criteria.

## Common Agent Fixes

- Add one primary CTA and demote secondary actions.
- Add clear loading, empty, error, success, and permission states.
- Replace vague labels with task-oriented labels.
- Add undo or confirmation for destructive actions.
- Preserve form data after errors.
- Make current location and next best action obvious.
- Use consistent component variants, spacing, and terminology.
