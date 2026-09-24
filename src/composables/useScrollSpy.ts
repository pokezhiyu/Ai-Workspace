import { onBeforeUnmount, ref, type Ref } from 'vue'

export function useScrollSpy(root: Ref<HTMLElement | null>) {
  const activeId = ref('')
  let observer: IntersectionObserver | null = null

  function observe(): void {
    observer?.disconnect()
    const article = root.value
    if (!article) return
    const headings = [...article.querySelectorAll<HTMLElement>('h2[id], h3[id], h4[id]')]
    if (!headings.length) {
      activeId.value = ''
      return
    }
    const scrollRoot = article.closest<HTMLElement>('.document-view')
    observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]?.target instanceof HTMLElement) activeId.value = visible[0].target.id
      else {
        const boundary = (scrollRoot?.getBoundingClientRect().top ?? 0) + 92
        const passed = headings.filter((heading) => heading.getBoundingClientRect().top <= boundary)
        activeId.value = passed.at(-1)?.id ?? headings[0]?.id ?? ''
      }
    }, { root: scrollRoot, rootMargin: '-76px 0px -72% 0px', threshold: [0, 1] })
    headings.forEach((heading) => observer?.observe(heading))
    activeId.value = headings[0]?.id ?? ''
  }

  function setActive(id: string): void { activeId.value = id }
  onBeforeUnmount(() => observer?.disconnect())
  return { activeId, observe, setActive }
}
