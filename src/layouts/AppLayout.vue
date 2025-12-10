<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar 
      :user="user" 
      :is-collapsed="isSidebarCollapsed"
      @toggle-sidebar="toggleSidebar"
    />
    
    <!-- Contenido principal -->
    <div class="transition-all duration-300" :class="isSidebarCollapsed ? 'ml-16' : 'ml-64'">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Botón para toggle sidebar en móvil -->
            <button 
              @click="toggleSidebar"
              class="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="isSidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- Título de la página -->
            <div class="flex-1 ml-4 lg:ml-0">
              <h1 class="text-xl font-bold text-gray-900">{{ pageTitle }}</h1>
              <p class="text-sm text-gray-500">{{ user?.company_name }}</p>
            </div>
            
            <!-- Información de usuario y logout -->
            <div class="flex items-center space-x-4">
              <div class="hidden sm:flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-700">{{ user?.full_name }}</p>
                  <p class="text-xs text-gray-500">{{ getUserRoleName() }}</p>
                </div>
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-medium text-sm">{{ getUserInitials() }}</span>
                </div>
              </div>
              
              <button
                @click="handleLogout"
                class="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 px-3 rounded-lg transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido de la vista -->
      <main class="px-4 sm:px-6 lg:px-8 py-6">
        <router-view :user="user" @update-title="updateTitle" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
const route = useRoute()
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const pageTitle = ref('Dashboard')
const isSidebarCollapsed = ref(false)

// Actualizar título de la página
const updateTitle = (title) => {
  pageTitle.value = title
}

// Funciones de utilidad
const getUserInitials = () => {
  if (!user.value?.full_name) return 'U'
  return user.value.full_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getUserRoleName = () => {
  const roles = {
    'superadmin': 'Super Administrador',
    'admin': 'Administrador',
    'user': 'Usuario'
  }
  return roles[user.value?.role] || 'Usuario'
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

// Observar cambios en la ruta para actualizar título
import { watch } from 'vue'
watch(() => route.meta?.title, (newTitle) => {
  if (newTitle) {
    pageTitle.value = newTitle
  }
})
</script>