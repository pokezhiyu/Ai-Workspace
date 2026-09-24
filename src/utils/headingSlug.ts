import type { SearchHeading } from '@/types/workspace'

export interface HeadingSlugger {
  slug: (value: string) => string
}

function normalizeHeading(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[`*_~[\](){}<>]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section'
}

export function createHeadingSlugger(): HeadingSlugger {
  const counts = new Map<string, number>()
  return {
    slug(value: string): string {
      const base = normalizeHeading(value)
      const count = (counts.get(base) ?? 0) + 1
      counts.set(base, count)
      return count === 1 ? base : `${base}-${count}`
    },
  }
}

export function extractHeadings(markdown: string): SearchHeading[] {
  const slugger = createHeadingSlugger()
  const headings: SearchHeading[] = []
  let fence = ''
  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = /^\s*(```+|~~~+)/.exec(line)
    if (fenceMatch?.[1]) {
      if (!fence) fence = fenceMatch[1][0] ?? ''
      else if (fenceMatch[1].startsWith(fence)) fence = ''
      continue
    }
    if (fence) continue
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match?.[1] || !match[2]) continue
    const text = match[2].replace(/\s+#+$/, '').trim()
    headings.push({ id: slugger.slug(text), text, level: match[1].length })
  }
  return headings
}
