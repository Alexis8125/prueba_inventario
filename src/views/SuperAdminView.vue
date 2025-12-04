<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <div class="bg-purple-600 text-white p-2 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Panel de SuperAdministrador</h1>
              <p class="text-sm text-gray-500">Gestión global del sistema</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showProfileModal = true"
              class="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span class="text-purple-600 font-medium text-sm">{{ userInitials }}</span>
              </div>
              <span class="text-sm">{{ user?.full_name }}</span>
            </button>
            <button
              @click="handleLogout"
              class="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 px-3 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar y contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar -->
        <div class="lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
          <nav class="space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-3',
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.name }}</span>
            </button>
          </nav>
        </div>

        <!-- Contenido principal -->
        <div class="flex-1">
          <!-- Resumen general -->
          <div v-if="activeTab === 'dashboard'" class="space-y-6">
            <!-- Estadísticas rápidas -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Empresas</p>
                    <p class="text-2xl font-bold text-gray-900">{{ stats.overview?.total_companies || 0 }}</p>
                  </div>
                  <div class="bg-blue-100 p-3 rounded-full">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Usuarios Totales</p>
                    <p class="text-2xl font-bold text-gray-900">{{ stats.overview?.total_users || 0 }}</p>
                  </div>
                  <div class="bg-green-100 p-3 rounded-full">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Inventarios</p>
                    <p class="text-2xl font-bold text-gray-900">{{ stats.overview?.total_inventories || 0 }}</p>
                  </div>
                  <div class="bg-purple-100 p-3 rounded-full">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Productos Contados</p>
                    <p class="text-2xl font-bold text-gray-900">{{ stats.overview?.total_counted_units || 0 }}</p>
                  </div>
                  <div class="bg-orange-100 p-3 rounded-full">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actividad reciente -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div class="space-y-3">
                <div
                  v-for="activity in stats.recentActivity"
                  :key="activity.timestamp"
                  class="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div
                    :class="[
                      'p-2 rounded-full',
                      activity.type === 'user' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="activity.type === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      {{ activity.type === 'user' ? 'Nuevo usuario' : 'Nuevo inventario' }}: {{ activity.full_name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Empresa: {{ activity.company_name }} • 
                      {{ formatDate(activity.date) }}
                    </p>
                  </div>
                </div>
                <div v-if="!stats.recentActivity || stats.recentActivity.length === 0" class="text-center py-4 text-gray-500">
                  No hay actividad reciente
                </div>
              </div>
            </div>
          </div>

          <!-- Gestión de empresas -->
          <div v-if="activeTab === 'companies'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-900">Gestión de Empresas</h2>
              <button
                @click="showCreateCompanyModal = true"
                class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Nueva Empresa</span>
              </button>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <AppTable
                :data="companies"
                :headers="companyHeaders"
                :pageSize="10"
                :pageCurrent="currentPage"
                :totalItems="companies.length"
                :loading="loading"
                :showPaginator="true"
                :multipleSelection="false"
                :tableSize="'small'"
                :stripedRows="true"
              >
                <!-- Slot para acciones -->
                <template #custom-actions="{ data }">
                  <div class="flex space-x-2">
                    <button
                      @click="viewCompanyDetails(data)"
                      class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                      title="Ver detalles"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </div>
                </template>

                <!-- Slot para cuando no hay datos -->
                <template #empty>
                  <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No hay empresas</h3>
                    <p class="text-gray-500 mb-4">Crea la primera empresa para comenzar</p>
                    <button
                      @click="showCreateCompanyModal = true"
                      class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                    >
                      Crear Primera Empresa
                    </button>
                  </div>
                </template>
              </AppTable>
            </div>
          </div>

          <!-- Auditoría -->
          <div v-if="activeTab === 'audit'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-900">Registros de Auditoría</h2>
              <button
                @click="fetchAuditLogs"
                class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Actualizar</span>
              </button>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <AppTable
                :data="auditLogs"
                :headers="auditHeaders"
                :pageSize="10"
                :pageCurrent="currentPage"
                :totalItems="auditLogs.length"
                :loading="loading"
                :showPaginator="true"
                :multipleSelection="false"
                :tableSize="'small'"
                :stripedRows="true"
              >
                <!-- Slot para tipo de acción -->
                <template #custom-action_type="{ data }">
                  <span 
                    :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      data.action_type === 'login' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    {{ data.action_type === 'login' ? 'Inicio de Sesión' : 'Conteo' }}
                  </span>
                </template>

                <!-- Slot para cuando no hay datos -->
                <template #empty>
                  <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No hay registros de auditoría</h3>
                    <p class="text-gray-500">Los registros aparecerán aquí cuando haya actividad en el sistema</p>
                  </div>
                </template>
              </AppTable>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Crear Empresa -->
    <transition name="modal">
      <div v-if="showCreateCompanyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Crear Nueva Empresa</h3>
          
          <form @submit.prevent="createCompany">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa *</label>
                <input
  v-model="companyForm.company_name"
  type="text"
  required
  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
  placeholder="Nombre de la empresa"
>
              </div>

              <div class="md:col-span-2">
                <h4 class="text-md font-medium text-gray-900 mb-3">Administrador Principal</h4>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  v-model="companyForm.admin_full_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="Nombre del administrador"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
                <input
                  v-model="companyForm.admin_username"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="Nombre de usuario"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  v-model="companyForm.admin_email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="correo@empresa.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                <input
                  v-model="companyForm.admin_password"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="Contraseña segura"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Límite de Usuarios</label>
                <input
                  v-model.number="companyForm.user_limit"
                  type="number"
                  min="1"
                  max="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  placeholder="10"
                >
                <p class="text-xs text-gray-500 mt-1">Máximo número de usuarios permitidos</p>
              </div>
            </div>

            <div class="flex space-x-3 mt-6">
              <button
                type="button"
                @click="showCreateCompanyModal = false"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="creatingCompany"
                class="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <svg v-if="creatingCompany" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ creatingCompany ? 'Creando...' : 'Crear Empresa' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal de Detalles de Empresa -->
    <transition name="modal">
      <div v-if="selectedCompany" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Detalles de Empresa: {{ selectedCompany.name }}</h3>
            <button @click="selectedCompany = null" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Información de la empresa -->
            <div class="space-y-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-3">Información General</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Nombre:</span>
                    <span class="font-medium">{{ selectedCompany.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Límite de usuarios:</span>
                    <span class="font-medium">{{ selectedCompany.user_limit }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Fecha de creación:</span>
                    <span class="font-medium">{{ formatDate(selectedCompany.created_at) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Administrador:</span>
                    <span class="font-medium">{{ selectedCompany.admin_name }} ({{ selectedCompany.admin_username }})</span>
                  </div>
                </div>
              </div>

              <!-- Estadísticas -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-3">Estadísticas</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Usuarios activos:</span>
                    <span class="font-medium">{{ selectedCompany.user_count }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Inventarios:</span>
                    <span class="font-medium">{{ selectedCompany.inventory_count }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Usuarios de la empresa -->
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h4 class="font-medium text-gray-900">Usuarios de la Empresa</h4>
                <span class="text-sm text-gray-500">{{ companyUsers.length }} usuarios</span>
              </div>
              
              <div class="space-y-2 max-h-80 overflow-y-auto">
                <div
                  v-for="user in companyUsers"
                  :key="user.id"
                  class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-gray-900">{{ user.full_name }}</p>
                      <p class="text-sm text-gray-500">{{ user.username }} • {{ user.email }}</p>
                      <div class="flex space-x-2 mt-1">
                        <span 
                          :class="[
                            'px-2 py-1 rounded-full text-xs',
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          ]"
                        >
                          {{ user.role === 'admin' ? 'Administrador' : 'Usuario' }}
                        </span>
                        <span 
                          :class="[
                            'px-2 py-1 rounded-full text-xs',
                            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          ]"
                        >
                          {{ user.is_active ? 'Activo' : 'Inactivo' }}
                        </span>
                      </div>
                    </div>
                    <div class="text-right text-xs text-gray-500">
                      <p>Creado: {{ formatDate(user.created_at) }}</p>
                      <p>Inventarios: {{ user.created_inventories }}</p>
                      <p>Productos contados: {{ user.counted_products }}</p>
                    </div>
                  </div>
                </div>
                <div v-if="companyUsers.length === 0" class="text-center py-4 text-gray-500">
                  No hay usuarios en esta empresa
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Perfil -->
    <ProfileModal 
      v-if="showProfileModal"
      @close="showProfileModal = false"
      @updated="handleProfileUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { apiService } from '@/services/api'
import AppTable from '@/components/atoms/AppTable.vue'
import ProfileModal from '@/components/ProfileModal.vue'

const router = useRouter()
const { success, error } = useNotifications()

// Refs principales
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const activeTab = ref('dashboard')
const loading = ref(false)

// Datos
const companies = ref([])
const stats = ref({})
const auditLogs = ref([])
const companyUsers = ref([])

// Estados para modales
const showCreateCompanyModal = ref(false)
const showProfileModal = ref(false)
const selectedCompany = ref(null)
const creatingCompany = ref(false)

// Paginación
const currentPage = ref(1)

// Formulario de empresa - CORREGIDO con valores por defecto
const companyForm = ref({
  company_name: '', // CAMBIADO: era 'name'
  admin_username: '',
  admin_email: '',
  admin_full_name: '',
  admin_password: '',
  user_limit: 10
})

// Tabs del sidebar
const tabs = [
  { id: 'dashboard', name: 'Dashboard', icon: 'DashboardIcon' },
  { id: 'companies', name: 'Empresas', icon: 'CompanyIcon' },
  { id: 'audit', name: 'Auditoría', icon: 'AuditIcon' }
]

// Headers de las tablas
const companyHeaders = ref([
  { field: 'name', header: 'Nombre', width: '200px' },
  { field: 'admin_name', header: 'Administrador', width: '150px' },
  { field: 'admin_email', header: 'Email Admin', width: '200px' },
  { field: 'user_count', header: 'Usuarios', width: '100px' },
  { field: 'inventory_count', header: 'Inventarios', width: '100px' },
  { field: 'user_limit', header: 'Límite', width: '100px' },
  { field: 'created_at', header: 'Creado', width: '120px' },
  { field: 'last_activity', header: 'Última Actividad', width: '150px' },
  { field: 'actions', header: 'Acciones', width: '80px' }
])

const auditHeaders = ref([
  { field: 'action_type', header: 'Tipo', width: '120px' },
  { field: 'full_name', header: 'Usuario', width: '150px' },
  { field: 'username', header: 'Usuario', width: '120px' },
  { field: 'company_name', header: 'Empresa', width: '150px' },
  { field: 'timestamp', header: 'Fecha/Hora', width: '150px' },
  { field: 'ip_address', header: 'IP', width: '120px' }
])

// Computed
const userInitials = computed(() => {
  if (!user.value.full_name) return 'SA'
  return user.value.full_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Iconos para las tabs
const DashboardIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
    </svg>
  `
}

const CompanyIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    </svg>
  `
}

const AuditIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
    </svg>
  `
}

// Funciones de utilidad
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Funciones principales
async function fetchStats() {
  try {
    const data = await apiService.getSuperAdminStats()
    stats.value = data
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'No se pudieron cargar las estadísticas')
    }
  }
}

async function fetchCompanies() {
  loading.value = true
  try {
    companies.value = await apiService.getCompanies()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'Error al cargar las empresas')
    }
  } finally {
    loading.value = false
  }
}

async function fetchAuditLogs() {
  loading.value = true
  try {
    auditLogs.value = await apiService.getAuditLogs()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'Error al cargar los registros de auditoría')
    }
  } finally {
    loading.value = false
  }
}

async function viewCompanyDetails(company) {
  selectedCompany.value = company
  loading.value = true
  
  try {
    companyUsers.value = await apiService.getCompanyUsers(company.id)
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'Error al cargar los usuarios de la empresa')
    }
  } finally {
    loading.value = false
  }
}

async function createCompany() {
  // Validación de campos requeridos - CORREGIDO
  const requiredFields = [
    'company_name',
    'admin_username', 
    'admin_email',
    'admin_full_name',
    'admin_password'
  ]
  
  const missingFields = requiredFields.filter(field => !companyForm.value[field]?.trim())
  
  if (missingFields.length > 0) {
    error('Error', 'Por favor completa todos los campos requeridos')
    return
  }

  creatingCompany.value = true
  try {
    console.log('Enviando datos:', companyForm.value) // Para debugging
    
    await apiService.createCompany(companyForm.value)
    success('Éxito', 'Empresa creada exitosamente')
    showCreateCompanyModal.value = false
    
    // Resetear formulario - CORREGIDO
    companyForm.value = {
      company_name: '',
      admin_username: '',
      admin_email: '',
      admin_full_name: '',
      admin_password: '',
      user_limit: 10
    }
    
    fetchCompanies()
    fetchStats()
  } catch (err) {
    console.error('Error creando empresa:', err)
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al crear la empresa')
    }
  } finally {
    creatingCompany.value = false
  }
}

function handleProfileUpdated() {
  user.value = JSON.parse(localStorage.getItem('user') || '{}')
  success('Éxito', 'Perfil actualizado correctamente')
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

// Watcher para cambios de tab
import { watch } from 'vue'
watch(activeTab, (newTab) => {
  if (newTab === 'dashboard') {
    fetchStats()
  } else if (newTab === 'companies') {
    fetchCompanies()
  } else if (newTab === 'audit') {
    fetchAuditLogs()
  }
})

// Resetear formulario cuando se abre el modal
watch(showCreateCompanyModal, (newVal) => {
  if (newVal) {
    companyForm.value = {
      company_name: '',
      admin_username: '',
      admin_email: '',
      admin_full_name: '',
      admin_password: '',
      user_limit: 10
    }
  }
})

onMounted(() => {
  fetchStats()
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
</style>