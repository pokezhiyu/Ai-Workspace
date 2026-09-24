export type WorkspaceEntryKind = 'file' | 'folder'

export interface WorkspaceEntry {
  path: string
  name: string
  kind: WorkspaceEntryKind
  content?: string
  createdAt: string
  updatedAt: string
  order?: number
}

export interface WorkspaceTreeNode extends WorkspaceEntry {
  children: WorkspaceTreeNode[]
  space?: WorkspaceSpaceDefinition
}

export type WorkspaceSpaceStatus = 'active' | 'planned' | 'archived'

export interface WorkspaceSpaceDefinition {
  id: string
  name: string
  path: string
  description: string
  purpose: string
  order: number
  status: WorkspaceSpaceStatus
}

export interface WorkspaceManifestIdentity {
  id: string
  name: string
  description: string
  language: string
}

export interface WorkspaceManifestEntrypoints {
  baseTemplate: string
  agentProtocol: string
  harness: string
  spaces: string
  releases: string
  roles: string
  skills: string
  agents: string
}

export interface WorkspaceManifest {
  schemaVersion: string
  workspace: WorkspaceManifestIdentity
  entrypoints: WorkspaceManifestEntrypoints
}

export interface WorkspaceRoleSpaceModel {
  mode: 'role-based-write'
  primarySpaceField: string
  accessibleSpacesField: string
  activeRolesPath: string
  accessControlEnabled: true
}

export interface WorkspaceConfig {
  schemaVersion: string
  templateVersion: string
  defaultDocument: string
  contentRoots: string[]
  spaces: WorkspaceSpaceDefinition[]
  roleSpaceModel: WorkspaceRoleSpaceModel
}

export type TreeDropPosition = 'before' | 'inside' | 'after' | 'root'

export type TreeAction =
  | 'new-document'
  | 'new-folder'
  | 'rename'
  | 'delete'
  | 'duplicate'
  | 'copy-path'
  | 'move-up'
  | 'move-down'
  | 'move-parent'
  | 'move-to-folder'

export type DocumentStatus = 'draft' | 'review' | 'active' | 'superseded' | 'archived'

export interface DocumentMetadata {
  id?: string
  title: string
  type?: string
  domain?: string
  version?: string
  status?: DocumentStatus
  owner?: string
  updated?: string
  related: string[]
  [key: string]: unknown
}

export interface WorkspaceDocument {
  path: string
  source: string
  body: string
  metadata: DocumentMetadata
}

export interface SearchResult {
  path: string
  title: string
  excerpt: string
  metadata: DocumentMetadata
  matchKind: 'title-exact' | 'title' | 'heading' | 'metadata' | 'path' | 'content'
  heading?: SearchHeading
  score: number
}

export interface SearchHeading {
  id: string
  text: string
  level: number
}

export type TocHeading = SearchHeading

export interface SearchIndexItem {
  documentId: string
  title: string
  path: string
  type?: string
  status?: DocumentStatus
  content: string
  metadataText: string
  headings: SearchHeading[]
  metadata: DocumentMetadata
}

export type SaveState = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error'
