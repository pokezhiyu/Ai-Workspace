import type { WorkspaceEntry } from '@/types/workspace'

export interface WorkspaceMoveOptions {
  beforePath?: string
}

export interface WorkspaceFileAdapter {
  list(): Promise<WorkspaceEntry[]>
  replaceAll(entries: WorkspaceEntry[]): Promise<void>
  read(path: string): Promise<string>
  write(path: string, content: string): Promise<void>
  createFile(path: string, content?: string): Promise<void>
  createFolder(path: string): Promise<void>
  rename(path: string, newName: string): Promise<string>
  delete(path: string): Promise<void>
  move(path: string, destinationFolder: string, options?: WorkspaceMoveOptions): Promise<string>
  exists(path: string): Promise<boolean>
}
