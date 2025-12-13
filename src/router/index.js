/**
 * router/index.js
 *
 * Manual routes only
 */

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login-view',
    redirect: '/login-view/login',
    component: () => import('@/layouts/LoginLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'LoginView',
        component: () => import('@/pages/LoginView/LoginView.vue'),
      },
    ],
  },
  {
    path: '/dashboard-view',
    name: 'DashboardView',
    component: () => import('@/pages/DashboardView/DashboardView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'LoginView' },
  },
]

const router = createRouter({
  history: createWebHistory('/vault-mate/'),

  routes,
})

// Workaround برای https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
