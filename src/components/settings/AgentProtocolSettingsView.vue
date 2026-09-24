<script setup lang="ts">
import ArrowRight from '@lucide/vue/dist/esm/icons/arrow-right.mjs'
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import CircleAlert from '@lucide/vue/dist/esm/icons/circle-alert.mjs'
import LockKeyhole from '@lucide/vue/dist/esm/icons/lock-keyhole.mjs'
import ShieldCheck from '@lucide/vue/dist/esm/icons/shield-check.mjs'
import { useWorkspaceStore } from '@/stores/workspace'
import { WORKSPACE_AGENT_PROTOCOL_PATH } from '@/features/agents/workspaceAgentProtocol'

const store = useWorkspaceStore()
</script>

<template>
  <section class="settings-panel">
    <div class="settings-panel-page">
      <header class="settings-panel-header agent-protocol-header">
        <div>
          <span class="eyebrow">Workspace kernel</span>
          <div class="agent-protocol-title-line">
            <h1>Agent 协作协议</h1>
            <span class="agent-protocol-readonly"><LockKeyhole :size="11" />系统规定 · 只读</span>
          </div>
          <p>确保不同 AI Coding Agent 可以共同操作当前 Workspace，并理解其他 Agent 留下的工作成果。</p>
        </div>
      </header>

      <div v-if="!store.agentProtocol" class="agent-protocol-error" role="alert">
        <CircleAlert :size="17" />
        <div><strong>协议暂时无法读取</strong><span>{{ store.agentProtocolError }}</span></div>
      </div>

      <template v-else>
        <section class="settings-section" aria-labelledby="agent-entry-flow-title">
          <div class="settings-section-heading">
            <div>
              <h2 id="agent-entry-flow-title">统一工作入口</h2>
              <p>{{ store.agentProtocol.contextStrategy.summary }}</p>
            </div>
            <span class="agent-protocol-version">v{{ store.agentProtocol.version }}</span>
          </div>
          <ol class="agent-entry-flow">
            <li v-for="(entry, index) in store.agentProtocol.entryFlow" :key="entry.id">
              <span class="agent-entry-index">{{ index + 1 }}</span>
              <div><strong>{{ entry.label }}</strong><p>{{ entry.purpose }}</p><code>{{ entry.source }}</code></div>
              <ArrowRight v-if="index < store.agentProtocol.entryFlow.length - 1" :size="13" aria-hidden="true" />
            </li>
          </ol>
        </section>

        <section class="settings-section" aria-labelledby="agent-protocol-list-title">
          <div class="settings-section-heading">
            <div>
              <h2 id="agent-protocol-list-title">核心协议</h2>
              <p>所有 Agent 使用相同语义工作；专属入口只能提供最薄的发现指针。</p>
            </div>
            <span class="settings-count">{{ store.agentProtocol.protocols.length }}</span>
          </div>
          <div class="agent-protocol-list">
            <details v-for="section in store.agentProtocol.protocols" :key="section.id">
              <summary>
                <span class="agent-protocol-check"><Check :size="12" /></span>
                <span><strong>{{ section.title }}</strong><small>{{ section.summary }}</small></span>
              </summary>
              <ul><li v-for="rule in section.rules" :key="rule">{{ rule }}</li></ul>
            </details>
          </div>
        </section>

        <section class="settings-section" aria-labelledby="agent-handoff-title">
          <div class="settings-section-heading">
            <div>
              <h2 id="agent-handoff-title">跨 Agent 交接</h2>
              <p>默认后继 Agent 不拥有当前 Agent 的聊天记录、Memory 或私有上下文。</p>
            </div>
          </div>
          <div class="agent-handoff-boundary">
            <div>
              <span>必须写入 Repository</span>
              <ul><li v-for="target in store.agentProtocol.handoff.durableTargets" :key="target">{{ target }}</li></ul>
            </div>
            <div>
              <span>不能作为唯一事实来源</span>
              <ul><li v-for="target in store.agentProtocol.handoff.privateOnlyTargets" :key="target">{{ target }}</li></ul>
            </div>
          </div>
        </section>

        <footer class="agent-protocol-footer">
          <div><ShieldCheck :size="15" /><span><strong>唯一 Source of Truth</strong><code>{{ WORKSPACE_AGENT_PROTOCOL_PATH }}</code></span></div>
          <span><LockKeyhole :size="12" />Workspace 系统协议，不可修改、删除或禁用</span>
        </footer>
      </template>
    </div>
  </section>
</template>
