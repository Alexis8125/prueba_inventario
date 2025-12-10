<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-4 w-full max-w-full sm:max-w-md max-h-[90vh] overflow-auto">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-base font-semibold text-gray-900 flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Agregar Producto
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
            <label class="block text-xs font-medium text-gray-700 mb-1">Código de Barras *</label>
            <input v-model="form.barcode" type="text" required
              class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Código de barras">
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nombre del Producto *</label>
            <input v-model="form.name" type="text" required
              class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del producto">
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="form.description" rows="1"
              class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- CATEGORÍA MEJORADA CON SELECT -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
              <div class="relative">
                <select v-model="selectedCategory" @change="handleCategoryChange"
                  class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer">
                  <option value="">Selecciona una categoría</option>
                  <option v-for="category in sortedCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                  <option value="__new__">➕ Agregar nueva categoría...</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Input para nueva categoría (se muestra solo cuando se selecciona "Agregar nueva") -->
              <div v-if="showNewCategoryInput" class="mt-1">
                <input v-model="newCategory" type="text" ref="newCategoryInput"
                  class="w-full px-3 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nueva categoría"
                  @keyup.enter="addNewCategory">
                <div class="flex gap-1 mt-1">
                  <button type="button" @click="addNewCategory"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs">
                    Agregar
                  </button>
                  <button type="button" @click="cancelNewCategory"
                    class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded text-xs">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Cantidad Esperada *</label>
              <input v-model="form.expected_quantity" type="number" min="0" required
                class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Ubicación</label>
            <input v-model="form.location" type="text"
              class="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Estante A1">
          </div>

          <!-- Vista previa de categorías disponibles -->
          <div v-if="sortedCategories.length > 0" class="bg-blue-50 p-2 rounded border border-blue-200">
            <p class="text-xs text-blue-700 font-medium mb-1">Disponibles:</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="category in sortedCategories" :key="category"
                class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                @click="selectCategory(category)"
                :title="`Seleccionar: ${category}`">
                {{ category }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button type="button" @click="$emit('close')"
            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1.5 rounded text-sm transition-colors\">
            Cancelar
          </button>
          <button type="submit" :disabled="loading"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed\">
            <span v-if="loading">Agregando...</span>
            <span v-else>Agregar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { productService } from '@/services/productService'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  inventoryId: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'product-added', 'category-added'])

const { success, error } = useNotifications()
const loading = ref(false)
const newCategoryInput = ref(null)

const form = ref({
  barcode: '',
  name: '',
  description: '',
  category: '',
  expected_quantity: 0,
  location: ''
})

// Estado para manejar la selección de categoría
const selectedCategory = ref('')
const showNewCategoryInput = ref(false)
const newCategory = ref('')

// Computed para ordenar las categorías alfabéticamente
const sortedCategories = computed(() => {
  return [...props.categories].sort((a, b) => a.localeCompare(b))
})

// Manejar cambio en el select de categorías
const handleCategoryChange = () => {
  if (selectedCategory.value === '__new__') {
    showNewCategoryInput.value = true
    newCategory.value = ''
    nextTick(() => {
      newCategoryInput.value?.focus()
    })
  } else {
    showNewCategoryInput.value = false
    form.value.category = selectedCategory.value
  }
}

// Agregar nueva categoría
const addNewCategory = () => {
  if (!newCategory.value.trim()) {
    error('Error', 'Por favor escribe un nombre para la nueva categoría')
    return
  }

  const trimmedCategory = newCategory.value.trim()
  
  // Evitar duplicados
  if (sortedCategories.value.includes(trimmedCategory)) {
    error('Error', 'Esta categoría ya existe')
    return
  }

  // Agregar la nueva categoría al formulario
  form.value.category = trimmedCategory
  
  // Emitir evento para que el padre actualice la lista de categorías
  emit('category-added', trimmedCategory)
  
  // Resetear el estado
  selectedCategory.value = trimmedCategory
  showNewCategoryInput.value = false
  newCategory.value = ''
  
  success('Éxito', `Categoría "${trimmedCategory}" agregada`)
}

// Cancelar nueva categoría
const cancelNewCategory = () => {
  selectedCategory.value = ''
  showNewCategoryInput.value = false
  newCategory.value = ''
  form.value.category = ''
}

// Seleccionar categoría haciendo clic en las etiquetas
const selectCategory = (category) => {
  form.value.category = category
  selectedCategory.value = category
}

// Enviar formulario
const handleSubmit = async () => {
  // Validaciones
  if (!form.value.barcode.trim()) {
    error('Error', 'El código de barras es requerido')
    return
  }

  if (!form.value.name.trim()) {
    error('Error', 'El nombre del producto es requerido')
    return
  }

  if (form.value.expected_quantity < 0) {
    error('Error', 'La cantidad esperada no puede ser negativa')
    return
  }

  loading.value = true
  try {
    const newProduct = await productService.addProduct(props.inventoryId, form.value)
    success('Éxito', 'Producto agregado exitosamente')
    emit('product-added', newProduct)
    emit('close')
  } catch (err) {
    error('Error', 'No se pudo agregar el producto')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Si hay categorías, seleccionar la primera por defecto
watch(() => props.categories, (newCategories) => {
  if (newCategories.length > 0 && !form.value.category) {
    form.value.category = newCategories[0]
    selectedCategory.value = newCategories[0]
  }
}, { immediate: true })
</script>

<style scoped>
/* Estilos para el select personalizado */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style>