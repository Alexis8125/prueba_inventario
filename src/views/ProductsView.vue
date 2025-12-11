<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Main Content -->
    <div class="pl-0 lg:pl-64 transition-all duration-300">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <button @click="$router.back()" class="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </button>
              <div>
                <h1 class="text-xl font-bold text-gray-900">Gestión de Productos</h1>
                <p class="text-sm text-gray-500">{{ inventoryName }}</p>
              </div>
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {{ products.length }} productos
              </span>
            </div>

            <!-- User Info -->
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-700">{{ user?.full_name }}</p>
                <p class="text-xs text-gray-500">{{ getUserRoleName() }}</p>
              </div>
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 font-medium text-sm">{{ getUserInitials() }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <!-- Toolbar -->
        <div class="mb-5 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <!-- Search and Filters -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-2xl">
              <!-- Search Bar -->
              <div class="relative flex-1 max-w-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input v-model="searchQuery" type="text"
                  class="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm w-full"
                  placeholder="Buscar por código, nombre, categoría...">
              </div>

              <!-- Quick Filters -->
              <div class="flex flex-wrap gap-2">
                <select v-model="filterCategory" class="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas las Categorías</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                
                <select v-model="filterStatus" class="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todos los Estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="counted">Contado</option>
                  <option value="discrepancy">Con Discrepancia</option>
                </select>
                
                <select v-model="filterStock" class="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todo el Stock</option>
                  <option value="low">Stock Bajo</option>
                  <option value="normal">Normal</option>
                  <option value="over">Stock Alto</option>
                </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
              <!-- Botón Actualizar -->
              <button @click="fetchProducts" class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Actualizar">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>

              <!-- Botón Cargar Excel -->
              <button @click="openUploadModal"
                class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                <span class="hidden sm:inline">Cargar Excel</span>
              </button>

              <!-- Botón Agregar Producto -->
              <button @click="openCreateModal"
                class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="hidden sm:inline">Agregar Producto</span>
              </button>
            </div>
          </div>

          <!-- Contador de Resultados -->
          <div v-if="searchQuery || filterCategory || filterStatus" class="mt-3 pt-3 border-t border-gray-100">
            <p class="text-xs text-gray-600">
              Mostrando {{ filteredProducts.length }} de {{ products.length }} productos
              <span v-if="searchQuery"> para "<strong>{{ searchQuery }}</strong>"</span>
              <span v-if="filterCategory"> en la categoría "<strong>{{ filterCategory }}</strong>"</span>
              <button @click="clearFilters" class="ml-2 text-blue-600 hover:text-blue-800 text-sm">
                Limpiar filtros
              </button>
            </p>
          </div>
        </div>

        <!-- Products Table Component -->
        <ProductsTable 
          :products="filteredProducts"
          :loading="loading"
          @edit-product="editProduct"
          @delete-product="deleteProduct"
          @view-details="viewProductDetails"
        />

        <!-- Sin Productos -->
        <div v-if="!loading && products.length === 0" class="text-center py-8 bg-white rounded-lg border border-gray-200">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <h3 class="text-base font-medium text-gray-900 mb-1">No hay productos</h3>
          <p class="text-sm text-gray-500 mb-3">Agrega productos manualmente o carga un archivo Excel</p>
          <div class="space-x-2">
            <button @click="openCreateModal"
              class="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-lg text-sm font-medium">
              Agregar Producto
            </button>
            <button @click="openUploadModal"
              class="border border-gray-300 hover:bg-gray-50 text-gray-700 py-1.5 px-3 rounded-lg text-sm font-medium">
              Cargar Excel
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Add Product Modal -->
    <AddProductModal 
      v-if="showCreateModal"
      :inventory-id="inventoryId"
      :categories="categories"
      @close="showCreateModal = false"
      @product-added="handleProductAdded"
      @category-added="handleCategoryAdded"
    />

    <!-- Upload Excel Modal -->
    <UploadExcelModal 
      v-if="showUploadModal"
      :inventory-id="inventoryId"
      @close="showUploadModal = false"
      @upload-success="handleUploadSuccess"
    />

    <!-- Edit Product Modal -->
    <EditProductModal 
      v-if="showEditModal"
      :product="editingProduct"
      :readonly="editReadOnly"
      @close="showEditModal = false"
      @product-updated="handleProductUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal 
      v-if="showDeleteModal"
      title="Delete Product"
      message="Are you sure you want to delete this product? This action cannot be undone."
      confirm-text="Delete"
      confirm-color="red"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import ProductsTable from '@/components/ProductsTable.vue'
import AddProductModal from '@/components/modals/AddProductModal.vue'
import UploadExcelModal from '@/components/modals/UploadExcelModal.vue'
import EditProductModal from '@/components/modals/EditProductModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import { productService } from '@/services/productService'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const router = useRouter()
const { success, error } = useNotifications()

// Component State
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const inventoryId = ref(route.params.id)
const inventoryName = ref('')
const products = ref([])
const loading = ref(false)

// Filter States
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const filterStock = ref('')

// Modal States
const showCreateModal = ref(false)
const showUploadModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingProduct = ref(null)
const deletingProductId = ref(null)
const editReadOnly = ref(false)

// Computed Properties
// manualCategories holds categories added via the AddProductModal so they persist
const manualCategories = ref([])

const categories = computed(() => {
  const cats = new Set()
  products.value.forEach(product => {
    if (product.category) cats.add(product.category)
  })
  manualCategories.value.forEach(c => {
    if (c) cats.add(c)
  })
  return Array.from(cats).sort()
})

const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Text search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.barcode?.toLowerCase().includes(query) ||
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (filterCategory.value) {
    filtered = filtered.filter(product => product.category === filterCategory.value)
  }

  // Status filter
  if (filterStatus.value) {
    if (filterStatus.value === 'pending') {
      filtered = filtered.filter(product => !product.counted_quantity)
    } else if (filterStatus.value === 'counted') {
      filtered = filtered.filter(product => product.counted_quantity > 0)
    } else if (filterStatus.value === 'discrepancy') {
      filtered = filtered.filter(product => 
        product.counted_quantity && 
        product.counted_quantity !== product.expected_quantity
      )
    }
  }

  // Stock filter
  if (filterStock.value) {
    if (filterStock.value === 'low') {
      filtered = filtered.filter(product => 
        product.counted_quantity && 
        product.counted_quantity < (product.expected_quantity || 0)
      )
    } else if (filterStock.value === 'over') {
      filtered = filtered.filter(product => 
        product.counted_quantity && 
        product.counted_quantity > (product.expected_quantity || 0)
      )
    } else if (filterStock.value === 'normal') {
      filtered = filtered.filter(product => 
        product.counted_quantity === (product.expected_quantity || 0)
      )
    }
  }

  return filtered
})

// Methods
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
    'superadmin': 'Súper Administrador',
    'admin': 'Administrador',
    'user': 'Usuario'
  }
  return roles[user.value?.role] || 'Usuario'
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const data = await productService.getProductsByInventory(inventoryId.value)
    products.value = data.products || []
    inventoryName.value = data.inventory_name || 'Inventario'
    success('Éxito', `Se cargaron ${products.value.length} productos`)
    // Fetch persisted categories from backend
    try {
      const cats = await productService.getCategories(inventoryId.value)
      if (Array.isArray(cats)) {
        // replace manualCategories with backend categories (keep any local ones too)
        manualCategories.value = Array.from(new Set([...(manualCategories.value || []), ...cats]))
      }
    } catch (e) {
      console.warn('No se pudieron cargar categorías desde backend:', e.message)
    }
  } catch (err) {
    error('Error', 'No se pudieron cargar los productos')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const openUploadModal = () => {
  showUploadModal.value = true
}

const clearFilters = () => {
  searchQuery.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
  filterStock.value = ''
}

// Product CRUD Operations
const editProduct = (product) => {
  editingProduct.value = { ...product }
  editReadOnly.value = false
  showEditModal.value = true
}

const deleteProduct = (productId) => {
  deletingProductId.value = productId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await productService.deleteProduct(inventoryId.value, deletingProductId.value)
    products.value = products.value.filter(p => p.id !== deletingProductId.value)
    success('Éxito', 'Producto eliminado exitosamente')
    showDeleteModal.value = false
    deletingProductId.value = null
  } catch (err) {
    error('Error', 'No se pudo eliminar el producto')
  }
}

const viewProductDetails = (product) => {
  // Open the Edit modal in readonly mode for quick product view
  editingProduct.value = { ...product }
  editReadOnly.value = true
  showEditModal.value = true
}

const handleProductAdded = (newProduct) => {
  products.value.unshift(newProduct)
  success('Éxito', 'Producto agregado exitosamente')
}

const handleCategoryAdded = (category) => {
  const trimmed = String(category || '').trim()
  if (!trimmed) return
  if (!manualCategories.value.includes(trimmed)) {
    // persist to backend
    productService.addCategory(inventoryId.value, trimmed)
      .then(res => {
        // server responds with categories
        if (res && Array.isArray(res.categories)) {
          manualCategories.value = res.categories
        } else {
          manualCategories.value.push(trimmed)
        }
        success('Éxito', `Categoría "${trimmed}" agregada`)
      })
      .catch(err => {
        console.error('Error saving category:', err)
        // fallback to UI-only
        manualCategories.value.push(trimmed)
        success('Éxito', `Categoría "${trimmed}" agregada (local)`)
      })
  }
}

const handleProductUpdated = (updatedProduct) => {
  const index = products.value.findIndex(p => p.id === updatedProduct.id)
  if (index !== -1) {
    products.value[index] = updatedProduct
  }
  success('Éxito', 'Producto actualizado exitosamente')
}

const handleUploadSuccess = (uploadedProducts) => {
  products.value = [...uploadedProducts, ...products.value]
  success('Éxito', `${uploadedProducts.length} productos cargados exitosamente`)
}

const exportToExcel = async () => {
  try {
    const data = await productService.exportProducts(inventoryId.value)
    
    // Create blob and download
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `productos_inventario_${inventoryId.value}_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    success('Éxito', 'Archivo Excel descargado')
  } catch (err) {
    error('Error', 'No se pudo exportar los productos')
  }
}

// Lifecycle
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>