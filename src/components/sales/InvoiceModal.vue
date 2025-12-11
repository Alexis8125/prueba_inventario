<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Factura de Venta</h3>
          <p class="text-sm text-gray-500">{{ sale?.invoice_number }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="printInvoice"
            class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            <span>Imprimir</span>
          </button>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido de la factura -->
      <div id="invoice-content" class="border border-gray-200 rounded-lg p-8 bg-white">
        <!-- Encabezado -->
        <div class="flex justify-between items-start mb-8 pb-6 border-b-2 border-green-600">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ user?.company_name }}</h2>
            <p class="text-gray-600">Sistema de Inventario</p>
          </div>
          <div class="text-right">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">FACTURA</h1>
            <p class="text-gray-600 font-medium">{{ sale?.invoice_number }}</p>
            <p class="text-gray-600">{{ formatDate(sale?.created_at) }}</p>
          </div>
        </div>

        <!-- Información del cliente y vendedor -->
        <div class="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 class="font-medium text-gray-700 mb-2">Cliente</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium text-gray-900">{{ sale?.customer_name || 'Cliente General' }}</p>
              <p v-if="sale?.customer_document" class="text-sm text-gray-600 mt-1">
                RUC/DNI: {{ sale.customer_document }}
              </p>
              <p v-if="sale?.customer_phone" class="text-sm text-gray-600">
                Teléfono: {{ sale.customer_phone }}
              </p>
            </div>
          </div>
          <div>
            <h3 class="font-medium text-gray-700 mb-2">Vendedor</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium text-gray-900">{{ sale?.created_by_name }}</p>
              <p class="text-sm text-gray-600 mt-1">
                Fecha: {{ formatDateTime(sale?.created_at) }}
              </p>
              <p class="text-sm text-gray-600">
                Pago: {{ getPaymentMethodName(sale?.payment_method) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Tabla de productos -->
        <div class="mb-8">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-green-600 text-white">
                <th class="py-3 px-4 text-left font-medium">Código</th>
                <th class="py-3 px-4 text-left font-medium">Producto</th>
                <th class="py-3 px-4 text-left font-medium">Cantidad</th>
                <th class="py-3 px-4 text-left font-medium">Precio Unit.</th>
                <th class="py-3 px-4 text-left font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in saleItems" :key="index" 
                  :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
                <td class="py-3 px-4 border-b">{{ item.barcode }}</td>
                <td class="py-3 px-4 border-b">{{ item.product_name }}</td>
                <td class="py-3 px-4 border-b text-center">{{ item.quantity }}</td>
                <td class="py-3 px-4 border-b text-right">${{ parseFloat(item.unit_price).toFixed(2) }}</td>
                <td class="py-3 px-4 border-b text-right">${{ parseFloat(item.subtotal).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totales -->
        <div class="flex justify-end mb-8">
          <div class="w-80">
            <div class="space-y-2">
              <div class="flex justify-between text-lg">
                <span class="text-gray-600">Subtotal:</span>
                <span>${{ parseFloat(sale?.subtotal || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg">
                <span class="text-gray-600">IVA (16%):</span>
                <span>${{ parseFloat(sale?.tax || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-2xl font-bold border-t pt-4 mt-4">
                <span class="text-gray-900">TOTAL:</span>
                <span class="text-green-600">${{ parseFloat(sale?.total || 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pie de página -->
        <div class="border-t pt-6 text-center text-gray-500 text-sm">
          <p>¡Gracias por su compra!</p>
          <p class="mt-1">Documento generado automáticamente por Sistema de Inventario</p>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="downloadPDF"
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Descargar PDF</span>
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
import { useNotifications } from '@/composables/useNotifications'
import { salesService } from '@/services/salesService'

const { success, error } = useNotifications()
const emit = defineEmits(['close'])

const props = defineProps({
  sale: {
    type: Object,
    required: true
  }
})

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const saleItems = ref([])
const loading = ref(false)

// Métodos de formato
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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

function getPaymentMethodName(method) {
  const methods = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia',
    yape: 'Yape/Plin'
  }
  return methods[method] || method
}

// Funciones de acción
function printInvoice() {
  const invoiceContent = document.getElementById('invoice-content').innerHTML
  const originalContent = document.body.innerHTML
  
  document.body.innerHTML = invoiceContent
  window.print()
  document.body.innerHTML = originalContent
  window.location.reload()
}

async function downloadPDF() {
  try {
    const response = await salesService.getInvoice(props.sale.id, 'html')
    // En una implementación real, aquí generarías el PDF
    // Por ahora solo mostramos un mensaje
    success('PDF', 'Funcionalidad de PDF en desarrollo')
  } catch (err) {
    error('Error', 'No se pudo generar el PDF')
  }
}

async function loadSaleDetails() {
  if (!props.sale.id) return
  
  loading.value = true
  try {
    const data = await salesService.getSaleDetails(props.sale.id)
    saleItems.value = data.items || []
  } catch (err) {
    error('Error', 'No se pudieron cargar los detalles')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSaleDetails()
})
</script>