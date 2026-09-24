# Advanced Accessibility Patterns

Use this reference when designing or implementing complex interactive components beyond simple links, buttons, and forms.

## Core Rule

Use native HTML first. Add ARIA only when native semantics cannot express the pattern. Bad ARIA is worse than no ARIA.

## Complex Widget Checklist

- Dialog/modal: focus moves in, is trapped, Escape closes if safe, focus returns to opener.
- Tabs: arrow-key navigation, selected state, panel association.
- Accordion: button semantics, expanded state, heading structure.
- Menu: correct role only for application menus, keyboard support, Escape, typeahead if useful.
- Combobox/autocomplete: label, active descendant or focus strategy, listbox relationship, keyboard behavior.
- Tooltip: not required to complete task, available on focus and hover.
- Toast/live region: polite/assertive only as appropriate, not focus stealing.
- Data grid: row/column headers, keyboard model, sort state, accessible names.
- Drag and drop: provide keyboard and non-drag alternative.

## WCAG 2.2 Criteria to Remember

- Focus Appearance.
- Dragging Movements.
- Target Size.
- Consistent Help.
- Accessible Authentication.
- Redundant Entry.

## Testing Matrix

At minimum test:

- Keyboard only.
- Browser zoom 200%.
- Reduced motion.
- High contrast/forced colors where relevant.
- Screen reader smoke test: NVDA/JAWS on Windows, VoiceOver on Apple, TalkBack on Android as applicable.
- Touch target size and orientation changes on mobile.

## Accessible Handoff

For each complex component specify role/semantic element, name, state, keyboard interaction, focus behavior, announcements, and fallback behavior.
