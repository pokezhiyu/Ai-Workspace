import matter from 'gray-matter'
import type { DocumentMetadata, WorkspaceDocument } from '@/types/workspace'
import { displayName } from '@/utils/path'

function stringValue(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10)
  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined
}

export function parseDocument(path: string, source: string): WorkspaceDocument {
  let parsed: ReturnType<typeof matter>
  try {
    parsed = matter(source)
  } catch (error) {
    const filename = path.split('/').at(-1) ?? path
    return {
      path,
      source,
      body: source,
      metadata: {
        title: displayName(filename),
        status: 'draft',
        related: [],
        frontmatterError: error instanceof Error ? error.message : 'Invalid frontmatter',
      },
    }
  }
  const raw = parsed.data as Record<string, unknown>
  const filename = path.split('/').at(-1) ?? path
  const related = Array.isArray(raw.related)
    ? raw.related.filter((item): item is string => typeof item === 'string')
    : []
  const status = stringValue(raw.status)
  const allowedStatuses = ['draft', 'review', 'active', 'superseded', 'archived'] as const
  const safeStatus = allowedStatuses.find((candidate) => candidate === status)

  const metadata: DocumentMetadata = {
    ...raw,
    id: stringValue(raw.id),
    title: stringValue(raw.title) ?? displayName(filename),
    type: stringValue(raw.type),
    domain: stringValue(raw.domain),
    version: stringValue(raw.version),
    status: safeStatus,
    owner: stringValue(raw.owner),
    updated: stringValue(raw.updated),
    related,
  }

  return { path, source, body: parsed.content.trimStart(), metadata }
}

export function validateDocumentSource(source: string): void {
  matter(source)
}

export function createDocumentSource(title: string, id: string): string {
  const updated = new Date().toISOString().slice(0, 10)
  return `---\nid: ${id}\ntitle: ${title}\ntype: note\ndomain: workspace\nversion: 0.1.0\nstatus: draft\nowner: unassigned\nupdated: ${updated}\nrelated: []\n---\n\n# ${title}\n\n从这里开始编写文档。\n`
}

export function formatDocumentDate(value?: string, short = false): string {
  if (!value) return '未设置'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    month: short ? 'short' : 'long',
    day: 'numeric',
    year: short ? undefined : 'numeric',
  }).format(date)
}
