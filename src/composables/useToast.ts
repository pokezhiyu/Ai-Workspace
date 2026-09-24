import { ref } from 'vue'

export interface ToastMessage {
  id: number
  title: string
  description?: string
  tone?: 'default' | 'danger'
}

const messages = ref<ToastMessage[]>([])
let id = 0

export function useToast() {
  function toast(message: Omit<ToastMessage, 'id'>): void {
    const item = { ...message, id: ++id }
    messages.value.push(item)
    window.setTimeout(() => {
      messages.value = messages.value.filter((candidate) => candidate.id !== item.id)
    }, 2800)
  }

  return { messages, toast }
}
