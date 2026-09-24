import { createRouter, createWebHistory } from 'vue-router'
import WorkspaceShell from '@/components/layout/WorkspaceShell.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: WorkspaceShell },
    { path: '/getting-started', name: 'getting-started', component: WorkspaceShell },
    { path: '/settings/:section(workspace|releases|skills|roles|agents|sync)?', name: 'settings', component: WorkspaceShell },
    { path: '/document/:path(.*)*', name: 'document', component: WorkspaceShell },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
