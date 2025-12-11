<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div class="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Nueva Venta</h3>
          <p class="text-sm text-gray-500">Registra una nueva venta de productos</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna izquierda: Búsqueda de productos -->
        <div class="lg:col-span-2">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-4">Productos</h4>
            
            <!-- Búsqueda de productos -->
            <div class="mb-4">
              <div class="flex space-x-2">
                <div class="relative flex-1">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    v-model="searchQuery"
                    @input="searchProducts"
                    type="text"
                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full"
                    placeholder="Buscar producto por nombre o código..."
                  >
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                  <input
                    v-model="barcodeInput"
                    @keyup.enter="searchByBarcode"
                    type="text"
                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-48"
                    placeholder="Código de barras..."
                  >
                </div>
              </div>
            </div>

            <!-- Lista de productos encontrados -->
            <div class="mb-4">
              <div v-if="searchLoading" class="text-center py-4">
                <svg class="animate-spin h-5 w-5 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                <div
                  v-for="product in searchResults"
                  :key="product.id"
                  class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  @click="addToCart(product)"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ product.name }}</p>
                      <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>Código: {{ product.barcode }}</span>
                        <span>Stock: {{ product.current_stock }}</span>
                        <span>Categoría: {{ product.category || 'N/A' }}</span>
                      </div>
                    </div>
                    <button class="text-green-600 hover:text-green-800 ml-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-4 text-gray-500">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>Busca productos para agregar a la venta</p>
              </div>
            </div>

            <!-- Carrito de compra -->
            <div>
              <h5 class="font-medium text-gray-900 mb-3">Productos en la venta</h5>
              <div v-if="cart.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-gray-500">No hay productos en el carrito</p>
              </div>
              
              <div v-else class="border border-gray-200 rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, index) in cart" :key="index">
                      <td class="px-4 py-3">
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ item.product_name }}</p>
                          <p class="text-xs text-gray-500">{{ item.barcode }}</p>
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex items-center">
                          <span class="text-sm">$</span>
                          <input
                            v-model.number="item.unit_price"
                            @change="updateItemTotal(item)"
                            type="number"
                            min="0"
                            step="0.01"
                            class="ml-1 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                        </div>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex items-center space-x-2">
                          <button
                            @click="updateQuantity(item, -1)"
                            :disabled="item.quantity <= 1"
                            class="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                          >
                            -
                          </button>
                          <input
                            v-model.number="item.quantity"
                            @change="updateItemTotal(item)"
                            type="number"
                            min="1"
                            :max="item.current_stock"
                            class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                          >
                          <button
                            @click="updateQuantity(item, 1)"
                            :disabled="item.quantity >= item.current_stock"
                            class="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Stock: {{ item.current_stock }}</p>
                      </td>
                      <td class="px-4 py-3">
                        <p class="text-sm font-medium text-green-600">
                          ${{ item.subtotal.toFixed(2) }}
                        </p>
                      </td>
                      <td class="px-4 py-3">
                        <button
                          @click="removeFromCart(index)"
                          class="text-red-600 hover:text-red-800"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Resumen y pago -->
        <div>
          <div class="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
            <h4 class="font-medium text-gray-900 mb-4">Resumen de Venta</h4>
            
            <!-- Información del cliente -->
            <div class="mb-6">
              <h5 class="text-sm font-medium text-gray-700 mb-2">Información del Cliente</h5>
              <div class="space-y-2">
                <input
                  v-model="customer.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Nombre del cliente"
                >
                <input
                  v-model="customer.document"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="RUC/DNI (opcional)"
                >
                <input
                  v-model="customer.phone"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Teléfono (opcional)"
                >
              </div>
            </div>

            <!-- Método de pago -->
            <div class="mb-6">
              <h5 class="text-sm font-medium text-gray-700 mb-2">Método de Pago</h5>
              <select
                v-model="paymentMethod"
                class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="yape">Yape/Plin</option>
              </select>
            </div>

            <!-- Totales -->
            <div class="mb-6">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal:</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">IVA (16%):</span>
                  <span>${{ tax.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-lg font-semibold border-t pt-2">
                  <span class="text-gray-900">Total:</span>
                  <span class="text-green-600">${{ total.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="space-y-2">
              <button
                @click="processSale"
                :disabled="cart.length === 0 || processing"
                :class="[
                  'w-full py-3 rounded-lg font-medium transition-colors duration-300',
                  cart.length === 0 || processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                ]"
              >
                <svg v-if="processing" class="animate-spin h-5 w-5 text-white inline mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ processing ? 'Procesando...' : `Pagar $${total.toFixed(2)}` }}</span>
              </button>
              
              <button
                @click="clearCart"
                :disabled="cart.length === 0"
                :class="[
                  'w-full py-2 rounded-lg font-medium transition-colors duration-300 text-sm',
                  cart.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                ]"
              >
                Limpiar Carrito
              </button>
              
              <button
                @click="$emit('close')"
                class="w-full py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-300 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { salesService } from '@/services/salesService'

const { success, error } = useNotifications()
const emit = defineEmits(['close', 'sale-created'])

// Estado
const searchQuery = ref('')
const barcodeInput = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
const processing = ref(false)

// Carrito
const cart = ref([])

// Información del cliente
const customer = ref({
  name: 'Cliente General',
  document: '',
  phone: '',
  email: ''
})

const paymentMethod = ref('efectivo')

// Computed properties
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.subtotal, 0)
})

const tax = computed(() => {
  return subtotal.value * 0.16 // 16% IVA
})

const total = computed(() => {
  return subtotal.value + tax.value
})

// Métodos
async function searchProducts() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  searchLoading.value = true
  try {
    const products = await salesService.searchProducts(searchQuery.value)
    searchResults.value = products
  } catch (err) {
    error('Error', 'No se pudieron buscar productos')
  } finally {
    searchLoading.value = false
  }
}

async function searchByBarcode() {
  if (!barcodeInput.value.trim()) return
  
  searchLoading.value = true
  try {
    const products = await salesService.searchProducts(null, barcodeInput.value)
    if (products.length > 0) {
      addToCart(products[0])
      barcodeInput.value = ''
      searchResults.value = []
    } else {
      error('No encontrado', 'Producto no encontrado')
    }
  } catch (err) {
    error('Error', 'No se pudo buscar el producto')
  } finally {
    searchLoading.value = false
  }
}

function addToCart(product) {
  // Verificar si el producto ya está en el carrito
  const existingItem = cart.value.find(item => item.product_id === product.id)
  
  if (existingItem) {
    if (existingItem.quantity < product.current_stock) {
      existingItem.quantity += 1
      updateItemTotal(existingItem)
    } else {
      error('Stock insuficiente', `Solo hay ${product.current_stock} unidades disponibles`)
    }
  } else {
    cart.value.push({
      product_id: product.id,
      barcode: product.barcode,
      product_name: product.name,
      unit_price: 0, // El usuario debe ingresar el precio
      quantity: 1,
      current_stock: product.current_stock,
      subtotal: 0
    })
  }
  
  // Limpiar búsqueda
  searchQuery.value = ''
  searchResults.value = []
}

function removeFromCart(index) {
  cart.value.splice(index, 1)
}

function updateQuantity(item, change) {
  const newQuantity = item.quantity + change
  if (newQuantity >= 1 && newQuantity <= item.current_stock) {
    item.quantity = newQuantity
    updateItemTotal(item)
  }
}

function updateItemTotal(item) {
  item.subtotal = item.quantity * (item.unit_price || 0)
}

function clearCart() {
  cart.value = []
  customer.value = {
    name: 'Cliente General',
    document: '',
    phone: '',
    email: ''
  }
  paymentMethod.value = 'efectivo'
}

async function processSale() {
  if (cart.length === 0) {
    error('Error', 'No hay productos en el carrito')
    return
  }
  
  // Validar precios y datos
  for (const item of cart.value) {
    if (!item.unit_price || item.unit_price <= 0) {
      error('Error', `Ingresa un precio válido para ${item.product_name}`)
      return
    }
    if (!item.quantity || item.quantity <= 0) {
      error('Error', `Ingresa una cantidad válida para ${item.product_name}`)
      return
    }
    if (item.quantity > item.current_stock) {
      error('Stock insuficiente', `${item.product_name}: solo hay ${item.current_stock} unidades`)
      return
    }
  }
  
  processing.value = true
  
  try {
    // PREPARAR DATOS CORRECTAMENTE
    const saleData = {
      customer_name: customer.value.name?.trim() || 'Cliente General',
      // Enviar null si está vacío, no undefined o string vacío
      customer_document: customer.value.document?.trim() || null,
      customer_phone: customer.value.phone?.trim() || null,
      customer_email: customer.value.email?.trim() || null,
      payment_method: paymentMethod.value || 'efectivo',
      items: cart.value.map(item => ({
        product_id: item.product_id,
        barcode: item.barcode || '',
        product_name: item.product_name,
        quantity: Number(item.quantity), // Asegurar que sea número
        unit_price: Number(item.unit_price) // Asegurar que sea número
      }))
    }
    
    console.log('📤 Enviando datos de venta:', JSON.stringify(saleData, null, 2))
    
    const result = await salesService.createSale(saleData)
    
    success('Éxito', `Venta registrada: ${result.invoice_number}`)
    clearCart()
    emit('sale-created', result)
    
  } catch (err) {
    console.error('❌ Error en processSale:', err)
    error('Error', err.message || 'Error al procesar la venta')
  } finally {
    processing.value = false
  }
}

// Watch para búsqueda con debounce
let searchTimeout = null
watch(searchQuery, (newValue) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (newValue.trim()) {
      searchProducts()
    }
  }, 300)
})
</script>