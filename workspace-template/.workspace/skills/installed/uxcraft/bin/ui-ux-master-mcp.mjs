#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), '..');
const protocolVersion = '2024-11-05';

const assetMap = {
  skill: 'SKILL.md',
  readme: 'README.md',
  llms: 'llms.txt',
  manifest: 'ai-discovery/ui-ux-master.manifest.json',
  system_prompt: 'system-prompts/ui-ux-master-system-add-on.md',
  compact_prompt: 'system-prompts/ui-ux-master-compact.md',
  mcp_prompt: 'system-prompts/ui-ux-master-mcp-add-on.md',
  mcp_docs: 'docs/mcp-server.md',
  slash_docs: 'docs/slash-command-compatibility.md',
  memory_workflow: 'references/ui-ux-memory-workflow.md',
  frontend_rules: 'references/ui-ux-frontend-implementation-rules.md',
  complete_checklist: 'references/ui-ux-complete-checklist.md',
  wcag: 'references/wcag-aa-quick-reference.md',
  accessibility_patterns: 'references/accessibility-advanced-patterns.md',
  design_system_playbook: 'references/design-system-playbook.md',
  memory_template: 'templates/ui-ux-memory.md',
};

const resourceMap = {
  'ui-ux-master://skill': 'SKILL.md',
  'ui-ux-master://readme': 'README.md',
  'ui-ux-master://llms': 'llms.txt',
  'ui-ux-master://manifest': 'ai-discovery/ui-ux-master.manifest.json',
  'ui-ux-master://system-prompt': 'system-prompts/ui-ux-master-system-add-on.md',
  'ui-ux-master://compact-prompt': 'system-prompts/ui-ux-master-compact.md',
  'ui-ux-master://mcp-prompt': 'system-prompts/ui-ux-master-mcp-add-on.md',
  'ui-ux-master://mcp-docs': 'docs/mcp-server.md',
  'ui-ux-master://checklist': 'references/ui-ux-complete-checklist.md',
  'ui-ux-master://memory-template': 'templates/ui-ux-memory.md',
};

function readRel(rel) {
  const full = path.resolve(packageRoot, rel);
  if (!full.startsWith(packageRoot)) throw new Error('Path escapes package root');
  return fs.readFileSync(full, 'utf8');
}

function textContent(text) {
  return [{ type: 'text', text }];
}

function jsonText(obj) {
  return textContent(JSON.stringify(obj, null, 2));
}

function tool(name, description, properties = {}, required = []) {
  return {
    name,
    description,
    inputSchema: {
      type: 'object',
      properties,
      required,
      additionalProperties: false,
    },
  };
}

function listTools() {
  return [
    tool('get_skill', 'Return the main UI/UX Master SKILL.md content.', {}, []),
    tool('list_assets', 'List discoverable UI/UX Master assets, references, prompts, and resources.', {}, []),
    tool('get_asset', 'Return a named package asset such as skill, readme, system_prompt, complete_checklist, or memory_template.', {
      name: { type: 'string', description: `Asset name. Allowed: ${Object.keys(assetMap).join(', ')}` },
    }, ['name']),
    tool('generate_system_prompt', 'Generate a system prompt add-on for an AI agent.', {
      mode: { type: 'string', enum: ['full', 'compact', 'mcp'], default: 'full' },
      agent: { type: 'string', description: 'Optional target agent name such as Claude, Codex, Windsurf, Cursor, Gemini, Antigravity, or universal.' },
    }, []),
    tool('create_memory_template', 'Return a project .ui-ux-memory.md template with optional project name inserted.', {
      projectName: { type: 'string', description: 'Optional project/product name.' },
    }, []),
    tool('install_instructions', 'Return install instructions for npm, project agent rules, or MCP clients.', {
      target: { type: 'string', enum: ['npm', 'project', 'global', 'mcp', 'claude-desktop', 'hermes', 'cursor', 'codex', 'windsurf', 'gemini', 'antigravity', 'universal'], default: 'project' },
    }, []),
  ];
}

function callTool(name, args = {}) {
  switch (name) {
    case 'get_skill':
      return { content: textContent(readRel('SKILL.md')) };
    case 'list_assets':
      return { content: jsonText({ assets: assetMap, resources: Object.keys(resourceMap), prompts: listPrompts().map(p => p.name), tools: listTools().map(t => t.name) }) };
    case 'get_asset': {
      const rel = assetMap[args.name];
      if (!rel) throw new Error(`Unknown asset '${args.name}'. Use list_assets first.`);
      return { content: textContent(readRel(rel)) };
    }
    case 'generate_system_prompt': {
      const mode = args.mode || 'full';
      const rel = mode === 'compact' ? assetMap.compact_prompt : mode === 'mcp' ? assetMap.mcp_prompt : assetMap.system_prompt;
      const agentLine = args.agent ? `\n\nTarget agent: ${args.agent}. Keep the /ui-ux-master opt-in rule and use that agent's instruction format when applying this add-on.\n` : '';
      return { content: textContent(readRel(rel) + agentLine) };
    }
    case 'create_memory_template': {
      let text = readRel('templates/ui-ux-memory.md');
      if (args.projectName) text = text.replace('# UI/UX Memory', `# UI/UX Memory — ${args.projectName}`);
      return { content: textContent(text) };
    }
    case 'install_instructions':
      return { content: textContent(installInstructions(args.target || 'project')) };
    default:
      throw new Error(`Unknown tool '${name}'`);
  }
}

function installInstructions(target) {
  const common = 'After install, activate with: /ui-ux-master <your normal UI/UX request>';
  const map = {
    npm: 'npm install -g ui-ux-master\nui-ux-master install --global',
    project: 'npm install --save-dev ui-ux-master\nnpx ui-ux-master install --project',
    global: 'npm install -g ui-ux-master\nui-ux-master install --global',
    mcp: 'npx -y --package ui-ux-master ui-ux-master-mcp\n# or after install: ui-ux-master-mcp',
    hermes: 'mcp_servers:\n  ui_ux_master:\n    command: "npx"\n    args: ["-y", "--package", "ui-ux-master", "ui-ux-master-mcp"]',
    'claude-desktop': '{\n  "mcpServers": {\n    "ui-ux-master": {\n      "command": "npx",\n      "args": ["-y", "--package", "ui-ux-master", "ui-ux-master-mcp"]\n    }\n  }\n}',
    cursor: 'npx ui-ux-master install --project --agents cursor',
    codex: 'npx ui-ux-master install --project --agents codex',
    windsurf: 'npx ui-ux-master install --project --agents windsurf',
    gemini: 'npx ui-ux-master install --project --agents gemini',
    antigravity: 'npx ui-ux-master install --project --agents antigravity',
    universal: 'Copy system-prompts/ui-ux-master-system-add-on.md into the agent custom instructions, or run npx ui-ux-master install --project --agents universal',
  };
  return `${map[target] || map.project}\n\n${common}`;
}

function listResources() {
  return Object.entries(resourceMap).map(([uri, rel]) => ({
    uri,
    name: path.basename(rel),
    description: `UI/UX Master asset: ${rel}`,
    mimeType: rel.endsWith('.json') ? 'application/json' : 'text/markdown',
  }));
}

function readResource(uri) {
  const rel = resourceMap[uri];
  if (!rel) throw new Error(`Unknown resource '${uri}'`);
  return { contents: [{ uri, mimeType: rel.endsWith('.json') ? 'application/json' : 'text/markdown', text: readRel(rel) }] };
}

function listPrompts() {
  return [
    { name: 'ui-ux-master', description: 'Activate the full UI/UX Master workflow for a normal user task.', arguments: [{ name: 'task', description: 'The user UI/UX request.', required: true }] },
    { name: 'ui-ux-audit', description: 'Audit a screen, flow, app, or URL for UX, UI, accessibility, and handoff issues.', arguments: [{ name: 'target', description: 'What to audit.', required: true }] },
    { name: 'ui-ux-redesign', description: 'Redesign a product area while preserving or intentionally evolving brand conventions.', arguments: [{ name: 'target', description: 'What to redesign.', required: true }] },
    { name: 'ui-ux-design-system', description: 'Create or extend a design system with tokens, components, governance, and QA.', arguments: [{ name: 'scope', description: 'Product/component scope.', required: true }] },
    { name: 'ui-ux-accessibility-review', description: 'Run a WCAG-focused accessibility and interaction review.', arguments: [{ name: 'target', description: 'Screen, component, or flow.', required: true }] },
  ];
}

function getPrompt(name, args = {}) {
  const task = args.task || args.target || args.scope || 'the requested UI/UX work';
  const map = {
    'ui-ux-master': `/ui-ux-master ${task}\n\nUse the full UI/UX Master workflow. Check UI/UX memory first. Produce implementation-ready output.`,
    'ui-ux-audit': `/ui-ux-master audit ${task} for UX clarity, accessibility, responsive behavior, content, trust, conversion, states, and implementation quality. Return prioritized findings and fixes.`,
    'ui-ux-redesign': `/ui-ux-master redesign ${task}. Preserve existing brand/tokens/components unless a redesign is requested. Include IA, flow, layout, states, accessibility, responsive rules, copy, and developer handoff.`,
    'ui-ux-design-system': `/ui-ux-master create or extend a design system for ${task}. Include tokens, components, variants, states, accessibility, governance, examples, QA, and acceptance criteria.`,
    'ui-ux-accessibility-review': `/ui-ux-master review ${task} for WCAG 2.2 AA, keyboard, focus, semantics, screen reader behavior, contrast, motion, forms, error recovery, and test coverage.`,
  };
  if (!map[name]) throw new Error(`Unknown prompt '${name}'`);
  return { messages: [{ role: 'user', content: { type: 'text', text: map[name] } }] };
}

function ok(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

function err(id, error, code = -32603) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message: error?.message || String(error) } }) + '\n');
}

function handle(message) {
  const { id, method, params = {} } = message;
  try {
    if (method === 'initialize') {
      ok(id, {
        protocolVersion,
        capabilities: { tools: {}, resources: {}, prompts: {} },
        serverInfo: { name: 'ui-ux-master', version: readPackageVersion() },
      });
    } else if (method === 'notifications/initialized') {
      // no response for notifications
    } else if (method === 'ping') {
      ok(id, {});
    } else if (method === 'tools/list') {
      ok(id, { tools: listTools() });
    } else if (method === 'tools/call') {
      ok(id, callTool(params.name, params.arguments || {}));
    } else if (method === 'resources/list') {
      ok(id, { resources: listResources() });
    } else if (method === 'resources/read') {
      ok(id, readResource(params.uri));
    } else if (method === 'prompts/list') {
      ok(id, { prompts: listPrompts() });
    } else if (method === 'prompts/get') {
      ok(id, getPrompt(params.name, params.arguments || {}));
    } else {
      err(id, new Error(`Method not found: ${method}`), -32601);
    }
  } catch (e) {
    err(id, e);
  }
}

function readPackageVersion() {
  try {
    return JSON.parse(readRel('package.json')).version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function printHelp() {
  console.log(`UI/UX Master MCP Server\n\nRun over stdio for MCP clients:\n  ui-ux-master-mcp\n\nExample client config:\n{\n  "mcpServers": {\n    "ui-ux-master": {\n      "command": "npx",\n      "args": ["-y", "--package", "ui-ux-master", "ui-ux-master-mcp"]\n    }\n  }\n}`);
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printHelp();
  process.exit(0);
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    handle(JSON.parse(trimmed));
  } catch (e) {
    err(null, e);
  }
});
