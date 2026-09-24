import type { WorkspaceFileAdapter } from '@/adapters/workspace-file/WorkspaceFileAdapter'
import type { WorkspaceActiveRoleState } from '@/types/roles'
import type { RoleAccessService } from './RoleAccessService'
import { ACTIVE_ROLES_PATH, serializeActiveRoleState } from './workspaceRoleRegistry'

/**
 * Human-only mutation boundary used by Settings and Workspace initialization.
 * Agent Runtime must receive RoleAccessService, never this service.
 */
export class HumanRoleSettingsService {
  constructor(
    private readonly systemAdapter: WorkspaceFileAdapter,
    private readonly access: RoleAccessService,
  ) {}

  async setActiveRoles(
    roleIds: string[],
    updatedBy: WorkspaceActiveRoleState['updatedBy'],
  ): Promise<WorkspaceActiveRoleState> {
    const entries = await this.systemAdapter.list()
    const allowedIds = new Set(this.access.getRoles(entries).filter((role) => role.status === 'active').map((role) => role.id))
    const activeRoleIds = [...new Set(roleIds)].filter((id) => allowedIds.has(id))
    const state: WorkspaceActiveRoleState = {
      schemaVersion: '1.0',
      activeRoleIds,
      updatedAt: new Date().toISOString(),
      updatedBy,
    }
    const content = serializeActiveRoleState(state)
    if (await this.systemAdapter.exists(ACTIVE_ROLES_PATH)) await this.systemAdapter.write(ACTIVE_ROLES_PATH, content)
    else await this.systemAdapter.createFile(ACTIVE_ROLES_PATH, content)
    return state
  }
}
