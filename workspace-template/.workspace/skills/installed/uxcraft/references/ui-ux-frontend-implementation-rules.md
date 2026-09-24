# UI/UX Frontend Implementation Rules

Use these rules every time an agent creates, edits, reviews, or ships frontend using `ui-ux-master`. This file is the implementation guardrail so frontend work does not miss UX, UI, accessibility, responsiveness, states, branding, or handoff requirements.

## Non-Negotiable Rule

No frontend is complete until it handles:

- User goal and business goal.
- Primary flow and secondary flow.
- Layout, hierarchy, and responsive structure.
- Brand/style direction and design tokens.
- Components and all interactive states.
- Loading, empty, error, success, disabled, and permission states.
- Accessibility and keyboard behavior.
- Content/microcopy.
- Data requirements and validation.
- QA verification.

If any item is missing, the implementation is incomplete.

## Required Implementation Order

### 1. Inspect Before Building

Before writing UI code:

- Check for an application UI/UX memory file first: `.ui-ux-memory.md`, `docs/ui-ux-memory.md`, `docs/design/ui-ux-memory.md`, or `design/ui-ux-memory.md`.
- If memory exists, read it and follow it as the source of truth for brand and UI consistency.
- If no memory exists, inspect existing branding and create `.ui-ux-memory.md` using `templates/ui-ux-memory.md` before or alongside the first durable UI change.
- Check the project stack and dependencies.
- Check existing component library or design system.
- Check routing, layout, state management, and styling conventions.
- Check existing colors, typography, spacing, and components.
- Check similar pages/components before creating new ones.

Do not assume Tailwind, Bootstrap, shadcn, Radix, MUI, Framer Motion, icons, fonts, or chart libraries exist. Verify first.

### 2. Define the UX Contract

If this is a fresh project with no existing memory or branding, ask minimal high-value questions first: what is being built, who it is for, primary success action, desired personality, colors/fonts/references to use or avoid, and platform/type. If the user does not answer, proceed with explicit assumptions and save them in `.ui-ux-memory.md`.

Before coding a screen, write or infer:

- Screen purpose.
- Primary user.
- Primary task.
- Primary CTA.
- Secondary actions.
- Entry point.
- Success outcome.
- Failure/recovery path.
- Required data.
- Permissions/roles if applicable.

### 3. Choose the Design Method

Use `references/top-100-brand-website-analysis.md` and choose one primary method plus up to two supporting methods:

- Product Cinema.
- Utility Command Center.
- Editorial Brand World.
- Enterprise Trust Hub.
- Card-Based Discovery.
- Conversion Simplicity.
- Ecosystem Bundling.
- Premium Restraint.
- Playful Familiarity.
- Technical Authority.

Never copy a brand exactly. Extract methods, not trademarks.

### 4. Create or Reuse Tokens

Use tokens instead of scattered hardcoded values.

Required token groups:

- Color: background, surface, text, border, primary, secondary, success, warning, danger, info, focus.
- Typography: display, h1, h2, h3, body, body-sm, label, caption, code.
- Spacing: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.
- Radius: none, sm, md, lg, xl, full.
- Elevation: none, sm, md, lg, overlay.
- Motion: fast, base, slow, easing.
- Breakpoints: mobile, tablet, desktop, wide.

Use existing project tokens if present. Extend them only when needed.

### 5. Build Layout First

Every page must define:

- Header/navigation.
- Main content region.
- Sidebar/panel if needed.
- Primary action region.
- Secondary/supporting content.
- Footer or persistent actions if needed.
- Responsive behavior for each region.

Layout rules:

- One clear primary action per screen.
- Most important content appears first in reading and tab order.
- Use spacing to group related content.
- Use consistent max-widths and grid rhythm.
- Avoid horizontal scrolling except intentional data tables.
- Do not hide critical actions below unclear menus.

### 6. Build Components with Complete States

Every interactive component must include:

- Default.
- Hover.
- Focus-visible.
- Active/pressed.
- Selected/current.
- Disabled.
- Loading.
- Error.
- Success if applicable.

Every screen must include:

- Loading state.
- Empty state.
- Error state.
- Success/confirmation state.
- Permission denied state if roles/auth exist.
- Offline/network failure state if network dependent.
- Partial data state if data can be incomplete.

### 7. Accessibility Is Part of the Build

Minimum: WCAG 2.2 AA.

Required:

- Use semantic HTML first.
- Buttons are buttons; navigation links are links.
- Every input has a visible label.
- Error text is associated with the field.
- Keyboard can reach and operate every control.
- Focus order matches visual/task order.
- Focus-visible styles are obvious.
- Text contrast meets AA.
- UI control contrast meets AA where applicable.
- Do not rely on color alone.
- Icon-only controls have accessible names.
- Modals/drawers trap focus and restore focus on close.
- Menus/popovers support keyboard and Escape.
- Motion respects reduced-motion preferences.
- Images have useful alt text or are marked decorative.
- Touch targets are ideally 44x44 px.

### 8. Responsive Rules

Design mobile, tablet, desktop, and wide behavior.

Check:

- 320px minimum width.
- 375px mobile.
- 768px tablet.
- 1024px desktop.
- 1440px wide.

Required decisions:

- What stacks?
- What becomes a drawer?
- What becomes cards instead of tables?
- What remains sticky?
- What content is hidden, collapsed, or prioritized?
- How does the keyboard affect mobile forms?

Do not simply shrink desktop UI.

### 9. Forms and Validation Rules

Forms must include:

- Visible labels.
- Required/optional clarity.
- Helper text where useful.
- Correct input types and autocomplete.
- Inline validation after user interaction.
- Clear error messages that explain how to fix the issue.
- Submit loading state.
- Disabled state with reason when not obvious.
- Data preservation after errors.
- Success confirmation.

Avoid:

- Placeholder-only labels.
- Validation before the user interacts.
- Generic messages like `Invalid input`.
- Clearing user input on failure.

### 10. Content and Microcopy Rules

Every screen needs:

- Clear H1 matching the user's task.
- CTA labels that describe the next action.
- Helpful empty state with next action.
- Recovery-focused error copy.
- Success copy that confirms what happened.
- Destructive action copy that explains consequences.

Copy must be specific, concise, human, and action-oriented.

### 11. Branding and Visual Quality Rules

Use selected brand method to define:

- Personality.
- Color strategy.
- Typography feel.
- Layout rhythm.
- Imagery/icon style.
- Motion style.
- Density.

Quality rules:

- Use one dominant visual idea per screen.
- Limit accents; reserve strong color for action or meaning.
- Use consistent spacing and alignment.
- Match visual density to product type.
- Avoid random gradients, shadows, glassmorphism, and animations unless they support the chosen method.
- Do not use top-brand inspiration to copy protected assets or exact identity.

### 12. Data and API UX Rules

For every data-driven screen, define:

- Loading behavior.
- Empty response behavior.
- Error response behavior.
- Partial data behavior.
- Pagination/infinite scroll behavior.
- Refresh behavior.
- Optimistic update or confirmation behavior.
- Permission/authorization behavior.
- Validation errors from backend.

Never show raw backend errors to users. Translate them into helpful recovery copy.

### 13. Navigation and IA Rules

Navigation must:

- Match user vocabulary.
- Show current location.
- Keep common tasks close.
- Separate primary, secondary, and utility navigation.
- Support keyboard and mobile.
- Avoid hiding frequent tasks in overflow menus.

For large products, route by user intent: role, task, industry, product category, or lifecycle stage.

### 14. Performance Perception Rules

Frontend should feel fast even when data is slow.

Required:

- Show immediate feedback after actions.
- Use skeletons for structured content loads over 500ms.
- Avoid layout shift.
- Lazy-load non-critical media.
- Keep hero media optimized.
- Avoid blocking UI with unnecessary modals.
- Use optimistic UI only when rollback is safe.

### 15. Security, Trust, and Ethics Rules

Include trust cues when users face risk:

- Price/cost clarity.
- Privacy/data usage explanation.
- Permission explanation.
- Secure payment/account cues.
- Confirmation before destructive actions.
- Undo when possible.
- Clear distinction between human and AI-generated content if relevant.

Avoid dark patterns:

- Hidden costs.
- Forced continuity.
- Confirm-shaming.
- Fake scarcity.
- Obstructive cancellation.
- Misleading defaults.

### 16. Frontend QA Checklist

Before marking implementation complete, verify:

- [ ] Primary flow works end-to-end.
- [ ] Secondary flow works.
- [ ] Loading state appears.
- [ ] Empty state appears.
- [ ] Error state appears and has recovery copy.
- [ ] Success state appears.
- [ ] Disabled state is understandable.
- [ ] Keyboard-only usage works.
- [ ] Focus states are visible.
- [ ] Screen reader names are meaningful for icon controls.
- [ ] Forms have labels and associated errors.
- [ ] Color contrast meets WCAG AA.
- [ ] Layout works at 320, 375, 768, 1024, and 1440 px.
- [ ] No critical action is hover-only.
- [ ] Mobile nav works.
- [ ] Tables/lists are usable on mobile.
- [ ] Motion respects reduced-motion.
- [ ] Copy is specific and human.
- [ ] Component styling is consistent with tokens.
- [ ] No console errors.
- [ ] No broken images or missing assets.
- [ ] No copied protected logos/assets unless owned by the user.

### 17. Implementation Handoff Checklist

When handing off or summarizing frontend work, include:

- Files changed.
- Components created/modified.
- Tokens added/used.
- UX method selected.
- States implemented.
- Accessibility measures.
- Responsive behavior.
- Known limitations.
- Test/QA commands run.
- Screenshots or visual verification if available.

## Agent Stop Condition

Do not stop at "implemented the UI" if verification has not happened. Run available checks, inspect the result, and fix issues found. If browser or visual tools are available, visually verify the page. If tests/lint/build exist, run them. If no automated checks exist, perform the manual QA checklist and report what was verified.

## Advanced Deployment Checks

### Platform-Specific Implementation

- Follow the target platform conventions from `references/platform-guidelines.md`.
- Do not force desktop web patterns into mobile/native contexts.
- Implement Back, Escape, focus restoration, safe-area, zoom, and reduced-motion behavior where applicable.

### Internationalization Implementation

- Avoid hardcoded concatenated strings that cannot be translated.
- Allow text expansion and wrapping.
- Use locale-aware date, number, currency, phone, address, and name formatting where relevant.
- Test RTL or bidirectional layout when target locales require it.

### Privacy and Consent UI

- Do not preselect optional consent.
- Make destructive, paid, public, or data-sharing actions explicit.
- Provide clear recovery or cancellation paths where appropriate.

### Advanced Accessibility Widgets

- For dialogs, tabs, menus, comboboxes, data grids, toasts, drag/drop, and live updates, follow `references/accessibility-advanced-patterns.md`.
- Specify keyboard model, focus behavior, accessible name/state, and announcements.

### Measurable Frontend Quality Gates

- Build/lint/test command passes when available.
- Main task can be completed at 320px, 768px, 1024px, and 1440px.
- Keyboard-only path completes the main task.
- Console has no new runtime errors in the changed flow.
- Loading, empty, error, success, disabled, permission, and offline/partial states are handled when applicable.
