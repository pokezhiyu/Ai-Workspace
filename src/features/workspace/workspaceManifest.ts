import type { WorkspaceManifest } from '@/types/workspace'

export const WORKSPACE_MANIFEST_PATH = '.workspace/manifest.json'

export const DEFAULT_WORKSPACE_MANIFEST: WorkspaceManifest = {
  schemaVersion: '1.1',
  workspace: {
    id: '',
    name: '',
    description: '',
    language: 'zh-CN',
  },
  entrypoints: {
    baseTemplate: '.workspace/base-template/registry.json',
    agentProtocol: '.workspace/agents/protocol.json',
    harness: '.workspace/harness',
    spaces: '.workspace/config.json',
    releases: '.workspace/releases/registry.json',
    roles: '.workspace/roles/registry.json',
    skills: '.workspace/skills',
    agents: '.workspace/agents',
  },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function identityValue(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value.trim() : fallback
}

function workspaceNameHash(value: string): string {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36).padStart(7, '0').slice(0, 7)
}

export function createWorkspaceId(projectName: string): string {
  const normalizedName = projectName.trim().normalize('NFKD')
  if (!normalizedName) return ''

  const containsNonAscii = /[^\x00-\x7F]/.test(normalizedName)
  const semanticPart = normalizedName
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

  const hash = workspaceNameHash(normalizedName)
  const base = semanticPart || 'workspace'
  const withHash = containsNonAscii ? `${base}-${hash}` : base
  const safeId = withHash.slice(0, 64).replace(/-+$/g, '')
  return safeId.length >= 2 ? safeId : `workspace-${hash}`
}

export function parseWorkspaceManifest(source: string): WorkspaceManifest {
  let raw: unknown
  try {
    raw = JSON.parse(source)
  } catch {
    raw = {}
  }
  const root = isRecord(raw) ? raw : {}
  const workspace = isRecord(root.workspace) ? root.workspace : {}
  const entrypoints = isRecord(root.entrypoints) ? root.entrypoints : {}

  return {
    schemaVersion: stringValue(root.schemaVersion, DEFAULT_WORKSPACE_MANIFEST.schemaVersion),
    workspace: {
      id: identityValue(workspace.id, DEFAULT_WORKSPACE_MANIFEST.workspace.id),
      name: identityValue(workspace.name, DEFAULT_WORKSPACE_MANIFEST.workspace.name),
      description: identityValue(workspace.description, DEFAULT_WORKSPACE_MANIFEST.workspace.description),
      language: stringValue(workspace.language, DEFAULT_WORKSPACE_MANIFEST.workspace.language),
    },
    entrypoints: {
      baseTemplate: stringValue(entrypoints.baseTemplate, DEFAULT_WORKSPACE_MANIFEST.entrypoints.baseTemplate),
      agentProtocol: stringValue(entrypoints.agentProtocol, DEFAULT_WORKSPACE_MANIFEST.entrypoints.agentProtocol),
      harness: stringValue(entrypoints.harness, DEFAULT_WORKSPACE_MANIFEST.entrypoints.harness),
      spaces: stringValue(entrypoints.spaces, DEFAULT_WORKSPACE_MANIFEST.entrypoints.spaces),
      releases: stringValue(entrypoints.releases, DEFAULT_WORKSPACE_MANIFEST.entrypoints.releases),
      roles: stringValue(entrypoints.roles, DEFAULT_WORKSPACE_MANIFEST.entrypoints.roles),
      skills: stringValue(entrypoints.skills, DEFAULT_WORKSPACE_MANIFEST.entrypoints.skills),
      agents: stringValue(entrypoints.agents, DEFAULT_WORKSPACE_MANIFEST.entrypoints.agents),
    },
  }
}

export function serializeWorkspaceManifest(manifest: WorkspaceManifest): string {
  return `${JSON.stringify(manifest, null, 2)}\n`
}
