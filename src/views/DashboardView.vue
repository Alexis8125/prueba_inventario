<template>
  <div>
    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Inventarios</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total_inventories || 0 }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Productos Totales</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total_products || 0 }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Contados</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total_counted || 0 }}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Progreso</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.progress || 0 }}%</p>
          </div>
          <div class="bg-orange-100 p-3 rounded-full">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Inventarios recientes -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Inventarios Recientes</h2>
        <router-link 
          to="/inventarios" 
          class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
        >
          Ver todos
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="inventory in recentInventories" :key="inventory.id">
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ inventory.name }}</div>
                <div class="text-sm text-gray-500">{{ inventory.description }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ inventory.counted_products || 0 }}/{{ inventory.total_products || 0 }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full" 
                      :style="{ width: `${calculateProgress(inventory)}%` }"
                    ></div>
                  </div>
                  <span class="ml-2 text-xs text-gray-600">{{ Math.round(calculateProgress(inventory)) }}%</span>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(inventory.created_at) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="startCounting(inventory)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Contar
                </button>
                <button
                  @click="viewReports(inventory)"
                  class="text-green-600 hover:text-green-900"
                >
                  Reportes
                </button>
              </td>
            </tr>
            <tr v-if="recentInventories.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                No hay inventarios recientes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div class="space-y-3">
          <button
            v-if="user?.role === 'admin' || user?.role === 'superadmin'"
            @click="$router.push('/inventarios/crear')"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center">
              <div class="bg-blue-100 p-2 rounded-lg mr-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-900">Crear Inventario</p>
                <p class="text-sm text-gray-500">Crea un nuevo inventario</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <button
            @click="$router.push('/conteos')"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center">
              <div class="bg-green-100 p-2 rounded-lg mr-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-900">Iniciar Conteo</p>
                <p class="text-sm text-gray-500">Continúa con el conteo</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <button
            v-if="user?.role === 'admin' || user?.role === 'superadmin'"
            @click="$router.push('/reportes')"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center">
              <div class="bg-purple-100 p-2 rounded-lg mr-3">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-900">Ver Reportes</p>
                <p class="text-sm text-gray-500">Reportes detallados</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start">
            <div class="flex-shrink-0">
              <div :class="`p-2 rounded-full ${activity.color}`">
                <component :is="activity.icon" class="w-4 h-4" />
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
          <div v-if="recentActivity.length === 0" class="text-center py-4 text-gray-500">
            No hay actividad reciente
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { error } = useNotifications()

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update-title'])

const stats = ref({
  total_inventories: 0,
  total_products: 0,
  total_counted: 0,
  progress: 0
})

const recentInventories = ref([])
const recentActivity = ref([])

// Definir iconos para actividad
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

const UserIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  `
}

onMounted(() => {
  emit('update-title', 'Dashboard')
  fetchDashboardData()
})

async function fetchDashboardData() {
  try {
    // Obtener estadísticas
    const data = await apiService.getDashboardStats()
    stats.value = data
    
    // Obtener inventarios recientes
    const inventories = await apiService.getInventories()
    recentInventories.value = inventories.slice(0, 5)
    
    // Simular actividad reciente
    recentActivity.value = [
      {
        id: 1,
        message: 'Nuevo inventario creado: "Inventario General"',
        time: 'Hace 2 horas',
        color: 'bg-blue-100 text-blue-600',
        icon: InventoryIcon
      },
      {
        id: 2,
        message: 'Usuario "Juan Pérez" completó un conteo',
        time: 'Hace 4 horas',
        color: 'bg-green-100 text-green-600',
        icon: CountingIcon
      },
      {
        id: 3,
        message: 'Nuevo usuario registrado: "María García"',
        time: 'Hace 1 día',
        color: 'bg-purple-100 text-purple-600',
        icon: UserIcon
      }
    ]
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'No se pudieron cargar los datos del dashboard')
    }
  }
}

function calculateProgress(inventory) {
  const total = inventory.total_products || 0
  const counted = inventory.counted_products || 0
  if (total === 0) return 0
  return (counted / total) * 100
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function startCounting(inventory) {
  router.push(`/conteo/${inventory.id}`)
}

function viewReports(inventory) {
  router.push(`/reportes/${inventory.id}`)
}
</script>