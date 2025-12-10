// En tu archivo de rutas (router.js)
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import InventoriesView from '@/views/InventoriesView.vue'
import CountingView from '@/views/CountingView.vue'
import ReportsView from '@/views/ReportsView.vue'
import UsersView from '@/views/UsersView.vue'
import SuperAdminView from '@/views/SuperAdminView.vue'
import DashboardView from '@/views/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/inventarios'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/inventarios',
    name: 'inventarios',
    component: InventoriesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/conteo/:id',
    name: 'conteo',
    component: CountingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reportes/:id',
    name: 'reportes',
    component: ReportsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsersView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/superadmin',
    name: 'superadmin',
    component: SuperAdminView,
    meta: { requiresAuth: true, requiresSuperAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin && user.role !== 'admin') {
    next('/inventarios')
  } else {
    next()
  }
})

export default router
