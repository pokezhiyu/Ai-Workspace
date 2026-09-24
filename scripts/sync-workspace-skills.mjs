import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import matter from 'gray-matter'

const projectRoot = process.cwd()
const codexHome = process.env.CODEX_HOME || join(homedir(), '.codex')
const externalSkillRoot = resolve(process.env.WORKSPACE_SKILL_IMPORT_ROOT || join(codexHome, 'skills'))
const registryDirectory = join(projectRoot, 'workspace-template', '.workspace', 'skills')
const registryPath = join(registryDirectory, 'registry.json')
const overridesPath = join(registryDirectory, 'registry-overrides.json')
const workspaceSkillRoot = join(registryDirectory, 'installed')
const checkedAt = new Date().toISOString()

if (!existsSync(overridesPath)) throw new Error(`Skill Registry 配置不存在：${overridesPath}`)

function loadJson(filePath) {
  if (!existsSync(filePath)) return null
  try { return JSON.parse(readFileSync(filePath, 'utf8')) } catch { return null }
}

const overrides = loadJson(overridesPath) || {}
const previousRegistry = loadJson(registryPath) || {}
const previousById = new Map(Array.isArray(previousRegistry.skills) ? previousRegistry.skills.map((skill) => [skill.id, skill]) : [])
const excludedSkillIds = Array.isArray(previousRegistry.management?.excludedSkillIds)
  ? previousRegistry.management.excludedSkillIds.filter((id) => typeof id === 'string')
  : []

const capabilityRules = [
  ['browser-automation', /browser|cdp|web interaction|automation/i],
  ['ui-testing', /testing|test automation|screenshot/i],
  ['editable-diagram', /excalidraw|editable.*diagram|whiteboard/i],
  ['technical-diagram', /technical diagram|uml|architecture diagram/i],
  ['flowchart', /flowchart|workflow|process flow/i],
  ['prototype', /prototype|wireframe|frontend handoff/i],
  ['mindmap', /mind ?map/i],
  ['product-design', /product design|ui\/ux|user experience/i],
  ['accessibility', /accessibility|wcag/i],
  ['design-system', /design system/i],
  ['svg', /\bsvg\b/i],
  ['visual-documentation', /visual|diagram|graph/i],
]

function normalizeSource(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  return value.trim().replace(/^git\+/, '').replace(/\.git$/, '')
}

function titleCase(value) {
  return value.split(/[-_\s]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function metadataFiles(directory, id) {
  return [
    join(directory, 'package.json'),
    join(directory, '.codex-plugin', 'plugin.json'),
    join(directory, 'ai-discovery', `${id}.manifest.json`),
  ].filter(existsSync).map((filePath) => relative(directory, filePath).replaceAll('\\', '/'))
}

const discoveryRoots = [
  { physicalPath: workspaceSkillRoot, path: '.workspace/skills/installed', scope: 'workspace' },
]

const discovered = discoveryRoots.flatMap((root) => !existsSync(root.physicalPath) ? [] : readdirSync(root.physicalPath, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink() && !entry.name.startsWith('.'))
  .map((entry) => {
    const id = entry.name
    const directory = join(root.physicalPath, id)
    const skillFile = join(directory, 'SKILL.md')
    const workspaceMetadata = overrides[id] || {}
    const issues = []
    let sourceText = ''
    let frontmatter = {}
    if (!existsSync(skillFile) || !statSync(skillFile).isFile()) issues.push('缺少 SKILL.md。')
    else {
      try {
        sourceText = readFileSync(skillFile, 'utf8')
        frontmatter = matter(sourceText).data || {}
      } catch (error) {
        issues.push(`SKILL.md 无法读取：${error instanceof Error ? error.message : '未知错误'}`)
      }
    }
    const packageMetadata = loadJson(join(directory, 'package.json'))
    const description = String(frontmatter.description || packageMetadata?.description || '').trim()
    if (sourceText && !description) issues.push('SKILL.md 缺少 description metadata。')
    const name = String(workspaceMetadata.name || frontmatter.name || packageMetadata?.name || titleCase(id))
    const searchableText = `${id} ${name} ${description}`
    const capabilities = [...new Set([
      ...(Array.isArray(workspaceMetadata.capabilities) ? workspaceMetadata.capabilities : []),
      ...capabilityRules.filter(([, pattern]) => pattern.test(searchableText)).map(([capability]) => capability),
    ])].sort()
    const repository = typeof packageMetadata?.repository === 'string' ? packageMetadata.repository : packageMetadata?.repository?.url
    const valid = issues.length === 0
    const previous = previousById.get(id)
    const enabled = valid && previous?.enabled !== false && previous?.status !== 'disabled'
    return {
      id,
      name,
      description,
      purpose: String(workspaceMetadata.purpose || description || '未提供用途说明。'),
      capabilities,
      status: valid ? enabled ? 'enabled' : 'disabled' : 'invalid',
      enabled,
      installPath: `${root.path}/${id}`,
      skillFile: `${root.path}/${id}/SKILL.md`,
      version: String(frontmatter.version || packageMetadata?.version || '').trim() || null,
      source: normalizeSource(repository || frontmatter.homepage || packageMetadata?.homepage),
      metadataFiles: [...(sourceText ? ['SKILL.md'] : []), ...metadataFiles(directory, id)],
      fingerprint: `sha256:${createHash('sha256').update(sourceText || `${id}:${issues.join('|')}`).digest('hex')}`,
      scope: root.scope,
      deletable: true,
      health: { valid, issues, checkedAt },
    }
  }))

const seenSkillIds = new Set()
const uniqueSkills = discovered.filter((skill) => {
  if (seenSkillIds.has(skill.id)) return false
  seenSkillIds.add(skill.id)
  return true
})
const discoveredIds = new Set(uniqueSkills.map((skill) => skill.id))
const activeExclusions = excludedSkillIds.filter((id) => discoveredIds.has(id))
const excluded = new Set(activeExclusions)
const skills = uniqueSkills.filter((skill) => !excluded.has(skill.id)).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
const registry = {
  schemaVersion: '1.1.0',
  registryType: 'workspace-skill-registry',
  generatedAt: checkedAt,
  sourceRoot: '.workspace/skills/installed',
  sourceOfTruth: 'Each discovered Skill directory and its SKILL.md file.',
  management: {
    supported: ['discover', 'inspect', 'enable', 'disable', 'remove-reference', 'health-check'],
    planned: ['install', 'update'],
    excludedSkillIds: activeExclusions,
  },
  discoveryRoots: discoveryRoots.map(({ path: registryPath, scope }) => ({ path: registryPath, scope })),
  skills,
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8')
console.log(`Synced ${skills.length} Workspace Skills (${skills.filter((skill) => skill.status === 'invalid').length} invalid) -> ${registryPath}`)
if (existsSync(externalSkillRoot)) console.log(`External discovery source (not registered): ${externalSkillRoot}`)
