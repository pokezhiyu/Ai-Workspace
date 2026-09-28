import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const templateRoot = path.join(root, 'workspace-template')

function resolveTemplate(relativePath) {
  return path.join(templateRoot, ...relativePath.split('/'))
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(resolveTemplate(relativePath), 'utf8'))
}

async function listFiles(directory) {
  const files = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await listFiles(entryPath))
    else files.push(entryPath)
  }
  return files
}

const manifest = await readJson('.workspace/manifest.json')
const config = await readJson('.workspace/config.json')
const activeRoles = await readJson('.workspace/roles/active.json')
const releases = await readJson('.workspace/releases/registry.json')
const skills = await readJson('.workspace/skills/registry.json')
const baseTemplate = await readJson('.workspace/base-template/registry.json')
const roleRegistry = await readJson('.workspace/roles/registry.json')

assert(manifest.workspace?.id === '', 'Base Template 不应预置 Workspace ID')
assert(manifest.workspace?.name === '', 'Base Template 不应预置项目名称')
assert(manifest.workspace?.description === '', 'Base Template 不应预置项目介绍')
assert(activeRoles.activeRoleIds?.length === 0, 'Base Template 不应预置 Active Roles')
assert(releases.current === null && releases.releases?.length === 0, 'Base Template 不应预置项目 Release')
assert(!config.contentRoots.includes('空间配置'), '系统空间配置不应进入 Knowledge Layer')
assert(!config.spaces.some((space) => space.id === 'space-config'), '系统空间配置不应注册为专业 Space')
assert(/^https:\/\/github\.com\/[^/]+\/[^/]+$/i.test(baseTemplate.sourceRepository), 'Base Template 必须声明稳定的源仓库标识')
const productRole = roleRegistry.roles?.find((role) => role.id === 'product')
assert(productRole?.accessibleSpaceIds?.includes('start'), '产品经理必须可以维护“开始阅读”项目入口')

const allowedRolePaths = new Set([
  '产品空间/项目角色/产品经理.md',
  '设计空间/项目角色/UI-UX-设计师.md',
  '技术空间/项目角色/开发工程师.md',
  '测试空间/项目角色/QA-工程师.md',
  '运维空间/项目角色/运维工程师.md',
])
const contentRootFiles = (await Promise.all(config.contentRoots.map(async (contentRoot) => {
  const physicalRoot = resolveTemplate(contentRoot)
  return fs.access(physicalRoot).then(() => listFiles(physicalRoot), () => [])
}))).flat().map((filePath) => path.relative(templateRoot, filePath).replaceAll('\\', '/'))
const unexpectedKnowledge = contentRootFiles.filter((filePath) => !allowedRolePaths.has(filePath))
assert(unexpectedKnowledge.length === 0, `发现项目实例知识：${unexpectedKnowledge.join(', ')}`)

assert(skills.sourceRoot === '.workspace/skills/installed', 'Skill Source of Truth 必须位于 Workspace 内')
const expectedDefaultSkillIds = [
  'ai-figure',
  'browser-use',
  'excalidraw',
  'frontend-design',
  'uxcraft',
  'web-artifacts-builder',
]
const actualDefaultSkillIds = skills.skills.map((skill) => skill.id).sort()
assert(JSON.stringify(actualDefaultSkillIds) === JSON.stringify(expectedDefaultSkillIds), `默认 Skill 组合不正确：${actualDefaultSkillIds.join(', ')}`)
for (const skill of skills.skills) {
  assert(!/^[A-Za-z]:[\\/]|^\/Users\/|^\/home\//.test(skill.installPath), `Skill ${skill.id} 使用机器绝对路径`)
  assert(skill.status === 'enabled' && skill.enabled === true && skill.health?.valid === true, `默认 Skill ${skill.id} 必须处于可用状态`)
  await fs.access(resolveTemplate(skill.skillFile))
}
assert(!actualDefaultSkillIds.includes('fireworks-tech-graph'), 'Fireworks Tech Graph 已被 AI Figure 替换，不应继续出现在默认模板')

const initializer = await fs.readFile(path.join(root, 'src', 'features', 'workspace', 'WorkspaceInitializationService.ts'), 'utf8')
for (const requiredPath of [
  '开始阅读/项目入口/项目介绍.md',
  '.workspace/context/workspace-index.md',
  '.workspace/harness/project.md',
  '.workspace/roles/active.json',
  '.workspace/releases/registry.json',
  '.workspace/releases/v1.md',
]) assert(initializer.includes(requiredPath), `初始化器缺少 ${requiredPath}`)
assert(initializer.includes('activeRoleIds: [...new Set(activeRoleIds)]'), '初始化器必须根据用户选择生成 Active Roles')

const onboarding = await fs.readFile(path.join(root, 'src', 'components', 'onboarding', 'WorkspaceInitializationDialog.vue'), 'utf8')
for (const phrase of ['下一步', '选择工作角色', '跳过，稍后设置', '保存并进入 Workspace']) {
  assert(onboarding.includes(phrase), `初始化向导缺少“${phrase}”`)
}

const roleAccessService = await fs.readFile(path.join(root, 'src', 'features', 'roles', 'RoleAccessService.ts'), 'utf8')
assert(roleAccessService.includes('...role.accessibleSpaceIds'), 'RoleAccessService 必须应用角色的附加可写空间')

const productRoleSource = await fs.readFile(resolveTemplate('产品空间/项目角色/产品经理.md'), 'utf8')
assert(productRoleSource.includes('accessibleSpaceIds: [start]'), '产品经理角色文档必须声明“开始阅读”写入权限')

const gitPlugin = await fs.readFile(path.join(root, 'server', 'workspaceGitPlugin.ts'), 'utf8')
const statusHandler = gitPlugin.split("if (pathname === '/api/git/status')")[1]?.split("if (pathname === '/api/git/diff')")[0] ?? ''
assert(!statusHandler.includes('materializeWorkspace'), '读取 Git 状态不应把浏览器测试快照写回 Base Template')
for (const phrase of ['remotePurpose', 'template-source', 'TEMPLATE_REMOTE_PROTECTED']) {
  assert(gitPlugin.includes(phrase), `Git 同步缺少模板来源保护：${phrase}`)
}

const gitSyncView = await fs.readFile(path.join(root, 'src', 'components', 'settings', 'GitSyncSettingsView.vue'), 'utf8')
assert(gitSyncView.includes("remotePurpose === 'project'"), 'GitHub 已连接状态必须只接受项目 Remote')
assert(gitSyncView.includes('isTemplateSource'), 'GitHub 同步界面必须隐藏模板来源地址')

const manifestSettingsView = await fs.readFile(path.join(root, 'src', 'components', 'settings', 'WorkspaceManifestSettingsView.vue'), 'utf8')
assert(!manifestSettingsView.includes('Schema Version'), '机器 Schema Version 不应出现在用户配置界面')

const forbiddenFiles = [
  '.workspace/context/workspace-index.md',
  '.workspace/releases/v1.md',
  '.workspace/releases/v2.md',
  '.workspace/releases/v3.md',
  '开始阅读/项目入口/项目介绍.md',
]
for (const forbiddenPath of forbiddenFiles) {
  await fs.access(resolveTemplate(forbiddenPath)).then(
    () => { throw new Error(`未初始化模板仍包含项目实例文件：${forbiddenPath}`) },
    () => undefined,
  )
}

console.log('Base Template clean-room validation passed.\n')
console.log([
  '- State: uninitialized',
  `- System spaces: ${config.spaces.length}`,
  `- Standard roles: ${allowedRolePaths.size}`,
  `- Workspace skills: ${skills.skills.length}`,
  '- Project knowledge: generated only after initialization',
  '- Project Harness / Release / Index: generated during initialization',
].join('\n'))
