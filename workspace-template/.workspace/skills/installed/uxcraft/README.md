# UXCraft

[![npm version](https://img.shields.io/npm/v/uxcraft?logo=npm&label=npm&color=6366f1)](https://www.npmjs.com/package/uxcraft)
[![downloads](https://img.shields.io/npm/dm/uxcraft?logo=npm&label=downloads&color=10b981)](https://www.npmjs.com/package/uxcraft)
[![License: MIT](https://img.shields.io/npm/l/uxcraft?color=f59e0b)](https://github.com/Seance1723/UXCraft/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub stars](https://img.shields.io/github/stars/Seance1723/UXCraft?style=flat&logo=github)](https://github.com/Seance1723/UXCraft/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/Seance1723/UXCraft?logo=github)](https://github.com/Seance1723/UXCraft/commits/main)

**Turn your AI coding agent into a Senior Product Designer, UX Researcher, and Frontend Lead — in one command.**

One trigger. Every agent. Full design lifecycle from discovery to developer handoff.

```text
/uxcraft build a SaaS landing page for my project management tool
```

---

## Install with npm

```bash
# Recommended — project install
npm install --save-dev uxcraft
npx uxcraft install --project

# No install needed (one-time)
npx uxcraft install --project
```

> **Note:** `ui-ux-master` is a deprecated backward-compatible alias. Update to `uxcraft`.

Works with **Claude**, **Windsurf**, **Cursor**, **Codex**, **Gemini**, and any agent that supports instruction files.

---

## Quick Start — Try These

```text
/uxcraft audit this dashboard for accessibility and give me fixes
```

```text
/uxcraft design a checkout flow for my e-commerce app
```

```text
/uxcraft build a landing page for a healthcare startup
```

```text
/uxcraft create a full design system for this SaaS product
```

> The skill only activates when you type `/uxcraft` — your normal coding workflow is untouched.

---

## What It Does

| Without UXCraft | With UXCraft |
|---|---|
| Jumps straight to code | Discovery form first — brief, audience, and brand locked before design |
| Generic colors and layout | Industry reasoning engine → instant Design System Block per product type |
| No design system | Portable 9-section schema saved to `.ui-ux-memory.md` per project |
| Ignores accessibility | WCAG 2.2 AA + ARIA patterns audited on every output |
| AI slop output | Anti-slop blacklist + 5-dimensional quality gate before every emit |
| One-size-fits-all style | 20+ named UI styles with complete token overrides |
| Forgets your brand | Design memory persists across all sessions |

---

## What's New

### v1.5.4 — Security policy & supply chain hardening *(May 2026)*

- Added `SECURITY.md` with vulnerability reporting policy and response timeline
- Zero runtime dependencies — no transitive supply chain risk

### v1.5.3 — GitHub repo renamed to UXCraft *(May 2026)*

- Updated all GitHub URLs to `https://github.com/Seance1723/UXCraft`
- Updated README badges, repository, homepage, and bugs fields

### v1.5.2 — Source provenance fix *(May 2026)*

- Added npm provenance (`publishConfig.provenance`) for socket.dev source verification
- Added `repository.directory` field for correct package-to-repo linking

### v1.5.1 — Rebranded to UXCraft *(May 2026)*

- Package renamed from `ui-ux-master` to `uxcraft`
- CLI command updated: `uxcraft` (backward-compatible alias `ui-ux-master` kept as deprecated)
- MCP server renamed to `uxcraft-mcp`
- All agent templates, system prompts, and trigger phrases updated to `/uxcraft`
- All tests, validator, and manifest updated for new branding

### v1.5.0 — Industry Intelligence Update *(May 2026)*

- **Industry Reasoning Engine** — describe your product, get a complete Design System Block instantly (pattern + style + palette + typography + effects + anti-patterns) for 15+ industries
- **UI Styles Catalog** — 20+ named styles: Glassmorphism, Liquid Glass, Data Brutalism, Aurora Borealis, Cyberpunk, AI-Native, Bento Grid, Soft UI Evolution, Claymorphism, and more — each with full CSS token overrides
- **Architectural Color Scales** — 11-step (50–950) OKLch ramps for every hue family, semantic states, and dark mode mappings
- **16-Framework Tech Stack Guidelines** — React, Next.js, Vue, Nuxt, Angular, Svelte, Astro, Remix, SolidJS, React Native, Flutter, SwiftUI, shadcn/ui, Jetpack Compose, Laravel, HTML+Tailwind
- **Landing Page Patterns** — 12 named conversion patterns (Hero-Centric, Problem-Solution, Social Proof First, Comparison, Product Demo First, and more) with section-by-section structure
- **Chart Type Guide** — 25-type decision tree + dashboard layout rules and anti-patterns
- **Code-Level AI Audit** — 30 error codes (AI001–AI030): Tailwind interpolation bugs, hallucinated utilities, missing a11y, React anti-patterns, invented metrics — each with severity level and line reference
- **MASTER + Page Overrides** — `design-system/MASTER.md` + `pages/[page].md` hierarchy for multi-page consistency

### v1.4.0 — Quality Gates Update

- 6-question discovery form runs before any visual output
- Brand extraction protocol — never guesses colors from a company name
- 5 OKLch visual directions for brandless projects
- 5-dimensional self-critique + P0/P1/P2 quality gates before every emit
- Anti-AI-slop blacklist — purple gradients, generic emojis, invented metrics all forbidden
- Portable 9-section design system schema (DESIGN.md-compatible)

### v1.3.0 — Brand Methods Update

- 10 top-brand design method skill files (Product Cinema, Enterprise Trust Hub, Conversion Simplicity, and more)
- Color Psychology and Branding skill with industry-specific palette prescriptions

---

## Supported Agents

| Agent | Trigger |
|---|---|
| Claude Code | `/uxcraft` (native slash command) |
| Windsurf / Cascade | `/uxcraft` |
| Cursor | `/uxcraft` |
| Codex | `/uxcraft` |
| Gemini CLI | `/uxcraft` |
| Antigravity | `/uxcraft` |
| Any other agent | Copy `agent-templates/universal/` into your instruction file |
| MCP clients | Auto-discovered via `uxcraft-mcp` |

---

## MCP Server

```bash
npx -y --package uxcraft uxcraft-mcp
```

```json
{
  "mcpServers": {
    "uxcraft": {
      "command": "npx",
      "args": ["-y", "--package", "uxcraft", "uxcraft-mcp"]
    }
  }
}
```

---

## CLI Reference

```bash
uxcraft install --project                             # install for current project
uxcraft install --project --agents claude,windsurf   # specific agents only
uxcraft install --project --dry-run                  # preview without writing
uxcraft install --global                             # global install
uxcraft doctor                                       # check install health
uxcraft uninstall --project                          # remove
```

---

## Full Capabilities

<details>
<summary>Expand to see everything</summary>

**Design & Research**
- UX strategy, user goals, jobs-to-be-done
- UX research plans and evidence-confidence scoring
- Information architecture, navigation, taxonomy, search/filter models
- User flows, task flows, journey maps, service blueprints
- Wireframes, layout specs, visual direction, interaction design

**Accessibility**
- WCAG 2.2 AA audits and remediation guidance
- Advanced ARIA patterns: dialogs, tabs, comboboxes, menus, grids, live regions, drag/drop

**Design Systems**
- Token architecture, component specs, governance, usage rules
- Portable 9-section schema saved per project (`.ui-ux-memory.md`)
- MASTER.md + page-level override hierarchy

**Content & Platform**
- UX writing, error copy, empty states, i18n, RTL
- Web, iOS, Android/Material, Windows, kiosk, email, TV

**Specialized Screens**
- SaaS dashboards, data visualization, ecommerce, checkout, onboarding, auth, forms, landing pages

**Ethics & Handoff**
- Dark-pattern detection, privacy, consent, AI transparency, high-risk domain safeguards
- Developer handoff: states, tokens, responsive behavior, analytics events, QA, acceptance criteria

</details>

---

## Package Layout

```
uxcraft/
├── SKILL.md                         main orchestration (steps 1–12)
├── references/
│   ├── industry-reasoning-rules.md  15+ industry → instant design system
│   ├── ui-styles-catalog.md         20+ named styles with full token specs
│   ├── color-scale-system.md        11-step OKLch architectural scales
│   ├── tech-stack-guidelines.md     16 frameworks with component patterns
│   ├── landing-page-patterns.md     12 patterns + 25-type chart guide
│   ├── output-quality-gates.md      AI audit codes + 5-dim self-critique
│   ├── design-system-schema.md      9-section schema + MASTER/overrides
│   ├── visual-directions.md         5 OKLch directions for brandless projects
│   ├── design-discovery-protocol.md 6-question intake + brand extraction
│   └── brand-method-*.md            10 top-brand design methods
├── templates/                       briefs, specs, memory template
├── agent-templates/                 Claude, Windsurf, Cursor, Codex, Gemini
├── system-prompts/                  copy into any AI custom-instructions
└── bin/                             CLI + MCP server
```

---

## Validation and Testing

```bash
python scripts/validate_skill.py --release
npm test
npm pack --dry-run
```

Expected output: `PASS: UXCraft skill package is valid`

---

## Limitations

- Guides research — does not replace real user testing
- Assists accessibility review — does not replace AT expert testing for high-risk products
- Flags legal/privacy risks — does not replace legal review
- No live preview or media generation

---

## Competitive Positioning

UXCraft combines what every competitor does best into one opt-in, daemon-free, cross-agent skill:

- **Discovery-first** — no visuals until brief is locked (beats generic prompt packs)
- **Industry reasoning engine** — instant Design System Block per product type (matches `ui-ux-pro-max-skill`)
- **11-step OKLch color scales** — architectural palette system (matches `saifyxpro`)
- **Code-level audit AI001–AI030** — catches Tailwind bugs, missing a11y, React anti-patterns (matches `saifyxpro`)
- **16-framework tech stack rules** — component patterns per framework (matches `saifyxpro`)
- **Quality gates** — 5-dimensional self-critique + anti-slop blacklist (inspired by `open-design`)
- **Full lifecycle** — research → IA → UI → accessibility → dev handoff (beats all narrow skills)
- **Project memory** — `.ui-ux-memory.md` persists brand/design across sessions

See `references/competitive-landscape.md` for the full analysis.

---

## Deployment Readiness Checklist

- [ ] `python scripts/validate_skill.py --release` passes
- [ ] `npm test` passes
- [ ] `npm pack --dry-run` contains only intended files
- [ ] `uxcraft install --project --dry-run` works
- [ ] No `node_modules`, `.pyc`, secrets, or local paths in package

---

## License

MIT — by Rupak Biswas. Contributions welcome.
