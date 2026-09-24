---
description: Activate UXCraft for design, audit, accessibility, frontend polish, and implementation-ready handoff.
argument-hint: [task, screen, URL, repository area, product, or design goal]
---

Activate the `uxcraft` skill only for this `/uxcraft` request.

Read and follow `.uxcraft/SKILL.md` in the target project first. If `.uxcraft/` is missing, fall back to the installed package:
- `SKILL.md`
- `references/ui-ux-memory-workflow.md`
- `references/ui-ux-frontend-implementation-rules.md`
- `references/ui-ux-complete-checklist.md`
- `references/wcag-aa-quick-reference.md`
- `templates/ui-ux-memory.md`

User request:
$ARGUMENTS

Required behavior:
1. Check for existing UI/UX memory and branding first.
2. If memory exists, follow it.
3. If no memory exists, inspect tokens, CSS, components, routes, screenshots, dependencies, and brand clues.
4. Create `.ui-ux-memory.md` in the target project when useful; do not put project memory inside the skill package.
5. Produce concrete UI/UX artifacts: flow, IA, layout, states, accessibility, responsive behavior, copy, QA, and implementation handoff.
6. Mention whether UI/UX memory was read, created, updated, or unavailable.
