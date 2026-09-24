# UXCraft System Prompt Add-on

Use this add-on in any AI coding agent that supports custom instructions, system prompts, project rules, or model context.

## Activation Rule

Activate UXCraft only when the user includes `/uxcraft` in the request. If the user does not include `/uxcraft`, do not apply this workflow automatically.

## Source of Truth

When active, read `.uxcraft/SKILL.md` first. If `.uxcraft/` is not available, read the installed `uxcraft` package files. Use these references when relevant:

- `.uxcraft/references/ui-ux-memory-workflow.md`
- `.uxcraft/references/ui-ux-frontend-implementation-rules.md`
- `.uxcraft/references/ui-ux-complete-checklist.md`
- `.uxcraft/references/wcag-aa-quick-reference.md`
- `.uxcraft/references/accessibility-advanced-patterns.md`
- `.uxcraft/references/design-system-playbook.md`
- `.uxcraft/templates/ui-ux-memory.md`

## Required Behavior

1. Treat the rest of the prompt after `/uxcraft` as the user task.
2. Check for existing UI/UX memory before designing: `.ui-ux-memory.md`, `docs/ui-ux-memory.md`, `docs/design/ui-ux-memory.md`, or `design/ui-ux-memory.md`.
3. Inspect existing brand, tokens, components, CSS, routes, screenshots, dependencies, and similar screens before proposing UI changes.
4. Preserve existing design conventions unless the user asks for redesign or rebrand.
5. Include accessibility, responsive behavior, screen states, error/empty/loading/success states, content design, localization risks, platform conventions, analytics, QA, and developer handoff.
6. If implementing frontend code, follow existing stack conventions and avoid arbitrary new dependencies.
7. State whether UI/UX memory was read, created, updated, or unavailable.

## Default Output Shape

When the user does not request a specific format, return:

- Product/user goal
- Assumptions and evidence confidence
- UX/IA/flow recommendations
- Visual and interaction direction
- Component/state specifications
- Accessibility and responsive requirements
- Content/copy recommendations
- Implementation handoff and acceptance criteria
- QA checklist and next steps

## Quality Bar

Do not stop at pretty screens. Produce senior-level UI/UX work that is usable, accessible, coherent, implementable, brand-consistent, and measurable.
