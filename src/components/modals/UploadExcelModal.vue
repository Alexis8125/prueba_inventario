<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-4 w-full max-w-full sm:max-w-2xl max-h-[90vh] overflow-auto">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-base font-semibold text-gray-900 flex items-center">
          <svg class="w-4 h-4 text-green-600 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          Cargar Excel
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <!-- File Upload Area -->
        <div class="border-2 border-dashed border-gray-300 rounded p-4 text-center"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop="handleFileDrop"
          :class="dragOver ? 'border-blue-500 bg-blue-50' : ''">
          <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          
          <div class="mb-2">
            <p class="text-xs text-gray-600 mb-1">Arrastra tu archivo Excel aquí</p>
            <p class="text-xs text-gray-500">Formatos: .xlsx, .xls (máx 10MB)</p>
          </div>
          
          <label class="cursor-pointer">
            <input type="file" ref="fileInput" accept=".xlsx,.xls" @change="handleFileSelect" class="hidden">
            <span class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Seleccionar
            </span>
          </label>
        </div>

        <!-- Selected File Info -->
        <div v-if="selectedFile" class="p-3 bg-green-50 border border-green-200 rounded">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="text-xs font-medium text-green-800">{{ selectedFile.name }}</p>
                <p class="text-xs text-green-600">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button @click="removeFile" class="text-green-600 hover:text-green-800 p-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Upload Options -->
        <div class="p-3 border border-gray-200 rounded">
          <h4 class="text-xs font-medium text-gray-700 mb-2">Opciones</h4>
          
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="options.overwrite" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="text-xs text-gray-700">Sobrescribir existentes</span>
            </label>
            
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="options.skipErrors" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="text-xs text-gray-700">Saltar con errores</span>
            </label>
            
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Fila datos</label>
              <input v-model="options.startRow" type="number" min="1" class="w-16 px-2 py-1 border border-gray-300 rounded text-xs">
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button type="button" @click="$emit('close')"
          class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1.5 rounded text-sm transition-colors">
          Cancelar
        </button>
        <button @click="handleUpload" :disabled="!selectedFile || loading"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="loading">Cargando...</span>
          <span v-else>Cargar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { productService } from '@/services/productService'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  inventoryId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'upload-success'])

const { success, error } = useNotifications()
const loading = ref(false)
const dragOver = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const options = ref({
  overwrite: false,
  skipErrors: true,
  startRow: 2
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateFile(file)
  }
}

const handleFileDrop = (event) => {
  dragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateFile(file)
  }
}

const validateFile = (file) => {
  const validTypes = ['.xlsx', '.xls']
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

  if (!validTypes.includes(fileExtension)) {
    error('Error', 'Solo se permiten archivos Excel (.xlsx, .xls)')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    error('Error', 'El tamaño del archivo debe ser menor a 10MB')
    return
  }

  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  loading.value = true
  try {
    const result = await productService.uploadProductsFromExcel(
      props.inventoryId,
      selectedFile.value,
      options.value
    )
    
    success('Éxito', `Se cargaron ${result.processed || result.products?.length || 0} productos exitosamente`)
    emit('upload-success', result.products || [])
    emit('close')
  } catch (err) {
    error('Error', 'No se pudo cargar el archivo')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>