'use strict';

const path = require('node:path');

const packageRoot = __dirname;

const _pkg = require('./package.json');

const name = 'uxcraft';
const version = _pkg.version;
const trigger = '/uxcraft';

const bins = Object.freeze({
  cli: path.join(packageRoot, 'bin', 'uxcraft.mjs'),
  mcp: path.join(packageRoot, 'bin', 'uxcraft-mcp.mjs'),
});

const assets = Object.freeze({
  skill: path.join(packageRoot, 'SKILL.md'),
  readme: path.join(packageRoot, 'README.md'),
  llms: path.join(packageRoot, 'llms.txt'),
  manifest: path.join(packageRoot, 'ai-discovery', 'uxcraft.manifest.json'),
});

function assetPath(name) {
  if (!Object.hasOwn(assets, name)) {
    throw new Error(`Unknown uxcraft asset: ${name}`);
  }
  return assets[name];
}

module.exports = {
  assetPath,
  assets,
  bins,
  name,
  trigger,
  version,
};
