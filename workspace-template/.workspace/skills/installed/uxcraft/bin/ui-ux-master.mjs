#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), '..');
const markerStart = '<!-- ui-ux-master:start -->';
const markerEnd = '<!-- ui-ux-master:end -->';

function read(rel) {
  return fs.readFileSync(path.join(packageRoot, rel), 'utf8');
}

function mkdirp(dir, dryRun) {
  if (dryRun) return;
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(target, content, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] write ${target}`);
    return;
  }
  mkdirp(path.dirname(target), false);
  fs.writeFileSync(target, content, 'utf8');
  console.log(`wrote ${target}`);
}

function appendMarked(target, block, dryRun) {
  const content = block.includes(markerStart) ? block.trim() + '\n' : `${markerStart}\n${block.trim()}\n${markerEnd}\n`;
  const old = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  const re = new RegExp(`${escapeRegExp(markerStart)}[\\s\\S]*?${escapeRegExp(markerEnd)}\\n?`, 'm');
  const next = re.test(old) ? old.replace(re, content) : `${old.replace(/\s*$/, '')}${old.trim() ? '\n\n' : ''}${content}`;
  if (dryRun) {
    console.log(`[dry-run] append/update marked section ${target}`);
    return;
  }
  mkdirp(path.dirname(target), false);
  fs.writeFileSync(target, next, 'utf8');
  console.log(`updated ${target}`);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseArgs(argv) {
  const opts = { command: 'help', scope: 'project', agents: null, dryRun: false, dir: null, postinstall: false };
  const args = [...argv];
  if (args.includes('--postinstall')) opts.postinstall = true;
  const first = args.find(a => !a.startsWith('--'));
  if (first) opts.command = first;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--project') opts.scope = 'project';
    else if (a === '--global') opts.scope = 'global';
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--dir') opts.dir = path.resolve(args[++i]);
    else if (a === '--agents') opts.agents = args[++i].split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  }
  return opts;
}

function findProjectRoot(start) {
  let cur = path.resolve(start || process.cwd());
  while (true) {
    for (const name of ['package.json', '.git', 'pyproject.toml', 'Cargo.toml', 'go.mod']) {
      if (fs.existsSync(path.join(cur, name))) return cur;
    }
    const parent = path.dirname(cur);
    if (parent === cur) return path.resolve(start || process.cwd());
    cur = parent;
  }
}

function wanted(opts, name) {
  return !opts.agents || opts.agents.includes(name) || opts.agents.includes('all');
}

function copyProjectSkillAssets(root, dryRun) {
  const dest = path.join(root, '.ui-ux-master');
  const files = ['SKILL.md', 'README.md', 'LICENSE', 'package.json', 'llms.txt'];
  const dirs = ['references', 'templates', 'docs', 'system-prompts', 'ai-discovery'];
  for (const file of files) {
    writeFile(path.join(dest, file), read(file), dryRun);
  }
  for (const dir of dirs) {
    copyDir(path.join(packageRoot, dir), path.join(dest, dir), dryRun);
  }
  console.log(`${dryRun ? '[dry-run] ' : ''}project skill assets available at ${dest}`);
}

function installProject(root, opts) {
  const dry = opts.dryRun;
  const installedPath = packageRoot;
  console.log(`Installing /ui-ux-master project trigger into ${root}`);
  console.log(`Package root: ${installedPath}`);

  copyProjectSkillAssets(root, dry);

  if (wanted(opts, 'claude')) writeFile(path.join(root, '.claude', 'commands', 'ui-ux-master.md'), read('agent-templates/claude/commands/ui-ux-master.md'), dry);
  if (wanted(opts, 'codex') || wanted(opts, 'antigravity') || wanted(opts, 'universal')) appendMarked(path.join(root, 'AGENTS.md'), read('agent-templates/codex/AGENTS.append.md'), dry);
  if (wanted(opts, 'windsurf')) {
    writeFile(path.join(root, '.windsurf', 'rules', 'ui-ux-master.md'), read('agent-templates/windsurf/rules/ui-ux-master.md'), dry);
    appendMarked(path.join(root, '.windsurfrules'), read('agent-templates/universal/ui-ux-master-trigger.md'), dry);
  }
  if (wanted(opts, 'antigravity')) writeFile(path.join(root, '.antigravity', 'rules', 'ui-ux-master.md'), read('agent-templates/universal/ui-ux-master-trigger.md'), dry);
  if (wanted(opts, 'gemini')) appendMarked(path.join(root, 'GEMINI.md'), read('agent-templates/gemini/GEMINI.append.md'), dry);
  if (wanted(opts, 'cursor')) writeFile(path.join(root, '.cursor', 'rules', 'ui-ux-master.mdc'), read('agent-templates/cursor/rules/ui-ux-master.mdc'), dry);

  console.log('Done. Use: /ui-ux-master <your normal UI/UX request>');
}

function copyDir(src, dest, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] copy ${src} -> ${dest}`);
    return;
  }
  fs.cpSync(src, dest, { recursive: true, force: true, filter: (p) => !p.includes(`${path.sep}.git${path.sep}`) && !p.includes(`${path.sep}graphify-out${path.sep}`) && !p.includes(`${path.sep}__pycache__${path.sep}`) && !p.endsWith('.pyc') });
}

function installGlobal(opts) {
  const root = path.join(os.homedir(), '.ui-ux-master');
  console.log(`Installing global UI/UX Master files into ${root}`);
  copyDir(packageRoot, root, opts.dryRun);
  const claudeTarget = path.join(os.homedir(), '.claude', 'commands', 'ui-ux-master.md');
  writeFile(claudeTarget, read('agent-templates/claude/commands/ui-ux-master.md'), opts.dryRun);
  console.log('Global install complete. Project-local install is still recommended for Codex/Windsurf/Gemini rules.');
}

function uninstallProject(root, opts) {
  const dry = opts.dryRun;
  const files = [
    path.join(root, '.ui-ux-master'),
    path.join(root, '.claude', 'commands', 'ui-ux-master.md'),
    path.join(root, '.windsurf', 'rules', 'ui-ux-master.md'),
    path.join(root, '.antigravity', 'rules', 'ui-ux-master.md'),
    path.join(root, '.cursor', 'rules', 'ui-ux-master.mdc'),
  ];
  for (const file of files) {
    if (fs.existsSync(file)) {
      if (dry) console.log(`[dry-run] remove ${file}`);
      else { fs.rmSync(file, { force: true, recursive: true }); console.log(`removed ${file}`); }
    }
  }
  for (const file of [path.join(root, 'AGENTS.md'), path.join(root, 'GEMINI.md'), path.join(root, '.windsurfrules')]) {
    if (!fs.existsSync(file)) continue;
    const old = fs.readFileSync(file, 'utf8');
    const re = new RegExp(`${escapeRegExp(markerStart)}[\\s\\S]*?${escapeRegExp(markerEnd)}\\n?`, 'm');
    const next = old.replace(re, '').trimEnd() + '\n';
    if (dry) console.log(`[dry-run] remove marker block from ${file}`);
    else { fs.writeFileSync(file, next, 'utf8'); console.log(`updated ${file}`); }
  }
}

function doctor(opts) {
  const root = opts.scope === 'global' ? os.homedir() : findProjectRoot(opts.dir || process.cwd());
  console.log(`ui-ux-master package root: ${packageRoot}`);
  console.log(`target root: ${root}`);
  console.log(`node: ${process.version}`);
  console.log(`trigger: /ui-ux-master`);
  const required = ['SKILL.md', 'README.md', 'llms.txt', 'references/ui-ux-complete-checklist.md', 'agent-templates/universal/ui-ux-master-trigger.md', 'system-prompts/ui-ux-master-system-add-on.md', 'docs/mcp-server.md', 'bin/ui-ux-master-mcp.mjs'];
  let ok = true;
  for (const rel of required) {
    const exists = fs.existsSync(path.join(packageRoot, rel));
    console.log(`${exists ? 'ok' : 'missing'} ${rel}`);
    ok = ok && exists;
  }
  if (!ok) process.exitCode = 1;
}

function help() {
  console.log(`UI/UX Master\n\nUsage:\n  ui-ux-master install [--project|--global] [--agents claude,codex,windsurf,antigravity,gemini,cursor,universal] [--dir path] [--dry-run]\n  ui-ux-master uninstall [--project] [--dir path] [--dry-run]\n  ui-ux-master doctor [--dir path]\n  ui-ux-master where\n  ui-ux-master mcp\n  ui-ux-master-mcp\n\nAfter install, use: /ui-ux-master <your normal UI/UX prompt>\nMCP: npx -y --package ui-ux-master ui-ux-master-mcp`);
}

const opts = parseArgs(process.argv.slice(2));
if (opts.postinstall) {
  console.log('ui-ux-master installed. Run `npx ui-ux-master install --project` inside a repo, then use `/ui-ux-master ...`.');
} else if (opts.command === 'install') {
  if (opts.scope === 'global') installGlobal(opts);
  else installProject(findProjectRoot(opts.dir || process.cwd()), opts);
} else if (opts.command === 'uninstall') {
  uninstallProject(findProjectRoot(opts.dir || process.cwd()), opts);
} else if (opts.command === 'doctor') {
  doctor(opts);
} else if (opts.command === 'mcp' || opts.command === 'ui-ux-master-mcp') {
  await import('./ui-ux-master-mcp.mjs');
} else if (opts.command === 'where') {
  console.log(packageRoot);
} else {
  help();
}
