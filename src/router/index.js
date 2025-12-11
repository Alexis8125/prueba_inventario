import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import InventoriesView from '@/views/InventoriesView.vue'
import CountingView from '@/views/CountingView.vue'
import ReportsView from '@/views/ReportsView.vue'
import UsersView from '@/views/UsersView.vue'
import SuperAdminView from '@/views/SuperAdminView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductsView from '@/views/ProductsView.vue' // Nueva importación
import SalesView from '@/views/SalesView.vue'



const routes = [
  {
    path: '/',
    redirect: '/inventarios' // O '/dashboard' si prefieres
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventarios',
    name: 'inventarios',
    component: InventoriesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventario/:id/productos',
    name: 'products',
    component: ProductsView,
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
  },
  // Redirecciones para mantener compatibilidad
  {
    path: '/inventory/:id/products',
    redirect: to => ({ path: `/inventario/${to.params.id}/productos` })
  },
  // Agrega esta ruta al array de routes:
  {
    path: '/ventas',
    name: 'ventas',
    component: SalesView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación mejorado
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Si la ruta requiere autenticación y no hay token
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  // Si ya está autenticado y trata de ir al login
  if (to.name === 'login' && token) {
    next('/inventarios')
    return
  }

  // Verificar permisos de administrador
  if (to.meta.requiresAdmin && user.role !== 'admin' && user.role !== 'superadmin') {
    next('/inventarios')
    return
  }

  // Verificar permisos de super administrador
  if (to.meta.requiresSuperAdmin && user.role !== 'superadmin') {
    next('/inventarios')
    return
  }

  // Continuar a la ruta
  next()
})

// Manejo de errores de navegación
router.onError((error) => {
  console.error('Router error:', error)
})


export default router