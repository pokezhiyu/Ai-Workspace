import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const repositoryRoot = process.cwd()
const workspaceRoot = path.join(repositoryRoot, 'workspace-template')
const manifestPath = path.join(workspaceRoot, '.workspace', 'manifest.json')

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

function resolveWorkspacePath(relativePath) {
  return path.join(workspaceRoot, ...relativePath.split('/'))
}

async function assertExists(filePath, label) {
  await fs.access(filePath)
  return `${label}: ${path.relative(repositoryRoot, filePath).replaceAll('\\', '/')}`
}

async function findProtocolFiles(directory) {
  const matches = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) matches.push(...await findProtocolFiles(entryPath))
    else if (entry.name === 'protocol.json' && entryPath.includes(`${path.sep}.workspace${path.sep}agents${path.sep}`)) matches.push(entryPath)
  }
  return matches
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const manifest = await readJson(manifestPath)
assert(typeof manifest.entrypoints?.agentProtocol === 'string', 'Manifest 缺少 entrypoints.agentProtocol')

const protocolPath = resolveWorkspacePath(manifest.entrypoints.agentProtocol)
const protocol = await readJson(protocolPath)
assert(protocol.sourceOfTruth === manifest.entrypoints.agentProtocol, 'Protocol sourceOfTruth 与 Manifest 入口不一致')
assert(protocol.status === 'system-readonly', 'Protocol 必须是 system-readonly')
assert(protocol.systemPolicy?.humanUiMode === 'read-only', 'Human UI 必须只读')
assert(protocol.systemPolicy?.mutableByRegularAgent === false, '普通 Agent 不得修改协议')
assert(protocol.systemPolicy?.canDisable === false && protocol.systemPolicy?.canDelete === false, 'Protocol 不得禁用或删除')
assert(protocol.handoff?.assumeSharedConversationHistory === false, 'Handoff 不得假设共享聊天历史')
assert(protocol.contextStrategy?.allowFullWorkspaceScan === false, 'Context Protocol 必须采用渐进加载')
assert(Array.isArray(protocol.protocols) && protocol.protocols.length === 9, '核心协议应包含 9 项')

const harnessPath = resolveWorkspacePath(manifest.entrypoints.harness)
const roleRegistryPath = resolveWorkspacePath(manifest.entrypoints.roles)
const releaseRegistryPath = resolveWorkspacePath(manifest.entrypoints.releases)
const skillRegistryPath = resolveWorkspacePath(`${manifest.entrypoints.skills}/registry.json`)
const harnessReadmePath = path.join(harnessPath, 'README.md')
const knowledgeIndexPath = resolveWorkspacePath('.workspace/context/workspace-index.md')

const roleRegistry = await readJson(roleRegistryPath)
const activeRolesPath = resolveWorkspacePath(roleRegistry.activeRolesPath)
const activeRoles = await readJson(activeRolesPath)
const releaseRegistry = await readJson(releaseRegistryPath)
const skillRegistry = await readJson(skillRegistryPath)
const enabledSkills = skillRegistry.skills.filter((skill) => skill.enabled && skill.status === 'enabled' && skill.health?.valid)
const initialized = Boolean(manifest.workspace?.name?.trim() && manifest.workspace?.id?.trim())
const currentRelease = releaseRegistry.releases.find((release) => release.id === releaseRegistry.current)

assert(protocol.entryFlow?.find((entry) => entry.id === 'harness')?.source === manifest.entrypoints.harness, 'Protocol 的 Harness 入口与 Manifest 不一致')
assert(Array.isArray(activeRoles.activeRoleIds), 'Active Roles 无法读取')
if (initialized) {
  assert(currentRelease, '已初始化 Workspace 的 Current Release 无法读取')
  await assertExists(resolveWorkspacePath(currentRelease.summaryPath), 'Current Release Summary')
  await assertExists(knowledgeIndexPath, 'Workspace Index')
} else {
  assert(releaseRegistry.current === null && releaseRegistry.releases.length === 0, '未初始化模板不应包含项目 Release')
  assert(activeRoles.activeRoleIds.length === 0, '未初始化模板不应包含 Active Roles')
  await fs.access(knowledgeIndexPath).then(
    () => { throw new Error('未初始化模板不应预置项目 Workspace Index') },
    () => undefined,
  )
}
for (const skill of enabledSkills) await assertExists(resolveWorkspacePath(skill.skillFile), `Enabled Skill ${skill.id}`)

const bootstrapPaths = [path.join(repositoryRoot, 'AGENTS.md'), path.join(repositoryRoot, 'CLAUDE.md')]
for (const bootstrapPath of bootstrapPaths) {
  const content = await fs.readFile(bootstrapPath, 'utf8')
  assert(content.length < 800, `${path.basename(bootstrapPath)} 不是薄 Bootstrap`)
  assert(content.includes('manifest.json') && content.includes('entrypoints.agentProtocol'), `${path.basename(bootstrapPath)} 未指向统一入口`)
  assert(!content.includes('No Agent Memory Dependency'), `${path.basename(bootstrapPath)} 复制了 Protocol 规则`)
}

const protocolFiles = await findProtocolFiles(repositoryRoot)
assert(protocolFiles.length === 1, `发现 ${protocolFiles.length} 份 Agent Protocol Source of Truth`)
const serializedProtocol = JSON.stringify(protocol)
assert(!/[A-Za-z]:\\\\|\/Users\/|\/home\//.test(serializedProtocol), 'Protocol 包含机器绝对路径')

const results = [
  await assertExists(manifestPath, 'Manifest'),
  await assertExists(protocolPath, 'Agent Protocol'),
  await assertExists(harnessPath, 'Harness'),
  await assertExists(harnessReadmePath, 'Harness README'),
  `Workspace State: ${initialized ? 'initialized' : 'uninitialized'}`,
  `Active Roles: ${activeRoles.activeRoleIds.length}`,
  `Current Release: ${currentRelease?.id ?? 'none (created during initialization)'}`,
  `Enabled Skills: ${enabledSkills.length}`,
  `Protocol Sources: ${protocolFiles.length}`,
  'Bootstrap: AGENTS.md + CLAUDE.md (thin pointers)',
  'Handoff: repository-only continuation validated',
]

console.log('Agent Protocol validation passed.\n')
console.log(results.map((item) => `- ${item}`).join('\n'))
