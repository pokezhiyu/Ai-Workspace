# WCAG 2.2 AA Quick Reference for Agents

This is a practical accessibility reference for UI/UX work. Treat WCAG 2.2 AA as the default minimum unless the user specifies another standard.

## Core Principles

1. Perceivable: users can perceive content.
2. Operable: users can operate controls.
3. Understandable: users can understand interface and content.
4. Robust: content works with assistive technology.

## Contrast

- Normal text: at least 4.5:1.
- Large text: at least 3:1.
- UI components and graphical objects: at least 3:1.
- Do not use color as the only way to communicate status.

## Keyboard

- All interactive controls must be reachable by keyboard.
- Focus order must follow the visual/task order.
- Focus indicator must be visible and high contrast.
- No keyboard trap unless there is an obvious escape method.
- Modals must trap focus while open and return focus when closed.

## Semantic Structure

- Use real buttons for actions and links for navigation.
- Use headings in logical order.
- Use lists, tables, labels, fieldsets, and landmarks semantically.
- Use ARIA only when native HTML cannot express the behavior.
- If ARIA is used, names, roles, values, and states must be correct.

## Forms

- Every input needs a programmatically associated label.
- Required fields must be clear.
- Error messages must identify the field and explain the fix.
- Do not rely only on placeholder text.
- Use autocomplete attributes when helpful.
- Use fieldsets/legends for grouped radio/checkbox inputs.

## Motion and Timing

- Respect prefers-reduced-motion.
- Avoid flashing content.
- Give users control over time limits where relevant.
- Animation should support orientation, feedback, or continuity, not distract.

## Images and Media

- Informative images need alt text.
- Decorative images should be hidden from assistive technology.
- Icons used as buttons need accessible labels.
- Videos need captions; audio-only content needs transcript when relevant.

## Touch and Pointer

- Aim for 44x44 px touch targets.
- Do not require complex gestures without alternatives.
- Hover-only content must also work on focus/tap.

## Common Agent Fixes

- Add visible labels instead of placeholder-only fields.
- Replace clickable divs with buttons or links.
- Add focus states to custom components.
- Add aria-expanded and aria-controls to disclosure controls.
- Add aria-current to current nav item.
- Add aria-live polite for async success/status updates.
- Add role="alert" or associated error text for validation errors.
- Ensure disabled controls have explanation if their disabled reason is not obvious.

## Accessibility Acceptance Criteria

For final handoff, include:

- Keyboard path for all major tasks.
- Focus behavior for modals, drawers, menus, popovers.
- Contrast requirement for text and UI elements.
- Screen reader labels for icon-only controls.
- Error association for forms.
- Reduced-motion behavior.
- Touch target requirements.
