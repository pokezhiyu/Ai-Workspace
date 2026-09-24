# UXCraft MCP Server

UXCraft includes a local MCP server so AI clients can discover the skill automatically as tools, resources, and reusable prompts.

## Why MCP Matters

MCP lets compatible AI clients discover local capabilities without relying only on human-readable README files. Project installs also copy the same assets into `.uxcraft/`, so MCP clients and text-trigger agents can both find the same source of truth. With this package, agents can:

- list UXCraft tools;
- read the main skill and references as MCP resources;
- retrieve system prompt add-ons;
- generate project memory templates;
- get install instructions for supported agents;
- start common UI/UX workflows through MCP prompts.

## Run the Server

After global install:

```bash
uxcraft-mcp
```

Without global install:

```bash
npx -y --package uxcraft uxcraft-mcp
```

The server communicates over stdio using JSON-RPC/MCP-compatible methods.

## Claude Desktop / MCP Client Config

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

## Hermes Native MCP Config

```yaml
mcp_servers:
  uxcraft:
    command: "npx"
    args: ["-y", "--package", "uxcraft", "uxcraft-mcp"]
```

Restart the agent after adding the config so it can discover the tools.

## Tools

| Tool | Purpose |
|---|---|
| `get_skill` | Return the main `SKILL.md` content. |
| `list_assets` | List discoverable assets, resources, prompts, and tools. |
| `get_asset` | Return a named asset such as `system_prompt`, `complete_checklist`, `memory_template`, or `frontend_rules`. |
| `generate_system_prompt` | Generate full, compact, or MCP-focused system prompt add-ons. |
| `create_memory_template` | Return a `.ui-ux-memory.md` template, optionally with a project name. |
| `install_instructions` | Return install instructions for npm, project, global, MCP, Hermes, Claude Desktop, Cursor, Codex, Windsurf, Gemini, Antigravity, or universal agents. |

## Resources

| URI | Content |
|---|---|
| `uxcraft://skill` | Main skill. |
| `uxcraft://readme` | README. |
| `uxcraft://llms` | AI discovery text. |
| `uxcraft://manifest` | Machine-readable AI manifest. |
| `uxcraft://system-prompt` | Full system prompt add-on. |
| `uxcraft://compact-prompt` | Compact system prompt add-on. |
| `uxcraft://mcp-prompt` | MCP-focused prompt add-on. |
| `uxcraft://mcp-docs` | This document. |
| `uxcraft://checklist` | Complete UI/UX checklist. |
| `uxcraft://memory-template` | UI/UX memory template. |

## Prompts

| Prompt | Purpose |
|---|---|
| `uxcraft` | Activate the full UXCraft workflow for a normal UI/UX task. |
| `ui-ux-audit` | Audit a screen, product, flow, URL, or component. |
| `ui-ux-redesign` | Redesign a product area with handoff-ready output. |
| `ui-ux-design-system` | Create or extend tokens, components, governance, and QA. |
| `ui-ux-accessibility-review` | Perform a WCAG-focused accessibility review. |

## Manual Smoke Test

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' | node bin/uxcraft-mcp.mjs
```

Expected output: JSON-RPC responses containing server info and a tools array.

## Security

The MCP server is read-only. It exposes package content and generated prompt text. It does not write files, execute shell commands, read arbitrary paths, or access credentials.

## Activation Reminder

Even through MCP, UXCraft remains opt-in. Use the workflow only when the user includes `/uxcraft` or explicitly asks to use UXCraft.
