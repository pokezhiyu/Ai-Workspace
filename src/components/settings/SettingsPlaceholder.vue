<script setup lang="ts">
import Bot from '@lucide/vue/dist/esm/icons/bot.mjs'
import RefreshCw from '@lucide/vue/dist/esm/icons/refresh-cw.mjs'

const props = defineProps<{
  kind: 'agent' | 'sync'
  title: string
  description: string
  capabilities: string[]
}>()
</script>

<template>
  <section class="settings-panel">
    <div class="settings-panel-page">
      <header class="settings-panel-header">
        <span class="eyebrow">{{ props.kind === 'agent' ? 'Agent workspace' : 'External channels' }}</span>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </header>

      <section class="settings-section">
        <div class="settings-placeholder">
          <span class="settings-placeholder-icon">
            <Bot v-if="kind === 'agent'" :size="20" />
            <RefreshCw v-else :size="20" />
          </span>
          <strong>暂未配置</strong>
          <p>本期仅预留稳定入口，具体管理能力后续开放。</p>
          <div class="settings-future-capabilities" aria-label="未来能力">
            <span v-for="capability in capabilities" :key="capability">{{ capability }}</span>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
