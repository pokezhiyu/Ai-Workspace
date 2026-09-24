import type {
  CreateProjectReleaseInput,
  ProjectRelease,
  ProjectReleaseRegistry,
  ProjectReleaseStatus,
} from '@/types/releases'

export const RELEASE_REGISTRY_PATH = '.workspace/releases/registry.json'

export const EMPTY_RELEASE_REGISTRY: ProjectReleaseRegistry = {
  schemaVersion: '1.0',
  current: null,
  releases: [],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback
}

function optionalString(value: unknown): string | null {
  const result = stringValue(value)
  return result || null
}

function releaseStatus(value: unknown): ProjectReleaseStatus {
  return value === 'planning' || value === 'released' ? value : 'active'
}

function parseRelease(value: unknown): ProjectRelease | null {
  if (!isRecord(value)) return null
  const id = stringValue(value.id)
  const name = stringValue(value.name)
  if (!id || !name) return null
  return {
    id,
    name,
    status: releaseStatus(value.status),
    goal: stringValue(value.goal),
    summary: stringValue(value.summary),
    startedAt: stringValue(value.startedAt),
    releasedAt: optionalString(value.releasedAt),
    previous: optionalString(value.previous),
    gitTag: optionalString(value.gitTag),
    summaryPath: stringValue(value.summaryPath, `.workspace/releases/${id}.md`),
  }
}

export function parseProjectReleaseRegistry(source: string): ProjectReleaseRegistry {
  try {
    const value: unknown = JSON.parse(source)
    if (!isRecord(value)) return { ...EMPTY_RELEASE_REGISTRY }
    const releases = Array.isArray(value.releases)
      ? value.releases.map(parseRelease).filter((release): release is ProjectRelease => release !== null)
      : []
    const active = releases.filter((release) => release.status === 'active')
    const requestedCurrent = optionalString(value.current)
    const current = requestedCurrent && active.some((release) => release.id === requestedCurrent)
      ? requestedCurrent
      : active[0]?.id ?? null
    return {
      schemaVersion: stringValue(value.schemaVersion, '1.0'),
      current,
      releases,
    }
  } catch {
    return { ...EMPTY_RELEASE_REGISTRY }
  }
}

export function serializeProjectReleaseRegistry(registry: ProjectReleaseRegistry): string {
  return `${JSON.stringify(registry, null, 2)}\n`
}

export function createReleaseSummary(release: ProjectRelease): string {
  return `---
id: RELEASE-${release.id.toUpperCase()}
title: ${release.name}
type: release
domain: workspace
version: 1.0.0
status: ${release.status === 'released' ? 'active' : 'draft'}
owner: product
updated: ${release.releasedAt ?? release.startedAt}
related: []
---

# ${release.name}

## 本期目标

${release.goal}

## 基于什么

本期在上一阶段积累的当前有效知识上继续演进，不复制 Workspace 或专业文档。

## 本期需求

${release.summary}

## 重要变更

- 按专业 Space 更新需求、设计、技术、测试与运维知识。
- 关键设计变化通过 ADR 记录原因。

## 当前状态

${release.status === 'released' ? '已发布' : release.status === 'active' ? '进行中' : '规划中'}

## 完成内容

随项目推进持续补充，保持为轻量阶段摘要，不重复完整 PRD。
`
}

export function buildProjectRelease(input: CreateProjectReleaseInput, previous: string | null): ProjectRelease {
  return {
    id: input.id,
    name: input.name,
    status: input.makeActive ? 'active' : 'planning',
    goal: input.goal,
    summary: input.summary,
    startedAt: input.startedAt,
    releasedAt: null,
    previous,
    gitTag: null,
    summaryPath: `.workspace/releases/${input.id}.md`,
  }
}
