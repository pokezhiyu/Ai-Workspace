import type { SearchIndexItem, SearchResult, WorkspaceEntry } from '@/types/workspace'
import { parseDocument } from '@/utils/document'
import { extractHeadings } from '@/utils/headingSlug'
import { isWorkspaceSystemPath } from '@/features/workspace/workspaceSystemPaths'

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('zh-CN')
}

function plainText(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, ' ').replace(/[#*`>\[\]()_|~-]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function buildWorkspaceSearchIndex(entries: WorkspaceEntry[]): SearchIndexItem[] {
  return entries
    .filter((entry) => entry.kind === 'file' && entry.path.endsWith('.md') && !isWorkspaceSystemPath(entry.path))
    .map((entry) => {
      const document = parseDocument(entry.path, entry.content ?? '')
      return {
        documentId: document.metadata.id ?? entry.path,
        title: document.metadata.title,
        path: entry.path,
        type: document.metadata.type,
        status: document.metadata.status,
        content: plainText(document.body),
        metadataText: JSON.stringify(document.metadata),
        headings: extractHeadings(document.body),
        metadata: document.metadata,
      }
    })
}

function excerptAround(content: string, query: string): string {
  const index = normalize(content).indexOf(query)
  const start = Math.max(0, index - 36)
  return content.slice(start, start + 116)
}

export function searchWorkspaceIndex(index: SearchIndexItem[], rawQuery: string): SearchResult[] {
  const query = normalize(rawQuery)
  if (!query) return []
  return index.flatMap((item): SearchResult[] => {
    const title = normalize(item.title)
    const matchingHeading = item.headings.find((heading) => normalize(heading.text).includes(query))
    let matchKind: SearchResult['matchKind'] | undefined
    let score = 0
    if (title === query) { matchKind = 'title-exact'; score = 100 }
    else if (title.includes(query)) { matchKind = 'title'; score = 85 }
    else if (matchingHeading) { matchKind = 'heading'; score = 70 }
    else if (normalize(item.metadataText).includes(query)) { matchKind = 'metadata'; score = 55 }
    else if (normalize(item.path).includes(query)) { matchKind = 'path'; score = 45 }
    else if (normalize(item.content).includes(query)) { matchKind = 'content'; score = 30 }
    if (!matchKind) return []
    if (item.status === 'active') score += 5
    return [{
      path: item.path,
      title: matchingHeading && matchKind === 'heading' ? matchingHeading.text : item.title,
      excerpt: matchKind === 'heading' ? item.title : excerptAround(item.content, query),
      metadata: item.metadata,
      matchKind,
      heading: matchKind === 'heading' ? matchingHeading : undefined,
      score,
    }]
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'zh-CN')).slice(0, 40)
}
