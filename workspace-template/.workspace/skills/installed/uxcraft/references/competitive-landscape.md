# Competitive Landscape and Differentiation

This reference summarizes the open-source/UI-agent landscape checked while improving UI/UX Master.

## What Existing Tools Do Well

- `skills` / open agent skills ecosystem: broad multi-agent distribution and many supported agent names.
- `bentoskills`: simple npm-based installation for Claude-oriented UI/UX skills.
- `extract-design-system`: strong focused capability for extracting design tokens from public websites and packaging it as a CLI/agent skill.
- `@assistant-ui/react`: production-grade React components for AI chat interfaces.
- `@figma/code-connect`: strong design-to-code component mapping for Figma and codebases.
- Mature design systems such as GOV.UK Frontend, Salesforce Lightning, Material, Carbon, Atlassian, and Fluent: strong component guidance and production CSS/component foundations.
- `ui-ux-pro-max-skill` (nextlevelbuilder): 161 industry-specific design system generation rules, 67 UI styles, 57 font pairings, 161 color palettes, 25 chart types, 15 tech stacks, BM25-ranked reasoning engine. Multi-domain parallel search (product → style → palette → typography → pattern). MASTER.md + page-override hierarchy for design system persistence. Pre-delivery checklist on every output. Key innovations adopted into UI/UX Master v1.5.0: full industry reasoning engine, MASTER+overrides pattern, pre-delivery checklist format, chart type guide.
- `saifyxpro/ui-ux-design-pro-skill` (2026 Edition): 107 UI styles (incl. Liquid Glass, Data Brutalism, Spatial UI, Aurora, Cyberpunk), 127 palettes, 107 font pairings, 11-step (50–950) architectural color scales with semantic roles, 150+ UX guidelines, 16 tech stacks, Orama search engine (sub-50ms), code-level AI audit detecting hallucinated Tailwind utilities, low-contrast pseudo-transparency, h-screen layout shifts. Key innovations adopted into UI/UX Master v1.5.0: 11-step OKLch scale system, UI styles catalog, code-level AI audit error codes (AI001–AI030), tech stack guidelines.
- `ux-ui-agent-skills` (plugin87): solid 3-tier DTCG token architecture (primitive → semantic → component), dark mode swap approach, scored design review output across 6 dimensions.
- `claude-code-ui-agents` (mustafakendiguzel): curated prompt library for component development, UX research, animation, and accessibility across multiple categories.
- `open-design` (nexu-io): Full-stack app (daemon + Next.js + Electron), 132 skills, 150 design systems, 16 CLI adapters. Key innovations adopted into UI/UX Master v1.4.0: discovery question form, brand extraction protocol, 5-dimensional self-critique, anti-slop blacklist, 5 OKLch visual directions, 9-section DESIGN.md schema, P0/P1/P2 quality gates, honest placeholder protocol.

## Where Narrow Skills Often Outperform Generic UI Prompts

- They are easier to install.
- They have a simple trigger or CLI.
- They focus on one concrete task, such as token extraction or component mapping.
- Some have npm packaging and tests.
- Some integrate with a specific agent's native command system.
- `ui-ux-pro-max-skill` matches industry → style → color → font in one automated step with BM25 ranking, very fast for first-time project setup.
- `saifyxpro/ui-ux-design-pro-skill` has a native CLI (Bun + Orama) with sub-50ms search, live code audit, and icon search — functionality that requires running a process, not just a Markdown skill.

## Gaps UI/UX Master Must Beat

UI/UX Master is designed to lead by combining the best parts:

1. One simple opt-in trigger: `/ui-ux-master`.
2. Cross-agent installation instead of one-agent lock-in.
3. Full lifecycle coverage from research to handoff, not only visual polish.
4. Project UI/UX memory for consistent branding across repeated work.
5. Standards alignment across WCAG, WAI-ARIA, NN/g-style heuristics, GOV.UK service patterns, Material, Apple HIG, Microsoft, ISO HCD concepts, and Baymard-style ecommerce practice.
6. Advanced risk coverage: privacy, ethics, dark patterns, high-risk domains, AI transparency, localization, and platform conventions.
7. Release engineering: npm package, CLI installer, tests, validator, and deployment zip.
8. Brand-method depth: 10 dedicated skill files with full design specs (layout, typography, spacing, motion, component specs, accessibility, anti-patterns, QA) — more depth per method than any competitor.
9. Color psychology and branding skill with industry-specific palette prescriptions, sentiment-to-color mapping, WCAG contrast verification, and dark mode adaptation rules.
10. Discovery-first workflow: 6-question form before any visual output, brand extraction protocol (never guesses colors), 5 OKLch visual directions for brandless projects, junior-designer warm-up pass.
11. Quality-gated output: 5-dimensional self-critique, P0/P1/P2 hard gates, anti-AI-slop blacklist, honest placeholder protocol.
12. Portable 9-section design system schema (DESIGN.md-compatible): single source of truth for every `.ui-ux-memory.md`.
13. **v1.5.0:** UI styles catalog (20+ named styles) — matches `saifyxpro`'s 107-style scope at the Markdown-skill layer with complete token overrides, required effects, forbidden patterns, and decision tree.
14. **v1.5.0:** 11-step (50–950) OKLch architectural color scales — matches and extends `saifyxpro`'s scale system with full semantic role mapping and dark mode overrides.
15. **v1.5.0:** Industry reasoning engine (15+ categories) — matches `ui-ux-pro-max-skill`'s 161-rule reasoning engine for instant Design System Block output per product type.
16. **v1.5.0:** 16-framework tech stack guidelines — matches and extends `saifyxpro`'s 16-stack coverage with component patterns, rules, and common AI mistakes for React, Next.js, Vue, Nuxt, Angular, Svelte, Astro, Remix, SolidJS, React Native, Flutter, SwiftUI, shadcn/ui, Jetpack Compose, Laravel, HTML+Tailwind.
17. **v1.5.0:** 12 landing page conversion patterns + 25-type chart guide — matches `ui-ux-pro-max-skill`'s 24-pattern + chart coverage.
18. **v1.5.0:** Code-level AI audit error codes AI001–AI030 — matches `saifyxpro`'s live audit capability at the Markdown-skill layer (no CLI runtime required).
19. **v1.5.0:** MASTER.md + page-override hierarchy — matches `ui-ux-pro-max-skill`'s design system persistence pattern.

## Remaining Honest Limitations

- No sandboxed live preview or daemon: UI/UX Master is a prompt-layer skill only; `open-design` ships a full Next.js + Electron app with iframe preview, export, and SQLite persistence. If a live rendering environment is needed, pair with open-design or use a separate preview tool.
- No built-in media generation: `open-design` integrates gpt-image-2 and Seedance video generation. UI/UX Master focuses on design specs and code-handoff, not media rendering.
- It does not replace specialized code libraries such as assistant-ui React components or GOV.UK Frontend CSS.
- It does not integrate directly with Figma APIs; pair it with Figma Code Connect or MCP/Figma tooling if needed.
- It cannot replace real user research, accessibility expert review, or legal/domain review in high-risk contexts.
- No native CLI runtime: `saifyxpro` has Bun+Orama sub-50ms search, live code audit, and icon search via a real process. UI/UX Master delivers equivalent guidance as Markdown references (no install of Bun/Node required), but cannot achieve sub-50ms database lookups.
- Fewer named styles at launch: `saifyxpro` ships 107 styles; we launch v1.5.0 with 20+ documented in depth. Volume can grow iteratively.
- Fewer industry categories at launch: `ui-ux-pro-max-skill` has 161 product categories; we cover 15+ in depth with full Design System Blocks. Depth per category exceeds theirs; breadth can grow.
- `open-design` has live rendering, export to PDF/PPTX/MP4, and a 132-skill catalog; UI/UX Master is a lighter-weight prompt-layer skill that works without a local daemon or Electron app.

## Strategy to Stay Ahead

- Keep `/ui-ux-master` simple, opt-in, and daemon-free — one npm install, works in every agent.
- Re-audit major competitors (`saifyxpro`, `ui-ux-pro-max-skill`, `open-design`) on every major release; close gaps in the Markdown skill layer.
- Grow UI styles catalog and industry rules iteratively — depth per entry beats volume.
- Discovery-first + quality-gated output as non-negotiable defaults.
- Tech stack guidelines are a durable differentiator — keep them updated as frameworks evolve.
- Validate every release with Python, Node tests, npm pack dry-run, and independent review.
- Maintain DESIGN.md-compatible schema — interoperability with open-design's ecosystem is a feature, not a bug.
