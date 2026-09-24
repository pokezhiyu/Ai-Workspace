import type { WorkspaceFileAdapter } from '@/adapters/workspace-file/WorkspaceFileAdapter'
import type {
  WorkspaceActiveRoleState,
  WorkspacePathAccessValidation,
  WorkspaceRoleAccessContext,
  WorkspaceRoleDefinition,
} from '@/types/roles'
import type { WorkspaceEntry, WorkspaceSpaceDefinition } from '@/types/workspace'
import { parseWorkspaceConfig } from '@/features/workspace/workspaceConfig'
import { isWorkspaceSystemPath } from '@/features/workspace/workspaceSystemPaths'
import { resolveSpaceFromPath } from '@/features/workspace/workspaceSpaceResolver'
import {
  ACTIVE_ROLES_PATH,
  discoverWorkspaceRoles,
  parseActiveRoleState,
} from './workspaceRoleRegistry'

const WORKSPACE_CONFIG_PATH = '.workspace/config.json'

function fileSource(entries: WorkspaceEntry[], path: string): string {
  return entries.find((entry) => entry.path === path && entry.kind === 'file')?.content ?? ''
}

export class WorkspaceAccessError extends Error {
  readonly code = 'ROLE_WRITE_DENIED'

  constructor(message: string, readonly path: string, readonly spaceId?: string) {
    super(message)
    this.name = 'WorkspaceAccessError'
  }
}

export class RoleAccessService {
  constructor(private readonly systemAdapter: WorkspaceFileAdapter) {}

  getRoles(entries: WorkspaceEntry[]): WorkspaceRoleDefinition[] {
    return discoverWorkspaceRoles(entries)
  }

  getSpaces(entries: WorkspaceEntry[]): WorkspaceSpaceDefinition[] {
    return parseWorkspaceConfig(fileSource(entries, WORKSPACE_CONFIG_PATH)).spaces
  }

  getActiveRoleState(entries: WorkspaceEntry[]): WorkspaceActiveRoleState {
    return parseActiveRoleState(fileSource(entries, ACTIVE_ROLES_PATH))
  }

  getActiveRoleIds(entries: WorkspaceEntry[]): string[] {
    const enabledRoleIds = new Set(this.getRoles(entries).filter((role) => role.status === 'active').map((role) => role.id))
    return this.getActiveRoleState(entries).activeRoleIds.filter((id) => enabledRoleIds.has(id))
  }

  getWritableSpaceIds(entries: WorkspaceEntry[]): string[] {
    const activeRoleIds = new Set(this.getActiveRoleIds(entries))
    const selectedSpaceIds = new Set(this.getRoles(entries)
      .filter((role) => role.status === 'active' && activeRoleIds.has(role.id))
      .map((role) => role.spaceId))
    return this.getSpaces(entries)
      .filter((space) => selectedSpaceIds.has(space.id))
      .map((space) => space.id)
  }

  getAccessContext(entries: WorkspaceEntry[]): WorkspaceRoleAccessContext {
    return {
      activeRoleIds: this.getActiveRoleIds(entries),
      writableSpaceIds: this.getWritableSpaceIds(entries),
      readableSpaceIds: this.getSpaces(entries)
        .filter((space) => !isWorkspaceSystemPath(space.path))
        .map((space) => space.id),
    }
  }

  resolveSpace(path: string, entries: WorkspaceEntry[]): WorkspaceSpaceDefinition | undefined {
    return resolveSpaceFromPath(path, this.getSpaces(entries))
  }

  canReadSpace(_spaceId: string): boolean {
    return true
  }

  canWriteSpace(spaceId: string, entries: WorkspaceEntry[]): boolean {
    return this.getWritableSpaceIds(entries).includes(spaceId)
  }

  canReadPath(_path: string): boolean {
    return true
  }

  canWritePath(path: string, entries: WorkspaceEntry[]): boolean {
    if (isWorkspaceSystemPath(path)) return false
    const space = this.resolveSpace(path, entries)
    return Boolean(space && this.canWriteSpace(space.id, entries))
  }

  denialForPath(path: string, entries: WorkspaceEntry[]): WorkspaceAccessError {
    if (isWorkspaceSystemPath(path)) {
      return new WorkspaceAccessError('Workspace 系统配置只能通过“设置”修改，不能通过普通文档操作写入。', path)
    }
    const space = this.resolveSpace(path, entries)
    if (!space) {
      return new WorkspaceAccessError('当前路径不属于可写的专业空间。你仍然可以查看和引用其中的内容。', path)
    }
    return new WorkspaceAccessError(
      `当前角色没有${space.name}的编辑权限。你仍然可以查看和引用该空间内容。`,
      path,
      space.id,
    )
  }

  async assertCanWritePath(path: string): Promise<void> {
    const entries = await this.systemAdapter.list()
    if (!this.canWritePath(path, entries)) throw this.denialForPath(path, entries)
  }

  async validateChangedFiles(paths: string[]): Promise<WorkspacePathAccessValidation> {
    const entries = await this.systemAdapter.list()
    return paths.reduce<WorkspacePathAccessValidation>((result, path) => {
      if (this.canWritePath(path, entries)) result.allowed.push(path)
      else {
        const denial = this.denialForPath(path, entries)
        result.blocked.push({ path, spaceId: denial.spaceId, reason: denial.message })
      }
      return result
    }, { allowed: [], blocked: [] })
  }
}
