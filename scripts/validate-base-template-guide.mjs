import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const repositoryRoot = process.cwd()
const workspaceRoot = path.join(repositoryRoot, 'workspace-template')

function resolveWorkspacePath(relativePath) {
  return path.join(workspaceRoot, ...relativePath.split('/'))
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(resolveWorkspacePath(relativePath), 'utf8'))
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const manifest = await readJson('.workspace/manifest.json')
const config = await readJson('.workspace/config.json')
const registryPath = manifest.entrypoints?.baseTemplate
assert(registryPath === '.workspace/base-template/registry.json', 'Manifest 的 Base Template 入口无效')

const registry = await readJson(registryPath)
const current = registry.versions?.find((version) => version.id === registry.current)
assert(current, 'Base Template Registry 缺少当前版本')
assert(current.name === 'Base Template V1' && current.version === '1.0.0', '当前模板不是 Base Template V1')
assert(config.templateVersion === current.version, 'Workspace Config 与 Base Template Registry 版本不一致')

const guide = await readJson(current.guidePath)
assert(guide.templateVersion === current.id, '快速入门与当前模板版本不匹配')
assert(guide.productName === 'AI Coding Workspace', '快速入门缺少产品名称')
assert(Array.isArray(guide.modules) && guide.modules.length >= 9, '快速入门的真实功能介绍不完整')
assert(Array.isArray(guide.limitations) && guide.limitations.length >= 5, '快速入门的当前限制不完整')
assert(Array.isArray(guide.harness?.paragraphs) && guide.harness.paragraphs.length >= 3, 'Harness 普通用户说明不完整')

const requiredModules = ['knowledge', 'markdown', 'spaces', 'workspace-settings', 'roles', 'skills', 'releases', 'agents', 'git-sync']
const moduleIds = new Set(guide.modules.map((module) => module.id))
for (const id of requiredModules) assert(moduleIds.has(id), `快速入门缺少 ${id} 模块`)

assert(typeof config.defaultDocument === 'string' && config.defaultDocument.startsWith('开始阅读/'), '默认项目首页不在“开始阅读”中')
const initializerSource = await fs.readFile(path.join(repositoryRoot, 'src/features/workspace/WorkspaceInitializationService.ts'), 'utf8')
assert(initializerSource.includes(config.defaultDocument), '初始化流程不会生成默认项目首页')
await fs.access(resolveWorkspacePath(config.defaultDocument)).then(
  () => { throw new Error('未初始化 Base Template 不应预置具体项目首页') },
  () => undefined,
)

const maintenanceRulePath = resolveWorkspacePath('.workspace/base-template/maintenance-rule.md')
const maintenanceRule = await fs.readFile(maintenanceRulePath, 'utf8')
for (const phrase of ['Base Template Version', '快速入门', '功能介绍', '当前限制', '版本更新说明']) {
  assert(maintenanceRule.includes(phrase), `Base Template 维护规则缺少“${phrase}”`)
}

const headerSource = await fs.readFile(path.join(repositoryRoot, 'src/components/layout/WorkspaceHeader.vue'), 'utf8')
const shellSource = await fs.readFile(path.join(repositoryRoot, 'src/components/layout/WorkspaceShell.vue'), 'utf8')
assert(headerSource.includes('快速入门') && headerSource.includes('openGettingStarted'), '右上角缺少快速入门入口')
assert(shellSource.includes('store.projectHomePath') && shellSource.includes('store.isWorkspaceInitialized'), '快速开始没有使用初始化状态与默认项目首页')

console.log('Base Template guide validation passed.\n')
console.log([
  `- Current template: ${current.name} (${current.version})`,
  `- Guide source: ${current.guidePath}`,
  `- Modules: ${guide.modules.length}`,
  `- Limitations: ${guide.limitations.length}`,
  `- Project home: ${config.defaultDocument} (generated during initialization)`,
  '- Harness maintenance rule: complete',
  '- Quick start routing: initialized and fallback paths present',
].join('\n'))
