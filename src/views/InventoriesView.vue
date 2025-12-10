<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar :user="user" />

    <!-- Contenido principal con sidebar -->
    <div class="pl-0 lg:pl-64 transition-all duration-300">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Inventarios</h1>
              <span class="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {{ user?.company_name }}
              </span>
            </div>

            <!-- Información de usuario y logout -->
            <div class="flex items-center space-x-4">
              <div class="hidden sm:flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-700">{{ user?.full_name }}</p>
                  <p class="text-xs text-gray-500">{{ getUserRoleName() }}</p>
                </div>
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-medium text-sm">{{ getUserInitials() }}</span>
                </div>
              </div>

              <button @click="handleLogout"
                class="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 px-3 rounded-lg transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                  </path>
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Tabla de inventarios -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Header de la tabla -->
          <div
            class="flex flex-col lg:flex-row lg:justify-between lg:items-center p-6 border-b border-gray-200 space-y-4 lg:space-y-0">
            <!-- Título y búsqueda -->
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div class="relative flex-1 max-w-md">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input v-model="searchQuery" type="text"
                  class="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm w-full"
                  placeholder="Buscar inventarios...">
              </div>

              <button v-if="user?.role === 'admin'" @click="showCreateModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2 justify-center sm:justify-start shadow-md hover:shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                  </path>
                </svg>
                <span>Crear Inventario</span>
              </button>
            </div>

            <!-- Acciones -->
            <div class="flex items-center space-x-2">
              <!-- Botón de actualizar -->
              <button @click="refreshInventories"
                class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Actualizar">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                  </path>
                </svg>
              </button>

              <!-- Botón para gestión de usuarios (solo admin) -->
              <button v-if="user?.role === 'admin'" @click="$router.push('/usuarios')"
                class="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2 px-4 rounded-lg transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
                  </path>
                </svg>
                <span>Usuarios</span>
              </button>
            </div>
          </div>

          <!-- AppTable Component -->
          <AppTable :data="filteredTableData" :headers="tableHeaders" :pageSize="pageSize" :pageCurrent="currentPage"
            :totalItems="filteredTableData.length" :loading="loading" :showPaginator="true" :multipleSelection="false"
            :tableSize="'medium'" :stripedRows="true" :selectedRow="selectedInventory"
            @row-double-click="handleRowDoubleClick">
            <!-- Slot para progreso basado en unidades -->
            <template #custom-progress="{ data }">
              <div class="flex flex-col items-center">
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${calculateUnitProgress(data)}%` }"></div>
                </div>
                <div class="flex justify-between w-full text-xs">
                  <span class="text-gray-600">{{ Math.round(calculateUnitProgress(data)) }}%</span>
                  <span class="text-gray-400">
                    {{ data.counted_units || 0 }}/{{ data.total_units || 0 }}
                  </span>
                </div>
              </div>
            </template>

            <!-- Slot para acciones -->
            <template #custom-actions="{ data }">
              <div class="flex space-x-2">
                <button @click="startCounting(data)"
                  class="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded transition-colors duration-200"
                  title="Iniciar Conteo">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
                <button @click="viewReports(data)"
                  class="text-purple-600 hover:text-purple-700 p-1 hover:bg-purple-50 rounded transition-colors duration-200"
                  title="Ver Reportes">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                </button>
                <button v-if="user?.role === 'admin' || data?.can_edit" @click="editInventory(data)"
                  class="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors duration-200"
                  title="Editar">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                  </svg>
                </button>
              </div>
            </template>

            <!-- Slot para cuando no hay datos -->
            <template #empty>
              <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                  </path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay inventarios</h3>
                <p class="text-gray-500 mb-4">Crea tu primer inventario para comenzar</p>
                <button v-if="user?.role === 'admin'" @click="showCreateModal = true"
                  class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300">
                  Crear Primer Inventario
                </button>
              </div>
            </template>
          </AppTable>
        </div>
      </main>
    </div>

    <!-- Modal de Crear Inventario - VERSIÓN MEJORADA -->
    <transition name="modal">
      <div v-if="showCreateModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <transition name="modal-content">
          <div class="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                  </path>
                </svg>
                Crear Nuevo Inventario
              </h3>
              <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div class="mb-6">
              <!-- Pestañas -->
              <div class="flex space-x-4 mb-4 border-b">
                <button @click="activeTab = 'info'" :class="activeTab === 'info'
                  ? 'border-blue-600 text-blue-600 border-b-2 -mb-px'
                  : 'text-gray-500 hover:text-gray-700'" class="py-2 px-4 font-medium text-sm">
                  Información Básica
                </button>
                <button @click="activeTab = 'columns'" :disabled="!selectedFile" :class="[
                  'py-2 px-4 font-medium text-sm',
                  activeTab === 'columns'
                    ? 'border-blue-600 text-blue-600 border-b-2 -mb-px'
                    : 'text-gray-500 hover:text-gray-700',
                  !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
                ]">
                  Mapeo de Columnas
                  <span v-if="excelColumns.length > 0"
                    class="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {{ excelColumns.length }} columnas
                  </span>
                </button>
              </div>

              <!-- Formulario -->
              <form @submit.prevent="handleCreateInventory">
                <!-- Tab 1: Información básica -->
                <div v-if="activeTab === 'info'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Inventario *</label>
                    <input v-model="newInventory.name" type="text" required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Ej: Inventario General" ref="nameInput">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea v-model="newInventory.description" rows="3"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Descripción opcional del inventario"></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Archivo Excel de Productos</label>
                    <input type="file" ref="fileInput" accept=".xlsx, .xls" @change="handleFileSelect"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100">
                    <p class="text-xs text-gray-500 mt-1">
                      Archivo Excel con productos. Las columnas pueden ser: código de barras, nombre, descripción,
                      categoría, etc.
                    </p>
                  </div>

                  <div v-if="selectedFile" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                          </path>
                        </svg>
                        <span class="text-sm font-medium text-blue-600">{{ selectedFile.name }}</span>
                        <span class="text-xs text-blue-600">({{ formatFileSize(selectedFile.size) }})</span>
                      </div>
                      <div class="flex space-x-2">
                        <button type="button" @click="analyzeExcelColumns"
                          class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          :disabled="analyzingColumns">
                          <svg v-if="analyzingColumns" class="animate-spin h-4 w-4 mr-1" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                          </svg>
                          <span>{{ analyzingColumns ? 'Analizando...' : 'Ver columnas' }}</span>
                        </button>
                        <button type="button" @click="clearSelectedFile" class="text-blue-600 hover:text-blue-800">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12">
                            </path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div v-if="excelColumns.length > 0" class="mt-2 text-xs text-blue-600">
                      <span>{{ excelColumns.length }} columnas detectadas</span>
                    </div>
                  </div>
                </div>

                <!-- Tab 2: Mapeo de columnas -->
                <div v-if="activeTab === 'columns' && excelColumns.length > 0" class="space-y-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-700 mb-3">Mapea las columnas de tu Excel</h4>
                    <p class="text-xs text-gray-500 mb-4">
                      Selecciona qué columna de tu archivo corresponde a cada campo del sistema.
                      <span class="font-medium">Las columnas marcadas con * son obligatorias.</span>
                    </p>

                    <div class="space-y-3">
                      <!-- Código de barras (obligatorio) -->
                      <div class="flex items-center space-x-3">
                        <label class="block text-sm font-medium text-gray-700 w-48">
                          Código de barras *
                        </label>
                        <select v-model="columnMapping.barcode"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required>
                          <option value="">Selecciona una columna</option>
                          <option v-for="col in excelColumns" :key="col" :value="col">
                            {{ col }}
                          </option>
                        </select>
                        <span v-if="columnMapping.barcode" class="text-green-600">
                          ✓
                        </span>
                      </div>

                      <!-- Nombre del producto (obligatorio) -->
                      <div class="flex items-center space-x-3">
                        <label class="block text-sm font-medium text-gray-700 w-48">
                          Nombre del producto *
                        </label>
                        <select v-model="columnMapping.name"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required>
                          <option value="">Selecciona una columna</option>
                          <option v-for="col in excelColumns" :key="col" :value="col">
                            {{ col }}
                          </option>
                        </select>
                        <span v-if="columnMapping.name" class="text-green-600">
                          ✓
                        </span>
                      </div>

                      <!-- Descripción (opcional) -->
                      <div class="flex items-center space-x-3">
                        <label class="block text-sm font-medium text-gray-700 w-48">
                          Descripción
                        </label>
                        <select v-model="columnMapping.description"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">No usar descripción</option>
                          <option v-for="col in excelColumns" :key="col" :value="col">
                            {{ col }}
                          </option>
                        </select>
                      </div>

                      <!-- Stock esperado (opcional) -->
                      <div class="flex items-center space-x-3">
                        <label class="block text-sm font-medium text-gray-700 w-48">
                          Stock esperado
                        </label>
                        <select v-model="columnMapping.expected_stock"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">No usar stock</option>
                          <option v-for="col in excelColumns" :key="col" :value="col">
                            {{ col }}
                          </option>
                        </select>
                      </div>

                      <!-- Categoría (opcional) -->
                      <div class="flex items-center space-x-3">
                        <label class="block text-sm font-medium text-gray-700 w-48">
                          Categoría
                        </label>
                        <select v-model="columnMapping.category"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">No usar categoría</option>
                          <option v-for="col in excelColumns" :key="col" :value="col">
                            {{ col }}
                          </option>
                        </select>
                      </div>

                      <!-- Precio (opcional) -->
                      <div class="flex items-center space-x-3">
                        <label class="block text-sm font-medium text-gray-700 w-48">
                          Precio
                        </label>
                        <select v-model="columnMapping.price"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">No usar precio</option>
                          <option v-for="col in excelColumns" :key="col" :value="col">
                            {{ col }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <!-- Vista previa de mapeo -->
                    <div v-if="Object.keys(columnMapping).filter(k => columnMapping[k]).length > 0"
                      class="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 class="text-sm font-medium text-blue-700 mb-2">Resumen de mapeo:</h5>
                      <div class="grid grid-cols-2 gap-2 text-xs">
                        <div v-for="(value, key) in columnMapping" :key="key" v-if="value" class="flex items-center">
                          <span class="font-medium text-blue-600 capitalize">{{ key.replace('_', ' ') }}:</span>
                          <span class="ml-2 text-blue-800">{{ value }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-between items-center pt-4 border-t">
              <div class="text-sm text-gray-500">
                Paso {{ activeTab === 'info' ? '1' : '2' }} de 2
              </div>
              <div class="flex space-x-3">
                <button type="button" @click="showCreateModal = false"
                  class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300">
                  Cancelar
                </button>

                <button v-if="activeTab === 'info'" type="button" @click="activeTab = 'columns'"
                  :disabled="!selectedFile" :class="!selectedFile ? 'opacity-50 cursor-not-allowed' : ''"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300">
                  Siguiente: Mapear Columnas
                </button>

                <button v-if="activeTab === 'columns'" type="button" @click="activeTab = 'info'"
                  class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors duration-300">
                  Atrás
                </button>

                <button type="button" @click="handleCreateInventory" :disabled="creatingInventory || !isFormValid()"
                  :class="!isFormValid() || creatingInventory ? 'opacity-50 cursor-not-allowed' : ''"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 flex items-center">
                  <svg v-if="creatingInventory" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <span>{{ creatingInventory ? 'Creando...' : 'Crear Inventario' }}</span>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Modal de Edición -->
    <transition name="modal">
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <transition name="modal-content">
          <div class="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Editar Inventario</h3>

            <form @submit.prevent="updateInventory">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input v-model="editingInventory.name" type="text" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Nombre del inventario" ref="editNameInput">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea v-model="editingInventory.description" rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Descripción del inventario"></textarea>
                </div>
              </div>

              <div class="flex space-x-3 mt-6">
                <button type="button" @click="showEditModal = false"
                  class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors duration-300">
                  Cancelar
                </button>
                <button type="submit"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-300">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Modal de Confirmación de Eliminación -->
    <transition name="modal">
      <div v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <transition name="modal-content">
          <div class="bg-white rounded-xl p-6 w-full max-w-md">
            <div class="flex items-center space-x-3 mb-4">
              <div class="bg-red-100 p-2 rounded-full">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z">
                  </path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
            </div>

            <p class="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el inventario "<strong>{{ deletingInventory?.name }}</strong>"?
              Esta acción no se puede deshacer y se perderán todos los datos asociados.
            </p>

            <div class="flex space-x-3">
              <button @click="showDeleteModal = false"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors duration-300">
                Cancelar
              </button>
              <button @click="confirmDelete"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors duration-300">
                Eliminar
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { apiService } from '@/services/api'
import AppTable from '@/components/atoms/AppTable.vue'
import Sidebar from '@/components/Sidebar.vue'

const activeTab = ref('info')
const analyzingColumns = ref(false)
const excelColumns = ref([])
const columnMapping = ref({
  barcode: '',
  name: '',
  description: '',
  expected_stock: '',
  category: '',
  price: ''
})




const router = useRouter()
const { success, error, info } = useNotifications()

const inventories = ref([])
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const selectedInventory = ref(null)
const searchQuery = ref('')

// Estados para modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingInventory = ref({ id: null, name: '', description: '' })
const deletingInventory = ref(null)
const nameInput = ref(null)
const editNameInput = ref(null)
const fileInput = ref(null)
const loading = ref(false)
const creatingInventory = ref(false)

// Estados para archivos
const selectedFile = ref(null)

// Configuración de paginación
const pageSize = ref(10)
const currentPage = ref(1)

const newInventory = ref({
  name: '',
  description: ''
})

// Configuración de la tabla
const tableHeaders = ref([
  { field: 'name', header: 'Nombre', width: '200px' },
  { field: 'description', header: 'Descripción', width: '250px' },
  { field: 'total_products', header: 'Productos', width: '120px' },
  { field: 'total_units', header: 'Unidades', width: '120px' },
  { field: 'counted_products', header: 'Productos Contados', width: '160px' },
  { field: 'counted_units', header: 'Unid. Contadas', width: '160px' },
  { field: 'progress', header: 'Progreso', width: '180px' },
  { field: 'created_at', header: 'Creado', width: '140px' },
  { field: 'created_by_name', header: 'Creado por', width: '160px' },
  { field: 'actions', header: 'Acciones', width: '100px' }
])

// Datos formateados para la tabla
const tableData = computed(() => {
  return inventories.value.map(inventory => ({
    ...inventory,
    progress: calculateUnitProgress(inventory),
    created_at: formatDateForTable(inventory.created_at)
  }))
})

// Datos filtrados por búsqueda
const filteredTableData = computed(() => {
  if (!searchQuery.value) return tableData.value

  const query = searchQuery.value.toLowerCase()
  return tableData.value.filter(inventory =>
    inventory.name?.toLowerCase().includes(query) ||
    inventory.description?.toLowerCase().includes(query) ||
    inventory.created_by_name?.toLowerCase().includes(query)
  )
})

// Funciones de utilidad
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
    'superadmin': 'Super Administrador',
    'admin': 'Administrador',
    'user': 'Usuario'
  }
  return roles[user.value?.role] || 'Usuario'
}

async function analyzeExcelColumns() {
  if (!selectedFile.value) return

  analyzingColumns.value = true
  try {
    const response = await apiService.getExcelColumns(selectedFile.value)
    excelColumns.value = response.columns || []


    autoMapColumns(response.columns)


    activeTab.value = 'columns'

    success('Éxito', `${excelColumns.value.length} columnas detectadas en el archivo`)
  } catch (err) {
    error('Error', 'No se pudieron leer las columnas del archivo Excel')
    console.error(err)
  } finally {
    analyzingColumns.value = false
  }
}

function autoMapColumns(columns) {
  const mapping = {}

  columns.forEach(col => {
    const lowerCol = col.toLowerCase()


    if (lowerCol.includes('codigo') || lowerCol.includes('código') || lowerCol.includes('barras') || lowerCol.includes('sku')) {
      mapping.barcode = col
    } else if (lowerCol.includes('nombre') || lowerCol.includes('producto') || lowerCol.includes('descripcion') || lowerCol.includes('item')) {
      mapping.name = col
    } else if (lowerCol.includes('descripcion') || lowerCol.includes('detalle')) {
      mapping.description = col
    } else if (lowerCol.includes('stock') || lowerCol.includes('cantidad') || lowerCol.includes('existencia')) {
      mapping.expected_stock = col
    } else if (lowerCol.includes('categoria') || lowerCol.includes('tipo') || lowerCol.includes('grupo')) {
      mapping.category = col
    } else if (lowerCol.includes('precio') || lowerCol.includes('costo') || lowerCol.includes('valor')) {
      mapping.price = col
    }
  })

  columnMapping.value = { ...columnMapping.value, ...mapping }
}

function isFormValid() {

  if (!newInventory.value.name.trim()) return false


  if (selectedFile.value && activeTab.value === 'columns') {

    if (!columnMapping.value.barcode || !columnMapping.value.name) return false
  }

  return true
}

async function handleCreateInventory() {
  if (!isFormValid()) {
    error('Error', 'Por favor completa todos los campos obligatorios')
    return
  }

  creatingInventory.value = true

  try {

    const data = await apiService.createInventory(newInventory.value)
    const inventoryId = data.id


    if (selectedFile.value) {
      try {
        await apiService.uploadProductsWithMapping(
          inventoryId,
          selectedFile.value,
          columnMapping.value,
          false
        )

        success('Éxito', 'Inventario creado y productos cargados exitosamente')
      } catch (uploadErr) {

        info('Aviso', 'Inventario creado, pero hubo un error al cargar los productos')
        console.error('Error al cargar productos:', uploadErr)
      }
    } else {
      success('Éxito', 'Inventario creado exitosamente')
    }

    resetCreateForm()
    showCreateModal.value = false


    fetchInventories()

  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al crear el inventario')
    }
  } finally {
    creatingInventory.value = false
  }
}

function resetCreateForm() {
  newInventory.value = { name: '', description: '' }
  selectedFile.value = null
  excelColumns.value = []
  columnMapping.value = {
    barcode: '',
    name: '',
    description: '',
    expected_stock: '',
    category: '',
    price: ''
  }
  activeTab.value = 'info'
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}


async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {

    const validTypes = ['.xlsx', '.xls']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

    if (!validTypes.includes(fileExtension)) {
      error('Error', 'Solo se permiten archivos Excel (.xlsx, .xls)')
      event.target.value = ''
      return
    }


    if (file.size > 10 * 1024 * 1024) {
      error('Error', 'El archivo no debe superar los 10MB')
      event.target.value = ''
      return
    }

    selectedFile.value = file

    setTimeout(() => {
      analyzeExcelColumns()
    }, 500)
  }
}

// Función para calcular progreso basado en unidades
function calculateUnitProgress(inventory) {
  const totalUnits = inventory.total_units || 0
  const countedUnits = inventory.counted_units || 0

  if (totalUnits === 0) return 0

  const progress = (countedUnits / totalUnits) * 100
  return Math.min(100, Math.max(0, progress))
}

// Funciones de formato
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatDateForTable(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Manejar doble click
function handleRowDoubleClick(inventory) {
  selectedInventory.value = inventory
}

// Refrescar inventarios
function refreshInventories() {
  fetchInventories()
  success('Actualizado', 'Lista de inventarios actualizada')
}

// Funciones CRUD usando el servicio de API
async function fetchInventories() {
  loading.value = true
  try {
    const data = await apiService.getInventories()
    // Asegurarse de que los valores numéricos sean correctos
    inventories.value = data.map(inv => ({
      ...inv,
      total_units: Number(inv.total_units) || 0,
      counted_units: Number(inv.counted_units) || 0,
      total_products: Number(inv.total_products) || 0,
      counted_products: Number(inv.counted_products) || 0
    }))
    console.log('Inventarios cargados:', inventories.value)
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error de conexión', 'No se pudo conectar con el servidor')
    }
  } finally {
    loading.value = false
  }
}



function clearSelectedFile() {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function createInventory() {
  if (!newInventory.value.name.trim()) {
    error('Error', 'El nombre del inventario es requerido')
    return
  }

  creatingInventory.value = true

  try {
    const data = await apiService.createInventory(newInventory.value)
    const inventoryId = data.id

    // Si hay un archivo seleccionado, cargarlo inmediatamente
    if (selectedFile.value) {
      await apiService.uploadProducts(inventoryId, selectedFile.value, false)
    }

    // Limpiar formulario y cerrar modal
    newInventory.value = { name: '', description: '' }
    clearSelectedFile()
    showCreateModal.value = false

    // Actualizar lista
    fetchInventories()
    success('Éxito', 'Inventario creado exitosamente' + (selectedFile.value ? ' con productos cargados' : ''))
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al crear el inventario')
    }
  } finally {
    creatingInventory.value = false
  }
}

function editInventory(inventory) {
  editingInventory.value = {
    id: inventory.id,
    name: inventory.name,
    description: inventory.description || ''
  }
  showEditModal.value = true
  nextTick(() => {
    editNameInput.value?.focus()
  })
}

async function updateInventory() {
  try {
    await apiService.updateInventory(editingInventory.value.id, {
      name: editingInventory.value.name,
      description: editingInventory.value.description
    })

    showEditModal.value = false
    fetchInventories()
    success('Éxito', 'Inventario actualizado exitosamente')
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al actualizar el inventario')
    }
  }
}

function deleteInventory(inventory) {
  deletingInventory.value = inventory
  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    await apiService.deleteInventory(deletingInventory.value.id)
    showDeleteModal.value = false
    fetchInventories()
    success('Éxito', 'Inventario eliminado exitosamente')
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al eliminar el inventario')
    }
  }
}

function uploadProducts(inventory) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx, .xls'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await uploadFile(inventory.id, file, false)
    }
  }
  input.click()
}

async function uploadFile(inventoryId, file, overwrite = false) {
  try {
    const data = await apiService.uploadProducts(inventoryId, file, overwrite)

    success('Éxito', data.message)
    if (data.errorDetails && data.errorDetails.length > 0) {
      info('Advertencias', `Algunas filas tuvieron errores: ${data.errorDetails.join(', ')}`)
    }
    fetchInventories()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al cargar el archivo')
    }
  }
}

function startCounting(inventory) {
  router.push(`/conteo/${inventory.id}`)
}

function viewReports(inventory) {
  router.push(`/reportes/${inventory.id}`)
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  fetchInventories()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>