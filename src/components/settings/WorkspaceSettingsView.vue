<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArrowLeft from '@lucide/vue/dist/esm/icons/arrow-left.mjs'
import Blocks from '@lucide/vue/dist/esm/icons/blocks.mjs'
import Bot from '@lucide/vue/dist/esm/icons/bot.mjs'
import RefreshCw from '@lucide/vue/dist/esm/icons/refresh-cw.mjs'
import UsersRound from '@lucide/vue/dist/esm/icons/users-round.mjs'
import FileCog from '@lucide/vue/dist/esm/icons/file-cog.mjs'
import Tags from '@lucide/vue/dist/esm/icons/tags.mjs'
import SkillSettingsView from '@/components/skills/SkillSettingsView.vue'
import RoleSettingsView from './RoleSettingsView.vue'
import WorkspaceManifestSettingsView from './WorkspaceManifestSettingsView.vue'
import ProjectReleaseSettingsView from './ProjectReleaseSettingsView.vue'
import GitSyncSettingsView from './GitSyncSettingsView.vue'
import AgentProtocolSettingsView from './AgentProtocolSettingsView.vue'
import { useWorkspaceStore } from '@/stores/workspace'

type SettingsSection = 'workspace' | 'releases' | 'skills' | 'roles' | 'agents' | 'sync'

const route = useRoute()
const router = useRouter()
const store = useWorkspaceStore()
const sections = [
  { id: 'workspace', label: 'Workspace 配置', description: '项目身份与入口', icon: FileCog },
  { id: 'releases', label: '项目版本', description: '阶段与里程碑', icon: Tags },
  { id: 'skills', label: 'Skill 配置', description: 'Workspace 能力', icon: Blocks },
  { id: 'roles', label: '角色配置', description: '项目职责定义', icon: UsersRound },
  { id: 'agents', label: 'Agent 设置', description: '执行者与工作方式', icon: Bot },
  { id: 'sync', label: '同步', description: '外部知识渠道', icon: RefreshCw },
] as const

const activeSection = computed<SettingsSection>(() => {
  const value = route.params.section
  const section = Array.isArray(value) ? value[0] : value
  return sections.some((item) => item.id === section) ? section as SettingsSection : 'workspace'
})

function selectSection(section: SettingsSection): void {
  if (section !== activeSection.value) void router.push({ name: 'settings', params: { section } })
}

function returnToDocument(): void {
  const path = store.activePath || '.workspace/context/workspace-index.md'
  void router.push({ name: 'document', params: { path: path.split('/') } })
}
</script>

<template>
  <main class="settings-view">
    <aside class="settings-navigation">
      <button class="settings-back" type="button" @click="returnToDocument">
        <ArrowLeft :size="14" />
        <span>返回文档</span>
      </button>
      <header>
        <span class="eyebrow">Workspace</span>
        <h1>设置</h1>
        <p>统一管理项目能力与工作上下文。</p>
      </header>
      <nav aria-label="Workspace 设置">
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          :class="{ active: activeSection === section.id }"
          :aria-current="activeSection === section.id ? 'page' : undefined"
          @click="selectSection(section.id)"
        >
          <component :is="section.icon" :size="15" />
          <span><strong>{{ section.label }}</strong><small>{{ section.description }}</small></span>
        </button>
      </nav>
    </aside>

    <div class="settings-content">
      <WorkspaceManifestSettingsView v-if="activeSection === 'workspace'" />
      <ProjectReleaseSettingsView v-else-if="activeSection === 'releases'" />
      <SkillSettingsView v-else-if="activeSection === 'skills'" />
      <RoleSettingsView v-else-if="activeSection === 'roles'" />
      <AgentProtocolSettingsView v-else-if="activeSection === 'agents'" />
      <GitSyncSettingsView v-else />
    </div>
  </main>
</template>
