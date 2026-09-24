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

assert(manifest.workspace?.id === '', 'Base Template 不应预置 Workspace ID')
assert(manifest.workspace?.name === '', 'Base Template 不应预置项目名称')
assert(manifest.workspace?.description === '', 'Base Template 不应预置项目介绍')
assert(activeRoles.activeRoleIds?.length === 0, 'Base Template 不应预置 Active Roles')
assert(releases.current === null && releases.releases?.length === 0, 'Base Template 不应预置项目 Release')
assert(!config.contentRoots.includes('空间配置'), '系统空间配置不应进入 Knowledge Layer')
assert(!config.spaces.some((space) => space.id === 'space-config'), '系统空间配置不应注册为专业 Space')

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
for (const skill of skills.skills) {
  assert(!/^[A-Za-z]:[\\/]|^\/Users\/|^\/home\//.test(skill.installPath), `Skill ${skill.id} 使用机器绝对路径`)
  await fs.access(resolveTemplate(skill.skillFile))
}

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

const gitPlugin = await fs.readFile(path.join(root, 'server', 'workspaceGitPlugin.ts'), 'utf8')
const statusHandler = gitPlugin.split("if (pathname === '/api/git/status')")[1]?.split("if (pathname === '/api/git/diff')")[0] ?? ''
assert(!statusHandler.includes('materializeWorkspace'), '读取 Git 状态不应把浏览器测试快照写回 Base Template')

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
