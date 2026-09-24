<script setup lang="ts">
import { computed } from 'vue'
import PanelLeft from '@lucide/vue/dist/esm/icons/panel-left.mjs'
import ListTree from '@lucide/vue/dist/esm/icons/list-tree.mjs'
import BookOpenCheck from '@lucide/vue/dist/esm/icons/book-open-check.mjs'
import Settings2 from '@lucide/vue/dist/esm/icons/settings-2.mjs'
import ThemeToggle from './ThemeToggle.vue'
import { useWorkspaceStore } from '@/stores/workspace'

defineProps<{ sidebarCollapsed: boolean; showContextToggle?: boolean; settingsActive?: boolean; gettingStartedActive?: boolean }>()
const emit = defineEmits<{ toggleSidebar: []; toggleContext: []; openSettings: []; openGettingStarted: [] }>()
const store = useWorkspaceStore()
const brandInitial = computed(() => store.projectName.trim().charAt(0).toUpperCase() || 'W')
</script>

<template>
  <header class="workspace-header">
    <div class="brand-area">
      <button class="icon-button mobile-panel-toggle" :class="{ 'only-mobile': !sidebarCollapsed }" type="button" aria-label="打开知识侧栏" @click="emit('toggleSidebar')">
        <PanelLeft :size="16" />
      </button>
      <div class="brand-mark">{{ brandInitial }}</div>
      <div class="brand-copy">
        <strong>{{ store.projectName }}</strong>
        <span>{{ store.projectDescription }}</span>
      </div>
    </div>
    <div class="header-tools">
      <button class="header-action settings-trigger" :class="{ active: settingsActive }" type="button" :aria-current="settingsActive ? 'page' : undefined" @click="emit('openSettings')"><Settings2 :size="15" /><span class="header-action-label">设置</span></button>
      <button class="header-action getting-started-trigger" :class="{ active: gettingStartedActive }" type="button" :aria-current="gettingStartedActive ? 'page' : undefined" @click="emit('openGettingStarted')"><BookOpenCheck :size="15" /><span>快速入门</span></button>
      <button v-if="showContextToggle !== false" class="header-action mobile-toc-toggle" type="button" @click="emit('toggleContext')"><ListTree :size="15" /><span>目录</span></button>
      <ThemeToggle />
    </div>
  </header>
</template>
