import type {
  WorkspaceConfig,
  WorkspaceRoleSpaceModel,
  WorkspaceSpaceDefinition,
  WorkspaceSpaceStatus,
} from '@/types/workspace'

const DEFAULT_ROLE_SPACE_MODEL: WorkspaceRoleSpaceModel = {
  mode: 'role-based-write',
  primarySpaceField: 'primarySpaceId',
  accessibleSpacesField: 'accessibleSpaceIds',
  activeRolesPath: '.workspace/roles/active.json',
  accessControlEnabled: true,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
    : []
}

function spaceStatus(value: unknown): WorkspaceSpaceStatus {
  return value === 'planned' || value === 'archived' ? value : 'active'
}

function parseSpace(value: unknown, index: number): WorkspaceSpaceDefinition | null {
  if (!isRecord(value)) return null
  const path = stringValue(value.path)
  const name = stringValue(value.name)
  if (!path || !name) return null
  return {
    id: stringValue(value.id, `space-${index + 1}`),
    name,
    path,
    description: stringValue(value.description),
    purpose: stringValue(value.purpose, stringValue(value.description)),
    order: typeof value.order === 'number' && Number.isFinite(value.order) ? value.order : (index + 1) * 100,
    status: spaceStatus(value.status),
  }
}

export function parseWorkspaceConfig(source: string): WorkspaceConfig {
  let raw: unknown
  try {
    raw = JSON.parse(source)
  } catch {
    raw = {}
  }
  const root = isRecord(raw) ? raw : {}
  const spaces = Array.isArray(root.spaces)
    ? root.spaces.map(parseSpace).filter((space): space is WorkspaceSpaceDefinition => Boolean(space))
    : []
  const rawRoleSpaceModel = isRecord(root.roleSpaceModel) ? root.roleSpaceModel : {}

  return {
    schemaVersion: stringValue(root.schemaVersion, '0.1.0'),
    templateVersion: stringValue(root.templateVersion, stringValue(root.version, '0.1.0')),
    defaultDocument: stringValue(root.defaultDocument, '.workspace/context/workspace-index.md'),
    contentRoots: stringArray(root.contentRoots),
    spaces,
    roleSpaceModel: {
      ...DEFAULT_ROLE_SPACE_MODEL,
      primarySpaceField: stringValue(rawRoleSpaceModel.primarySpaceField, DEFAULT_ROLE_SPACE_MODEL.primarySpaceField),
      accessibleSpacesField: stringValue(rawRoleSpaceModel.accessibleSpacesField, DEFAULT_ROLE_SPACE_MODEL.accessibleSpacesField),
      activeRolesPath: stringValue(rawRoleSpaceModel.activeRolesPath, DEFAULT_ROLE_SPACE_MODEL.activeRolesPath),
    },
  }
}
