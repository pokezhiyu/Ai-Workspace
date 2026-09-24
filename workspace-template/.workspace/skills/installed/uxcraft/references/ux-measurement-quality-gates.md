# UX Measurement and Quality Gates

Use this reference to make UX measurable and deployment-ready.

## Metric Selection

Choose metrics based on goal:

- Task completion: success rate, error rate, time on task, support contact rate.
- Conversion: CTA click-through, signup completion, checkout completion, qualified leads.
- Activation: first successful action, onboarding completion, time to value.
- Retention: repeat usage, feature adoption, churn, saved work, returning users.
- Comprehension: first-click success, content comprehension, reduced confusion/support.
- Trust/safety: consent comprehension, refund/cancel success, security perception, complaint rate.
- Accessibility: WCAG 2.2 AA pass, keyboard completion, screen-reader smoke test.
- Performance perception: Core Web Vitals, skeleton stability, perceived latency, no layout shift.

## Common UX Measures

- Task success rate.
- Time on task.
- Error rate.
- System Usability Scale (SUS).
- Single Ease Question (SEQ).
- UMUX-Lite.
- HEART: Happiness, Engagement, Adoption, Retention, Task success.
- Funnel/drop-off by step.
- Qualitative severity themes.

## Quality Gate Template

A UI/UX deliverable is ready only when:

- Primary task and success metric are explicit.
- All required states exist: loading, empty, error, success, disabled, permission, offline if relevant.
- WCAG 2.2 AA acceptance criteria are listed.
- Responsive behavior is specified for mobile, tablet, desktop, and wide.
- Component states and tokens are documented.
- Content is final enough to implement or flagged as placeholder.
- Analytics events are named for key decisions and outcomes.
- Risks, assumptions, and validation plan are documented.

## Frontend Performance Gates

For web implementation, aim for:

- No avoidable layout shift in core flows.
- Interactive controls respond immediately or show progress.
- Images are sized and lazy-loaded appropriately.
- Critical flows work on low-end mobile and slow network where relevant.
- Errors are recoverable without data loss.

## Experimentation Guardrails

- Define hypothesis before A/B tests.
- Do not optimize conversion with dark patterns.
- Track guardrail metrics such as refunds, complaints, accessibility, support load, and retention.
- Avoid declaring success from underpowered or biased data.
