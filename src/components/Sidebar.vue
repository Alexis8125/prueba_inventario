<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- Logo -->
    <div class="sidebar-header">
      <div v-if="!isCollapsed" class="logo-container">
        <!-- Espacio para tu logo 4x4 -->
        <div class="logo-wrapper">
          <img :src="logoUrl" alt="Logo" class="logo" />
        </div>
        <div class="company-info">
          <h2 class="company-name">Sistema Inventario</h2>
          <p class="company-subtitle">{{ user?.company_name || 'Empresa' }}</p>
        </div>
      </div>
      <div v-else class="logo-mini">
        <img :src="logoUrl" alt="Logo" class="logo-icon" />
      </div>
      
      <button @click="$emit('toggle-sidebar')" class="sidebar-toggle">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="isCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <!-- Navegación -->
    <nav class="sidebar-nav">
      <div v-for="group in filteredNavigation" :key="group.name">
        <div v-if="group.items.length > 0" class="nav-group">
          <div v-if="!isCollapsed" class="nav-group-title">
            {{ group.name }}
          </div>
          <div class="nav-items">
            <router-link
              v-for="item in group.items"
              :key="item.name"
              :to="item.to"
              class="nav-item"
              :class="{ 'active': $route.path.startsWith(item.to) }"
              :title="isCollapsed ? item.name : ''"
            >
              <component :is="item.icon" class="nav-icon" />
              <span v-if="!isCollapsed" class="nav-label">{{ item.name }}</span>
              <span v-if="item.badge && !isCollapsed" class="nav-badge">{{ item.badge }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Usuario -->
    <div class="sidebar-footer">
      <div class="user-info" @click="goToProfile">
        <div class="avatar">
          {{ getUserInitials() }}
        </div>
        <div v-if="!isCollapsed" class="user-details">
          <p class="user-name">{{ user?.full_name }}</p>
          <p class="user-role">{{ getUserRoleName() }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const logoUrl = ref('/logo.png') // Cambia esto a la ruta de tu logo

// Definir iconos como componentes
const InventoryIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
    </svg>
  `
}

const CountingIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}

const ReportsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
  `
}

const UsersIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
    </svg>
  `
}

const CompanyIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    </svg>
  `
}

const AuditIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
    </svg>
  `
}

const DashboardIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
    </svg>
  `
}

// Navegación basada en roles
const navigation = [
  {
    name: 'Principal',
    items: [
      { 
        name: 'Dashboard', 
        to: '/dashboard', 
        icon: DashboardIcon,
        roles: ['admin', 'user', 'superadmin']
      },
      { 
        name: 'Inventarios', 
        to: '/inventarios', 
        icon: InventoryIcon,
        roles: ['admin', 'user', 'superadmin']
      },
      { 
        name: 'Conteos', 
        to: '/conteos', 
        icon: CountingIcon,
        roles: ['admin', 'user', 'superadmin']
      },
      { 
        name: 'Reportes', 
        to: '/reportes', 
        icon: ReportsIcon,
        roles: ['admin', 'superadmin']
      },
    ]
  },
  {
    name: 'Administración',
    items: [
      { 
        name: 'Usuarios', 
        to: '/usuarios', 
        icon: UsersIcon,
        roles: ['admin', 'superadmin']
      },
      { 
        name: 'Empresas', 
        to: '/empresas', 
        icon: CompanyIcon,
        roles: ['superadmin']
      },
      { 
        name: 'Auditoría', 
        to: '/auditoria', 
        icon: AuditIcon,
        roles: ['superadmin']
      },
    ]
  }
]

// Filtrar navegación según rol
const filteredNavigation = computed(() => {
  const userRole = props.user?.role || 'user'
  
  return navigation.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(userRole))
  }))
})

// Funciones de utilidad
const getUserInitials = () => {
  if (!props.user?.full_name) return 'U'
  return props.user.full_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getUserRoleName = () => {
  const roles = {
    'superadmin': 'Super Admin',
    'admin': 'Administrador',
    'user': 'Usuario'
  }
  return roles[props.user?.role] || 'Usuario'
}

const goToProfile = () => {
  router.push('/perfil')
}
</script>

<style scoped>
.sidebar {
  width: 256px;
  height: 100vh;
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.logo-wrapper {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.company-info {
  text-align: center;
}

.company-name {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.company-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.25rem 0 0 0;
}

.logo-mini {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sidebar-toggle {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.5rem;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 1.5rem;
}

.nav-group-title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.75rem;
  padding: 0 0.75rem;
  font-weight: 600;
}

.sidebar.collapsed .nav-group-title {
  display: none;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  font-weight: 600;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  stroke-width: 1.5;
}

.sidebar.collapsed .nav-label {
  display: none;
}

.nav-badge {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.7rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.125rem 0 0 0;
}

.sidebar.collapsed .user-details {
  display: none;
}

/* Scrollbar personalizado */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.collapsed {
    transform: translateX(0);
    width: 64px;
  }
}
</style>