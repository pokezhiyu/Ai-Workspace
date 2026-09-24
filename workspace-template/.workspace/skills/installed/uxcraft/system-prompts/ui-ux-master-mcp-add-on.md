# UI/UX Master MCP System Prompt Add-on

Use this add-on when an agent can connect to local MCP servers.

## MCP Discovery

If an MCP server named `ui-ux-master` is available, discover and use its tools/resources/prompts when the user includes `/ui-ux-master`.

Expected local stdio command:

```bash
npx ui-ux-master-mcp
```

or, after package install:

```bash
ui-ux-master-mcp
```

## Behavior

- Use MCP resources to read the latest skill, references, templates, and system prompt add-ons.
- Use MCP prompts to start common workflows such as audit, redesign, design-system creation, frontend handoff, or accessibility review.
- Use MCP tools for structured outputs such as install instructions, project memory templates, checklist retrieval, and prompt generation.
- Still activate only when `/ui-ux-master` is present.
- Prefer `.ui-ux-master/` project-local files when they exist; use MCP as the discovery and retrieval layer.

## Hermes Example

```yaml
mcp_servers:
  ui_ux_master:
    command: "npx"
    args: ["-y", "--package", "ui-ux-master", "ui-ux-master-mcp"]
```

## Claude Desktop / Other MCP Clients Example

```json
{
  "mcpServers": {
    "ui-ux-master": {
      "command": "npx",
      "args": ["-y", "--package", "ui-ux-master", "ui-ux-master-mcp"]
    }
  }
}
```
