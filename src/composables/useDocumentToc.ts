import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { TocHeading } from '@/types/workspace'
import { extractHeadings } from '@/utils/headingSlug'

export function useDocumentToc(content: MaybeRefOrGetter<string>) {
  const headings = computed<TocHeading[]>(() =>
    extractHeadings(toValue(content)).filter((heading) => heading.level >= 2 && heading.level <= 4),
  )

  return { headings }
}
