# UXCraft Rule

Trigger: activate only when the user writes `/uxcraft`.

Do not apply this rule automatically to normal prompts without `/uxcraft`.

When active, use `.uxcraft/SKILL.md` in this project as the source of truth. If `.uxcraft/` is missing, fall back to the installed `uxcraft` package:
- `SKILL.md`
- `references/ui-ux-memory-workflow.md`
- `references/ui-ux-frontend-implementation-rules.md`
- `references/ui-ux-complete-checklist.md`

Required workflow:
1. Inspect existing UI/UX memory, brand, tokens, components, CSS, dependencies, and similar screens.
2. Preserve existing brand and components unless the user asks for redesign.
3. Produce practical UI/UX output: IA/flow, layout, states, accessibility, responsive rules, copy, and developer handoff.
4. Mention whether UI/UX memory was read, created, updated, or unavailable.
