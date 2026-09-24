export type ProjectReleaseStatus = 'planning' | 'active' | 'released'

export interface ProjectRelease {
  id: string
  name: string
  status: ProjectReleaseStatus
  goal: string
  summary: string
  startedAt: string
  releasedAt: string | null
  previous: string | null
  gitTag: string | null
  summaryPath: string
}

export interface ProjectReleaseRegistry {
  schemaVersion: string
  current: string | null
  releases: ProjectRelease[]
}

export interface CreateProjectReleaseInput {
  id: string
  name: string
  goal: string
  summary: string
  startedAt: string
  makeActive: boolean
}
