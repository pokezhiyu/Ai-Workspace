<script setup lang="ts">
import ArrowRight from '@lucide/vue/dist/esm/icons/arrow-right.mjs'
import BookOpenCheck from '@lucide/vue/dist/esm/icons/book-open-check.mjs'
import Check from '@lucide/vue/dist/esm/icons/check.mjs'
import CircleAlert from '@lucide/vue/dist/esm/icons/circle-alert.mjs'
import { useWorkspaceStore } from '@/stores/workspace'

const emit = defineEmits<{ quickStart: [] }>()
const store = useWorkspaceStore()
</script>

<template>
  <main class="getting-started-view">
    <div class="getting-started-page">
      <header v-if="store.baseTemplateGuide" class="getting-started-header">
        <div class="getting-started-heading">
          <span class="eyebrow">快速入门</span>
          <h1>{{ store.baseTemplateGuide.productName }}</h1>
          <div class="getting-started-version-line">
            <strong>{{ store.baseTemplateGuide.title }}</strong>
          </div>
          <p>{{ store.baseTemplateGuide.description }}</p>
        </div>
        <button class="button primary getting-started-action" type="button" @click="emit('quickStart')">
          <BookOpenCheck :size="15" />快速开始<ArrowRight :size="13" />
        </button>
      </header>

      <div v-if="!store.baseTemplateGuide" class="getting-started-error" role="alert">
        <CircleAlert :size="17" />
        <div><strong>快速入门暂时无法读取</strong><span>{{ store.baseTemplateError }}</span></div>
      </div>

      <template v-else>
        <section class="getting-started-intro" aria-label="Workspace 介绍">
          <p v-for="paragraph in store.baseTemplateGuide.introduction" :key="paragraph">{{ paragraph }}</p>
        </section>

        <section class="getting-started-section" aria-labelledby="getting-started-steps">
          <div class="getting-started-section-heading">
            <span>01</span><div><h2 id="getting-started-steps">第一次使用</h2><p>从项目首页开始，再按任务逐步加载需要的内容。</p></div>
          </div>
          <ol class="getting-started-steps">
            <li v-for="(step, index) in store.baseTemplateGuide.firstRunSteps" :key="step"><span>{{ index + 1 }}</span><p>{{ step }}</p></li>
          </ol>
        </section>

        <section class="getting-started-section" aria-labelledby="getting-started-terms">
          <div class="getting-started-section-heading">
            <span>02</span><div><h2 id="getting-started-terms">五个常用名词</h2><p>先理解用途，不需要记住内部实现。</p></div>
          </div>
          <dl class="getting-started-glossary">
            <div v-for="item in store.baseTemplateGuide.glossary" :key="item.term">
              <dt><code>{{ item.term }}</code><strong>{{ item.plainName }}</strong></dt><dd>{{ item.description }}</dd>
            </div>
          </dl>
        </section>

        <section class="getting-started-section" aria-labelledby="getting-started-modules">
          <div class="getting-started-section-heading">
            <span>03</span><div><h2 id="getting-started-modules">当前主要功能</h2><p>按模块了解日常可用能力和使用入口。</p></div>
          </div>
          <div class="getting-started-modules">
            <article v-for="(module, index) in store.baseTemplateGuide.modules" :key="module.id">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div><h3>{{ module.title }}</h3><p>{{ module.canDo }}</p><small><strong>怎么使用</strong>{{ module.howToUse }}</small></div>
            </article>
          </div>
        </section>

        <section class="getting-started-section harness-guide" aria-labelledby="getting-started-harness">
          <div class="getting-started-section-heading">
            <span>04</span><div><h2 id="getting-started-harness">{{ store.baseTemplateGuide.harness.title }}</h2><p>让不同 Agent 接手时不必从聊天记录重新猜测项目。</p></div>
          </div>
          <div class="harness-guide-copy"><p v-for="paragraph in store.baseTemplateGuide.harness.paragraphs" :key="paragraph">{{ paragraph }}</p></div>
          <ol class="harness-guide-flow">
            <li v-for="(step, index) in store.baseTemplateGuide.harness.agentFlow" :key="step"><span>{{ index + 1 }}</span><strong>{{ step }}</strong><ArrowRight v-if="index < store.baseTemplateGuide.harness.agentFlow.length - 1" :size="12" /></li>
          </ol>
        </section>

        <section class="getting-started-section" aria-labelledby="getting-started-collaboration">
          <div class="getting-started-section-heading">
            <span>05</span><div><h2 id="getting-started-collaboration">{{ store.baseTemplateGuide.collaboration.title }}</h2><p>{{ store.baseTemplateGuide.collaboration.description }}</p></div>
          </div>
          <p class="getting-started-callout"><Check :size="14" />{{ store.baseTemplateGuide.collaboration.handoffRule }}</p>
        </section>

        <div class="getting-started-split">
          <section class="getting-started-section" aria-labelledby="getting-started-extensions">
            <div class="getting-started-section-heading"><span>06</span><div><h2 id="getting-started-extensions">项目可以继续扩展</h2><p>Base Template 是稳定起点，不是不可改变的固定目录。</p></div></div>
            <ul><li v-for="item in store.baseTemplateGuide.extensions" :key="item">{{ item }}</li></ul>
          </section>
          <section class="getting-started-section" aria-labelledby="getting-started-limitations">
            <div class="getting-started-section-heading"><span>07</span><div><h2 id="getting-started-limitations">Base Template V1 当前限制</h2><p>使用前建议了解这些能力边界。</p></div></div>
            <ul><li v-for="item in store.baseTemplateGuide.limitations" :key="item">{{ item }}</li></ul>
          </section>
        </div>

        <section class="getting-started-section" aria-labelledby="base-template-history">
          <div class="getting-started-section-heading"><span>08</span><div><h2 id="base-template-history">Base Template 版本记录</h2><p>查看当前模板版本与主要变化。</p></div></div>
          <ol class="base-template-history">
            <li v-for="version in store.baseTemplateRegistry?.versions" :key="version.id">
              <span class="base-template-history-mark"><Check :size="12" /></span>
              <div><div><strong>{{ version.name }}</strong><span>{{ version.status === 'current' ? '当前版本' : version.status === 'supported' ? '仍支持' : '已废弃' }}</span></div><p>{{ version.summary }}</p><small>发布于 {{ version.releasedAt }} · {{ version.version }}</small></div>
            </li>
          </ol>
        </section>

      </template>
    </div>
  </main>
</template>
