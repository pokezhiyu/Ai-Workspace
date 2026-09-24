import type { WorkspaceFileAdapter, WorkspaceMoveOptions } from './WorkspaceFileAdapter'
import type { WorkspaceEntry } from '@/types/workspace'
import { basename, dirname, joinPath, normalizePath } from '@/utils/path'

const STORAGE_KEY = 'ai-coding-workspace:base-template-v1'
const ALWAYS_SYNCED_SEED_PATHS = new Set([
  '.workspace/base-template/registry.json',
  '.workspace/base-template/guides/v1.json',
  '.workspace/base-template/maintenance-rule.md',
  '.workspace/agents/protocol.json',
  '.workspace/roles/registry.json',
  '.workspace/harness/README.md',
  '.workspace/harness/rules/context.md',
  '.workspace/harness/rules/knowledge.md',
  '.workspace/harness/rules/work.md',
  '.workspace/harness/rules/access.md',
  '.workspace/harness/rules/skills.md',
  '.workspace/harness/rules/release.md',
  '.workspace/harness/rules/handoff.md',
])
const WORKSPACE_CONFIG_PATH = '.workspace/config.json'
const WORKSPACE_MANIFEST_PATH = '.workspace/manifest.json'
const WORKSPACE_INDEX_PATH = '.workspace/context/workspace-index.md'
const SKILL_REGISTRY_PATH = '.workspace/skills/registry.json'
const ROLE_REGISTRY_PATH = '.workspace/roles/registry.json'
const ACTIVE_ROLES_PATH = '.workspace/roles/active.json'
const AGENT_PROTOCOL_PATH = '.workspace/agents/protocol.json'
const BASE_TEMPLATE_REGISTRY_PATH = '.workspace/base-template/registry.json'
const HARNESS_ROOT_PATH = '.workspace/harness'

const LEGACY_HARNESS_PATHS = new Set([
  '.workspace/rules/agent-context-rule.md',
  '.workspace/rules/document-rule.md',
  '.workspace/rules/naming-rule.md',
  '.workspace/rules/version-rule.md',
  '.workspace/rules/product-design-rule.md',
  '.workspace/rules/base-template-maintenance-rule.md',
])

const LEGACY_ROLE_DESTINATIONS: Record<string, string> = {
  'roles/product-manager.md': '产品空间/项目角色/产品经理.md',
  'roles/designer.md': '设计空间/项目角色/UI-UX-设计师.md',
  'roles/frontend-engineer.md': '技术空间/项目角色/前端工程师.md',
  'roles/backend-engineer.md': '技术空间/项目角色/后端工程师.md',
  'roles/qa-engineer.md': '测试空间/项目角色/QA-工程师.md',
}

const LEGACY_DOCUMENT_PATHS = new Set([
  'docs/00-overview/current-status.md',
  'docs/00-overview/project-overview.md',
  'docs/01-product/product-vision.md',
  'docs/01-product/roadmap.md',
  'docs/01-product/workspace-requirement.md',
  'docs/02-design/product-design-guideline.md',
  'docs/02-design/workspace-user-flow.md',
  'docs/03-engineering/frontend-architecture.md',
  'docs/03-engineering/system-architecture.md',
  'docs/04-decisions/ADR-001-markdown-source-of-truth.md',
  'docs/04-decisions/ADR-002-git-version-control.md',
])

interface DefaultRoleLocalization {
  path: string
  legacyId: string
  id: string
  legacyTitle: string
  title: string
  legacyHeading: string
  heading: string
  legacyDescription: string
  description: string
}

const DEFAULT_ROLE_LOCALIZATIONS: DefaultRoleLocalization[] = [
  {
    path: '产品空间/项目角色/产品经理.md',
    legacyId: 'ROLE-PRODUCT-001',
    id: 'product-manager',
    legacyTitle: 'Product Manager',
    title: '产品经理',
    legacyHeading: '# Product manager',
    heading: '# 产品经理',
    legacyDescription: 'Owns product intent, active requirements, scope discipline, and acceptance criteria.',
    description: '负责产品目标、需求定义、范围管理与验收标准，维护项目中的核心产品知识。',
  },
  {
    path: '设计空间/项目角色/UI-UX-设计师.md',
    legacyId: 'ROLE-DESIGN-001',
    id: 'ui-ux-designer',
    legacyTitle: 'Designer',
    title: 'UI/UX 设计师',
    legacyHeading: '# Designer',
    heading: '# UI/UX 设计师',
    legacyDescription: 'Owns interaction quality, information hierarchy, accessibility, and the quiet developer-tool visual language.',
    description: '负责信息架构、交互体验、视觉规范与可用性设计。',
  },
  {
    path: '技术空间/项目角色/前端工程师.md',
    legacyId: 'ROLE-FRONTEND-001',
    id: 'frontend-engineer',
    legacyTitle: 'Frontend Engineer',
    title: '前端工程师',
    legacyHeading: '# Frontend engineer',
    heading: '# 前端工程师',
    legacyDescription: 'Owns the Vue application, typed UI contracts, accessibility, performance, and browser storage adapter.',
    description: '负责前端应用、组件、交互实现、性能与前端工程质量。',
  },
  {
    path: '技术空间/项目角色/后端工程师.md',
    legacyId: 'ROLE-BACKEND-001',
    id: 'backend-engineer',
    legacyTitle: 'Backend Engineer',
    title: '后端工程师',
    legacyHeading: '# Backend engineer',
    heading: '# 后端工程师',
    legacyDescription: 'Reserved for later phases that introduce remote storage or integration services. No backend is part of phase one.',
    description: '负责服务端能力、数据处理、接口与系统集成。',
  },
  {
    path: '测试空间/项目角色/QA-工程师.md',
    legacyId: 'ROLE-QA-001',
    id: 'qa-engineer',
    legacyTitle: 'QA Engineer',
    title: '测试工程师',
    legacyHeading: '# QA engineer',
    heading: '# 测试工程师',
    legacyDescription: 'Owns workflow verification, accessibility checks, cross-theme review, and regression coverage for file operations.',
    description: '负责测试计划、功能验证、回归测试与质量保障。',
  },
]

type SeedModule = Record<string, string>

const seedModules: SeedModule = {
  // Dot-directories are not matched reliably by the broad glob, so Harness files
  // remain an explicit seed source.
  ...import.meta.glob([
    '/workspace-template/.workspace/**/*.{md,json}',
    '!/workspace-template/.workspace/skills/installed/**',
  ], {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
  ...import.meta.glob([
    '/workspace-template/**/*.{md,json}',
    '!/workspace-template/.workspace/skills/installed/**',
  ], {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
}

interface SeedProjectParameters {
  name: string
  description: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function seedProjectParameters(): SeedProjectParameters {
  const manifestModule = Object.entries(seedModules).find(([modulePath]) => modulePath.endsWith('/.workspace/manifest.json'))
  if (!manifestModule) return { name: 'Workspace', description: '本地项目知识库' }
  try {
    const raw: unknown = JSON.parse(manifestModule[1])
    const workspace = isRecord(raw) && isRecord(raw.workspace) ? raw.workspace : {}
    return {
      name: typeof workspace.name === 'string' ? workspace.name : 'Workspace',
      description: typeof workspace.description === 'string' ? workspace.description : '本地项目知识库',
    }
  } catch {
    return { name: 'Workspace', description: '本地项目知识库' }
  }
}

function renderSeedTemplate(content: string, parameters: SeedProjectParameters): string {
  return content
    .replaceAll('{{PROJECT_NAME}}', parameters.name)
    .replaceAll('{{PROJECT_DESCRIPTION}}', parameters.description)
}

function mergeSkillRegistry(seedContent: string, currentContent: string): string {
  try {
    const seed: unknown = JSON.parse(seedContent)
    const current: unknown = JSON.parse(currentContent)
    if (!isRecord(seed) || !Array.isArray(seed.skills) || !isRecord(seed.management)) return currentContent
    if (!isRecord(current) || !Array.isArray(current.skills) || !isRecord(current.management)) return seedContent
    const currentSkills = new Map(current.skills.flatMap((skill) => isRecord(skill) && typeof skill.id === 'string' ? [[skill.id, skill]] : []))
    const excludedSkillIds = Array.isArray(current.management.excludedSkillIds)
      ? current.management.excludedSkillIds.filter((id): id is string => typeof id === 'string')
      : []
    const excluded = new Set(excludedSkillIds)
    seed.skills = seed.skills.flatMap((skill) => {
      if (!isRecord(skill) || typeof skill.id !== 'string' || excluded.has(skill.id)) return []
      const previous = currentSkills.get(skill.id)
      if (previous && (previous.enabled === false || previous.status === 'disabled') && skill.status !== 'invalid') {
        return [{ ...skill, enabled: false, status: 'disabled' }]
      }
      return [skill]
    })
    seed.management = { ...seed.management, excludedSkillIds }
    return `${JSON.stringify(seed, null, 2)}\n`
  } catch {
    return currentContent
  }
}

function shouldMigrateWorkspaceConfig(entry: WorkspaceEntry): boolean {
  if (entry.path !== WORKSPACE_CONFIG_PATH || entry.kind !== 'file') return false
  try {
    const raw: unknown = JSON.parse(entry.content ?? '')
    return !isRecord(raw) || typeof raw.schemaVersion !== 'string' || !Array.isArray(raw.spaces)
  } catch {
    return true
  }
}

function manifestWithLegacyIdentity(content: string, entries: WorkspaceEntry[]): string {
  const legacyConfig = entries.find((entry) => entry.path === WORKSPACE_CONFIG_PATH && entry.kind === 'file')
  if (!legacyConfig?.content) return content
  try {
    const manifestRaw: unknown = JSON.parse(content)
    const configRaw: unknown = JSON.parse(legacyConfig.content)
    if (!isRecord(manifestRaw) || !isRecord(manifestRaw.workspace) || !isRecord(configRaw)) return content
    const legacyProject = isRecord(configRaw.project) ? configRaw.project : {}
    const legacyName = typeof legacyProject.name === 'string'
      ? legacyProject.name
      : typeof configRaw.name === 'string' ? configRaw.name : ''
    const legacyDescription = typeof legacyProject.description === 'string' ? legacyProject.description : ''
    if (legacyName.trim()) manifestRaw.workspace.name = legacyName.trim()
    if (legacyDescription.trim()) manifestRaw.workspace.description = legacyDescription.trim()
    return `${JSON.stringify(manifestRaw, null, 2)}\n`
  } catch {
    return content
  }
}

function removeLegacyProjectIdentity(entries: WorkspaceEntry[]): void {
  const index = entries.findIndex((entry) => entry.path === WORKSPACE_CONFIG_PATH && entry.kind === 'file')
  const configEntry = entries[index]
  if (!configEntry?.content) return
  try {
    const raw: unknown = JSON.parse(configEntry.content)
    if (!isRecord(raw) || (!('project' in raw) && !('name' in raw))) return
    delete raw.project
    delete raw.name
    entries[index] = { ...configEntry, content: `${JSON.stringify(raw, null, 2)}\n`, updatedAt: now() }
  } catch {
    // Invalid legacy configuration remains untouched for manual recovery.
  }
}

function migrateBaseTemplateVersion(entries: WorkspaceEntry[]): void {
  const index = entries.findIndex((entry) => entry.path === WORKSPACE_CONFIG_PATH && entry.kind === 'file')
  const configEntry = entries[index]
  if (!configEntry?.content) return
  try {
    const raw: unknown = JSON.parse(configEntry.content)
    if (!isRecord(raw) || raw.templateVersion !== '3.0.0') return
    raw.templateVersion = '1.0.0'
    entries[index] = { ...configEntry, content: `${JSON.stringify(raw, null, 2)}\n`, updatedAt: now() }
  } catch {
    // Invalid configuration remains untouched for manual recovery.
  }
}

function migrateManifestEntrypoints(entries: WorkspaceEntry[]): void {
  const index = entries.findIndex((entry) => entry.path === WORKSPACE_MANIFEST_PATH && entry.kind === 'file')
  const manifestEntry = entries[index]
  if (!manifestEntry?.content) return
  try {
    const raw: unknown = JSON.parse(manifestEntry.content)
    if (!isRecord(raw) || !isRecord(raw.entrypoints)) return
    let changed = false
    if (raw.entrypoints.roles === 'roles') {
      raw.entrypoints.roles = ROLE_REGISTRY_PATH
      changed = true
    }
    if (typeof raw.entrypoints.releases !== 'string' || !raw.entrypoints.releases.trim()) {
      raw.entrypoints.releases = '.workspace/releases/registry.json'
      changed = true
    }
    if (raw.entrypoints.agentProtocol !== AGENT_PROTOCOL_PATH) {
      raw.entrypoints.agentProtocol = AGENT_PROTOCOL_PATH
      if (raw.schemaVersion === '1.0') raw.schemaVersion = '1.1'
      changed = true
    }
    if (raw.entrypoints.baseTemplate !== BASE_TEMPLATE_REGISTRY_PATH) {
      raw.entrypoints.baseTemplate = BASE_TEMPLATE_REGISTRY_PATH
      changed = true
    }
    if (raw.entrypoints.harness !== HARNESS_ROOT_PATH) {
      raw.entrypoints.harness = HARNESS_ROOT_PATH
      changed = true
    }
    if (!changed) return
    entries[index] = { ...manifestEntry, content: `${JSON.stringify(raw, null, 2)}\n`, updatedAt: now() }
  } catch {
    // Invalid manifests remain untouched for manual recovery.
  }
}

function migrateHarnessV1(entries: WorkspaceEntry[]): void {
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index]
    if (entry && LEGACY_HARNESS_PATHS.has(entry.path)) entries.splice(index, 1)
  }
  const legacyRulesFolder = entries.findIndex((entry) => entry.path === '.workspace/rules' && entry.kind === 'folder')
  if (legacyRulesFolder >= 0 && !entries.some((entry) => entry.path.startsWith('.workspace/rules/'))) {
    entries.splice(legacyRulesFolder, 1)
  }
}

function shouldMigrateWorkspaceIndex(entry: WorkspaceEntry): boolean {
  if (entry.path !== WORKSPACE_INDEX_PATH || entry.kind !== 'file') return false
  return entry.content?.includes('version: 0.5.0') === true
    || entry.content?.includes('../rules/agent-context-rule.md') === true
}

function migrateLegacyKnowledgeRoots(entries: WorkspaceEntry[]): void {
  for (const [legacyPath, destinationPath] of Object.entries(LEGACY_ROLE_DESTINATIONS)) {
    const legacyIndex = entries.findIndex((entry) => entry.path === legacyPath && entry.kind === 'file')
    if (legacyIndex < 0) continue
    const legacyEntry = entries[legacyIndex]
    const destinationIndex = entries.findIndex((entry) => entry.path === destinationPath && entry.kind === 'file')
    if (!legacyEntry || destinationIndex < 0) continue
    if (legacyEntry) {
      const destinationEntry = entries[destinationIndex]
      if (destinationEntry) {
        entries[destinationIndex] = {
          ...destinationEntry,
          content: legacyEntry.content,
          createdAt: legacyEntry.createdAt,
          updatedAt: legacyEntry.updatedAt,
        }
      }
    }
    entries.splice(legacyIndex, 1)
  }

  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index]
    if (entry && LEGACY_DOCUMENT_PATHS.has(entry.path)) entries.splice(index, 1)
  }

  let removedFolder = true
  while (removedFolder) {
    removedFolder = false
    for (let index = entries.length - 1; index >= 0; index -= 1) {
      const entry = entries[index]
      if (!entry || entry.kind !== 'folder' || !['docs', 'roles', 'assets'].some((root) => entry.path === root || entry.path.startsWith(`${root}/`))) continue
      const hasChildren = entries.some((candidate) => candidate.path.startsWith(`${entry.path}/`))
      if (!hasChildren) {
        entries.splice(index, 1)
        removedFolder = true
      }
    }
  }
}

function migrateDefaultRoleLocalization(entries: WorkspaceEntry[]): void {
  for (const localization of DEFAULT_ROLE_LOCALIZATIONS) {
    const index = entries.findIndex((entry) => entry.path === localization.path && entry.kind === 'file')
    const entry = entries[index]
    if (!entry?.content) continue
    const content = entry.content
      .replace(`id: ${localization.legacyId}`, `id: ${localization.id}`)
      .replace(`title: ${localization.legacyTitle}`, `title: ${localization.title}`)
      .replace(localization.legacyHeading, localization.heading)
      .replace(localization.legacyDescription, localization.description)
    if (content !== entry.content) entries[index] = { ...entry, content, updatedAt: now() }
  }
}

function setFrontmatterField(content: string, key: string, value: string): string {
  const field = new RegExp(`^${key}:\\s*.*$`, 'm')
  if (field.test(content)) return content.replace(field, `${key}: ${value}`)
  return content.replace(/^---\r?\n/, (opening) => `${opening}${key}: ${value}\n`)
}

function migrateStandardRoleModel(entries: WorkspaceEntry[]): void {
  const migrations = [
    {
      path: '产品空间/项目角色/产品经理.md',
      id: 'product',
      type: 'role',
      spaceId: 'product',
      replacements: [
        ['负责产品目标、需求定义、范围管理与验收标准，维护项目中的核心产品知识。', '负责产品目标、用户需求、功能需求、业务规则、产品范围和验收标准。'],
      ],
    },
    {
      path: '设计空间/项目角色/UI-UX-设计师.md',
      id: 'design',
      type: 'role',
      spaceId: 'design',
      replacements: [
        ['负责信息架构、交互体验、视觉规范与可用性设计。', '负责用户体验、信息架构、交互流程、界面设计和设计规范。'],
      ],
    },
    {
      path: '技术空间/项目角色/前端工程师.md',
      id: 'frontend-engineer',
      type: 'role-persona',
      parentRole: 'engineering',
      replacements: [
        ['负责前端应用、组件、交互实现、性能与前端工程质量。', '负责前端应用、组件、交互实现、性能与前端工程质量。本身份作为开发工程师角色下的专业方向保留。'],
      ],
    },
    {
      path: '技术空间/项目角色/后端工程师.md',
      id: 'backend-engineer',
      type: 'role-persona',
      parentRole: 'engineering',
      replacements: [
        ['负责服务端能力、数据处理、接口与系统集成。', '负责服务端能力、数据处理、接口与系统集成。本身份作为开发工程师角色下的专业方向保留。'],
      ],
    },
    {
      path: '测试空间/项目角色/QA-工程师.md',
      id: 'quality',
      type: 'role',
      spaceId: 'quality',
      replacements: [
        ['负责测试计划、功能验证、回归测试与质量保障。', '负责测试方案、功能验证、回归测试、缺陷管理和质量保障。'],
      ],
    },
  ] as const

  for (const migration of migrations) {
    const index = entries.findIndex((entry) => entry.path === migration.path && entry.kind === 'file')
    const entry = entries[index]
    if (!entry?.content) continue
    let content = setFrontmatterField(entry.content, 'id', migration.id)
    content = setFrontmatterField(content, 'type', migration.type)
    if ('spaceId' in migration) content = setFrontmatterField(content, 'spaceId', migration.spaceId)
    if ('parentRole' in migration) content = setFrontmatterField(content, 'parentRole', migration.parentRole)
    for (const [before, after] of migration.replacements) {
      if (!content.includes(after)) content = content.replace(before, after)
    }
    if (content !== entry.content) entries[index] = { ...entry, content, updatedAt: now() }
  }
}

function migrateRoleAccessConfig(entries: WorkspaceEntry[]): void {
  const index = entries.findIndex((entry) => entry.path === WORKSPACE_CONFIG_PATH && entry.kind === 'file')
  const entry = entries[index]
  if (!entry?.content) return
  try {
    const raw: unknown = JSON.parse(entry.content)
    if (!isRecord(raw)) return
    if (Array.isArray(raw.spaces)) {
      raw.spaces = raw.spaces.map((space) => {
        if (!isRecord(space) || space.id !== 'testing') return space
        return { ...space, id: 'quality' }
      })
    }
    const currentModel = isRecord(raw.roleSpaceModel) ? raw.roleSpaceModel : {}
    raw.roleSpaceModel = {
      ...currentModel,
      mode: 'role-based-write',
      activeRolesPath: ACTIVE_ROLES_PATH,
      accessControlEnabled: true,
    }
    const content = `${JSON.stringify(raw, null, 2)}\n`
    if (content !== entry.content) entries[index] = { ...entry, content, updatedAt: now() }
  } catch {
    // Invalid Workspace config remains available for manual recovery.
  }
}

function migrateActiveRoleIds(entries: WorkspaceEntry[]): void {
  const index = entries.findIndex((entry) => entry.path === ACTIVE_ROLES_PATH && entry.kind === 'file')
  const entry = entries[index]
  if (!entry?.content) return
  try {
    const raw: unknown = JSON.parse(entry.content)
    if (!isRecord(raw) || !Array.isArray(raw.activeRoleIds)) return
    const legacyIds: Record<string, string> = {
      'product-manager': 'product',
      'ui-ux-designer': 'design',
      'frontend-engineer': 'engineering',
      'backend-engineer': 'engineering',
      'qa-engineer': 'quality',
    }
    raw.activeRoleIds = [...new Set(raw.activeRoleIds
      .filter((id): id is string => typeof id === 'string')
      .map((id) => legacyIds[id] ?? id))]
    const content = `${JSON.stringify(raw, null, 2)}\n`
    if (content !== entry.content) entries[index] = { ...entry, content, updatedAt: now() }
  } catch {
    // Invalid role selection remains available for manual recovery.
  }
}

function now(): string {
  return new Date().toISOString()
}

function cloneEntries(entries: WorkspaceEntry[]): WorkspaceEntry[] {
  return entries.map((entry) => ({ ...entry }))
}

function defaultEntrySort(a: WorkspaceEntry, b: WorkspaceEntry): number {
  if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
}

function normalizeEntryOrders(entries: WorkspaceEntry[]): WorkspaceEntry[] {
  const groups = new Map<string, WorkspaceEntry[]>()
  for (const entry of entries) {
    const parent = dirname(entry.path)
    const siblings = groups.get(parent) ?? []
    siblings.push(entry)
    groups.set(parent, siblings)
  }
  for (const siblings of groups.values()) {
    const hasStoredOrder = siblings.some((entry) => Number.isFinite(entry.order))
    siblings.sort((a, b) => {
      if (hasStoredOrder) {
        const delta = (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
        if (delta !== 0) return delta
      }
      return defaultEntrySort(a, b)
    })
    siblings.forEach((entry, index) => { entry.order = (index + 1) * 100 })
  }
  return entries
}

function buildSeed(): WorkspaceEntry[] {
  const entries = new Map<string, WorkspaceEntry>()
  const timestamp = now()
  const parameters = seedProjectParameters()

  for (const [modulePath, content] of Object.entries(seedModules)) {
    const path = normalizePath(modulePath.replace(/^\/workspace-template\//, ''))
    const segments = path.split('/')
    for (let index = 1; index < segments.length; index += 1) {
      const folderPath = segments.slice(0, index).join('/')
      if (!entries.has(folderPath)) {
        entries.set(folderPath, {
          path: folderPath,
          name: basename(folderPath),
          kind: 'folder',
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      }
    }
    entries.set(path, {
      path,
      name: basename(path),
      kind: 'file',
      content: renderSeedTemplate(content, parameters),
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  return normalizeEntryOrders([...entries.values()])
}

export class LocalStorageWorkspaceAdapter implements WorkspaceFileAdapter {
  private entries = new Map<string, WorkspaceEntry>()

  constructor() {
    this.load()
  }

  private load(): void {
    const stored = localStorage.getItem(STORAGE_KEY)
    const entries = stored ? (JSON.parse(stored) as WorkspaceEntry[]) : buildSeed()
    if (stored) {
      const seededEntries = buildSeed()
      const manifestSeed = seededEntries.find((entry) => entry.path === WORKSPACE_MANIFEST_PATH)
      const migratedManifestContent = manifestSeed
        ? manifestWithLegacyIdentity(manifestSeed.content ?? '', entries)
        : ''
      const knownPaths = new Set(entries.map((entry) => entry.path))
      for (const seededEntry of seededEntries) {
        if (!knownPaths.has(seededEntry.path)) {
          entries.push(seededEntry.path === WORKSPACE_MANIFEST_PATH
            ? { ...seededEntry, content: migratedManifestContent }
            : seededEntry)
          continue
        }
        const index = entries.findIndex((entry) => entry.path === seededEntry.path)
        const currentEntry = entries[index]
        if (currentEntry && seededEntry.path === SKILL_REGISTRY_PATH) {
          entries[index] = {
            ...currentEntry,
            content: mergeSkillRegistry(seededEntry.content ?? '', currentEntry.content ?? ''),
            updatedAt: seededEntry.updatedAt,
          }
          continue
        }
        const shouldSync = ALWAYS_SYNCED_SEED_PATHS.has(seededEntry.path)
          || (seededEntry.path === WORKSPACE_CONFIG_PATH && currentEntry && shouldMigrateWorkspaceConfig(currentEntry))
          || (seededEntry.path === WORKSPACE_INDEX_PATH && currentEntry && shouldMigrateWorkspaceIndex(currentEntry))
        if (currentEntry && shouldSync) {
          entries[index] = { ...currentEntry, content: seededEntry.content, updatedAt: seededEntry.updatedAt }
        }
      }
      removeLegacyProjectIdentity(entries)
      migrateBaseTemplateVersion(entries)
      migrateManifestEntrypoints(entries)
      migrateHarnessV1(entries)
      migrateLegacyKnowledgeRoots(entries)
      migrateDefaultRoleLocalization(entries)
      migrateStandardRoleModel(entries)
      migrateRoleAccessConfig(entries)
      migrateActiveRoleIds(entries)
    }
    normalizeEntryOrders(entries)
    this.entries = new Map(entries.map((entry) => [entry.path, entry]))
    this.persist()
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.entries.values()]))
  }

  private assertAvailable(path: string): void {
    if (this.entries.has(path)) throw new Error(`该路径已存在文件或文件夹：${path}`)
  }

  private assertParent(path: string): void {
    const parentPath = dirname(path)
    if (!parentPath) return
    const parent = this.entries.get(parentPath)
    if (!parent || parent.kind !== 'folder') throw new Error(`父文件夹不存在：${parentPath}`)
  }

  private nextOrder(folderPath: string): number {
    const orders = [...this.entries.values()]
      .filter((entry) => dirname(entry.path) === folderPath)
      .map((entry) => entry.order ?? 0)
    return (orders.length ? Math.max(...orders) : 0) + 100
  }

  private normalizeFolderOrder(folderPath: string, movedPath?: string, beforePath?: string): void {
    const siblings = [...this.entries.values()]
      .filter((entry) => dirname(entry.path) === folderPath && entry.path !== movedPath)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || defaultEntrySort(a, b))
    if (movedPath) {
      const movedEntry = this.entries.get(movedPath)
      if (movedEntry) {
        const targetIndex = beforePath ? siblings.findIndex((entry) => entry.path === beforePath) : -1
        siblings.splice(targetIndex >= 0 ? targetIndex : siblings.length, 0, movedEntry)
      }
    }
    siblings.forEach((entry, index) => {
      this.entries.set(entry.path, { ...entry, order: (index + 1) * 100 })
    })
  }

  async list(): Promise<WorkspaceEntry[]> {
    return cloneEntries([...this.entries.values()])
  }

  async replaceAll(entries: WorkspaceEntry[]): Promise<void> {
    const normalized = normalizeEntryOrders(entries.map((entry) => ({
      ...entry,
      path: normalizePath(entry.path),
      name: basename(normalizePath(entry.path)),
    })))
    this.entries = new Map(normalized.map((entry) => [entry.path, entry]))
    this.persist()
  }

  async read(path: string): Promise<string> {
    const entry = this.entries.get(normalizePath(path))
    if (!entry || entry.kind !== 'file') throw new Error(`未找到文档：${path}`)
    return entry.content ?? ''
  }

  async write(path: string, content: string): Promise<void> {
    const normalized = normalizePath(path)
    const entry = this.entries.get(normalized)
    if (!entry || entry.kind !== 'file') throw new Error(`未找到文档：${path}`)
    this.entries.set(normalized, { ...entry, content, updatedAt: now() })
    this.persist()
  }

  async createFile(path: string, content = ''): Promise<void> {
    const normalized = normalizePath(path)
    this.assertAvailable(normalized)
    this.assertParent(normalized)
    const timestamp = now()
    this.entries.set(normalized, {
      path: normalized,
      name: basename(normalized),
      kind: 'file',
      content,
      createdAt: timestamp,
      updatedAt: timestamp,
      order: this.nextOrder(dirname(normalized)),
    })
    this.persist()
  }

  async createFolder(path: string): Promise<void> {
    const normalized = normalizePath(path)
    this.assertAvailable(normalized)
    this.assertParent(normalized)
    const timestamp = now()
    this.entries.set(normalized, {
      path: normalized,
      name: basename(normalized),
      kind: 'folder',
      createdAt: timestamp,
      updatedAt: timestamp,
      order: this.nextOrder(dirname(normalized)),
    })
    this.persist()
  }

  async rename(path: string, newName: string): Promise<string> {
    const normalized = normalizePath(path)
    const entry = this.entries.get(normalized)
    if (!entry) throw new Error(`未找到路径：${path}`)
    const target = joinPath(dirname(normalized), newName)
    this.assertAvailable(target)
    const replacements = [...this.entries.values()]
      .filter((candidate) => candidate.path === normalized || candidate.path.startsWith(`${normalized}/`))
      .sort((a, b) => a.path.length - b.path.length)

    for (const current of replacements) this.entries.delete(current.path)
    for (const current of replacements) {
      const nextPath = target + current.path.slice(normalized.length)
      this.entries.set(nextPath, {
        ...current,
        path: nextPath,
        name: basename(nextPath),
        updatedAt: now(),
      })
    }
    this.persist()
    return target
  }

  async delete(path: string): Promise<void> {
    const normalized = normalizePath(path)
    if (!this.entries.has(normalized)) throw new Error(`未找到路径：${path}`)
    for (const candidate of [...this.entries.keys()]) {
      if (candidate === normalized || candidate.startsWith(`${normalized}/`)) this.entries.delete(candidate)
    }
    this.persist()
  }

  async move(path: string, destinationFolder: string, options: WorkspaceMoveOptions = {}): Promise<string> {
    const normalized = normalizePath(path)
    const targetFolder = normalizePath(destinationFolder)
    const target = joinPath(targetFolder, basename(normalized))
    const sourceFolder = dirname(normalized)
    const folder = this.entries.get(targetFolder)
    if (targetFolder && (!folder || folder.kind !== 'folder')) throw new Error('目标文件夹不存在')
    const entry = this.entries.get(normalized)
    if (!entry) throw new Error(`未找到路径：${path}`)
    if (entry.kind === 'folder' && (targetFolder === normalized || targetFolder.startsWith(`${normalized}/`))) {
      throw new Error('不能将文件夹移动到自身内部')
    }
    if (target !== normalized) this.assertAvailable(target)
    const beforePath = options.beforePath ? normalizePath(options.beforePath) : undefined
    if (beforePath && dirname(beforePath) !== targetFolder) throw new Error('排序目标不在目标文件夹中')
    const replacements = [...this.entries.values()].filter(
      (candidate) => candidate.path === normalized || candidate.path.startsWith(`${normalized}/`),
    )
    for (const current of replacements) this.entries.delete(current.path)
    for (const current of replacements) {
      const nextPath = target + current.path.slice(normalized.length)
      this.entries.set(nextPath, { ...current, path: nextPath, name: basename(nextPath), updatedAt: now() })
    }
    this.normalizeFolderOrder(sourceFolder)
    this.normalizeFolderOrder(targetFolder, target, beforePath === normalized ? target : beforePath)
    this.persist()
    return target
  }

  async exists(path: string): Promise<boolean> {
    return this.entries.has(normalizePath(path))
  }
}
