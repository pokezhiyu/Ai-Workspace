export type WorkspaceSkillStatus = 'enabled' | 'disabled' | 'invalid'
export type WorkspaceSkillScope = 'workspace' | 'global' | 'external'

export interface WorkspaceSkillHealth {
  valid: boolean
  issues: string[]
  checkedAt: string
}

export interface WorkspaceSkill {
  id: string
  name: string
  description: string
  purpose: string
  capabilities: string[]
  status: WorkspaceSkillStatus
  enabled: boolean
  installPath: string
  skillFile: string
  version: string | null
  source: string | null
  metadataFiles: string[]
  fingerprint: string
  scope: WorkspaceSkillScope
  deletable: boolean
  health: WorkspaceSkillHealth
}

export interface WorkspaceSkillRegistry {
  schemaVersion: string
  registryType: 'workspace-skill-registry'
  generatedAt: string
  sourceRoot: string
  sourceOfTruth: string
  management: {
    supported: string[]
    planned: string[]
    excludedSkillIds: string[]
  }
  discoveryRoots: Array<{
    path: string
    scope: WorkspaceSkillScope
  }>
  skills: WorkspaceSkill[]
}

export interface WorkspaceSkillDiscoveryResult {
  discoveredAt: string
  roots: Array<{
    path: string
    scope: WorkspaceSkillScope
  }>
  skills: WorkspaceSkill[]
  externalCandidates: WorkspaceSkillImportCandidate[]
}

export interface WorkspaceSkillImportCandidate {
  id: string
  name: string
  purpose: string
  capabilities: string[]
  version: string | null
  source: string | null
  origin: 'codex-global' | 'claude-global'
}
