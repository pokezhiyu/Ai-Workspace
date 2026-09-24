<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import PanelLeftOpen from '@lucide/vue/dist/esm/icons/panel-left-open.mjs'
import PanelRightOpen from '@lucide/vue/dist/esm/icons/panel-right-open.mjs'
import WorkspaceHeader from './WorkspaceHeader.vue'
import KnowledgeSidebar from '@/components/tree/KnowledgeSidebar.vue'
import DocumentView from '@/components/document/DocumentView.vue'
import DocumentContext from '@/components/document/DocumentContext.vue'
import DocumentMinimap from '@/components/document/DocumentMinimap.vue'
import ToastViewport from '@/components/ui/ToastViewport.vue'
import WorkspaceSettingsView from '@/components/settings/WorkspaceSettingsView.vue'
import GettingStartedView from '@/components/onboarding/GettingStartedView.vue'
import WorkspaceInitializationDialog from '@/components/onboarding/WorkspaceInitializationDialog.vue'
import { useWorkspaceStore } from '@/stores/workspace'

const store = useWorkspaceStore()
const route = useRoute()
const router = useRouter()
const searchFocusToken = ref(0)
const mobilePanel = ref<'knowledge' | 'context' | null>(null)
const shellStyle = computed(() => ({ '--sidebar-width': `${store.sidebarWidth ?? 264}px` }))
const isSettings = computed(() => route.name === 'settings')
const isGettingStarted = computed(() => route.name === 'getting-started')
const isSystemPage = computed(() => isSettings.value || isGettingStarted.value)

const routePath = computed(() => {
  const value = route.params.path
  return Array.isArray(value) ? value.join('/') : typeof value === 'string' ? value : undefined
})

async function openPath(path: string, anchor?: string, updateRoute = true): Promise<void> {
  if (path === store.activePath) {
    if (anchor) store.navigateToHeading(anchor)
    if (updateRoute && routePath.value !== path) await router.push({ name: 'document', params: { path: path.split('/') } })
    return
  }
  if (store.hasUnsavedChanges && !window.confirm('当前文档有未保存的修改，是否放弃并打开其他文档？')) return
  await store.openDocument(path)
  if (updateRoute) await router.push({ name: 'document', params: { path: path.split('/') } })
  if (anchor) store.navigateToHeading(anchor)
  mobilePanel.value = null
}

async function openSettings(): Promise<void> {
  if (isSettings.value) {
    mobilePanel.value = null
    return
  }
  if (store.hasUnsavedChanges && !window.confirm('当前文档有未保存的修改，是否放弃并打开设置？')) return
  await router.push({ name: 'settings', params: { section: 'workspace' } })
  mobilePanel.value = null
}

async function openGettingStarted(): Promise<void> {
  if (isGettingStarted.value) {
    mobilePanel.value = null
    return
  }
  if (store.hasUnsavedChanges && !window.confirm('当前文档有未保存的修改，是否放弃并打开快速入门？')) return
  await router.push({ name: 'getting-started' })
  mobilePanel.value = null
}

async function quickStart(): Promise<void> {
  if (!store.isWorkspaceInitialized) {
    await router.push({ name: 'home' })
    return
  }
  await openPath(store.projectHomePath)
}

async function finishInitialization(homePath: string): Promise<void> {
  await router.replace({ name: 'document', params: { path: homePath.split('/') } })
}

function handleShortcut(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    const target = event.target as HTMLElement | null
    if (target?.closest('.markdown-editor')) return
    event.preventDefault()
    store.sidebarCollapsed = false
    if (window.innerWidth <= 760) mobilePanel.value = 'knowledge'
    searchFocusToken.value += 1
  }
}

function toggleKnowledgeSidebar(): void {
  if (window.innerWidth <= 760) mobilePanel.value = mobilePanel.value === 'knowledge' ? null : 'knowledge'
  else store.sidebarCollapsed = !store.sidebarCollapsed
}

function handleBeforeUnload(event: BeforeUnloadEvent): void {
  if (!store.hasUnsavedChanges) return
  event.preventDefault()
  event.returnValue = ''
}

onMounted(async () => {
  window.addEventListener('keydown', handleShortcut)
  window.addEventListener('beforeunload', handleBeforeUnload)
  await store.initialize(routePath.value)
  if (route.name === 'home' && store.activePath) await router.replace({ name: 'document', params: { path: store.activePath.split('/') } })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

onBeforeRouteUpdate(async (to) => {
  const value = to.params.path
  const nextPath = Array.isArray(value) ? value.join('/') : typeof value === 'string' ? value : ''
  if (!nextPath || nextPath === store.activePath) return true
  if (store.hasUnsavedChanges && !window.confirm('当前文档有未保存的修改，是否放弃并继续？')) return false
  await store.openDocument(nextPath)
  return true
})
</script>

<template>
  <div class="workspace-shell" :class="{ 'sidebar-is-collapsed': store.sidebarCollapsed, 'context-is-collapsed': store.contextCollapsed }" :style="shellStyle">
    <WorkspaceHeader
      :sidebar-collapsed="store.sidebarCollapsed"
      :show-context-toggle="!isSystemPage"
      :settings-active="isSettings"
      :getting-started-active="isGettingStarted"
      @toggle-sidebar="toggleKnowledgeSidebar"
      @toggle-context="mobilePanel = mobilePanel === 'context' ? null : 'context'"
      @open-settings="openSettings"
      @open-getting-started="openGettingStarted"
    />
    <div class="workspace-grid">
      <KnowledgeSidebar
        v-if="!store.sidebarCollapsed"
        :focus-token="searchFocusToken"
        :mobile-open="mobilePanel === 'knowledge'"
        @open="openPath"
        @collapse="store.sidebarCollapsed = true"
        @close-mobile="mobilePanel = null"
      />
      <div v-if="store.sidebarCollapsed" class="collapsed-left-rail">
        <button class="icon-button" type="button" aria-label="显示知识侧栏" @click="store.sidebarCollapsed = false"><PanelLeftOpen :size="16" /></button>
      </div>
      <div v-if="!isSystemPage && !store.sidebarCollapsed && store.tocHeadings.length" class="workspace-boundary-minimap">
        <DocumentMinimap
          :items="store.tocHeadings"
          :active-id="store.activeHeadingId"
          @select="store.navigateToHeading"
        />
      </div>
      <WorkspaceSettingsView v-if="isSettings" />
      <GettingStartedView v-else-if="isGettingStarted" @quick-start="quickStart" />
      <DocumentView v-else @navigate="openPath" />
      <DocumentContext v-if="!isSystemPage && !store.contextCollapsed" :mobile-open="mobilePanel === 'context'" @navigate="openPath" @collapse="store.contextCollapsed = true" />
      <div v-if="!isSystemPage && store.contextCollapsed" class="collapsed-right-rail">
        <button class="icon-button" type="button" aria-label="显示文档导航" @click="store.contextCollapsed = false"><PanelRightOpen :size="16" /></button>
      </div>
    </div>
    <button v-if="mobilePanel" class="mobile-drawer-backdrop" type="button" aria-label="关闭侧栏" @click="mobilePanel = null" />
    <WorkspaceInitializationDialog
      v-if="!store.loading"
      :open="store.needsWorkspaceInitialization"
      @initialized="finishInitialization"
    />
    <ToastViewport />
  </div>
</template>
