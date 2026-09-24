<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import type { RendererRule } from 'markdown-it'
import taskLists from 'markdown-it-task-lists'
import hljs from 'highlight.js'
import { dirname, joinPath, normalizePath } from '@/utils/path'
import { createHeadingSlugger, type HeadingSlugger } from '@/utils/headingSlug'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { useWorkspaceStore } from '@/stores/workspace'

const props = defineProps<{ content: string; path: string }>()
const emit = defineEmits<{ navigate: [path: string]; 'active-heading': [id: string] }>()
const store = useWorkspaceStore()
const root = ref<HTMLElement | null>(null)
const { activeId, observe, setActive } = useScrollSpy(root)
const copiedCode = ref('')
let renderSequence = 0
interface MermaidRuntime {
  initialize: (config: Record<string, unknown>) => void
  run: (options: { nodes: HTMLElement[]; suppressErrors: boolean }) => Promise<void>
}
let mermaidPromise: Promise<MermaidRuntime> | null = null

function loadMermaid(): Promise<MermaidRuntime> {
  if (mermaidPromise) return mermaidPromise
  if (import.meta.env.PROD) {
    mermaidPromise = import('mermaid').then(({ default: runtime }) => runtime as unknown as MermaidRuntime)
    return mermaidPromise
  }
  mermaidPromise = new Promise((resolve, reject) => {
    const existing = (globalThis as typeof globalThis & { mermaid?: MermaidRuntime }).mermaid
    if (existing) {
      resolve(existing)
      return
    }
    const script = document.createElement('script')
    script.src = '/node_modules/mermaid/dist/mermaid.min.js'
    script.async = true
    script.onload = () => {
      const runtime = (globalThis as typeof globalThis & { mermaid?: MermaidRuntime }).mermaid
      if (runtime) resolve(runtime)
      else reject(new Error('Mermaid did not initialize'))
    }
    script.onerror = () => reject(new Error('Mermaid bundle could not be loaded'))
    document.head.append(script)
  })
  return mermaidPromise
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character] ?? character)
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(code: string, language: string): string {
    if (language === 'mermaid') return ''
    if (language && hljs.getLanguage(language)) return hljs.highlight(code, { language }).value
    return escapeHtml(code)
  },
})

md.use(taskLists, { enabled: true, label: true, labelAfter: true })
interface RenderEnvironment { headingSlugger: HeadingSlugger }
md.renderer.rules.heading_open = (tokens, index, _options, env) => {
  const token = tokens[index]
  const inline = tokens[index + 1]
  const environment = env as unknown as RenderEnvironment
  if (!token || !inline) return ''
  const id = environment.headingSlugger.slug(inline.content)
  return `<${token.tag} id="${escapeHtml(id)}">`
}
const defaultFence = md.renderer.rules.fence
const fenceRule: RendererRule = (tokens, index, options, env, renderer) => {
  const token = tokens[index]
  if (!token) return ''
  const language = token.info.trim().split(/\s+/)[0] ?? ''
  if (language === 'mermaid') return `<div class="mermaid-wrap"><div class="mermaid">${escapeHtml(token.content)}</div></div>`
  const highlighted = defaultFence ? defaultFence(tokens, index, options, env, renderer) : `<pre><code>${escapeHtml(token.content)}</code></pre>`
  return `<div class="code-block"><div class="code-toolbar"><span>${language || 'text'}</span><button type="button" class="copy-code" aria-label="复制代码"><span>复制</span></button></div>${highlighted}</div>`
}
md.renderer.rules.fence = fenceRule

const rendered = computed(() => md.render(props.content, { headingSlugger: createHeadingSlugger() }))

function scrollToHeading(id: string): void {
  const heading = root.value?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
  if (!heading) return
  const scrollRoot = root.value?.closest<HTMLElement>('.document-view')
  if (scrollRoot) {
    const top = scrollRoot.scrollTop + heading.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top - 72
    scrollRoot.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  setActive(id)
}

async function renderMermaid(): Promise<void> {
  await nextTick()
  if (!root.value) return
  const nodes = [...root.value.querySelectorAll<HTMLElement>('.mermaid')]
  if (!nodes.length) return
  const mermaid = await loadMermaid()
  mermaid.initialize({
    startOnLoad: false,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'neutral',
    securityLevel: 'strict',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    flowchart: { curve: 'basis', padding: 14 },
  })
  const sequence = ++renderSequence
  nodes.forEach((node, index) => node.setAttribute('id', `mermaid-${sequence}-${index}`))
  try {
    await mermaid.run({ nodes, suppressErrors: true })
  } catch {
    for (const node of nodes) node.closest('.mermaid-wrap')?.classList.add('mermaid-error')
  }
}

async function handleClick(event: MouseEvent): Promise<void> {
  const target = event.target as HTMLElement
  const copyButton = target.closest<HTMLButtonElement>('.copy-code')
  if (copyButton) {
    const code = copyButton.closest('.code-block')?.querySelector('code')?.textContent ?? ''
    await navigator.clipboard.writeText(code)
    copiedCode.value = code
    const label = copyButton.querySelector('span')
    if (label) label.textContent = '已复制'
    window.setTimeout(() => {
      if (label) label.textContent = '复制'
      copiedCode.value = ''
    }, 1500)
    return
  }
  const link = target.closest<HTMLAnchorElement>('a')
  const href = link?.getAttribute('href')
  if (href?.startsWith('#')) {
    event.preventDefault()
    scrollToHeading(decodeURIComponent(href.slice(1)))
    return
  }
  if (!href || !href.endsWith('.md') || href.startsWith('http')) return
  event.preventDefault()
  const isRootPath = /^(docs|roles|assets|\.workspace)\//.test(href)
  const path = href.startsWith('/') || isRootPath ? normalizePath(href) : joinPath(dirname(props.path), href)
  emit('navigate', path)
}

watch(() => [props.content, props.path], async () => {
  await renderMermaid()
  observe()
}, { flush: 'post' })
watch(activeId, (id) => emit('active-heading', id))
watch(() => store.anchorRequest?.nonce, async () => {
  const request = store.anchorRequest
  if (!request) return
  await nextTick()
  scrollToHeading(request.id)
}, { flush: 'post' })
onMounted(async () => {
  await renderMermaid()
  observe()
  if (store.anchorRequest) scrollToHeading(store.anchorRequest.id)
})
</script>

<template>
  <div ref="root" class="markdown-body" @click="handleClick" v-html="rendered" />
  <span v-if="copiedCode" class="sr-only">代码已复制</span>
</template>
