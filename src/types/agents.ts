export type WorkspaceAgentProtocolStatus = 'system-readonly'

export interface WorkspaceAgentProtocolEntry {
  id: string
  label: string
  source: string
  purpose: string
}

export interface WorkspaceAgentProtocolSection {
  id: string
  title: string
  summary: string
  rules: string[]
}

export interface WorkspaceAgentProtocol {
  schemaVersion: string
  id: string
  title: string
  version: string
  status: WorkspaceAgentProtocolStatus
  description: string
  sourceOfTruth: string
  entryFlow: WorkspaceAgentProtocolEntry[]
  contextStrategy: {
    name: string
    summary: string
    allowFullWorkspaceScan: boolean
  }
  protocols: WorkspaceAgentProtocolSection[]
  handoff: {
    assumeSharedConversationHistory: boolean
    durableTargets: string[]
    privateOnlyTargets: string[]
    completionChecks: string[]
  }
  systemPolicy: {
    mutableByRegularAgent: boolean
    humanUiMode: 'read-only'
    canDisable: boolean
    canDelete: boolean
    bootstrapPolicy: string
  }
}
