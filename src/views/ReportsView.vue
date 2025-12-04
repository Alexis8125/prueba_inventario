<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Responsive Mejorado -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header para móvil -->
        <div class="lg:hidden">
          <div class="flex flex-col space-y-3 py-3">
            <!-- Primera fila: Botón volver y título -->
            <div class="flex items-center justify-between">
              <button
                @click="$router.push('/inventarios')"
                class="flex items-center space-x-2 text-[#8557FB] hover:text-[#6B45C8] bg-[#F7F1FF] hover:bg-[#F1E9FF] py-2 px-3 rounded-lg transition-colors duration-200 text-xs"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Volver</span>
              </button>
              
              <!-- Botón exportar en móvil -->
              <button
                @click="exportReport"
                class="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-1 text-xs"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                <span>Exportar {{ getExportButtonText() }}</span>
              </button>
            </div>

            <!-- Segunda fila: Título principal -->
            <div class="text-center">
              <h1 class="text-base font-bold text-gray-900 truncate">{{ inventory?.name }}</h1>
              <p class="text-xs text-gray-500">Reportes de Inventario</p>
            </div>
          </div>
        </div>

        <!-- Header para desktop -->
        <div class="hidden lg:block">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <button
                @click="$router.push('/inventarios')"
                class="flex items-center space-x-2 text-[#8557FB] hover:text-[#6B45C8] bg-[#F7F1FF] hover:bg-[#F1E9FF] py-2 px-3 rounded-lg transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Volver a Inventarios</span>
              </button>
              <div>
                <h1 class="text-xl font-bold text-gray-900">{{ inventory?.name }}</h1>
                <p class="text-sm text-gray-500">Reportes de Inventario</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <button
                @click="exportReport"
                class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                <span>Exportar {{ getExportButtonText() }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-6">
      <!-- Pestañas de tipos de reporte - Responsive -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4 mb-4 lg:mb-6">
        <div class="flex space-x-1 overflow-x-auto pb-2">
          <button
            v-for="tab in reportTabs"
            :key="tab.id"
            @click="activeReportTab = tab.id"
            :class="[
              'px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap',
              activeReportTab === tab.id
                ? 'bg-[#F7F1FF] text-[#8557FB] border border-[#F1E9FF]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
          >
            {{ getMobileTabName(tab.name) }}
          </button>
        </div>
      </div>

      <!-- Filtros - Responsive -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div>
            <label class="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Buscar Producto</label>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
              placeholder="Código o nombre..."
            >
          </div>
          <div>
            <label class="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Estado</label>
            <select
              v-model="statusFilter"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
            >
              <option value="all">Todos</option>
              <option value="counted">Contados</option>
              <option value="not-counted">No Contados</option>
              <option value="excess">Exceso</option>
              <option value="shortage">Faltante</option>
              <option value="exact">Exacto</option>
            </select>
          </div>
          <div>
            <label class="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Ordenar por</label>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
            >
              <option value="difference">Diferencia</option>
              <option value="difference_percentage">% Diferencia</option>
              <option value="product_name">Nombre</option>
              <option value="barcode">Código</option>
              <option value="expected_stock">Stock Esperado</option>
              <option value="counted_stock">Stock Contado</option>
              <option value="last_counted_at">Último Conteo</option>
            </select>
          </div>
          <div>
            <label class="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">Dirección</label>
            <select
              v-model="sortDirection"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
            >
              <option value="desc">Mayor a Menor</option>
              <option value="asc">Menor a Mayor</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Resumen General - Responsive -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4 mb-4 lg:mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-2 lg:p-4 text-center">
          <div class="text-sm lg:text-xl font-bold text-blue-600">{{ summary.totalProducts }}</div>
          <p class="text-xs text-gray-600">Total</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-2 lg:p-4 text-center">
          <div class="text-sm lg:text-xl font-bold text-green-600">{{ summary.countedProducts }}</div>
          <p class="text-xs text-gray-600">Contados</p>
          <p class="text-xs text-gray-500">{{ summary.countedProductsPercentage }}%</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-green-200 p-2 lg:p-4 text-center bg-green-50">
          <div class="text-sm lg:text-xl font-bold text-green-700">{{ summary.productsWithExcess }}</div>
          <p class="text-xs text-green-700">Exceso</p>
          <p class="text-xs text-green-600">{{ summary.excessPercentage }}%</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-red-200 p-2 lg:p-4 text-center bg-red-50">
          <div class="text-sm lg:text-xl font-bold text-red-700">{{ summary.productsWithShortage }}</div>
          <p class="text-xs text-red-700">Faltante</p>
          <p class="text-xs text-red-600">{{ summary.shortagePercentage }}%</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-blue-200 p-2 lg:p-4 text-center bg-blue-50">
          <div class="text-sm lg:text-xl font-bold text-blue-700">{{ summary.productsExact }}</div>
          <p class="text-xs text-blue-700">Exactos</p>
          <p class="text-xs text-blue-600">{{ summary.exactPercentage }}%</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-2 lg:p-4 text-center">
          <div class="text-sm lg:text-xl font-bold text-orange-600">{{ summary.pendingProducts }}</div>
          <p class="text-xs text-gray-600">Pendientes</p>
          <p class="text-xs text-gray-500">{{ summary.pendingPercentage }}%</p>
        </div>
      </div>

      <!-- Resumen por Unidades - Responsive -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mb-4 lg:mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-xs lg:text-sm text-gray-600">Unid. Esperadas</p>
              <p class="text-base lg:text-2xl font-bold text-blue-600">{{ formatNumber(summary.totalExpectedUnits) }}</p>
            </div>
            <div class="bg-blue-100 p-1 lg:p-2 rounded-full">
              <svg class="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-xs lg:text-sm text-gray-600">Unid. Contadas</p>
              <p class="text-base lg:text-2xl font-bold text-green-600">{{ formatNumber(summary.totalCountedUnits) }}</p>
            </div>
            <div class="bg-green-100 p-1 lg:p-2 rounded-full">
              <svg class="w-4 h-4 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-green-200 p-3 lg:p-4 bg-green-50">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-xs lg:text-sm text-green-700">Exceso Total</p>
              <p class="text-base lg:text-2xl font-bold text-green-700">+{{ formatNumber(summary.totalExcess) }}</p>
            </div>
            <div class="bg-green-200 p-1 lg:p-2 rounded-full">
              <svg class="w-4 h-4 lg:w-6 lg:h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-red-200 p-3 lg:p-4 bg-red-50">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-xs lg:text-sm text-red-700">Faltante Total</p>
              <p class="text-base lg:text-2xl font-bold text-red-700">{{ formatNumber(summary.totalShortage) }}</p>
            </div>
            <div class="bg-red-200 p-1 lg:p-2 rounded-full">
              <svg class="w-4 h-4 lg:w-6 lg:h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos y Métricas - Responsive -->
      <div class="grid grid-cols-1 gap-4 lg:gap-6 mb-4 lg:mb-6">
        <!-- Distribución de Estados -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Distribución por Estado</h3>
          <div class="space-y-2 lg:space-y-3">
            <div v-for="status in statusDistribution" :key="status.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-2 lg:space-x-3">
                <div class="w-2 h-2 lg:w-3 lg:h-3 rounded-full" :class="status.color"></div>
                <span class="text-xs lg:text-sm font-medium text-gray-700">{{ status.name }}</span>
              </div>
              <div class="flex items-center space-x-1 lg:space-x-2">
                <span class="text-xs lg:text-sm text-gray-900 font-medium">{{ status.count }}</span>
                <span class="text-xs text-gray-500">({{ status.percentage }}%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Progreso General -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 class="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Progreso del Inventario</h3>
          <div class="space-y-3 lg:space-y-4">
            <div>
              <div class="flex justify-between text-xs lg:text-sm text-gray-600 mb-1">
                <span>Progreso de Productos</span>
                <span>
                  {{ Math.min(summary.countedProductsPercentage, 100) }}%
                  <span v-if="summary.countedProductsPercentage > 100" class="text-orange-500 text-xs ml-1">
                    ({{ summary.countedProductsPercentage }}%)
                  </span>
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1 lg:h-2">
                <div 
                  class="bg-green-600 h-1 lg:h-2 rounded-full transition-all duration-500" 
                  :style="{ width: `${Math.min(summary.countedProductsPercentage, 100)}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs lg:text-sm text-gray-600 mb-1">
                <span>Progreso de Unidades</span>
                <span>
                  {{ Math.min(summary.unitsProgressPercentage, 100) }}%
                  <span v-if="summary.unitsProgressPercentage > 100" class="text-orange-500 text-xs ml-1">
                    ({{ summary.unitsProgressPercentage }}%)
                  </span>
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1 lg:h-2">
                <div 
                  class="bg-blue-600 h-1 lg:h-2 rounded-full transition-all duration-500" 
                  :style="{ width: `${Math.min(summary.unitsProgressPercentage, 100)}%` }"
                ></div>
              </div>
            </div>
            <!-- <div>
              <div class="flex justify-between text-xs lg:text-sm text-gray-600 mb-1">
                <span>Salud del Inventario</span>
                <span :class="getHealthClass(summary.healthPercentage)">
                  {{ summary.healthPercentage > 0 ? '+' : '' }}{{ summary.healthPercentage }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1 lg:h-2 relative">
                <div 
                  class="h-1 lg:h-2 rounded-full transition-all duration-500 absolute" 
                  :class="getHealthBarClass(summary.healthPercentage)"
                  :style="{ 
                    width: `${Math.min(Math.abs(summary.healthPercentage), 100)}%`,
                    left: summary.healthPercentage >= 0 ? '50%' : 'auto',
                    right: summary.healthPercentage < 0 ? '50%' : 'auto'
                  }"
                ></div>
                <div class="absolute left-1/2 top-0 w-0.5 h-2 bg-gray-400"></div>
              </div>
              <p class="text-xs text-gray-500 mt-1 text-center">
                {{ getHealthText(summary.healthPercentage) }}
              </p>
            </div> -->
          </div>
        </div>
      </div>

      <!-- Tabla de reportes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-3 lg:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 class="text-base lg:text-lg font-semibold text-gray-900">
            {{ getReportTabTitle() }}
            <span class="text-xs lg:text-sm font-normal text-gray-500 ml-1 lg:ml-2">
              ({{ filteredProducts.length }} productos)
            </span>
          </h3>
          <div class="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
            <span>Mostrando {{ Math.min(filteredProducts.length, pageSize) }} de {{ filteredProducts.length }} registros</span>
          </div>
        </div>

        <AppTable
          :data="paginatedProducts"
          :headers="getTableHeaders()"
          :pageSize="pageSize"
          :pageCurrent="currentPage"
          :totalItems="filteredProducts.length"
          :loading="loading"
          :showPaginator="true"
          :multipleSelection="false"
          :tableSize="'small'"
          :stripedRows="true"
        >
          <!-- Slot para diferencia -->
          <template #custom-difference="{ data }">
            <div class="flex flex-col items-center">
              <span 
                :class="[
                  'text-xs font-medium px-1 py-0.5 lg:px-2 lg:py-1 rounded',
                  getDifferenceClass(data.difference)
                ]"
              >
                {{ data.difference > 0 ? '+' : '' }}{{ data.difference }}
              </span>
              <span class="text-xs text-gray-500 mt-0.5">
                {{ data.difference_percentage > 0 ? '+' : '' }}{{ data.difference_percentage }}%
              </span>
            </div>
          </template>

          <!-- Slot para estado -->
          <template #custom-status="{ data }">
            <span 
              :class="[
                'inline-flex items-center px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-full text-xs font-medium',
                getStatusClass(data.status)
              ]"
            >
              {{ getStatusText(data.status) }}
            </span>
          </template>

          <!-- Slot para progreso del producto -->
          <template #custom-progress="{ data }">
            <div class="flex flex-col items-center">
              <div class="w-full bg-gray-200 rounded-full h-1 lg:h-2 mb-0.5 lg:mb-1">
                <div
                  class="bg-[#8557FB] h-1 lg:h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min(data.progress_percentage, 100)}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-600">
                {{ Math.min(data.progress_percentage, 100) }}%
                <span v-if="data.progress_percentage > 100" class="text-orange-500 text-xs">
                  ({{ data.progress_percentage }}%)
                </span>
              </span>
            </div>
          </template>

          <!-- Slot para acciones -->
          <template #custom-actions="{ data }">
            <div class="flex space-x-1 lg:space-x-2">
              <button
                @click="viewProductDetails(data)"
                class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                title="Ver detalles"
              >
                <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </template>

          <!-- Slot para cuando no hay datos -->
          <template #empty>
            <div class="text-center py-8 lg:py-12">
              <svg class="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-3 lg:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
              <p class="text-gray-500 text-xs lg:text-sm mb-3 lg:mb-4">No se encontraron productos para mostrar en el reporte.</p>
              <button
                @click="resetFilters"
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 lg:py-2 lg:px-4 rounded-lg font-medium transition-colors duration-300 text-xs lg:text-sm"
              >
                Restablecer Filtros
              </button>
            </div>
          </template>
        </AppTable>
      </div>
    </main>

    <!-- Modal de Detalles del Producto -->
    <div v-if="selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 lg:p-4 z-50">
      <div class="bg-white rounded-lg p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-3 lg:mb-4">
          <h3 class="text-base lg:text-lg font-semibold text-gray-900">Detalles del Producto</h3>
          <button @click="selectedProduct = null" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 gap-4 lg:gap-6">
          <div>
            <h4 class="font-medium text-gray-900 mb-2 text-sm lg:text-base">Información General</h4>
            <div class="space-y-2 text-xs lg:text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Código:</span>
                <span class="font-mono text-gray-900">{{ selectedProduct.barcode }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Producto:</span>
                <span class="text-gray-900">{{ selectedProduct.product_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">SKU:</span>
                <span class="text-gray-900">{{ selectedProduct.sku || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Estado:</span>
                <span :class="getStatusClass(selectedProduct.status)" class="px-2 py-1 rounded-full text-xs">
                  {{ getStatusText(selectedProduct.status) }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 mb-2 text-sm lg:text-base">Estadísticas</h4>
            <div class="space-y-2 text-xs lg:text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Stock Esperado:</span>
                <span class="text-gray-900 font-medium">{{ selectedProduct.expected_stock }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Stock Contado:</span>
                <span class="text-gray-900 font-medium">{{ selectedProduct.counted_stock }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Diferencia:</span>
                <span :class="getDifferenceClass(selectedProduct.difference)" class="px-2 py-1 rounded text-xs font-medium">
                  {{ selectedProduct.difference > 0 ? '+' : '' }}{{ selectedProduct.difference }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">% Diferencia:</span>
                <span class="text-gray-900">{{ selectedProduct.difference_percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
          <h4 class="font-medium text-gray-900 mb-2 text-sm lg:text-base">Información de Conteo</h4>
          <div class="grid grid-cols-1 gap-3 lg:gap-4 text-xs lg:text-sm">
            <div>
              <span class="text-gray-600">Último Conteo:</span>
              <p class="text-gray-900">{{ selectedProduct.last_counted_at || 'No contado' }}</p>
            </div>
            <div>
              <span class="text-gray-600">Contado por:</span>
              <p class="text-gray-900">{{ selectedProduct.counted_by_name || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { apiService } from '@/services/api'
import AppTable from '@/components/atoms/AppTable.vue'

const route = useRoute()
const inventoryId = route.params.id
const { success, error } = useNotifications()

// Refs principales
const inventory = ref(null)
const products = ref([])
const loading = ref(false)
const selectedProduct = ref(null)

// Pestañas de reportes
const reportTabs = ref([
  { id: 'all', name: 'Todos los Productos' },
  { id: 'differences', name: 'Diferencias' },
  { id: 'excess', name: 'Excesos' },
  { id: 'shortage', name: 'Faltantes' },
  { id: 'not-counted', name: 'No Contados' },
  { id: 'counted', name: 'Contados' }
])
const activeReportTab = ref('all')

// Filtros y ordenamiento
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('difference')
const sortDirection = ref('desc')

// Paginación
const pageSize = ref(20)
const currentPage = ref(1)

// Configuración base de la tabla
const baseTableHeaders = ref([
  { field: 'barcode', header: 'Código', width: '150px' },
  { field: 'product_name', header: 'Producto', width: '200px' },
  { field: 'expected_stock', header: 'Stock Esperado', width: '120px' },
  { field: 'counted_stock', header: 'Stock Contado', width: '120px' },
  { field: 'difference', header: 'Diferencia', width: '120px' },
  { field: 'difference_percentage', header: '% Diferencia', width: '120px' },
  { field: 'status', header: 'Estado', width: '120px' },
  { field: 'progress_percentage', header: 'Progreso', width: '100px' },
  { field: 'last_counted_at', header: 'Último Conteo', width: '150px' },
  { field: 'actions', header: 'Acciones', width: '80px' }
])

// Función para nombres de pestañas en móvil
function getMobileTabName(fullName) {
  const mobileNames = {
    'Todos los Productos': 'Todos',
    'Diferencias': 'Diferencias',
    'Excesos': 'Excesos',
    'Faltantes': 'Faltantes',
    'No Contados': 'No Contados',
    'Contados': 'Contados'
  }
  return mobileNames[fullName] || fullName
}

// Computed para datos del reporte actual
const currentReportData = computed(() => {
  switch (activeReportTab.value) {
    case 'excess':
      return filteredProducts.value.filter(p => p.difference > 0)
    case 'shortage':
      return filteredProducts.value.filter(p => p.difference < 0)
    case 'not-counted':
      return filteredProducts.value.filter(p => p.counted_stock === 0)
    case 'counted':
      return filteredProducts.value.filter(p => p.counted_stock > 0)
    case 'differences':
      return filteredProducts.value.filter(p => p.difference !== 0)
    default:
      return filteredProducts.value
  }
})

// Computed para resumen
const summary = computed(() => {
  const totalProducts = products.value.length
  const countedProducts = products.value.filter(p => p.counted_stock > 0).length
  const productsWithExcess = products.value.filter(p => p.difference > 0).length
  const productsWithShortage = products.value.filter(p => p.difference < 0).length
  const productsExact = products.value.filter(p => p.difference === 0 && p.counted_stock > 0).length
  const pendingProducts = products.value.filter(p => p.counted_stock === 0).length

  const totalExpectedUnits = products.value.reduce((sum, p) => sum + (p.expected_stock || 0), 0)
  const totalCountedUnits = products.value.reduce((sum, p) => sum + (p.counted_stock || 0), 0)
  const totalExcess = products.value.reduce((sum, p) => sum + Math.max(0, p.difference || 0), 0)
  const totalShortage = products.value.reduce((sum, p) => sum + Math.abs(Math.min(0, p.difference || 0)), 0)

  const countedProductsPercentage = totalProducts > 0 ? Math.round((countedProducts / totalProducts) * 100) : 0
  const excessPercentage = totalProducts > 0 ? Math.round((productsWithExcess / totalProducts) * 100) : 0
  const shortagePercentage = totalProducts > 0 ? Math.round((productsWithShortage / totalProducts) * 100) : 0
  const exactPercentage = totalProducts > 0 ? Math.round((productsExact / totalProducts) * 100) : 0
  const pendingPercentage = totalProducts > 0 ? Math.round((pendingProducts / totalProducts) * 100) : 0

  const unitsProgressPercentage = totalExpectedUnits > 0 ? Math.round((totalCountedUnits / totalExpectedUnits) * 100) : 0
  
  // Calcular salud del inventario (puede ser negativa)
  const healthPercentage = totalExpectedUnits > 0 
    ? Math.round(((totalCountedUnits - totalExpectedUnits) / totalExpectedUnits) * 100)
    : 0

  return {
    totalProducts,
    countedProducts,
    productsWithExcess,
    productsWithShortage,
    productsExact,
    pendingProducts,
    totalExpectedUnits,
    totalCountedUnits,
    totalExcess,
    totalShortage,
    countedProductsPercentage,
    excessPercentage,
    shortagePercentage,
    exactPercentage,
    pendingPercentage,
    unitsProgressPercentage,
    healthPercentage
  }
})

// Distribución de estados
const statusDistribution = computed(() => {
  const total = products.value.length
  if (total === 0) return []

  const counts = {
    'Exceso': products.value.filter(p => p.difference > 0).length,
    'Faltante': products.value.filter(p => p.difference < 0).length,
    'Exacto': products.value.filter(p => p.difference === 0 && p.counted_stock > 0).length,
    'No Contado': products.value.filter(p => p.counted_stock === 0).length
  }

  return [
    { name: 'Exceso', count: counts['Exceso'], percentage: Math.round((counts['Exceso'] / total) * 100), color: 'bg-green-500' },
    { name: 'Faltante', count: counts['Faltante'], percentage: Math.round((counts['Faltante'] / total) * 100), color: 'bg-red-500' },
    { name: 'Exacto', count: counts['Exacto'], percentage: Math.round((counts['Exacto'] / total) * 100), color: 'bg-blue-500' },
    { name: 'No Contado', count: counts['No Contado'], percentage: Math.round((counts['No Contado'] / total) * 100), color: 'bg-gray-400' }
  ]
})

// Computed para productos filtrados
const filteredProducts = computed(() => {
  let filtered = products.value

  // Filtrar por pestaña activa
  switch (activeReportTab.value) {
    case 'differences':
      filtered = filtered.filter(p => p.difference !== 0)
      break
    case 'excess':
      filtered = filtered.filter(p => p.difference > 0)
      break
    case 'shortage':
      filtered = filtered.filter(p => p.difference < 0)
      break
    case 'not-counted':
      filtered = filtered.filter(p => p.counted_stock === 0)
      break
    case 'counted':
      filtered = filtered.filter(p => p.counted_stock > 0)
      break
  }

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.barcode?.toLowerCase().includes(query) ||
      product.product_name?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query)
    )
  }

  // Filtrar por estado
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(product => {
      switch (statusFilter.value) {
        case 'counted':
          return product.counted_stock > 0
        case 'not-counted':
          return product.counted_stock === 0
        case 'excess':
          return product.difference > 0
        case 'shortage':
          return product.difference < 0
        case 'exact':
          return product.difference === 0 && product.counted_stock > 0
        default:
          return true
      }
    })
  }

  // Ordenar
  filtered.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]

    if (sortBy.value === 'difference') {
      aValue = Math.abs(aValue)
      bValue = Math.abs(bValue)
    }

    if (sortDirection.value === 'desc') {
      return bValue - aValue
    } else {
      return aValue - bValue
    }
  })

  return filtered
})

// Productos paginados
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

// Funciones de utilidad
function getDifferenceClass(difference) {
  if (difference > 0) {
    return 'bg-green-100 text-green-800'
  } else if (difference < 0) {
    return 'bg-red-100 text-red-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'excess':
      return 'bg-green-100 text-green-800'
    case 'shortage':
      return 'bg-red-100 text-red-800'
    case 'exact':
      return 'bg-blue-100 text-blue-800'
    case 'not-counted':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status) {
  switch (status) {
    case 'excess':
      return 'Exceso'
    case 'shortage':
      return 'Faltante'
    case 'exact':
      return 'Exacto'
    case 'not-counted':
      return 'No Contado'
    default:
      return 'No Contado'
  }
}

function formatNumber(number) {
  return new Intl.NumberFormat('es-ES').format(number)
}

function getTableHeaders() {
  // Puedes personalizar los headers según la pestaña activa
  return baseTableHeaders.value
}

function getReportTabTitle() {
  const tab = reportTabs.value.find(t => t.id === activeReportTab.value)
  return tab ? getMobileTabName(tab.name) : 'Reporte'
}

function getExportButtonText() {
  const texts = {
    'all': 'Completo',
    'excess': 'Excesos',
    'shortage': 'Faltantes',
    'not-counted': 'No Contados',
    'counted': 'Contados',
    'differences': 'Diferencias'
  }
  return texts[activeReportTab.value] || 'Data'
}

// Funciones para salud del inventario
function getHealthClass(healthPercentage) {
  if (healthPercentage > 10) return 'text-green-600 font-bold'
  if (healthPercentage > 0) return 'text-green-500'
  if (healthPercentage === 0) return 'text-gray-600'
  if (healthPercentage > -10) return 'text-orange-500'
  return 'text-red-600 font-bold'
}

function getHealthBarClass(healthPercentage) {
  if (healthPercentage > 10) return 'bg-green-600'
  if (healthPercentage > 0) return 'bg-green-500'
  if (healthPercentage === 0) return 'bg-gray-500'
  if (healthPercentage > -10) return 'bg-orange-500'
  return 'bg-red-600'
}

function getHealthText(healthPercentage) {
  if (healthPercentage > 10) return 'Excelente - Exceso controlado'
  if (healthPercentage > 0) return 'Buena - Ligero exceso'
  if (healthPercentage === 0) return 'Perfecta - Conteo exacto'
  if (healthPercentage > -10) return 'Atención - Faltantes menores'
  return 'Crítica - Faltantes significativos'
}

function viewProductDetails(product) {
  selectedProduct.value = product
}

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
  sortBy.value = 'difference'
  sortDirection.value = 'desc'
  activeReportTab.value = 'all'
}

// Funciones principales
async function fetchInventory() {
  try {
    inventory.value = await apiService.getInventory(inventoryId)
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'No se pudo cargar la información del inventario')
    }
  }
}

async function fetchProducts() {
  loading.value = true
  try {
    const productsData = await apiService.getProducts(inventoryId)
    
    // Procesar los datos para calcular diferencias y estados
    products.value = productsData.map(product => {
      const difference = (product.counted_stock || 0) - (product.expected_stock || 0)
      const difference_percentage = product.expected_stock > 0 
        ? Math.round((difference / product.expected_stock) * 100) 
        : 0
      
      let status = 'not-counted'
      if (product.counted_stock > 0) {
        if (difference > 0) status = 'excess'
        else if (difference < 0) status = 'shortage'
        else status = 'exact'
      }

      const progress_percentage = product.expected_stock > 0 
        ? Math.round((product.counted_stock / product.expected_stock) * 100) 
        : 0

      return {
        ...product,
        difference,
        difference_percentage,
        status,
        progress_percentage,
        last_counted_at: product.count_date ? new Date(product.count_date).toLocaleString('es-ES') : 'No contado'
      }
    })
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'Error al cargar los productos')
    }
  } finally {
    loading.value = false
  }
}

async function exportReport() {
  try {
    const exportType = activeReportTab.value === 'all' ? 'all' : activeReportTab.value
    const response = await apiService.exportInventory(inventoryId, 'excel', exportType)
    
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    const now = new Date()
    const timestamp = now.toISOString().slice(0,19).replace(/:/g, '-')
    
    // Nombre del archivo según el tipo de reporte
    const reportTypeNames = {
      'all': 'completo',
      'excess': 'excesos',
      'shortage': 'faltantes',
      'not-counted': 'no_contados',
      'counted': 'contados',
      'differences': 'diferencias'
    }
    
    a.download = `reporte_${reportTypeNames[exportType]}_${inventory.value.name}_${timestamp}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    success('Éxito', `Reporte de ${reportTypeNames[exportType]} exportado exitosamente`)
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'Error al exportar el reporte')
    }
  }
}

onMounted(() => {
  fetchInventory()
  fetchProducts()
})
</script>