export type WorkspaceRoleStatus = 'active' | 'disabled'

export interface WorkspaceRoleDefinition {
  id: string
  path: string
  name: string
  description: string
  spaceId: string
  status: WorkspaceRoleStatus
  owner?: string
  version?: string
}

export interface WorkspaceActiveRoleState {
  schemaVersion: string
  activeRoleIds: string[]
  updatedAt: string
  updatedBy: 'human-settings' | 'workspace-initialization'
}

export interface WorkspaceRoleAccessContext {
  activeRoleIds: string[]
  writableSpaceIds: string[]
  readableSpaceIds: string[]
}

export interface WorkspacePathAccessValidation {
  allowed: string[]
  blocked: Array<{
    path: string
    spaceId?: string
    reason: string
  }>
}
