# Design System Playbook

Use this when creating, extending, or auditing a design system.

## Purpose

A design system should make good UI easier to build consistently. It is not only a component library. It includes foundations, tokens, components, patterns, content rules, accessibility rules, and governance.

## Foundations

### Color

Define semantic roles:

- Background: default, muted, inverse.
- Surface: default, raised, overlay, selected.
- Text: primary, secondary, muted, inverse, disabled.
- Border: default, strong, subtle, focus.
- Action: primary, secondary, tertiary, danger.
- Status: success, warning, danger, info.

Avoid naming tokens by appearance only, such as blue-500, in component specs. Use semantic tokens, with raw palette values beneath.

### Typography

Define:

- Font families.
- Type scale.
- Line heights.
- Weights.
- Letter spacing if needed.
- Usage roles: display, h1, h2, h3, body, body-sm, caption, label, code.

### Spacing

Use a predictable scale:

0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.

Define component spacing and page layout spacing separately when needed.

### Shape and Elevation

Define radius roles:

- none, sm, md, lg, xl, full.

Define elevation roles:

- none, sm, md, lg, overlay.

Use elevation sparingly and consistently.

### Motion

Define:

- fast: 120ms.
- base: 180ms.
- slow: 240ms.
- standard easing.
- enter easing.
- exit easing.
- reduced motion alternatives.

## Component Specification Requirements

For every component, document:

- Purpose.
- Anatomy.
- Variants.
- Sizes.
- States.
- Props/API if implementing.
- Accessibility requirements.
- Keyboard behavior.
- Responsive behavior.
- Content guidelines.
- Usage examples.
- Anti-patterns.

## Minimum Component Set

- Button.
- Link.
- Text input.
- Textarea.
- Select/combobox.
- Checkbox.
- Radio.
- Switch.
- Slider if needed.
- Date/time input if needed.
- Form field wrapper.
- Alert/banner.
- Toast.
- Badge/tag.
- Tooltip.
- Popover.
- Modal/dialog.
- Drawer/sheet.
- Tabs.
- Accordion/disclosure.
- Card.
- Table/data grid.
- Pagination.
- Breadcrumbs.
- Navigation/sidebar/topbar.
- Menu/dropdown.
- Avatar.
- Progress/skeleton/spinner.
- Empty state.

## Governance

- Prefer extending existing components before creating new ones.
- New components require a documented need and usage examples.
- Deprecated patterns should have migration instructions.
- Accessibility is part of definition of done.
- Keep tokens stable; introduce semantic aliases before broad renaming.

## Design System Audit Questions

- Are tokens semantic and consistently used?
- Are components accessible by default?
- Are states complete?
- Are variants meaningful or excessive?
- Are docs written for designers and developers?
- Are examples realistic?
- Is there a contribution process?
- Are anti-patterns documented?
