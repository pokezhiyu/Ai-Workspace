---
name: uxcraft
description: "Use when an agent must design, audit, improve, prototype, specify, or hand off any UI/UX work end-to-end. Provides one-stop UX strategy, research, IA, flows, wireframes, visual design, design systems, accessibility, usability testing, conversion, and engineering handoff workflows."
version: 1.5.4
author: Rupak Biswas
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [ui, ux, product-design, accessibility, design-system, prototyping, audit, frontend]
    related_skills: [popular-web-designs, sketch, claude-design, design-md, excalidraw, humanizer, writing-plans]
---

# UI/UX Master Skill

## Overview

This is a one-stop UI/UX skill for agents. Use it whenever the user asks for anything related to user experience, interface design, product design, design systems, wireframes, prototypes, frontend polish, accessibility, conversion, usability, or design critique.

The job is not only to make screens look good. The job is to solve the user's goal with a usable, accessible, coherent, implementable interface. Always connect design choices to user needs, product goals, content, system constraints, and measurable outcomes.

## Cross-Agent Activation

This skill is opt-in. In Codex, Claude, Windsurf, Antigravity, Gemini, Cursor, and other agents, activate it only when the user includes `/uxcraft` in the prompt or invokes the installed native slash command. If the user does not mention `/uxcraft`, do not apply this skill automatically.

When activated, the user can write naturally, for example: `/uxcraft audit this checkout flow` or `/uxcraft design a premium SaaS landing page`. Treat the rest of the prompt as the task and follow this SKILL.md plus the referenced files.

## AI Discovery and MCP

This package exposes the workflow through human-readable instructions and machine-readable discovery assets:

- `llms.txt` gives AI agents a short map of the package.
- `ai-discovery/uxcraft.manifest.json` describes activation, entrypoints, tools, resources, prompts, and supported agents.
- `system-prompts/` contains full, compact, and MCP-focused system prompt add-ons.
- `bin/uxcraft-mcp.mjs` runs a local read-only MCP server that exposes UXCraft tools, resources, and prompts.

Use MCP and system prompt add-ons only as discovery/activation layers. The workflow remains opt-in and should still require `/uxcraft` unless the user explicitly asks to use UXCraft.

## Core Operating Rule

Do not jump directly to visuals. Work in this order unless the user explicitly asks for a narrow task:

1. **Discovery first.** Load `references/design-discovery-protocol.md`. For any new design task, run the 6-question discovery form before producing any visual output. Lock down: surface, audience, tone, brand context, fidelity, and constraints.
2. **Brand extraction or visual direction.** If the user provides brand assets (URL, screenshot, hex codes), run the 5-step brand extraction protocol from `references/design-discovery-protocol.md` and write a brand-spec summary. If there is no brand, load `references/visual-directions.md`, present the 5 directions, and bind the selected direction's token block as the baseline. Never invent or guess brand colors from a company name alone.
3. **Check project memory.** Look for `.ui-ux-memory.md` at the project root. If it exists, read all 9 sections (schema defined in `references/design-system-schema.md`) before designing. If it does not exist, create it using the schema after discovery completes.
4. Understand the product, users, goal, platform, constraints, evidence available, research confidence, and success metric.
5. Define the UX model: audience, jobs-to-be-done, journeys, service touchpoints, information architecture, flows, states, and content.
6. **Industry reasoning.** Load `references/industry-reasoning-rules.md`. Match the user's product to an industry category and output the full Design System Block (pattern + style + colors + typography + effects + anti-patterns) in one step before designing.
6a. Select an appropriate top-brand design method when frontend polish is requested. Load the corresponding brand-method skill file from references/: `references/brand-method-product-cinema.md`, `references/brand-method-utility-command-center.md`, `references/brand-method-editorial-brand-world.md`, `references/brand-method-enterprise-trust-hub.md`, `references/brand-method-card-based-discovery.md`, `references/brand-method-conversion-simplicity.md`, `references/brand-method-ecosystem-bundling.md`, `references/brand-method-premium-restraint.md`, `references/brand-method-playful-familiarity.md`, or `references/brand-method-technical-authority.md`.
6b. Apply color psychology: load `references/color-psychology-branding.md`, identify the industry and sentiment, prescribe a complete palette with contrast ratios and rationale before any visual design begins. Use `references/color-scale-system.md` to generate full 11-step (50–950) OKLch color scales for the brand primary, neutral, and all semantic colors.
6c. Select a UI style from `references/ui-styles-catalog.md`. Apply the style's token overrides on top of the visual direction baseline.
7. **Junior designer warm-up.** For high-fidelity requests, show a wireframe sketch (grey blocks, real layout) first. Confirm direction before applying brand and polish. Skip if the user explicitly requests final output or provides a detailed reference.
8. Design the interface by extending the established brand/direction baseline. Apply only tokens from the schema — no ad-hoc magic values. Apply stack-specific rules from `references/tech-stack-guidelines.md` for the user's chosen framework. For landing pages and marketing pages, follow the appropriate conversion pattern from `references/landing-page-patterns.md`. For dashboards, use the chart type guide in that same file.
9. **Quality gates before any emit.** Load `references/output-quality-gates.md`. Run the 5-dimensional self-critique (philosophy/hierarchy/execution/specificity/restraint), pass all P0 hard gates, and clear the anti-slop blacklist. Fix and rescore until all dimensions ≥ 3. Do not emit output until all gates pass.
10. Validate: consistency with memory, research evidence, heuristics, WCAG, platform conventions, usability risks, i18n, ethics/privacy, edge cases, technical feasibility, metrics, and brand-fit.
11. Update `.ui-ux-memory.md` with any new durable design decisions before handoff.
12. Hand off: exact specs, tokens, component behavior, copy, states, QA checklist, implementation notes.

## When to Use

Use this skill for:

- New app, website, dashboard, landing page, SaaS, mobile, admin, ecommerce, onboarding, forms, checkout, settings, profile, search, data tables, empty states, error states, auth, or any other UI.
- Redesigning, modernizing, polishing, or improving an existing screen.
- Creating UX plans, design briefs, IA, user flows, wireframes, prototypes, mockups, design systems, or style guides.
- Reviewing UI/UX quality, accessibility, conversion, usability, responsiveness, or handoff readiness.
- Turning vague product ideas into design requirements.
- Translating Figma/design screenshots into implementation-ready frontend instructions.
- Giving agents a repeatable UI/UX process across all projects.

Do not use this skill for pure backend work with no user-facing behavior, unless API decisions affect UX states, latency, data shape, validation, or error handling.

## Required Agent Behavior

### Adaptive Brand and Memory Behavior

Every time this skill is used on an application, first load and follow `references/ui-ux-memory-workflow.md`.

The goal is consistency across the whole application. Do not create a new visual style each time.

Required behavior:

- Search for an application UI/UX memory file before designing: `.ui-ux-memory.md`, `docs/ui-ux-memory.md`, `docs/design/ui-ux-memory.md`, or `design/ui-ux-memory.md`.
- If memory exists, read it and treat it as the source of truth for brand, colors, fonts, layout rhythm, components, states, copy voice, and responsive rules.
- If memory does not exist, inspect existing branding first: CSS variables, theme files, Tailwind config, design tokens, global styles, components, pages, logo usage, fonts, and screenshots if available.
- If existing branding is found, create `.ui-ux-memory.md` at the application root using `templates/ui-ux-memory.md` and fill it with discovered stable facts.
- If the project is fresh and no branding exists, ask only a few high-value questions to understand what the user is building, who it is for, desired personality, colors/fonts/references, and platform. If the user does not answer, proceed with clear assumptions and record them in memory.
- For later changes, read memory first, preserve the baseline, and update only the requested area unless the user asks for a full redesign/rebrand.
- After stable UI decisions change, update the memory file so future work stays consistent.
- Be adaptive: normalize weak/inconsistent branding into a clearer token system; extend strong branding without unnecessary change.

Fresh project questions:

1. What are you building and who is it for?
2. What is the primary user action or success moment?
3. What personality should it have: premium, playful, enterprise, technical, calm, bold, luxury, friendly, etc.?
4. Any colors, fonts, logos, competitors, or references to use or avoid?
5. Is it a landing page, SaaS app, dashboard, ecommerce, admin, mobile, or another type?

Final response must mention whether UI/UX memory was read, created, updated, or unavailable.

### Ask Only High-Value Questions

If the user gave enough context, proceed with assumptions and label them. Ask questions only when missing context would materially change the design.

High-value questions:

- Who is the primary user and what job are they trying to complete?
- What platform: web, mobile, desktop, kiosk, email, dashboard, embedded widget?
- What is the primary success metric: activation, conversion, retention, task completion, speed, trust, comprehension?
- Is there an existing brand, design system, tech stack, or accessibility requirement?
- Are there competitor or reference products the user likes/dislikes?

### Always Produce Useful Output

For design tasks, include concrete artifacts, not just advice:

- Design direction and rationale.
- IA/site map or screen inventory.
- User flow or task flow.
- Layout/wireframe description.
- Component list and states.
- Copy recommendations.
- Responsive behavior.
- Accessibility requirements.
- Implementation/handoff checklist.
- Testing and QA checklist.

### Prefer Specifics Over Taste

Avoid vague language like "make it modern" or "improve UX" unless followed by exact changes. Say what to change, where, and why.

Bad: "Make the hero cleaner."
Good: "Reduce hero to one H1, one 18px supporting sentence, one primary CTA, one secondary proof link; move feature bullets below fold to reduce decision load."

## Universal UI/UX Workflow

### Phase 1: Product and User Understanding

Capture:

- Project category and promise.
- Existing UI/UX memory and branding baseline, if any.
- Existing colors, fonts, tokens, components, and representative screens.
- Primary user segments.
- User jobs-to-be-done.
- Business goals.
- Platform and context of use.
- Constraints: time, tech stack, brand, compliance, device, content, localization.
- Known data inputs/outputs.
- Existing analytics or user feedback if available.

Deliverable: short design brief.

### Phase 1B: UX Research and Evidence

When the task involves discovery, validation, audit, redesign, conversion, or an uncertain product direction, load and apply `references/ux-research-methods.md`.

Define:

- What is known from evidence.
- What is assumed.
- Research method needed, if any.
- Evidence confidence: high, medium, or low.
- Risks if the design proceeds without user evidence.

Use interviews, surveys, analytics review, support-ticket synthesis, card sorting, tree testing, first-click testing, usability testing, accessibility testing, or heuristic review as appropriate. Do not invent user research; label synthetic personas and journeys as assumptions.

Deliverable: research/evidence summary or research plan.

### Phase 2: UX Strategy

Define:

- Primary and secondary use cases.
- Main user journey.
- Decision points and friction points.
- Prioritized screens.
- Success metrics and guardrail metrics.
- Risks and assumptions.

Deliverable: UX strategy summary.

### Phase 3: Information Architecture

Create:

- Navigation model.
- Page/screen hierarchy.
- Content grouping.
- Labels and terminology.
- Search/filter/sort model where applicable.
- Permission/role visibility if applicable.

Principles:

- Use user vocabulary, not internal system vocabulary.
- Put the most common task in the shortest path.
- Progressive disclosure beats dense first screens.
- Group by user intent, not database schema.

Deliverable: IA map or screen inventory.

### Phase 4: User Flows

For each key task, define:

- Entry point.
- Required user decision.
- System response.
- Success path.
- Empty/error/loading/permission states.
- Recovery path.
- Exit/next best action.

Deliverable: flow steps or diagram.

### Phase 5: Wireframes and Layout

Design screen structure:

- Page goal.
- Primary action.
- Secondary actions.
- Visual hierarchy.
- Grid and spacing.
- Content modules.
- Component placement.
- Above-the-fold priorities.

For every screen, specify:

- Header/navigation.
- Main content region.
- Sidebars/panels if any.
- Footer or persistent actions.
- Responsive collapse behavior.

Deliverable: wireframe description or quick HTML/ASCII/diagram when useful.

### Phase 6: Visual Design

Define visual language:

- Brand personality: e.g. calm, premium, playful, technical, enterprise, editorial.
- Color palette and semantic color roles.
- Typography scale.
- Spacing scale.
- Radius, shadows, borders, elevation.
- Iconography and illustration style.
- Motion style.
- Density: compact, comfortable, spacious.

Rules:

- Use color semantically, not decoratively only.
- One dominant visual idea per screen.
- Establish hierarchy with size, weight, spacing, contrast, and grouping.
- Maintain consistent component behavior across screens.

Deliverable: style direction and design tokens.

### Phase 7: Interaction Design

Specify:

- Hover, focus, active, selected, disabled states.
- Loading and skeleton states.
- Empty states.
- Error and validation behavior.
- Confirmation patterns.
- Undo vs destructive confirmation.
- Keyboard support.
- Touch target sizes.
- Motion duration/easing.
- Drag/drop, pagination, infinite scroll, modals, drawers, popovers, tabs, accordions behavior.

Deliverable: interaction spec.

### Phase 8: Accessibility and Inclusive Design

Minimum standard: WCAG 2.2 AA unless user requests stricter.

Check:

- Semantic structure and headings.
- Keyboard navigation and focus order.
- Visible focus indicators.
- Color contrast.
- Text resizing/reflow.
- Touch target sizes.
- Form labels and error messages.
- ARIA only when semantic HTML is insufficient.
- Screen reader names/roles/states.
- Reduced motion.
- Language and reading level.
- Non-color indicators.

Deliverable: accessibility checklist and fixes.

### Phase 9: Content Design and Microcopy

For every screen, consider:

- Clear H1 that matches user intent.
- CTA labels that say what happens next.
- Helpful empty states.
- Recovery-focused error messages.
- Field labels and helper text.
- Confirmation copy.
- Tooltip necessity; avoid hiding critical information in tooltips.
- Tone consistency.

Copy principles:

- Be specific, human, and action-oriented.
- Avoid blame: "We couldn't save changes" instead of "Invalid input".
- Put the fix in the message.
- Use verbs for actions.

Deliverable: suggested copy blocks.

### Phase 10: Prototype and Handoff

Produce implementation-ready handoff:

- Screen list.
- Component inventory.
- Token values.
- Layout specs.
- Responsive rules.
- State matrix.
- Accessibility notes.
- Data requirements.
- Analytics events.
- QA checklist.
- Out-of-scope items.

Deliverable: handoff spec developers can implement without guessing.

### Phase 11: Measurement and Quality Gates

Before final handoff, load `references/ux-measurement-quality-gates.md` and define measurable acceptance criteria.

Include where applicable:

- Task success metric.
- Error-rate or support-contact reduction target.
- Funnel/conversion event names.
- Accessibility gate: WCAG 2.2 AA plus keyboard and screen-reader smoke checks.
- Responsive and platform acceptance criteria.
- Performance perception/Core Web Vitals expectations for web.
- Usability validation method: heuristic review, cognitive walkthrough, or user test.

Deliverable: quality gate checklist and validation plan.

### Phase 12: Ethics, Privacy, Inclusion, and Localization

For any flow involving personal data, money, health, identity, children, AI, permissions, cancellation, ads, subscriptions, or persuasive design, load `references/ethical-inclusive-design.md`. For content-heavy or multi-locale products, load `references/content-design-and-i18n.md`.

Check:

- No dark patterns or manipulative consent.
- Sensitive permissions are explained at the moment of need.
- Users can cancel, undo, delete, export, or recover when appropriate.
- Content is plain, inclusive, and localizable.
- RTL, text expansion, dates, numbers, names, addresses, and currency are handled where relevant.

Deliverable: ethics/privacy/i18n risk notes and fixes.

## Design Specialties Covered

### Product UX

Use for product structure, onboarding, activation, dashboards, retention loops, notification strategy, settings, permissions, collaboration, lifecycle emails, and feature discovery.

Key questions:

- What is the user's first successful moment?
- What must they understand before they can act?
- What can be deferred until later?
- What feedback confirms progress?
- What state makes users trust the system?

### SaaS and Dashboard UX

Must include:

- Role-based navigation.
- Overview with clear hierarchy: key metrics, alerts, recent activity, next actions.
- Data table behavior: sorting, filtering, search, bulk actions, column management, pagination, empty/error/loading states.
- Chart clarity: title, timeframe, units, legends, annotations, comparison, no misleading axes.
- Drill-down paths.
- Export/share behavior.
- Chart selection, axis integrity, units, freshness, uncertainty, annotations, and color-accessible legends.
- Data-grid keyboard behavior, density controls, saved filters, and stale/partial data states.
- Use `references/data-visualization-dashboard-ux.md` for analytics-heavy screens.

### Landing Page and Conversion UX

Must include:

- One clear promise above the fold.
- Primary CTA repeated at logical points.
- Social proof near claims.
- Objection handling.
- Feature-to-benefit translation.
- Pricing clarity if applicable.
- Trust signals.
- FAQ for high-friction questions.
- Performance and mobile-first layout.

### Ecommerce UX

Must include:

- Product discovery: categories, search, filters, sort.
- Product detail: imagery, price, variants, availability, delivery, returns, reviews, trust.
- Cart: editable quantities, transparent costs, saved state.
- Checkout: guest checkout, progress, validation, payment trust, error recovery.
- Post-purchase confirmation and tracking.

### Forms UX

Must include:

- Ask only necessary fields.
- Group fields logically.
- Label every field.
- Use inline validation after user input, not before.
- Preserve entered data on errors.
- Explain why sensitive data is needed.
- Provide input masks/examples for formatted data.
- Make submit state and errors obvious.

### Mobile and Platform-Specific UX

Load `references/platform-guidelines.md` for web, iOS, Android/Material, Windows/desktop, kiosk, email, TV, or other platform-specific conventions.

Must include:

- Thumb-friendly primary actions.
- 44x44 px minimum touch targets.
- Avoid hover-only interactions.
- Handle keyboard viewport changes.
- Reduce dense tables into cards or priority columns.
- Use native patterns where appropriate.
- Offline/poor network states if relevant.

### Design Systems

Must include:

- Foundations: color, typography, spacing, radius, elevation, iconography, motion.
- Components: buttons, inputs, selects, checkboxes, radios, switches, tabs, modals, drawers, cards, tables, alerts, toasts, tooltips, navigation, breadcrumbs, pagination.
- Component anatomy.
- Variants and sizes.
- State matrix.
- Accessibility rules.
- Usage guidelines and anti-patterns.
- Token naming and semantic roles.

### Top-Brand Frontend Method

When the user asks for a frontend that looks polished, premium, world-class, or similar to top brands, use `references/top-100-brand-website-analysis.md` before designing. Then load the dedicated skill file for the selected method.

Process:

1. Identify the product category and user task.
2. Pick one primary method and one or two supporting methods. Load the corresponding brand-method skill file for full layout, color, typography, spacing, motion, accessibility, and component specs:
   - **Product Cinema** → `references/brand-method-product-cinema.md` — premium products, hardware, automotive, luxury.
   - **Utility Command Center** → `references/brand-method-utility-command-center.md` — ecommerce, logistics, booking, dashboards.
   - **Editorial Brand World** → `references/brand-method-editorial-brand-world.md` — fashion, sports, beverage, entertainment.
   - **Enterprise Trust Hub** → `references/brand-method-enterprise-trust-hub.md` — B2B SaaS, finance, healthcare, industrial.
   - **Card-Based Discovery** → `references/brand-method-card-based-discovery.md` — marketplaces, media, travel, catalogs.
   - **Conversion Simplicity** → `references/brand-method-conversion-simplicity.md` — signup, trial, subscription, fintech flows.
   - **Ecosystem Bundling** → `references/brand-method-ecosystem-bundling.md` — multi-product suites, plan comparison.
   - **Premium Restraint** → `references/brand-method-premium-restraint.md` — ultra-luxury, high-end finance, premium services.
   - **Playful Familiarity** → `references/brand-method-playful-familiarity.md` — food, toys, family, consumer brands.
   - **Technical Authority** → `references/brand-method-technical-authority.md` — AI, developer tools, semiconductors, infra.
3. Apply color psychology: load `references/color-psychology-branding.md` to validate and prescribe the palette for the business type and emotional goal. Output the full palette before any visual design.
4. Translate the selected methods into original tokens, layout rules, components, states, and copy.
5. Never copy a brand exactly unless the user owns that brand. Avoid logos, proprietary images, exact trademark color combinations, and pixel-for-pixel layouts.
6. Preserve accessibility and usability even when using cinematic, luxury, or experimental layouts.

Deliverable additions:

- Brand method selected (with rationale).
- Color psychology palette (business type, emotional goal, full hex palette, contrast ratios).
- Brand-inspiration blend.
- Layout archetype.
- Token direction.
- Component behavior.
- Accessibility safeguards.
- Anti-copy/IP safety note.

### Color Psychology and Branding

When a user describes a product, business type, UI feel, or audience, load `references/color-psychology-branding.md` before prescribing any colors.

Process:

1. Identify: business category, emotional goal (trust/energy/calm/luxury/health/play/authority/innovation), positioning (mass/premium/luxury).
2. Look up the industry prescription and sentiment mapping in the reference file.
3. Output the complete palette: primary, secondary, accent/CTA, background, surface, text primary, text secondary, border, semantic success/warning/error/info, and dark mode variant if needed.
4. State the psychological rationale for each choice.
5. Warn of anti-patterns for this category.
6. Verify all text-on-background combinations against WCAG 2.2 AA (4.5:1 body, 3:1 large text/UI).
7. Include this palette in the `.ui-ux-memory.md` and all handoff specs.

### Frontend Implementation UX

When implementing UI, first load and follow `references/ui-ux-frontend-implementation-rules.md`. Treat it as the non-negotiable frontend implementation checklist.

Before coding, check project dependencies first. Do not assume Tailwind, shadcn, Material UI, Radix, Framer Motion, Bootstrap, or any other library exists. Use existing component conventions whenever possible.

Implementation rules:

- Inspect existing stack, components, routes, styles, tokens, and similar screens before editing.
- Reuse existing components before creating new ones.
- Preserve routing, state management, data fetching, and styling conventions.
- Use semantic HTML.
- Avoid hardcoded magic values when a token system exists.
- Build all states, not only the happy path.
- Implement loading, empty, error, success, disabled, permission, hover, focus, active, and responsive states.
- Test keyboard, focus, screen-reader names, contrast, mobile layout, console errors, and build/lint checks when available.
- Do not mark frontend work complete until the QA checklist in `references/ui-ux-frontend-implementation-rules.md` passes or any remaining gaps are explicitly reported.

## UI/UX Audit Framework

When auditing an existing UI, load `references/usability-heuristics.md`, score each area 1-5, map findings to heuristics where useful, and provide fixes:

1. Clarity: Can users immediately understand what this is and what to do?
2. Hierarchy: Is the most important content/action visually dominant?
3. Flow: Is the task path short, predictable, and recoverable?
4. Content: Is copy specific, useful, and human?
5. Accessibility: Does it meet WCAG AA basics?
6. Consistency: Are components, spacing, terminology, and states consistent?
7. Responsiveness: Does it work well across viewport sizes?
8. Feedback: Are loading, success, error, empty, and disabled states clear?
9. Trust: Are claims, permissions, costs, risks, and system status transparent?
10. Performance perception: Does the UI feel fast and stable?
11. Conversion/task success: Does it reduce friction toward the main goal?
12. Implementation readiness: Can developers build it from the spec?
13. Platform fit: Does it follow platform-native conventions?
14. Internationalization/content resilience: Will copy, layout, and formats survive localization?
15. Ethics/privacy: Does it avoid dark patterns and explain data/permission use?
16. Measurement: Are quality gates and success metrics explicit?

Output format:

- Executive summary.
- Severity-ranked findings.
- Quick wins.
- Detailed recommendations.
- Accessibility fixes.
- Revised screen structure or copy.
- QA checklist.

## Screen State Checklist

Every meaningful screen/component should define:

- Default.
- Loading.
- Skeleton if loading > 500ms.
- Empty.
- Error.
- Partial data.
- Permission denied.
- Offline/network failure if relevant.
- Disabled.
- Hover.
- Focus.
- Active/pressed.
- Selected/current.
- Validation success/error/warning.
- Success confirmation.
- Undo/recovery.

## Responsive Breakpoints Guidance

Use the project's existing breakpoints if present. If none exist, use:

- Small mobile: 320-374 px.
- Mobile: 375-767 px.
- Tablet: 768-1023 px.
- Desktop: 1024-1439 px.
- Wide: 1440+ px.

Responsive decisions:

- What reflows?
- What collapses?
- What becomes a drawer?
- What becomes horizontally scrollable only if unavoidable?
- What content is prioritized or hidden?
- How do sticky/fixed elements behave?

## Design Token Starter Set

Use semantic tokens, not raw color names in component specs.

Color roles:

- background, surface, surface-raised, surface-muted.
- text-primary, text-secondary, text-muted, text-inverse.
- border, border-strong, focus-ring.
- primary, primary-hover, primary-active, primary-contrast.
- secondary, secondary-hover, secondary-contrast.
- success, warning, danger, info and their background/border/text roles.

Typography roles:

- display, h1, h2, h3, body, body-sm, caption, label, code.

Spacing scale:

- 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.

Radius:

- none, sm, md, lg, xl, full.

Elevation:

- none, sm, md, lg, overlay.

Motion:

- fast 120ms, base 180ms, slow 240ms.
- easing: standard, enter, exit.

## Handoff Output Template

When asked to produce a final UI/UX spec, use this structure:

1. Goal and assumptions.
2. Users and jobs-to-be-done.
3. UX strategy.
4. Information architecture.
5. Key flows.
6. Screen-by-screen specification.
7. Components and states.
8. Visual direction, top-brand method blend, and tokens.
9. Content and microcopy.
10. Accessibility requirements.
11. Responsive behavior.
12. Analytics events.
13. Developer implementation notes.
14. QA/testing checklist.
15. Open questions and risks.
16. Anti-copy/IP safety notes when inspired by real brands.
17. UI/UX memory status: read, created, updated, or unavailable.
18. Durable design decisions added to memory.

## Quality Bar

A UI/UX answer is complete only when it handles:

- User goal.
- Business goal.
- Main flow.
- Edge cases.
- Error/loading/empty states.
- Accessibility.
- Responsiveness.
- Content/microcopy.
- Visual consistency.
- Implementation feasibility.
- Verification.

## Common Pitfalls

1. Starting with colors before solving the flow.
2. Designing only the happy path.
3. Ignoring empty, error, loading, and permission states.
4. Hiding critical actions behind icons without labels.
5. Using low-contrast text or color-only status indicators.
6. Creating new components when the project already has a component system.
7. Writing generic copy that does not tell users what happened or what to do next.
8. Overloading dashboards with metrics but no next action.
9. Making desktop-first layouts that collapse poorly on mobile.
10. Treating accessibility as a final pass instead of a design constraint.
11. Forgetting keyboard users.
12. Overusing modals, carousels, hover-only controls, and vague tooltips.
13. Shipping a mockup without developer-ready states and specs.
14. Choosing trendy visuals that conflict with the product's trust needs.
15. Confusing user personas with stereotypes; focus on tasks, context, and constraints.

## Verification Checklist

Before finalizing UI/UX work, verify:

- [ ] The primary user goal is explicit.
- [ ] Existing UI/UX memory was checked or created for the application.
- [ ] Existing branding, colors, fonts, tokens, and components were inspected before new design decisions.
- [ ] Research evidence, assumptions, and confidence level are documented.
- [ ] Platform-specific conventions are followed.
- [ ] Content design, i18n/localization, and translation risks are considered.
- [ ] Ethical, privacy, dark-pattern, and inclusive-design risks are checked.
- [ ] Measurement and quality gates are defined.
- [ ] The main CTA and next action are obvious.
- [ ] Screen hierarchy supports the main task.
- [ ] Navigation labels match user language.
- [ ] Every interactive element has states.
- [ ] Loading, empty, error, and success states are specified.
- [ ] Forms have labels, validation, helper text, and recovery behavior.
- [ ] Color contrast and focus states meet WCAG AA.
- [ ] Layout works at mobile, tablet, desktop, and wide sizes.
- [ ] Copy is specific, concise, and action-oriented.
- [ ] Components reuse or extend the existing design system.
- [ ] `references/ui-ux-frontend-implementation-rules.md` has been followed for frontend implementation.
- [ ] If top-brand inspiration is used, the output blends methods instead of copying a brand exactly.
- [ ] Developer handoff includes tokens, states, data needs, and QA steps.
- [ ] Risks, assumptions, and open questions are documented.

## Supporting Files

Use the supporting files in this skill folder when useful:

- `README.md` — installation, usage, validation, maintenance, and deployment-readiness instructions.

- `references/ui-ux-complete-checklist.md` — exhaustive checklist across UX, UI, content, accessibility, states, responsiveness, and handoff.
- `references/ui-ux-memory-workflow.md` — dynamic project memory workflow for preserving brand consistency across the application.
- `references/ui-ux-frontend-implementation-rules.md` — mandatory frontend implementation rules so agents do not miss stack inspection, states, accessibility, responsiveness, tokens, QA, or handoff.
- `references/wcag-aa-quick-reference.md` — practical WCAG 2.2 AA reference for agents.
- `references/design-system-playbook.md` — how to create or extend a design system.
- `references/ui-styles-catalog.md` — 20+ named UI styles (Glassmorphism, Liquid Glass, Data Brutalism, Aurora Borealis, AI-Native UI, Spatial UI, Cyberpunk, Claymorphism, Bento Grid, Soft UI Evolution, and more) with token overrides, required effects, forbidden patterns, and a style selection decision tree.
- `references/color-scale-system.md` — 11-step (50–950) OKLch architectural color scales for all brand hue families and semantic states. Semantic role-to-step mapping and dark mode overrides. Full px+rem typography scale.
- `references/industry-reasoning-rules.md` — one-step reasoning engine: input a product description, output a complete Design System Block (pattern, style, colors, typography, effects, anti-patterns, pre-delivery checklist) for 15+ industry categories.
- `references/tech-stack-guidelines.md` — stack-specific component patterns, rules, and common AI mistakes for 16 frameworks: React, Next.js, Vue, Nuxt, Angular, Svelte, Astro, Remix, SolidJS, React Native, Flutter, SwiftUI, shadcn/ui, Jetpack Compose, Laravel, HTML+Tailwind.
- `references/landing-page-patterns.md` — 12 named conversion patterns (Hero-Centric, Problem-Solution, Product Demo First, Comparison, etc.) with section-by-section structure. Plus 25-type chart selection guide with dashboard layout rules and data visualization anti-patterns.
- `references/design-discovery-protocol.md` — 6-question discovery form, brand extraction 5-step protocol, junior designer warm-up, and discovery checklist. Load at the start of every new design task.
- `references/output-quality-gates.md` — 5-dimensional self-critique (philosophy/hierarchy/execution/specificity/restraint), P0/P1/P2 hard gates, anti-AI-slop blacklist, and honest placeholder protocol. Run before every design emit.
- `references/visual-directions.md` — 5 fully-specified OKLch token directions (Neutral Modern, Dark Technical, Warm Editorial, Bold Energetic, Calm Trust) for projects with no brand. Each direction includes complete CSS token block ready to bind.
- `references/design-system-schema.md` — portable 9-section design system schema (color, typography, spacing, layout, components, motion, voice, brand, anti-patterns). Use as the template for all `.ui-ux-memory.md` files.
- `references/top-100-brand-website-analysis.md` — top global brand website patterns and reusable frontend methods.
- `references/brand-method-product-cinema.md` — full layout, color, typography, spacing, motion, accessibility, and component spec for the Product Cinema design method.
- `references/brand-method-utility-command-center.md` — full spec for the Utility Command Center design method.
- `references/brand-method-editorial-brand-world.md` — full spec for the Editorial Brand World design method.
- `references/brand-method-enterprise-trust-hub.md` — full spec for the Enterprise Trust Hub design method.
- `references/brand-method-card-based-discovery.md` — full spec for the Card-Based Discovery design method.
- `references/brand-method-conversion-simplicity.md` — full spec for the Conversion Simplicity design method.
- `references/brand-method-ecosystem-bundling.md` — full spec for the Ecosystem Bundling design method.
- `references/brand-method-premium-restraint.md` — full spec for the Premium Restraint design method.
- `references/brand-method-playful-familiarity.md` — full spec for the Playful Familiarity design method.
- `references/brand-method-technical-authority.md` — full spec for the Technical Authority design method.
- `references/color-psychology-branding.md` — color psychology, industry palette prescriptions, sentiment-to-palette mapping, contrast verification, and dark mode adaptation rules.
- `references/ux-research-methods.md` — research planning, method selection, evidence confidence, and ethical research rules.
- `references/usability-heuristics.md` — heuristic review, cognitive rules, and severity scoring.
- `references/platform-guidelines.md` — web, iOS, Android/Material, Windows, desktop, kiosk, email, TV, and cross-platform rules.
- `references/content-design-and-i18n.md` — UX writing, microcopy, localization, RTL, and content handoff.
- `references/ux-measurement-quality-gates.md` — task success metrics, UX measurement, accessibility gates, and definition of done.
- `references/ethical-inclusive-design.md` — dark-pattern avoidance, privacy UX, inclusive design, high-risk and AI interface rules.
- `references/service-design-journey-mapping.md` — journey maps, service blueprints, support handoff, and omnichannel checks.
- `references/data-visualization-dashboard-ux.md` — dashboard, table, chart, data-grid, and alerting UX rules.
- `references/accessibility-advanced-patterns.md` — complex widget accessibility and screen-reader test matrix.
- `references/ui-ux-curriculum-and-standards.md` — basic-to-advanced UI/UX curriculum and standards map.
- `references/competitive-landscape.md` — competitor gaps and strategy for staying ahead.
- `docs/slash-command-compatibility.md` — cross-agent `/uxcraft` trigger compatibility.
- `docs/mcp-server.md` — MCP tools, resources, prompts, client configs, and smoke testing.
- `llms.txt` — AI-readable package map for discovery by agents and indexing tools.
- `ai-discovery/uxcraft.manifest.json` — machine-readable manifest for activation, entrypoints, MCP, and capabilities.
- `system-prompts/uxcraft-system-add-on.md` — full system prompt add-on.
- `system-prompts/uxcraft-compact.md` — compact system prompt add-on.
- `system-prompts/uxcraft-mcp-add-on.md` — MCP-focused system prompt add-on.
- `agent-templates/` — Claude, Codex, Windsurf, Antigravity, Gemini, Cursor, and universal installer templates.
- `bin/uxcraft.mjs` — npm CLI installer.
- `bin/uxcraft-mcp.mjs` — local read-only MCP server.
- `templates/ui-ux-brief.md` — intake and requirements template.
- `templates/ui-ux-memory.md` — project UI/UX memory file template to copy into an application root as `.ui-ux-memory.md`.
- `templates/ui-ux-audit-report.md` — audit output template.
- `templates/component-spec.md` — component handoff template.
- `templates/design-system-spec.md` — design system template.
- `templates/top-brand-frontend-spec.md` — frontend spec template for top-brand-inspired UI.
- `scripts/validate_skill.py` — local validation for this skill package.
