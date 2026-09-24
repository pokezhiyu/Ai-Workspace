import { createHash, randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import type { Dirent } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import os from 'node:os'
import path from 'node:path'
import matter from 'gray-matter'
import type { Plugin } from 'vite'

const WORKSPACE_SKILL_PATH = '.workspace/skills/installed'
const MAX_BODY_SIZE = 2 * 1024 * 1024
const SENSITIVE_FILE_NAMES = new Set(['.env', '.pypirc', 'credentials.json', 'id_rsa', 'id_ed25519'])

interface SkillHealth {
  valid: boolean
  issues: string[]
  checkedAt: string
}

interface SkillMetadata {
  id: string
  name: string
  description: string
  purpose: string
  capabilities: string[]
  version: string | null
  source: string | null
  metadataFiles: string[]
  fingerprint: string
  health: SkillHealth
}

interface DiscoveredSkill extends SkillMetadata {
  status: 'enabled' | 'invalid'
  enabled: boolean
  installPath: string
  skillFile: string
  scope: 'workspace'
  deletable: true
}

interface ExternalSkillRoot {
  path: string
  origin: 'codex-global' | 'claude-global'
}

interface SkillImportCandidate {
  id: string
  name: string
  purpose: string
  capabilities: string[]
  version: string | null
  source: string | null
  origin: ExternalSkillRoot['origin']
}

const capabilityRules: Array<[string, RegExp]> = [
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validSkillId(value: unknown): string {
  const id = typeof value === 'string' ? value.trim() : ''
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(id)) throw new Error('Skill ID 格式无效。')
  return id
}

function titleCase(value: string): string {
  return value.split(/[-_\s]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function normalizeSource(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  return value.trim().replace(/^git\+/, '').replace(/\.git$/, '')
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function loadJson(filePath: string, issues?: string[]): Promise<Record<string, unknown> | null> {
  if (!await exists(filePath)) return null
  try {
    const value: unknown = JSON.parse(await fs.readFile(filePath, 'utf8'))
    if (!isRecord(value)) throw new Error('根结构必须是对象')
    return value
  } catch (error) {
    issues?.push(`${path.basename(filePath)} 无法解析：${error instanceof Error ? error.message : '未知错误'}`)
    return null
  }
}

function repositoryUrl(metadata: Record<string, unknown> | null): unknown {
  const repository = metadata?.repository
  if (typeof repository === 'string') return repository
  return isRecord(repository) ? repository.url : null
}

async function metadataFiles(directory: string, id: string): Promise<string[]> {
  const candidates = [
    path.join(directory, 'package.json'),
    path.join(directory, '.codex-plugin', 'plugin.json'),
    path.join(directory, 'ai-discovery', `${id}.manifest.json`),
  ]
  const found: string[] = []
  for (const candidate of candidates) {
    if (await exists(candidate)) found.push(path.relative(directory, candidate).replaceAll('\\', '/'))
  }
  return found
}

async function readDirectories(root: string): Promise<Dirent[]> {
  try {
    return (await fs.readdir(root, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink() && !entry.name.startsWith('.'))
  } catch {
    return []
  }
}

async function readSkillMetadata(
  directory: string,
  id: string,
  overrides: Record<string, unknown>,
  checkedAt: string,
): Promise<SkillMetadata> {
  const skillFile = path.join(directory, 'SKILL.md')
  const issues: string[] = []
  let sourceText = ''
  let frontmatter: Record<string, unknown> = {}
  if (!await exists(skillFile)) issues.push('缺少 SKILL.md。')
  else {
    try {
      const stats = await fs.stat(skillFile)
      if (!stats.isFile()) issues.push('SKILL.md 不是普通文件。')
      else {
        sourceText = await fs.readFile(skillFile, 'utf8')
        const parsed = matter(sourceText)
        frontmatter = isRecord(parsed.data) ? parsed.data : {}
      }
    } catch (error) {
      issues.push(`SKILL.md 无法读取：${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
  const packageMetadata = await loadJson(path.join(directory, 'package.json'), issues)
  const overrideValue = overrides[id]
  const workspaceMetadata = isRecord(overrideValue) ? overrideValue : {}
  const description = String(frontmatter.description ?? packageMetadata?.description ?? '').trim()
  if (sourceText && !description) issues.push('SKILL.md 缺少 description metadata。')
  const name = String(workspaceMetadata.name ?? frontmatter.name ?? packageMetadata?.name ?? titleCase(id)).trim() || titleCase(id)
  const searchableText = `${id} ${name} ${description}`
  const inferredCapabilities = capabilityRules.filter(([, pattern]) => pattern.test(searchableText)).map(([capability]) => capability)
  const declaredCapabilities = Array.isArray(workspaceMetadata.capabilities)
    ? workspaceMetadata.capabilities.filter((value): value is string => typeof value === 'string')
    : []
  return {
    id,
    name,
    description,
    purpose: String(workspaceMetadata.purpose ?? description).trim() || '未提供用途说明。',
    capabilities: [...new Set([...declaredCapabilities, ...inferredCapabilities])].sort(),
    version: String(frontmatter.version ?? packageMetadata?.version ?? '').trim() || null,
    source: normalizeSource(repositoryUrl(packageMetadata) ?? frontmatter.homepage ?? packageMetadata?.homepage),
    metadataFiles: [...(sourceText ? ['SKILL.md'] : []), ...await metadataFiles(directory, id)],
    fingerprint: `sha256:${createHash('sha256').update(sourceText || `${id}:${issues.join('|')}`).digest('hex')}`,
    health: { valid: issues.length === 0, issues, checkedAt },
  }
}

function physicalWorkspaceSkillRoot(projectRoot: string): string {
  return path.join(projectRoot, 'workspace-template', '.workspace', 'skills', 'installed')
}

function registryInstallPath(id: string): string {
  return `${WORKSPACE_SKILL_PATH}/${id}`
}

async function readOverrides(projectRoot: string): Promise<Record<string, unknown>> {
  const overridePath = path.join(projectRoot, 'workspace-template', '.workspace', 'skills', 'registry-overrides.json')
  return await loadJson(overridePath) ?? {}
}

function externalSkillRoots(): ExternalSkillRoot[] {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex')
  const candidates: ExternalSkillRoot[] = [
    {
      path: path.resolve(process.env.WORKSPACE_SKILL_IMPORT_ROOT || path.join(codexHome, 'skills')),
      origin: 'codex-global',
    },
    { path: path.join(os.homedir(), '.claude', 'skills'), origin: 'claude-global' },
  ]
  const seen = new Set<string>()
  return candidates.filter((candidate) => {
    const key = path.resolve(candidate.path).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function discoverWorkspaceSkills(projectRoot: string) {
  const checkedAt = new Date().toISOString()
  const overrides = await readOverrides(projectRoot)
  const workspaceRoot = physicalWorkspaceSkillRoot(projectRoot)
  const skills: DiscoveredSkill[] = []
  for (const entry of await readDirectories(workspaceRoot)) {
    const metadata = await readSkillMetadata(path.join(workspaceRoot, entry.name), entry.name, overrides, checkedAt)
    skills.push({
      ...metadata,
      status: metadata.health.valid ? 'enabled' : 'invalid',
      enabled: metadata.health.valid,
      installPath: registryInstallPath(entry.name),
      skillFile: `${registryInstallPath(entry.name)}/SKILL.md`,
      scope: 'workspace',
      deletable: true,
    })
  }
  const officialIds = new Set(skills.map((skill) => skill.id))
  const candidates = new Map<string, SkillImportCandidate>()
  for (const root of externalSkillRoots()) {
    for (const entry of await readDirectories(root.path)) {
      if (officialIds.has(entry.name) || candidates.has(entry.name)) continue
      const metadata = await readSkillMetadata(path.join(root.path, entry.name), entry.name, overrides, checkedAt)
      if (!metadata.health.valid) continue
      candidates.set(entry.name, {
        id: metadata.id,
        name: metadata.name,
        purpose: metadata.purpose,
        capabilities: metadata.capabilities,
        version: metadata.version,
        source: metadata.source,
        origin: root.origin,
      })
    }
  }
  return {
    discoveredAt: checkedAt,
    roots: [{ path: WORKSPACE_SKILL_PATH, scope: 'workspace' as const }],
    skills: skills.sort((left, right) => left.name.localeCompare(right.name, 'zh-CN')),
    externalCandidates: [...candidates.values()].sort((left, right) => left.name.localeCompare(right.name, 'zh-CN')),
  }
}

async function auditPortableSkill(directory: string, current = directory): Promise<void> {
  for (const entry of await fs.readdir(current, { withFileTypes: true })) {
    if (entry.name === '.git') continue
    const absolute = path.join(current, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Skill 包含符号链接，无法安全导入：${path.relative(directory, absolute)}`)
    if (entry.isDirectory()) await auditPortableSkill(directory, absolute)
    else {
      const lowerName = entry.name.toLowerCase()
      if (SENSITIVE_FILE_NAMES.has(lowerName)) {
        throw new Error(`Skill 包含可能的本地凭据文件，已停止导入：${path.relative(directory, absolute)}`)
      }
      if (lowerName === '.npmrc') {
        const content = await fs.readFile(absolute, 'utf8')
        const unsafeCredential = content.split(/\r?\n/).some((line) => {
          const match = line.match(/(?:_authToken|password|_password)\s*=\s*(.+)$/i)
          return Boolean(match?.[1] && !/^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(match[1].trim()))
        })
        if (unsafeCredential) throw new Error(`Skill 的 .npmrc 包含写死的认证信息，已停止导入：${path.relative(directory, absolute)}`)
      }
    }
  }
}

async function findExternalSkill(id: string): Promise<{ directory: string; origin: ExternalSkillRoot['origin'] } | null> {
  for (const root of externalSkillRoots()) {
    const directory = path.join(root.path, id)
    if (!await exists(directory)) continue
    const stats = await fs.lstat(directory)
    if (stats.isDirectory() && !stats.isSymbolicLink()) return { directory, origin: root.origin }
  }
  return null
}

async function importSkill(projectRoot: string, idValue: unknown): Promise<{ imported: true; id: string }> {
  const id = validSkillId(idValue)
  const source = await findExternalSkill(id)
  if (!source) throw new Error('外部 Skill 来源中未找到该 Skill。')
  const overrides = await readOverrides(projectRoot)
  const metadata = await readSkillMetadata(source.directory, id, overrides, new Date().toISOString())
  if (!metadata.health.valid) throw new Error(`Skill 配置异常，无法导入：${metadata.health.issues.join('；')}`)
  await auditPortableSkill(source.directory)
  const workspaceRoot = physicalWorkspaceSkillRoot(projectRoot)
  const target = path.join(workspaceRoot, id)
  if (await exists(target)) throw new Error('Workspace 已存在同名 Skill。')
  await fs.mkdir(workspaceRoot, { recursive: true })
  const temporaryTarget = path.join(workspaceRoot, `.importing-${id}-${randomUUID()}`)
  try {
    await fs.cp(source.directory, temporaryTarget, {
      recursive: true,
      errorOnExist: true,
      force: false,
      filter: (sourcePath) => !path.relative(source.directory, sourcePath).split(path.sep).includes('.git'),
    })
    await fs.rename(temporaryTarget, target)
  } catch (error) {
    await fs.rm(temporaryTarget, { recursive: true, force: true }).catch(() => undefined)
    throw error
  }
  return { imported: true, id }
}

async function readBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  let body = ''
  for await (const chunk of request) {
    body += String(chunk)
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_SIZE) throw new Error('Skill 请求内容过大。')
  }
  if (!body) return {}
  const parsed: unknown = JSON.parse(body)
  if (!isRecord(parsed)) throw new Error('请求结构无效。')
  return parsed
}

function sendJson(response: ServerResponse, status: number, payload: object): void {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function validRegistry(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value) || value.registryType !== 'workspace-skill-registry' || !Array.isArray(value.skills) || !isRecord(value.management)) return false
  if (value.sourceRoot !== WORKSPACE_SKILL_PATH) return false
  return value.skills.every((skill) => isRecord(skill)
    && skill.scope === 'workspace'
    && typeof skill.installPath === 'string'
    && skill.installPath.startsWith(`${WORKSPACE_SKILL_PATH}/`)
    && !path.isAbsolute(skill.installPath))
}

async function persistRegistry(projectRoot: string, registry: Record<string, unknown>): Promise<void> {
  const registryPath = path.join(projectRoot, 'workspace-template', '.workspace', 'skills', 'registry.json')
  await fs.mkdir(path.dirname(registryPath), { recursive: true })
  await fs.writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8')
}

async function removeSkill(projectRoot: string, idValue: unknown): Promise<{ removedFiles: true; scope: 'workspace' }> {
  const id = validSkillId(idValue)
  const workspaceRoot = path.resolve(physicalWorkspaceSkillRoot(projectRoot))
  const target = path.resolve(workspaceRoot, id)
  const relative = path.relative(workspaceRoot, target)
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('拒绝删除 Workspace Skill 根目录之外的内容。')
  if (!await exists(path.join(target, 'SKILL.md'))) throw new Error('Workspace 中未找到该 Skill；可以重新扫描清理 Registry。')
  await fs.rm(target, { recursive: true, force: false })
  return { removedFiles: true, scope: 'workspace' }
}

function skillMiddleware(projectRoot: string) {
  return async (request: IncomingMessage, response: ServerResponse, next: () => void): Promise<void> => {
    const pathname = request.url?.split('?')[0] ?? ''
    if (!pathname.startsWith('/api/workspace-skills/')) return next()
    if (request.method !== 'POST') return sendJson(response, 405, { error: '仅支持 POST 请求。' })
    try {
      if (pathname === '/api/workspace-skills/scan') return sendJson(response, 200, await discoverWorkspaceSkills(projectRoot))
      const body = await readBody(request)
      if (pathname === '/api/workspace-skills/registry') {
        if (!validRegistry(body.registry)) return sendJson(response, 400, { error: 'Skill Registry 必须只引用 Workspace 内的相对路径。' })
        await persistRegistry(projectRoot, body.registry)
        return sendJson(response, 200, { saved: true })
      }
      if (pathname === '/api/workspace-skills/import') return sendJson(response, 200, await importSkill(projectRoot, body.id))
      if (pathname === '/api/workspace-skills/delete') return sendJson(response, 200, await removeSkill(projectRoot, body.id))
      return sendJson(response, 404, { error: '未知 Skill 操作。' })
    } catch (error) {
      return sendJson(response, 500, { error: error instanceof Error ? error.message : 'Skill 操作失败。' })
    }
  }
}

export function workspaceSkillPlugin(projectRoot = process.cwd()): Plugin {
  const registryPath = path.join(projectRoot, 'workspace-template', '.workspace', 'skills', 'registry.json')
  const installedPath = physicalWorkspaceSkillRoot(projectRoot)
  return {
    name: 'workspace-local-skills',
    configureServer(server) {
      server.watcher.unwatch([registryPath, installedPath])
      server.middlewares.use(skillMiddleware(projectRoot))
    },
    configurePreviewServer(server) {
      server.middlewares.use(skillMiddleware(projectRoot))
    },
  }
}
