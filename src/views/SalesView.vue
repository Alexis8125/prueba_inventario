<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Contenido principal -->
    <div class="pl-0 lg:pl-64 transition-all duration-300">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Módulo de Ventas</h1>
              <span class="ml-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {{ user?.company_name }}
              </span>
            </div>
            
            <div class="flex items-center space-x-4">
              <button
                @click="showNewSaleModal = true"
                class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Nueva Venta</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        

        <!-- Tabla de ventas recientes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900">
              Ventas Recientes
              <span class="text-sm font-normal text-gray-500 ml-2">
                ({{ sales.length }} ventas)
              </span>
            </h3>
            
            <div class="flex items-center space-x-2">
              <select v-model="periodFilter" @change="fetchSales"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm">
                <option value="today">Hoy</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
                <option value="all">Todo</option>
              </select>
            </div>
          </div>

          <AppTable
            :data="sales"
            :headers="salesHeaders"
            :pageSize="10"
            :pageCurrent="1"
            :totalItems="sales.length"
            :loading="loading"
            :showPaginator="true"
            :multipleSelection="false"
            :tableSize="'small'"
            :stripedRows="true"
          >
            <!-- Slot para total -->
            <template #custom-total="{ data }">
              <span class="font-semibold text-green-600">
                ${{ parseFloat(data.total).toFixed(2) }}
              </span>
            </template>

            <!-- Slot para estado -->
            <template #custom-status="{ data }">
              <span :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                data.status === 'completed' ? 'bg-green-100 text-green-800' : 
                data.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              ]">
                {{ data.status === 'completed' ? 'Completada' : 'Cancelada' }}
              </span>
            </template>

            <!-- Slot para acciones -->
            <template #custom-actions="{ data }">
              <div class="flex space-x-2">
                <button
                  @click="viewInvoice(data)"
                  class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                  title="Ver Factura"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </button>
                <button
                  @click="viewSaleDetails(data)"
                  class="text-green-600 hover:text-green-800 p-1 rounded transition-colors duration-200"
                  title="Ver Detalles"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </template>

            <!-- Slot para cuando no hay datos -->
            <template #empty>
              <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
                <p class="text-gray-500 mb-4">Crea tu primera venta para comenzar</p>
                <button
                  @click="showNewSaleModal = true"
                  class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                >
                  Crear Primera Venta
                </button>
              </div>
            </template>
          </AppTable>
        </div>
      </main>
    </div>

    <!-- Modal para nueva venta -->
    <NewSaleModal 
      v-if="showNewSaleModal"
      @close="showNewSaleModal = false"
      @sale-created="handleSaleCreated"
    />

    <!-- Modal para ver factura -->
    <InvoiceModal
      v-if="showInvoiceModal"
      :sale="selectedSale"
      @close="showInvoiceModal = false"
    />

    <!-- Modal para ver detalles de venta -->
    <SaleDetailsModal
      v-if="showDetailsModal"
      :sale="selectedSale"
      @close="showDetailsModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import Sidebar from '@/components/Sidebar.vue'
import AppTable from '@/components/atoms/AppTable.vue'
import NewSaleModal from '@/components/sales/NewSaleModal.vue'
import InvoiceModal from '@/components/sales/InvoiceModal.vue'
import SaleDetailsModal from '@/components/sales/SaleDetailsModal.vue'
import { salesService } from '@/services/salesService'

const { success, error } = useNotifications()

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const sales = ref([])
const stats = ref({ overview: {}, top_products: [] })
const loading = ref(false)
const periodFilter = ref('today')

// Estados para modales
const showNewSaleModal = ref(false)
const showInvoiceModal = ref(false)
const showDetailsModal = ref(false)
const selectedSale = ref(null)

// Headers de la tabla
const salesHeaders = ref([
  { field: 'invoice_number', header: 'Factura', width: '150px' },
  { field: 'customer_name', header: 'Cliente', width: '200px' },
  { field: 'created_at', header: 'Fecha', width: '150px' },
  { field: 'total_items', header: 'Items', width: '80px' },
  { field: 'total_quantity', header: 'Cantidad', width: '100px' },
  { field: 'total', header: 'Total', width: '120px' },
  { field: 'payment_method', header: 'Pago', width: '100px' },
  { field: 'status', header: 'Estado', width: '100px' },
  { field: 'created_by_name', header: 'Vendedor', width: '150px' },
  { field: 'actions', header: 'Acciones', width: '100px' }
])

// Funciones
async function fetchSales() {
  loading.value = true
  try {
    let params = {}
    if (periodFilter.value !== 'all') {
      params.startDate = getDateRange(periodFilter.value)
    }
    
    sales.value = await salesService.getSales(params)
  } catch (err) {
    error('Error', 'No se pudieron cargar las ventas')
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    stats.value = await salesService.getSalesStats(periodFilter.value)
  } catch (err) {
    console.error('Error cargando estadísticas:', err)
  }
}

function getDateRange(period) {
  const today = new Date()
  const result = new Date()
  
  switch(period) {
    case 'week':
      result.setDate(today.getDate() - 7)
      break
    case 'month':
      result.setMonth(today.getMonth() - 1)
      break
    default:
      return today.toISOString().split('T')[0]
  }
  
  return result.toISOString().split('T')[0]
}

function handleSaleCreated() {
  showNewSaleModal.value = false
  fetchSales()
  fetchStats()
  success('Éxito', 'Venta registrada correctamente')
}

function viewInvoice(sale) {
  selectedSale.value = sale
  showInvoiceModal.value = true
}

function viewSaleDetails(sale) {
  selectedSale.value = sale
  showDetailsModal.value = true
}

onMounted(() => {
  fetchSales()
  fetchStats()
})
</script>