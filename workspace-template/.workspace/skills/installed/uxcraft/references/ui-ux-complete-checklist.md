# UI/UX Complete Checklist

Use this checklist for every UI/UX design, audit, redesign, or implementation review.

## 1. Product Fit

- [ ] Product category is clear.
- [ ] Primary user is identified.
- [ ] User job-to-be-done is explicit.
- [ ] Business goal is explicit.
- [ ] Success metric is defined.
- [ ] Constraints are listed: platform, brand, tech, timeline, compliance, localization.
- [ ] Assumptions are separated from facts.
- [ ] Risks and open questions are documented.

## 2. Information Architecture

- [ ] Navigation matches user mental model.
- [ ] Top-level sections are mutually exclusive and collectively useful.
- [ ] Labels use user vocabulary, not internal implementation names.
- [ ] Important tasks are reachable in the shortest path.
- [ ] Secondary and rare tasks are discoverable but not dominant.
- [ ] Search, filter, sort, and grouping are specified where needed.
- [ ] Role/permission visibility is defined.
- [ ] Breadcrumbs or location indicators exist for deep structures.

## 3. User Flows

- [ ] Entry points are defined.
- [ ] Happy path is short and clear.
- [ ] Back/cancel behavior is defined.
- [ ] Error recovery is defined.
- [ ] Empty states have next actions.
- [ ] Success confirmation is defined.
- [ ] Destructive actions have undo or confirmation.
- [ ] System feedback exists after every important action.
- [ ] Flow supports first-time and returning users.

## 4. Layout and Hierarchy

- [ ] Each screen has one primary goal.
- [ ] Main CTA is visually dominant.
- [ ] Secondary actions do not compete with primary action.
- [ ] Content is grouped by task or meaning.
- [ ] Spacing supports scanability.
- [ ] Headings create a logical page outline.
- [ ] Dense areas have progressive disclosure.
- [ ] Important information appears before advanced options.
- [ ] Visual weight matches importance.

## 5. Visual Design

- [ ] Design style matches product trust level and brand personality.
- [ ] Color roles are semantic and consistent.
- [ ] Typography scale supports hierarchy.
- [ ] Spacing scale is consistent.
- [ ] Radius, borders, elevation, and shadows are consistent.
- [ ] Icon style is consistent.
- [ ] Imagery/illustration style is defined if used.
- [ ] Motion style is purposeful and not excessive.
- [ ] UI density matches user context.

## 6. Components

- [ ] Buttons have variants, sizes, states, and usage rules.
- [ ] Form controls have labels, helper text, validation, disabled states.
- [ ] Navigation components have current, hover, focus, and collapsed states.
- [ ] Modals/drawers/popovers define open/close, focus trap, escape behavior.
- [ ] Tables define sorting, filtering, pagination, empty, loading, and bulk actions.
- [ ] Cards define clickable area and metadata hierarchy.
- [ ] Alerts/toasts define severity and dismissal behavior.
- [ ] Tooltips do not contain critical information.
- [ ] Component reuse is preferred over one-off styling.

## 7. State Coverage

- [ ] Default state.
- [ ] Loading state.
- [ ] Skeleton state if needed.
- [ ] Empty state.
- [ ] Error state.
- [ ] Partial data state.
- [ ] Offline/network issue state if applicable.
- [ ] Permission denied state.
- [ ] Disabled state.
- [ ] Hover/focus/active states.
- [ ] Selected/current state.
- [ ] Success state.
- [ ] Undo/recovery state.

## 8. Forms

- [ ] Only necessary fields are requested.
- [ ] Every field has a visible label.
- [ ] Required/optional status is clear.
- [ ] Helper text explains ambiguous fields.
- [ ] Validation timing is user-friendly.
- [ ] Error messages explain the fix.
- [ ] User input is preserved after errors.
- [ ] Inputs use correct type/autocomplete.
- [ ] Long forms are grouped or stepped.
- [ ] Submit/loading/disabled behavior is defined.

## 9. Content and Microcopy

- [ ] H1 explains the page purpose.
- [ ] CTA labels are verb-led and specific.
- [ ] Empty state copy explains what happened and what to do next.
- [ ] Error copy avoids blame and includes recovery.
- [ ] Confirmation copy states the result.
- [ ] Destructive action copy explains impact.
- [ ] Tone is consistent.
- [ ] Text is concise without becoming vague.
- [ ] Jargon is avoided unless the audience expects it.

## 10. Accessibility

- [ ] WCAG 2.2 AA is the baseline.
- [ ] Semantic HTML/roles are correct.
- [ ] Heading order is logical.
- [ ] Keyboard navigation works.
- [ ] Focus order matches visual/task order.
- [ ] Focus indicators are visible.
- [ ] Contrast meets AA.
- [ ] Color is not the only status indicator.
- [ ] Images/icons have appropriate alt text or are decorative.
- [ ] Form errors are programmatically associated.
- [ ] Motion respects reduced motion.
- [ ] Touch targets are at least 44x44 px where possible.

## 11. Responsive Design

- [ ] Mobile layout is not an afterthought.
- [ ] Navigation has a mobile pattern.
- [ ] Tables/cards have small-screen behavior.
- [ ] Sticky elements do not block content.
- [ ] Modals/drawers fit small screens.
- [ ] Text wraps safely.
- [ ] Images preserve useful crops.
- [ ] Layout works at 320px width.
- [ ] Layout works at tablet, desktop, and wide sizes.

## 12. Trust, Safety, and Ethics

- [ ] Costs, risks, permissions, and data usage are transparent.
- [ ] Dark patterns are avoided.
- [ ] Consent is explicit where needed.
- [ ] Destructive actions are recoverable or confirmed.
- [ ] Sensitive data requests explain why.
- [ ] AI-generated or uncertain content is labeled when relevant.
- [ ] User control is preserved.

## 13. Performance Perception

- [ ] Critical content loads first.
- [ ] Loading states reduce uncertainty.
- [ ] Layout shift is minimized.
- [ ] Feedback appears immediately after user action.
- [ ] Heavy visuals do not harm usability.
- [ ] Expensive interactions have optimistic UI or clear progress.

## 14. Handoff

- [ ] Screen list is complete.
- [ ] Components and states are specified.
- [ ] Design tokens are listed.
- [ ] Responsive behavior is defined.
- [ ] Accessibility requirements are explicit.
- [ ] Data requirements are defined.
- [ ] Analytics events are listed.
- [ ] QA checklist is included.
- [ ] Out-of-scope items are documented.

## Advanced One-Stop Coverage Additions

### Research Evidence

- [ ] Evidence sources are documented: analytics, support, interviews, usability tests, screenshots, or stakeholder assumptions.
- [ ] Research confidence is labeled high, medium, or low.
- [ ] Assumptions are not presented as user facts.
- [ ] Research method fits the uncertainty: interview, survey, usability test, card sort, tree test, accessibility test, or heuristic review.

### Platform-Native Conventions

- [ ] Web, iOS, Android/Material, desktop, email, kiosk, TV, or wearable conventions are followed as relevant.
- [ ] Touch, mouse, keyboard, remote, and assistive-tech input models are considered.
- [ ] Back, Escape, safe areas, system font scaling, zoom, and reduced-motion behaviors are defined where relevant.

### Internationalization and Content Resilience

- [ ] Text can expand without breaking layout.
- [ ] RTL/bidirectional layout is considered where relevant.
- [ ] Date, time, number, currency, address, phone, name, and plural formats are locale-aware where relevant.
- [ ] Translation keys, variables, fallback copy, and legal copy ownership are documented.

### Measurement and Quality Gates

- [ ] Task success metric is explicit.
- [ ] Accessibility, responsive, platform, performance, and content gates are defined.
- [ ] Analytics events support the key user decisions and outcomes.
- [ ] Usability validation method is specified when risk is medium or high.

### Ethics, Privacy, and Inclusion

- [ ] No dark patterns: hidden costs, forced continuity, confirmshaming, obstruction, sneaking, or manipulative urgency.
- [ ] Consent is clear, granular, and not preselected for optional tracking.
- [ ] Sensitive data and permissions are requested only when needed and explained plainly.
- [ ] High-risk flows include recovery, appeal, export/delete, or human handoff where appropriate.

### Data Visualization and Dashboards

- [ ] Charts have titles, units, timeframes, clear scales, and accessible color choices.
- [ ] Tables support keyboard use, sorting, filtering, density, empty/no-results states, and exports where relevant.
- [ ] Data freshness, partial data, stale data, and uncertainty are communicated.
