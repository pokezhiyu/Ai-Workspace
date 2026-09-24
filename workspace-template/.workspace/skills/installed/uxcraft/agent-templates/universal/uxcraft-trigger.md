# /uxcraft Trigger

When the user writes `/uxcraft`, activate the UXCraft skill. If the user does not include `/uxcraft`, do not apply this skill automatically.

Use UXCraft for UI design, UX strategy, audits, redesigns, frontend polish, accessibility, responsive behavior, design systems, content design, user flows, wireframes, prototypes, and engineering handoff.

Activation behavior:

1. Treat the rest of the user prompt as the task.
2. Read `.uxcraft/SKILL.md` from the target project. If `.uxcraft/` is missing, fall back to the installed `uxcraft` package.
3. Check for existing UI/UX memory first: `.ui-ux-memory.md`, `docs/ui-ux-memory.md`, `docs/design/ui-ux-memory.md`, or `design/ui-ux-memory.md`.
4. If memory exists, follow it as the source of truth.
5. If memory does not exist, inspect branding, tokens, CSS variables, components, fonts, layouts, screenshots, and dependencies before designing.
6. Preserve existing brand and component conventions unless the user asks for redesign/rebrand.
7. Always include accessibility, responsive behavior, loading/empty/error/success states, copy, platform conventions, and implementation handoff.
8. State whether UI/UX memory was read, created, updated, or unavailable.

Default output should be concrete and useful: design direction, IA/flow, layout, component states, accessibility, responsive behavior, copy, quality gates, and developer handoff.
