<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-4 w-full max-w-full sm:max-w-md max-h-[90vh] overflow-auto">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-base font-semibold text-gray-900 flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit Product
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Barcode *</label>
            <input v-model="form.barcode" type="text" required :readonly="readonly"
              :class="['w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white']">
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Product Name *</label>
            <input v-model="form.name" type="text" required :readonly="readonly"
              :class="['w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white']">
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" rows="1" :readonly="readonly"
              :class="['w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white']"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <input v-model="form.category" type="text" :readonly="readonly"
                :class="['w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white']">
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Expected Qty *</label>
              <input v-model="form.expected_quantity" type="number" min="0" required :readonly="readonly"
                :class="['w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white']">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Counted Quantity</label>
            <input v-model="form.counted_quantity" type="number" min="0" :readonly="readonly"
              :class="['w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white']">
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <input v-model="form.location" type="text" :readonly="readonly"
              :class="['w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500', readonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white']">
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button type="button" @click="$emit('close')"
            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1.5 rounded text-sm transition-colors">
            <span v-if="readonly">Close</span>
            <span v-else>Cancel</span>
          </button>
          <button v-if="!readonly" type="submit" :disabled="loading"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading">Updating...</span>
            <span v-else>Update</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { productService } from '@/services/productService'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'product-updated'])

const { success, error } = useNotifications()
const loading = ref(false)
const form = ref({ ...props.product })

watch(() => props.product, (newProduct) => {
  form.value = { ...newProduct }
})

const handleSubmit = async () => {
  if (!form.value.barcode || !form.value.name || form.value.expected_quantity < 0) {
    error('Error', 'Please fill all required fields')
    return
  }

  loading.value = true
  try {
    const updatedProduct = await productService.updateProduct(
      props.product.inventory_id || props.product.inventoryId,
      props.product.id,
      form.value
    )
    success('Success', 'Product updated successfully')
    emit('product-updated', updatedProduct)
    emit('close')
  } catch (err) {
    error('Error', 'Failed to update product')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>