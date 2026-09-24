import type { WorkspaceFileAdapter } from '@/adapters/workspace-file'
import type { CreateProjectReleaseInput, ProjectRelease, ProjectReleaseRegistry } from '@/types/releases'
import {
  buildProjectRelease,
  createReleaseSummary,
  EMPTY_RELEASE_REGISTRY,
  parseProjectReleaseRegistry,
  RELEASE_REGISTRY_PATH,
  serializeProjectReleaseRegistry,
} from './workspaceReleaseRegistry'

export class WorkspaceReleaseService {
  constructor(private readonly files: WorkspaceFileAdapter) {}

  async read(): Promise<ProjectReleaseRegistry> {
    if (!(await this.files.exists(RELEASE_REGISTRY_PATH))) return { ...EMPTY_RELEASE_REGISTRY }
    return parseProjectReleaseRegistry(await this.files.read(RELEASE_REGISTRY_PATH))
  }

  async create(input: CreateProjectReleaseInput): Promise<ProjectReleaseRegistry> {
    const registry = await this.read()
    if (registry.releases.some((release) => release.id === input.id)) throw new Error('该 Release ID 已存在。')
    if (input.makeActive && registry.current) throw new Error('同一时间只能有一个进行中的项目版本。')
    const previous = registry.current ?? registry.releases[0]?.id ?? null
    const release = buildProjectRelease(input, previous)
    if (!(await this.files.exists('.workspace/releases'))) await this.files.createFolder('.workspace/releases')
    await this.files.createFile(release.summaryPath, createReleaseSummary(release))
    const next = {
      ...registry,
      current: release.status === 'active' ? release.id : registry.current,
      releases: [release, ...registry.releases],
    }
    await this.write(next)
    return next
  }

  async activate(id: string): Promise<ProjectReleaseRegistry> {
    const registry = await this.read()
    if (registry.current) throw new Error('请先发布当前版本，再激活下一期。')
    return this.update(registry, id, (release) => ({ ...release, status: 'active' }), id)
  }

  async release(id: string, releasedAt: string): Promise<ProjectReleaseRegistry> {
    const registry = await this.read()
    if (registry.current !== id) throw new Error('只有当前进行中的版本可以发布。')
    return this.update(registry, id, (release) => ({ ...release, status: 'released', releasedAt }), null)
  }

  private async update(
    registry: ProjectReleaseRegistry,
    id: string,
    transform: (release: ProjectRelease) => ProjectRelease,
    current: string | null,
  ): Promise<ProjectReleaseRegistry> {
    let updatedRelease: ProjectRelease | undefined
    const releases = registry.releases.map((release) => {
      if (release.id !== id) return release
      updatedRelease = transform(release)
      return updatedRelease
    })
    if (!updatedRelease) throw new Error('未找到项目版本。')
    const next = { ...registry, current, releases }
    await this.files.write(updatedRelease.summaryPath, createReleaseSummary(updatedRelease))
    await this.write(next)
    return next
  }

  private async write(registry: ProjectReleaseRegistry): Promise<void> {
    if (await this.files.exists(RELEASE_REGISTRY_PATH)) {
      await this.files.write(RELEASE_REGISTRY_PATH, serializeProjectReleaseRegistry(registry))
      return
    }
    if (!(await this.files.exists('.workspace/releases'))) await this.files.createFolder('.workspace/releases')
    await this.files.createFile(RELEASE_REGISTRY_PATH, serializeProjectReleaseRegistry(registry))
  }
}
