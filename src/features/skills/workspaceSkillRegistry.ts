import type {
  WorkspaceSkill,
  WorkspaceSkillRegistry,
  WorkspaceSkillScope,
  WorkspaceSkillStatus,
} from '@/types/skills'

export const WORKSPACE_SKILL_REGISTRY_PATH = '.workspace/skills/registry.json'
export const WORKSPACE_SKILL_INSTALL_PATH = '.workspace/skills/installed'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key]
  if (typeof value !== 'string') throw new Error(`Skill Registry 字段无效：${key}`)
  return value
}

function nullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key]
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') throw new Error(`Skill Registry 字段无效：${key}`)
  return value
}

function stringArray(record: Record<string, unknown>, key: string): string[] {
  const value = record[key]
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`Skill Registry 字段无效：${key}`)
  }
  return value
}

function optionalStringArray(record: Record<string, unknown>, key: string): string[] {
  const value = record[key]
  if (value === undefined) return []
  return stringArray(record, key)
}

function parseStatus(value: unknown): WorkspaceSkillStatus {
  if (value === 'enabled' || value === 'disabled' || value === 'invalid') return value
  if (value === 'installed') return 'enabled'
  if (value === 'missing') return 'invalid'
  throw new Error('Skill Registry 包含未知状态')
}

function parseScope(value: unknown): WorkspaceSkillScope {
  if (value === 'workspace' || value === 'global' || value === 'external') return value
  return 'external'
}

function parseSkill(value: unknown): WorkspaceSkill {
  if (!isRecord(value)) throw new Error('Skill Registry 包含无效 Skill 项')
  const status = parseStatus(value.status)
  const health = isRecord(value.health) ? value.health : null
  const issues = health ? optionalStringArray(health, 'issues') : status === 'invalid' ? ['Skill 配置异常。'] : []
  return {
    id: requireString(value, 'id'),
    name: requireString(value, 'name'),
    description: requireString(value, 'description'),
    purpose: requireString(value, 'purpose'),
    capabilities: stringArray(value, 'capabilities'),
    status,
    enabled: status !== 'invalid' && value.enabled !== false,
    installPath: requireString(value, 'installPath'),
    skillFile: requireString(value, 'skillFile'),
    version: nullableString(value, 'version'),
    source: nullableString(value, 'source'),
    metadataFiles: stringArray(value, 'metadataFiles'),
    fingerprint: requireString(value, 'fingerprint'),
    scope: parseScope(value.scope),
    deletable: value.deletable === true,
    health: {
      valid: health ? health.valid === true : status !== 'invalid',
      issues,
      checkedAt: health && typeof health.checkedAt === 'string' ? health.checkedAt : '',
    },
  }
}

export function parseWorkspaceSkillRegistry(source: string): WorkspaceSkillRegistry {
  let value: unknown
  try {
    value = JSON.parse(source)
  } catch {
    throw new Error('Skill Registry 不是有效的 JSON 文件')
  }
  if (!isRecord(value)) throw new Error('Skill Registry 根结构无效')
  if (value.registryType !== 'workspace-skill-registry') throw new Error('无法识别该 Skill Registry')
  if (!Array.isArray(value.skills)) throw new Error('Skill Registry 缺少 skills 列表')
  if (!isRecord(value.management)) throw new Error('Skill Registry 缺少管理能力声明')

  return {
    schemaVersion: requireString(value, 'schemaVersion'),
    registryType: 'workspace-skill-registry',
    generatedAt: requireString(value, 'generatedAt'),
    sourceRoot: requireString(value, 'sourceRoot'),
    sourceOfTruth: requireString(value, 'sourceOfTruth'),
    management: {
      supported: stringArray(value.management, 'supported'),
      planned: stringArray(value.management, 'planned'),
      excludedSkillIds: optionalStringArray(value.management, 'excludedSkillIds'),
    },
    discoveryRoots: Array.isArray(value.discoveryRoots)
      ? value.discoveryRoots.flatMap((root) => isRecord(root) && typeof root.path === 'string'
        ? [{ path: root.path, scope: parseScope(root.scope) }]
        : [])
      : [{ path: requireString(value, 'sourceRoot'), scope: 'global' as const }],
    skills: value.skills.map(parseSkill),
  }
}

export function serializeWorkspaceSkillRegistry(registry: WorkspaceSkillRegistry): string {
  return `${JSON.stringify(registry, null, 2)}\n`
}

export function getEnabledSkills(registry: WorkspaceSkillRegistry): WorkspaceSkill[] {
  return registry.skills.filter((skill) => skill.status === 'enabled' && skill.enabled && skill.health.valid)
}
