# UXCraft MCP System Prompt Add-on

Use this add-on when an agent can connect to local MCP servers.

## MCP Discovery

If an MCP server named `uxcraft` is available, discover and use its tools/resources/prompts when the user includes `/uxcraft`.

Expected local stdio command:

```bash
npx uxcraft-mcp
```

or, after package install:

```bash
uxcraft-mcp
```

## Behavior

- Use MCP resources to read the latest skill, references, templates, and system prompt add-ons.
- Use MCP prompts to start common workflows such as audit, redesign, design-system creation, frontend handoff, or accessibility review.
- Use MCP tools for structured outputs such as install instructions, project memory templates, checklist retrieval, and prompt generation.
- Still activate only when `/uxcraft` is present.
- Prefer `.uxcraft/` project-local files when they exist; use MCP as the discovery and retrieval layer.

## Hermes Example

```yaml
mcp_servers:
  uxcraft:
    command: "npx"
    args: ["-y", "--package", "uxcraft", "uxcraft-mcp"]
```

## Claude Desktop / Other MCP Clients Example

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
