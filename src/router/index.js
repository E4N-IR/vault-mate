import { createRouter, createWebHashHistory } from 'vue-router'

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
  history: createWebHashHistory(),
  routes,
})

export default router
