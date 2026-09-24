import type { WorkspaceActiveRoleState, WorkspaceRoleDefinition } from '@/types/roles'
import type { WorkspaceEntry } from '@/types/workspace'
import { parseDocument } from '@/utils/document'

function firstBodyParagraph(body: string): string {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith('```'))
    ?.replace(/[*_`]/g, '') ?? '尚未填写角色职责。'
}

export function discoverWorkspaceRoles(entries: WorkspaceEntry[]): WorkspaceRoleDefinition[] {
  return entries
    .filter((entry) => entry.kind === 'file' && entry.path.endsWith('.md'))
    .flatMap((entry): WorkspaceRoleDefinition[] => {
      const document = parseDocument(entry.path, entry.content ?? '')
      if (document.metadata.type !== 'role') return []
      const spaceId = typeof document.metadata.spaceId === 'string' ? document.metadata.spaceId.trim() : ''
      if (!spaceId) return []
      return [{
        id: document.metadata.id ?? entry.path,
        path: entry.path,
        name: document.metadata.title,
        description: firstBodyParagraph(document.body),
        spaceId,
        status: document.metadata.status === 'active' ? 'active' : 'disabled',
        owner: document.metadata.owner,
        version: document.metadata.version,
      }]
    })
    .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: 'base' }))
}

export const ACTIVE_ROLES_PATH = '.workspace/roles/active.json'

export function parseActiveRoleState(source: string): WorkspaceActiveRoleState {
  try {
    const raw: unknown = JSON.parse(source)
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) throw new Error('invalid active role state')
    const value = raw as Record<string, unknown>
    return {
      schemaVersion: typeof value.schemaVersion === 'string' ? value.schemaVersion : '1.0',
      activeRoleIds: Array.isArray(value.activeRoleIds)
        ? [...new Set(value.activeRoleIds.filter((id): id is string => typeof id === 'string' && Boolean(id.trim())))]
        : [],
      updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '',
      updatedBy: value.updatedBy === 'workspace-initialization' ? 'workspace-initialization' : 'human-settings',
    }
  } catch {
    return { schemaVersion: '1.0', activeRoleIds: [], updatedAt: '', updatedBy: 'workspace-initialization' }
  }
}

export function serializeActiveRoleState(state: WorkspaceActiveRoleState): string {
  return `${JSON.stringify(state, null, 2)}\n`
}
