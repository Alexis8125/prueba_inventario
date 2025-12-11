<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Detalles de Venta</h3>
          <p class="text-sm text-gray-500">{{ sale?.invoice_number }}</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Información de la venta -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Cliente</p>
            <p class="font-medium text-gray-900">{{ sale?.customer_name || 'Cliente General' }}</p>
            <p v-if="sale?.customer_document" class="text-sm text-gray-600">
              {{ sale.customer_document }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Fecha</p>
            <p class="font-medium text-gray-900">{{ formatDateTime(sale?.created_at) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Método de Pago</p>
            <p class="font-medium text-gray-900 capitalize">{{ sale?.payment_method }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Estado</p>
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              sale?.status === 'completed' ? 'bg-green-100 text-green-800' : 
              'bg-red-100 text-red-800'
            ]">
              {{ sale?.status === 'completed' ? 'Completada' : 'Cancelada' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Productos vendidos -->
      <div class="mb-6">
        <h4 class="font-medium text-gray-900 mb-3">Productos Vendidos</h4>
        <div v-if="loading" class="text-center py-4">
          <svg class="animate-spin h-5 w-5 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="saleItems.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p class="text-gray-500">No hay información de productos</p>
        </div>
        
        <div v-else class="border border-gray-200 rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in saleItems" :key="index">
                <td class="px-4 py-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ item.product_name }}</p>
                    <p class="text-xs text-gray-500">{{ item.barcode }}</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <p class="text-sm">{{ item.quantity }}</p>
                </td>
                <td class="px-4 py-3">
                  <p class="text-sm">${{ parseFloat(item.unit_price).toFixed(2) }}</p>
                </td>
                <td class="px-4 py-3">
                  <p class="text-sm font-medium text-green-600">
                    ${{ parseFloat(item.subtotal).toFixed(2) }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Totales -->
      <div class="border-t pt-4">
        <div class="flex justify-end">
          <div class="w-64">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal:</span>
                <span>${{ parseFloat(sale?.subtotal || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">IVA (16%):</span>
                <span>${{ parseFloat(sale?.tax || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-semibold border-t pt-2">
                <span class="text-gray-900">Total:</span>
                <span class="text-green-600">${{ parseFloat(sale?.total || 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="generateInvoice"
          class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Ver Factura</span>
        </button>
        <button
          @click="$emit('close')"
          class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { salesService } from '@/services/salesService'

const props = defineProps({
  sale: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const saleItems = ref([])
const loading = ref(false)

// Formato de fecha
function formatDateTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar detalles de los productos de la venta
async function loadSaleDetails() {
  if (!props.sale?.id) {
    console.error('❌ No hay ID de venta para cargar detalles')
    return
  }

  loading.value = true
  try {
    console.log('🔍 Cargando detalles para venta ID:', props.sale.id)
    
    // Aquí llamas a la API para obtener los detalles de la venta
    // Necesitas que tu backend tenga la ruta: GET /api/sales/:id
    const saleDetails = await salesService.getSaleDetails(props.sale.id)
    
    console.log('📄 Detalles cargados:', saleDetails)
    
    // Ajusta según la estructura que retorna tu API
    if (saleDetails && saleDetails.items) {
      saleItems.value = saleDetails.items
    } else {
      saleItems.value = []
      console.warn('⚠️ La venta no tiene items o la estructura es diferente')
    }
    
  } catch (error) {
    console.error('❌ Error cargando detalles de venta:', error)
    saleItems.value = []
  } finally {
    loading.value = false
  }
}

function generateInvoice() {
  // Emitir evento para abrir modal de factura
  emit('open-invoice', props.sale)
}

onMounted(() => {
  loadSaleDetails()
})
</script>  