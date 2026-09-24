<!-- uxcraft:start -->
## UXCraft opt-in trigger

When the user writes `/uxcraft`, activate the UXCraft workflow from the installed `uxcraft` package. If the prompt does not include `/uxcraft`, do not use this workflow automatically.

Use it for UI/UX design, audits, redesigns, frontend polish, accessibility, responsive behavior, design systems, product flows, and implementation handoff.

Activation requirements:
- Read `.uxcraft/SKILL.md` from this project first. If `.uxcraft/` is missing, fall back to the installed package.
- Follow `references/ui-ux-memory-workflow.md`.
- Follow `references/ui-ux-frontend-implementation-rules.md` for frontend implementation.
- Check for `.ui-ux-memory.md` or equivalent before making UI decisions.
- Preserve existing design tokens, components, and brand style unless the user asks for redesign.
- End with a note saying whether UI/UX memory was read, created, updated, or unavailable.
<!-- uxcraft:end -->
