/// <reference types="vite/client" />

declare module 'markdown-it-task-lists' {
  import type { MarkdownIt } from 'markdown-it'
  interface TaskListOptions {
    enabled?: boolean
    label?: boolean
    labelAfter?: boolean
  }
  const taskLists: (md: MarkdownIt, options?: TaskListOptions) => void
  export default taskLists
}

declare module '@lucide/vue/dist/esm/icons/*.mjs' {
  import type { DefineComponent } from 'vue'
  const icon: DefineComponent<{ size?: number | string; strokeWidth?: number | string }>
  export default icon
}
