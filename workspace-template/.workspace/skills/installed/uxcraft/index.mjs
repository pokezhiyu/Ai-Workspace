import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const _require = createRequire(import.meta.url);
const _pkg = _require('./package.json');

export const name = 'uxcraft';
export const version = _pkg.version;
export const trigger = '/uxcraft';

export const bins = Object.freeze({
  cli: path.join(packageRoot, 'bin', 'uxcraft.mjs'),
  mcp: path.join(packageRoot, 'bin', 'uxcraft-mcp.mjs'),
});

export const assets = Object.freeze({
  skill: path.join(packageRoot, 'SKILL.md'),
  readme: path.join(packageRoot, 'README.md'),
  llms: path.join(packageRoot, 'llms.txt'),
  manifest: path.join(packageRoot, 'ai-discovery', 'uxcraft.manifest.json'),
});

export function assetPath(name) {
  if (!Object.hasOwn(assets, name)) {
    throw new Error(`Unknown uxcraft asset: ${name}`);
  }
  return assets[name];
}
