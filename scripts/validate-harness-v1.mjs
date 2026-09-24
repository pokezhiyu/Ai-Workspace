import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const repositoryRoot = process.cwd()
const workspaceRoot = path.join(repositoryRoot, 'workspace-template')

function resolveWorkspacePath(relativePath) {
  return path.join(workspaceRoot, ...relativePath.split('/'))
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(resolveWorkspacePath(relativePath), 'utf8'))
}

async function readText(relativePath) {
  return fs.readFile(resolveWorkspacePath(relativePath), 'utf8')
}

const manifest = await readJson('.workspace/manifest.json')
assert(manifest.entrypoints?.harness === '.workspace/harness', 'Manifest 未指向 Harness V1')

const harnessRoot = manifest.entrypoints.harness
const readme = await readText(`${harnessRoot}/README.md`)
const expectedRules = {
  'context.md': ['Progressive Context Loading', 'Manifest', 'Active Roles', 'Current Release', 'Enabled Skills'],
  'knowledge.md': ['稳定语义', 'Frontmatter', 'Document', 'Workspace 不是 Agent 工作日志'],
  'work.md': ['理解任务', '验证结果', 'ADR / Decision', '普通任务不得顺带修改 Harness'],
  'access.md': ['RoleAccessService', 'Workspace Guard', 'System Layer', '不维护 Role × Space 权限表'],
  'skills.md': ['Skill Registry', 'disabled', 'SKILL.md', '不保存 Skill 清单'],
  'release.md': ['Current Release', 'Release Registry', 'Git', '不保存当前 Release ID'],
  'handoff.md': ['不得假设', 'Workspace Knowledge', '后继 Agent', '不建立 Agent Session Log'],
}

const rulesDirectory = resolveWorkspacePath(`${harnessRoot}/rules`)
const actualRules = (await fs.readdir(rulesDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort()
const expectedRuleNames = Object.keys(expectedRules).sort()
assert(JSON.stringify(actualRules) === JSON.stringify(expectedRuleNames), `Harness Rules 应恰好包含七类，实际为：${actualRules.join(', ')}`)

const ruleSources = []
for (const [fileName, phrases] of Object.entries(expectedRules)) {
  assert(readme.includes(`rules/${fileName}`), `Harness README 缺少 ${fileName} 入口`)
  const source = await readText(`${harnessRoot}/rules/${fileName}`)
  ruleSources.push(source)
  for (const phrase of phrases) assert(source.includes(phrase), `${fileName} 缺少“${phrase}”`)
}

const harnessSource = `${readme}\n${ruleSources.join('\n')}`
for (const forbidden of ['"activeRoleIds"', '"skills"', '"current": "v', 'generatedAt', 'Agent Thinking Log']) {
  assert(!harnessSource.includes(forbidden), `Harness 不应保存运行时状态或日志：${forbidden}`)
}

const legacyRules = [
  '.workspace/rules/agent-context-rule.md',
  '.workspace/rules/document-rule.md',
  '.workspace/rules/naming-rule.md',
  '.workspace/rules/version-rule.md',
  '.workspace/rules/product-design-rule.md',
  '.workspace/rules/base-template-maintenance-rule.md',
]
for (const legacyPath of legacyRules) {
  await fs.access(resolveWorkspacePath(legacyPath)).then(
    () => { throw new Error(`仍存在旧 Harness 规则：${legacyPath}`) },
    () => undefined,
  )
}

await fs.access(resolveWorkspacePath('.workspace/base-template/maintenance-rule.md'))
await fs.access(resolveWorkspacePath('.workspace/templates/product-design.md'))

const roleAccessSource = await fs.readFile(path.join(repositoryRoot, 'src/features/roles/RoleAccessService.ts'), 'utf8')
const skillRegistrySource = await fs.readFile(path.join(repositoryRoot, 'src/features/skills/WorkspaceSkillRegistryService.ts'), 'utf8')
const releaseServiceSource = await fs.readFile(path.join(repositoryRoot, 'src/features/releases/WorkspaceReleaseService.ts'), 'utf8')
assert(roleAccessSource.includes('canWritePath') && roleAccessSource.includes('isWorkspaceSystemPath'), 'RoleAccessService 不再是访问事实来源')
assert(skillRegistrySource.includes('getEnabledSkills'), 'Skill Registry Service 缺少 enabled Skills 入口')
assert(releaseServiceSource.includes('RELEASE_REGISTRY_PATH'), 'Release System 缺少 Registry 事实来源')

console.log('Harness V1 validation passed.\n')
console.log([
  `- Harness: ${harnessRoot}`,
  `- Rules: ${actualRules.length} (${actualRules.join(', ')})`,
  '- Runtime state copies: none',
  '- Legacy Harness rules: removed',
  '- Role access source: RoleAccessService / Workspace Guard',
  '- Skill state source: Skill Registry Service',
  '- Release state source: Release Registry Service',
].join('\n'))
