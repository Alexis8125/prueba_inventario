<!-- src/components/Layout.vue -->
<template>
  <div class="app-layout">
    <!-- Sidebar - siempre visible, cambia de tamaño -->
    <Sidebar 
      :user="user" 
      :isCollapsed="sidebarCollapsed"
      @toggle="toggleSidebar"
    />
    
    <!-- Contenido principal -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <header class="main-header">
        <button @click="toggleSidebar" class="menu-toggle">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="sidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="header-title">
          <h1>{{ pageTitle }}</h1>
          <p class="company-name">{{ user?.company_name || 'Empresa' }}</p>
        </div>
        
        
        <div class="header-actions">
          <button @click="logout" class="logout-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>
      
      <!-- Contenido de la página -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'

const router = useRouter()
const route = useRoute()

// Datos del usuario
const user = ref({
  full_name: 'Usuario Demo',
  role: 'admin',
  company_name: 'Mi Empresa S.A.'
})

const pageTitle = ref('Dashboard')
const sidebarCollapsed = ref(false)

// Función simple para toggle
const toggleSidebar = () => {
  console.log('Toggle sidebar clicked!')
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value)
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// Cargar estado del sidebar
onMounted(() => {
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === 'true'
  }
  
  // Cargar usuario de localStorage si existe
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6;
}

/* Contenido principal */
.main-content {
  flex: 1;
  margin-left: 280px; /* Ancho del sidebar expandido */
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content.sidebar-collapsed {
  margin-left: 80px; /* Ancho del sidebar colapsado */
}

/* Header */
.main-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-toggle:hover {
  background-color: #f3f4f6;
}

.header-title {
  flex: 1;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.company-name {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.logout-btn:hover {
  background: #dc2626;
}

/* Área de contenido */
.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    width: 100%;
  }
  
  .menu-toggle {
    display: flex !important;
  }
}

@media (min-width: 769px) {
  .menu-toggle {
    display: none;
  }
}
</style>