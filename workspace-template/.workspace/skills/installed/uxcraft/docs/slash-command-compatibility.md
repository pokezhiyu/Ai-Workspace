# Slash Command Compatibility

`/uxcraft` is the opt-in activation phrase for this package.

## What `/ui-ux-master` Does

When a user writes `/uxcraft`, the agent switches into the UXCraft workflow for that request: research-aware UX, IA, flows, design systems, accessibility, responsive states, content design, platform conventions, UI/UX memory, quality gates, and engineering handoff.

If the user does not include `/uxcraft`, the skill should not be applied automatically.

**Note:** `/ui-ux-master` is a deprecated backward-compatible alias for `/uxcraft`. Please update to `/uxcraft`.

## Native Slash Commands vs Text Triggers

Agent ecosystems are not consistent:

- Some agents support native custom slash commands.
- Some agents support project instruction files such as `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.windsurfrules`, or `.cursor/rules`.
- Some agents only see normal prompt text.

This package handles both models. Native slash commands are installed where available. Everywhere else, project instructions define `/uxcraft` as a plain-text opt-in trigger.

## Supported Agents

| Agent | Install target | Trigger behavior |
|---|---|---|
| Claude Code | `.claude/commands/uxcraft.md` | Native `/uxcraft` command |
| Codex | `AGENTS.md` marked section | Type `/uxcraft` in the prompt |
| Windsurf/Cascade | `.windsurf/rules/uxcraft.md` and optional `.windsurfrules` | Type `/uxcraft` in the prompt |
| Antigravity | `AGENTS.md` / universal fallback | Type `/uxcraft` in the prompt |
| Gemini CLI | `GEMINI.md` marked section | Type `/uxcraft` in the prompt |
| Cursor | `.cursor/rules/uxcraft.mdc` | Type `/uxcraft` in the prompt |
| Other agents | `agent-templates/universal/uxcraft-trigger.md` | Copy the trigger into the agent's instruction file |

## Project-local Install

Project-local install is recommended because it keeps activation scoped to a repository and copies the skill source into `.uxcraft/` so all agents can find it, including no-save `npx` installs.

```bash
npx uxcraft install --project
```

## Global Install

Global install creates reusable templates under your home directory and, where supported, user-level slash commands.

```bash
npm install -g uxcraft
uxcraft install --global
```

## Troubleshooting

- If `/uxcraft` does nothing, your agent may not support native slash commands. Add the universal trigger text to the agent's project instructions.
- If the agent applies the skill too often, ensure the installed rule says "activate only when the user writes `/uxcraft`."
- If project instructions already have a UI/UX rule, merge carefully and preserve the `/uxcraft:start` and `/uxcraft:end` markers.

## Security and Consent

The installer should not overwrite existing agent instruction files without marker-based replacement. Review generated instruction files before committing them to a shared repository.
