import type { WorkspaceEntry } from '@/types/workspace'
import { basename, dirname, joinPath } from '@/utils/path'
import type { WorkspaceFileAdapter, WorkspaceMoveOptions } from './WorkspaceFileAdapter'
import type { RoleAccessService } from '@/features/roles/RoleAccessService'

export class RoleGuardedWorkspaceFileAdapter implements WorkspaceFileAdapter {
  constructor(
    private readonly adapter: WorkspaceFileAdapter,
    private readonly access: RoleAccessService,
  ) {}

  list(): Promise<WorkspaceEntry[]> { return this.adapter.list() }

  // Snapshot replacement is a trusted Workspace Sync operation, not a Human/Agent document edit.
  replaceAll(entries: WorkspaceEntry[]): Promise<void> { return this.adapter.replaceAll(entries) }

  read(path: string): Promise<string> { return this.adapter.read(path) }

  async write(path: string, content: string): Promise<void> {
    await this.access.assertCanWritePath(path)
    await this.adapter.write(path, content)
  }

  async createFile(path: string, content?: string): Promise<void> {
    await this.access.assertCanWritePath(path)
    await this.adapter.createFile(path, content)
  }

  async createFolder(path: string): Promise<void> {
    await this.access.assertCanWritePath(path)
    await this.adapter.createFolder(path)
  }

  async rename(path: string, newName: string): Promise<string> {
    await this.access.assertCanWritePath(path)
    await this.access.assertCanWritePath(joinPath(dirname(path), newName))
    return this.adapter.rename(path, newName)
  }

  async delete(path: string): Promise<void> {
    await this.access.assertCanWritePath(path)
    await this.adapter.delete(path)
  }

  async move(path: string, destinationFolder: string, options?: WorkspaceMoveOptions): Promise<string> {
    const target = joinPath(destinationFolder, basename(path))
    await this.access.assertCanWritePath(path)
    await this.access.assertCanWritePath(target)
    return this.adapter.move(path, destinationFolder, options)
  }

  exists(path: string): Promise<boolean> { return this.adapter.exists(path) }
}
