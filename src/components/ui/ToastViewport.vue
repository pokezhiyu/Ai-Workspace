<script setup lang="ts">
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import TriangleAlert from '@lucide/vue/dist/esm/icons/triangle-alert.mjs'
import { useToast } from '@/composables/useToast'

const { messages } = useToast()
</script>

<template>
  <div class="toast-viewport" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="message in messages" :key="message.id" class="toast" :class="{ 'toast--danger': message.tone === 'danger' }">
        <component :is="message.tone === 'danger' ? TriangleAlert : Check" :size="15" />
        <div>
          <strong>{{ message.title }}</strong>
          <span v-if="message.description">{{ message.description }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
