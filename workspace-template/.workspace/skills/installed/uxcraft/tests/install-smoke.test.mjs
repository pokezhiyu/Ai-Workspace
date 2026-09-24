import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const root = path.resolve(__dirname, '..');
const bin = path.join(root, 'bin', 'uxcraft.mjs');
const mcpBin = path.join(root, 'bin', 'uxcraft-mcp.mjs');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const templates = [
  'agent-templates/claude/commands/uxcraft.md',
  'agent-templates/universal/uxcraft-trigger.md',
  'agent-templates/codex/AGENTS.append.md',
  'agent-templates/windsurf/rules/uxcraft.md',
  'agent-templates/antigravity/AGENTS.append.md',
  'agent-templates/gemini/GEMINI.append.md',
  'agent-templates/cursor/rules/uxcraft.mdc',
];

function run(args, cwd = root) {
  return execFileSync(process.execPath, [bin, ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function runMcp(messages) {
  const input = messages.map(m => JSON.stringify(m)).join('\n') + '\n';

  const res = spawnSync(process.execPath, [mcpBin], {
    input,
    encoding: 'utf8',
    cwd: root,
    timeout: 5000,
  });

  assert.equal(res.status, 0, res.stderr);

  return res.stdout
    .trim()
    .split(/\n+/)
    .map(line => JSON.parse(line));
}

test('package exposes cli and mcp bins with Rupak Biswas author', () => {
  assert.equal(pkg.author, 'Rupak Biswas');
  assert.equal(pkg.bin['uxcraft'], './bin/uxcraft.mjs');
  assert.equal(pkg.bin['uxcraft-mcp'], './bin/uxcraft-mcp.mjs');

  assert.ok(fs.existsSync(bin));
  assert.ok(fs.existsSync(mcpBin));

  assert.ok(fs.readFileSync(bin, 'utf8').startsWith('#!/usr/bin/env node'));
  assert.ok(fs.readFileSync(mcpBin, 'utf8').startsWith('#!/usr/bin/env node'));
});

test('package metadata APIs work from ESM and CommonJS entrypoints', async () => {
  const esm = await import(pathToFileURL(path.join(root, 'index.mjs')).href);
  const cjs = require(path.join(root, 'index.cjs'));

  for (const api of [esm, cjs]) {
    assert.equal(api.name, 'uxcraft');
    assert.equal(api.version, pkg.version);
    assert.equal(api.trigger, '/uxcraft');
    assert.equal(api.bins.cli, bin);
    assert.equal(api.bins.mcp, mcpBin);
    assert.equal(api.assetPath('skill'), path.join(root, 'SKILL.md'));
    assert.throws(() => api.assetPath('missing'), /Unknown uxcraft asset/);
  }
});

test('agent templates include trigger and avoid local absolute paths', () => {
  for (const rel of templates) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');

    assert.match(text, /\/uxcraft/);
    assert.match(text, /\.uxcraft\/SKILL\.md|\.uxcraft\/|\.uxcraft/);
    assert.match(text, /UXCraft|uxcraft/i);
    assert.doesNotMatch(text, /C:\\|C:\/xampp|C:\/Users|\/workspace/);
  }
});

test('discovery assets and system prompts exist', () => {
  const required = [
    'llms.txt',
    'ai-discovery/uxcraft.manifest.json',
    'system-prompts/uxcraft-system-add-on.md',
    'system-prompts/uxcraft-compact.md',
    'system-prompts/uxcraft-mcp-add-on.md',
    'docs/mcp-server.md',
  ];

  for (const rel of required) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    assert.match(text, /\/uxcraft/);
  }

  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, 'ai-discovery/uxcraft.manifest.json'), 'utf8')
  );

  assert.equal(manifest.author, 'Rupak Biswas');
  assert.equal(manifest.activation.trigger, '/uxcraft');
  assert.equal(manifest.entrypoints.mcp_server_bin, 'uxcraft-mcp');
});

test('cli help doctor and where work', () => {
  const help = run(['--help']);
  assert.match(help, /uxcraft/i);

  const doctor = run(['doctor', '--dry-run']);
  assert.match(doctor, /package root|target root|ok SKILL\.md/i);

  const where = run(['where']);
  assert.match(where.trim(), /UI[-\s]UX[-\s]Skills|uxcraft/i);
});

test('project install dry-run does not write', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'uxcraft-dry-'));
  fs.writeFileSync(path.join(dir, 'package.json'), '{}');

  const out = run(['install', '--project', '--dry-run', '--dir', dir]);

  assert.match(out, /dry-run/);
  assert.equal(fs.existsSync(path.join(dir, 'AGENTS.md')), false);
});

test('project install writes expected files and is idempotent', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'uxcraft-install-'));
  fs.writeFileSync(path.join(dir, 'package.json'), '{}');

  run(['install', '--project', '--dir', dir]);
  run(['install', '--project', '--dir', dir]);

  assert.ok(fs.existsSync(path.join(dir, '.uxcraft', 'SKILL.md')));
  assert.ok(fs.existsSync(path.join(dir, '.uxcraft', 'llms.txt')));
  assert.ok(fs.existsSync(path.join(dir, '.uxcraft', 'ai-discovery', 'uxcraft.manifest.json')));
  assert.ok(fs.existsSync(path.join(dir, '.uxcraft', 'system-prompts', 'uxcraft-system-add-on.md')));
  assert.ok(fs.existsSync(path.join(dir, '.uxcraft', 'references', 'ui-ux-memory-workflow.md')));
  assert.ok(fs.existsSync(path.join(dir, '.uxcraft', 'templates', 'ui-ux-memory.md')));
  assert.ok(fs.existsSync(path.join(dir, '.claude', 'commands', 'uxcraft.md')));
  assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')));
  assert.ok(fs.existsSync(path.join(dir, '.windsurf', 'rules', 'uxcraft.md')));
  assert.ok(fs.existsSync(path.join(dir, 'GEMINI.md')));

  const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');

  assert.equal((agents.match(/uxcraft:start/g) || []).length, 1);
  assert.match(agents, /\.uxcraft\/SKILL\.md/);
  assert.match(agents, /\/uxcraft/);
});

test('mcp server lists tools resources prompts and can return the skill', () => {
  const responses = runMcp([
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
    { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} },
    { jsonrpc: '2.0', id: 3, method: 'resources/list', params: {} },
    { jsonrpc: '2.0', id: 4, method: 'prompts/list', params: {} },
    {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'get_asset',
        arguments: {
          name: 'system_prompt',
        },
      },
    },
  ]);

  assert.equal(responses[0].result.serverInfo.name, 'uxcraft');
  assert.ok(responses[1].result.tools.some(t => t.name === 'generate_system_prompt'));
  assert.ok(responses[2].result.resources.some(r => r.uri === 'uxcraft://skill'));
  assert.ok(responses[2].result.resources.some(r => r.uri === 'uxcraft://memory-template'));
  assert.ok(responses[3].result.prompts.some(p => p.name === 'ui-ux-audit'));
  assert.match(responses[4].result.content[0].text, /Activation Rule/);
});

test('mcp server handles prompt retrieval and unknown methods correctly', () => {
  const responses = runMcp([
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'prompts/get',
      params: {
        name: 'ui-ux-design-system',
        arguments: {
          scope: 'admin dashboard',
        },
      },
    },
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'not/a-method',
      params: {},
    },
  ]);

  assert.match(responses[0].result.messages[0].content.text, /\/uxcraft/);
  assert.match(responses[0].result.messages[0].content.text, /admin dashboard/);
  assert.equal(responses[1].error.code, -32601);
});