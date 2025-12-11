<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto max-h-[60vh]">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Esperado
            </th>
            <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Contado
            </th>
            <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Diferencia
            </th>
            <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Estado Cargando -->
          <tr v-if="loading">
            <td colspan="8" class="px-6 py-12 text-center">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <p class="mt-2 text-sm text-gray-500">Cargando productos...</p>
            </td>
          </tr>

          <!-- Products List -->
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ product.barcode || '-' }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
              <div v-if="product.description" class="text-xs text-gray-500 truncate max-w-[200px]">
                {{ product.description }}
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span v-if="product.category" class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 inline-block">
                {{ product.category }}
              </span>
              <span v-else class="text-gray-400 text-sm">-</span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-center">
              <div class="text-sm text-gray-900 font-medium">{{ product.expected_quantity || 0 }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-center">
              <div class="text-sm font-medium" :class="getCountedStockClass(product)">
                {{ product.counted_quantity || 0 }}
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-center">
              <div class="text-sm font-medium" :class="getDifferenceClass(product)">
                {{ calculateDifference(product) }}
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span :class="getStatusBadgeClass(product)" class="px-2 py-1 text-xs rounded-full inline-block">
                {{ getStatusText(product) }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center space-x-1">
                <button @click="$emit('view-details', product)" 
                  class="text-blue-600 hover:text-blue-900 p-0.5 hover:bg-blue-50 rounded transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button @click="$emit('edit-product', product)" 
                  class="text-green-600 hover:text-green-900 p-0.5 hover:bg-green-50 rounded transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button @click="$emit('delete-product', product.id)" 
                  class="text-red-600 hover:text-red-900 p-0.5 hover:bg-red-50 rounded transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit-product', 'delete-product', 'view-details'])

// Helper methods
const calculateDifference = (product) => {
  const expected = product.expected_quantity || 0
  const counted = product.counted_quantity || 0
  return counted - expected
}

const getCountedStockClass = (product) => {
  const expected = product.expected_quantity || 0
  const counted = product.counted_quantity || 0
  
  if (counted === 0) return 'text-gray-500'
  if (counted < expected) return 'text-red-600'
  if (counted > expected) return 'text-orange-600'
  return 'text-green-600'
}

const getDifferenceClass = (product) => {
  const diff = calculateDifference(product)
  if (diff === 0) return 'text-gray-500'
  if (diff < 0) return 'text-red-600'
  return 'text-orange-600'
}

const getStatusText = (product) => {
  if (!product.counted_quantity) return 'Pending'
  if (product.counted_quantity === product.expected_quantity) return 'Correct'
  return 'Discrepancy'
}

const getStatusBadgeClass = (product) => {
  if (!product.counted_quantity) return 'bg-yellow-100 text-yellow-800'
  if (product.counted_quantity === product.expected_quantity) return 'bg-green-100 text-green-800'
  return 'bg-red-100 text-red-800'
}
</script>