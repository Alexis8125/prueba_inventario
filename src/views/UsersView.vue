<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.push('/inventarios')"
              class="flex items-center space-x-2 text-[#8557FB] hover:text-[#6B45C8] bg-[#F7F1FF] hover:bg-[#F1E9FF] py-2 px-3 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver</span>
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p class="text-sm text-gray-500">{{ company?.name }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{{ companyStats.currentUsers }}</span> / 
              <span>{{ companyStats.userLimit }}</span> usuarios
            </div>
            <button
              @click="showCreateModal = true"
              class="bg-[#8557FB] hover:bg-[#6B45C8] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
              :disabled="companyStats.currentUsers >= companyStats.userLimit"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Crear Usuario</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ users.length }}</div>
          <p class="text-sm text-gray-600">Total Usuarios</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ companyStats.activeUsers }}</div>
          <p class="text-sm text-gray-600">Usuarios Activos</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div class="text-2xl font-bold text-purple-600">{{ companyStats.adminUsers }}</div>
          <p class="text-sm text-gray-600">Administradores</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div class="text-2xl font-bold text-orange-600">{{ companyStats.regularUsers }}</div>
          <p class="text-sm text-gray-600">Usuarios Regulares</p>
        </div>
      </div>

      <!-- Tabla de usuarios -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 class="text-lg font-semibold text-gray-900">
            Lista de Usuarios
            <span class="text-sm font-normal text-gray-500 ml-2">
              ({{ users.length }} usuarios)
            </span>
          </h3>
          <div class="flex items-center space-x-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-sm w-full sm:w-64"
                placeholder="Buscar usuarios..."
              >
            </div>
          </div>
        </div>

        <AppTable
          :data="filteredUsers"
          :headers="userHeaders"
          :pageSize="pageSize"
          :pageCurrent="currentPage"
          :totalItems="filteredUsers.length"
          :loading="loading"
          :showPaginator="true"
          :multipleSelection="false"
          :tableSize="'small'"
          :stripedRows="true"
        >
          <!-- Slot para estado -->
          <template #custom-is_active="{ data }">
            <span 
              :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                data.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ data.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </template>

          <!-- Slot para rol -->
          <template #custom-role="{ data }">
            <span 
              :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                data.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              ]"
            >
              {{ data.role === 'admin' ? 'Administrador' : 'Usuario' }}
            </span>
          </template>

          <!-- Slot para acciones -->
          <template #custom-actions="{ data }">
            <div class="flex space-x-2">
              <button
                @click="editUser(data)"
                class="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors duration-200"
                title="Editar usuario"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="manageInventories(data)"
                class="text-green-600 hover:text-green-800 p-1 rounded transition-colors duration-200"
                title="Gestionar inventarios"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </button>
              <!-- <button
                @click="toggleUserStatus(data)"
                :class="[
                  'p-1 rounded transition-colors duration-200',
                  data.is_active ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'
                ]"
                :title="data.is_active ? 'Desactivar usuario' : 'Activar usuario'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="data.is_active" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button> -->
              <button
                v-if="data.id !== currentUser.id && data.is_active"
                @click="deleteUser(data)"
                class="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200"
                title="Eliminar usuario"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </template>

          <!-- Slot para cuando no hay datos -->
          <template #empty>
            <div class="text-center py-12">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
              <p class="text-gray-500 mb-4">Crea el primer usuario para comenzar</p>
              <button
                @click="showCreateModal = true"
                class="bg-[#8557FB] hover:bg-[#6B45C8] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
              >
                Crear Primer Usuario
              </button>
            </div>
          </template>
        </AppTable>
      </div>
    </main>

    <!-- Modal de Crear/Editar Usuario -->
    <transition name="modal">
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ showEditModal ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
          </h3>
          
          <form @submit.prevent="showEditModal ? updateUser() : createUser()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  v-model="userForm.full_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
                  placeholder="Nombre completo del usuario"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
                <input
                  v-model="userForm.username"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
                  placeholder="Nombre de usuario"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  v-model="userForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
                  placeholder="correo@ejemplo.com"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ showEditModal ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *' }}
                </label>
                <div class="relative">
                  <input
                    v-model="userForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    :required="!showEditModal"
                    class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
                    placeholder="Contraseña segura"
                    @input="checkPasswordStrength"
                  >
                  <div class="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                    <button
                      type="button"
                      @click="generateSecurePassword"
                      class="text-xs bg-[#8557FB] text-white px-2 py-1 rounded hover:bg-[#6B45C8] transition-colors duration-200"
                    >
                      Generar
                    </button>
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Indicador de fortaleza de contraseña -->
                <div v-if="userForm.password && !showEditModal" class="mt-2">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-gray-600">Fortaleza de la contraseña:</span>
                    <span :class="passwordStrength.class" class="text-xs font-medium">
                      {{ passwordStrength.text }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      :class="passwordStrength.barClass"
                      class="h-1.5 rounded-full transition-all duration-300"
                      :style="{ width: passwordStrength.percentage + '%' }"
                    ></div>
                  </div>
                  <ul class="text-xs text-gray-500 mt-1 space-y-1">
                    <li :class="passwordRequirements.length ? 'text-green-600' : 'text-red-600'">
                      • Mínimo 8 caracteres
                    </li>
                    <li :class="passwordRequirements.uppercase ? 'text-green-600' : 'text-red-600'">
                      • Al menos una mayúscula
                    </li>
                    <li :class="passwordRequirements.lowercase ? 'text-green-600' : 'text-red-600'">
                      • Al menos una minúscula
                    </li>
                    <li :class="passwordRequirements.number ? 'text-green-600' : 'text-red-600'">
                      • Al menos un número
                    </li>
                    <li :class="passwordRequirements.special ? 'text-green-600' : 'text-red-600'">
                      • Al menos un carácter especial (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
                <select
                  v-model="userForm.role"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
                >
                  <option value="user">Contador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div v-if="showEditModal">
                <label class="flex items-center">
                  <input
                    v-model="userForm.is_active"
                    type="checkbox"
                    class="rounded border-gray-300 text-[#8557FB] focus:ring-[#8557FB]"
                  >
                  <span class="ml-2 text-sm text-gray-700">Usuario activo</span>
                </label>
              </div>
            </div>

            <div class="flex space-x-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="creatingUser || (!showEditModal && !isPasswordStrong)"
                class="flex-1 bg-[#8557FB] hover:bg-[#5436A3] disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <svg v-if="creatingUser" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ creatingUser ? 'Guardando...' : (showEditModal ? 'Guardar Cambios' : 'Crear Usuario') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal de Confirmación de Eliminación -->
    <transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <div class="flex items-center space-x-3 mb-4">
            <div class="bg-red-100 p-2 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
          </div>
          
          <p class="text-gray-600 mb-6">
            ¿Estás seguro de que deseas eliminar al usuario "<strong>{{ deletingUser?.full_name }}</strong>"? 
            Esta acción no se puede deshacer.
          </p>

          <div class="flex space-x-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-300"
            >
              Cancelar
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors duration-300"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Gestión de Inventarios -->
    <transition name="modal">
      <div v-if="showInventoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Gestionar Inventarios - {{ selectedUser?.full_name }}
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Inventarios Disponibles -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Inventarios Disponibles</h4>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="inventory in availableInventories"
                  :key="inventory.id"
                  class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-gray-900">{{ inventory.name }}</p>
                      <p class="text-sm text-gray-500">{{ inventory.description || 'Sin descripción' }}</p>
                      <p class="text-xs text-gray-400">Creado: {{ formatDate(inventory.created_at) }}</p>
                    </div>
                    <button
                      @click="assignInventory(inventory)"
                      class="bg-[#8557FB] hover:bg-[#6B45C8] text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                    >
                      Asignar
                    </button>
                  </div>
                </div>
                <div v-if="availableInventories.length === 0" class="text-center py-4 text-gray-500">
                  No hay inventarios disponibles para asignar
                </div>
              </div>
            </div>

            <!-- Inventarios Asignados -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Inventarios Asignados</h4>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="inventory in assignedInventories"
                  :key="inventory.id"
                  class="border border-green-200 bg-green-50 rounded-lg p-3"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium text-gray-900">{{ inventory.name }}</p>
                      <p class="text-sm text-gray-500">{{ inventory.description || 'Sin descripción' }}</p>
                      <div class="flex space-x-4 mt-2 text-xs">
                        <span><strong>Permisos:</strong></span>
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            :checked="inventory.can_edit"
                            @change="updateInventoryPermission(inventory.id, 'can_edit', $event.target.checked)"
                            class="rounded border-gray-300 text-[#8557FB] focus:ring-[#8557FB]"
                          >
                          <span class="ml-1 text-gray-700">Editar</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            :checked="inventory.can_upload"
                            @change="updateInventoryPermission(inventory.id, 'can_upload', $event.target.checked)"
                            class="rounded border-gray-300 text-[#8557FB] focus:ring-[#8557FB]"
                          >
                          <span class="ml-1 text-gray-700">Subir</span>
                        </label>
                      </div>
                    </div>
                    <button
                      @click="removeInventoryAssignment(inventory.id)"
                      class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-[11px] transition-colors duration-200"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <div v-if="assignedInventories.length === 0" class="text-center py-4 text-gray-500">
                  No hay inventarios asignados
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="closeInventoryModal"
              class="bg-[#8557FB] hover:bg-[#6B45C8] text-white py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { apiService } from '@/services/api'
import AppTable from '@/components/atoms/AppTable.vue'

const router = useRouter()
const { success, error, confirm } = useNotifications()

const users = ref([])
const company = ref(null)
const loading = ref(false)
const creatingUser = ref(false)
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))

// Estados para modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showInventoryModal = ref(false)
const showPassword = ref(false)

// Búsqueda y paginación
const searchQuery = ref('')
const pageSize = ref(10)
const currentPage = ref(1)

// Datos de usuario seleccionado
const selectedUser = ref(null)
const availableInventories = ref([])
const assignedInventories = ref([])
const deletingUser = ref(null)

// Formulario de usuario
const userForm = ref({
  id: null,
  full_name: '',
  username: '',
  email: '',
  password: '',
  role: 'user',
  is_active: true
})

// Estados para fortaleza de contraseña
const passwordStrength = ref({
  text: 'Débil',
  class: 'text-red-600',
  barClass: 'bg-red-500',
  percentage: 0
})

const passwordRequirements = ref({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false
})

const isPasswordStrong = ref(false)

// Headers de la tabla
const userHeaders = ref([
  { field: 'full_name', header: 'Nombre Completo', width: '200px' },
  { field: 'username', header: 'Usuario', width: '150px' },
  { field: 'email', header: 'Email', width: '200px' },
  { field: 'role', header: 'Rol', width: '120px' },
  { field: 'is_active', header: 'Estado', width: '100px' },
  { field: 'created_at', header: 'Creado', width: '120px' },
  { field: 'actions', header: 'Acciones', width: '140px' }
])

// Computed properties
const companyStats = computed(() => {
  const activeUsers = users.value.filter(user => user.is_active).length
  const adminUsers = users.value.filter(user => user.role === 'admin').length
  const regularUsers = users.value.filter(user => user.role === 'user').length
  
  return {
    currentUsers: users.value.length,
    userLimit: company.value?.user_limit || 10,
    activeUsers,
    adminUsers,
    regularUsers
  }
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.full_name?.toLowerCase().includes(query) ||
    user.username?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  )
})

// Funciones de utilidad
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

// Funciones para contraseña segura
function generateSecurePassword() {
  const length = 12
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  
  // Asegurar al menos un carácter de cada tipo
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)] // Mayúscula
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)] // Minúscula
  password += "0123456789"[Math.floor(Math.random() * 10)] // Número
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)] // Especial
  
  // Completar el resto
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Mezclar los caracteres
  password = password.split('').sort(() => 0.5 - Math.random()).join('')
  
  userForm.value.password = password
  checkPasswordStrength()
}

function checkPasswordStrength() {
  const password = userForm.value.password
  
  // Reiniciar requerimientos
  passwordRequirements.value = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password)
  }
  
  // Calcular puntuación
  let score = 0
  if (passwordRequirements.value.length) score += 20
  if (passwordRequirements.value.uppercase) score += 20
  if (passwordRequirements.value.lowercase) score += 20
  if (passwordRequirements.value.number) score += 20
  if (passwordRequirements.value.special) score += 20
  
  // Determinar fortaleza
  if (score >= 80) {
    passwordStrength.value = {
      text: 'Muy Fuerte',
      class: 'text-green-600',
      barClass: 'bg-green-500',
      percentage: 100
    }
    isPasswordStrong.value = true
  } else if (score >= 60) {
    passwordStrength.value = {
      text: 'Fuerte',
      class: 'text-green-500',
      barClass: 'bg-green-400',
      percentage: 75
    }
    isPasswordStrong.value = true
  } else if (score >= 40) {
    passwordStrength.value = {
      text: 'Moderada',
      class: 'text-yellow-600',
      barClass: 'bg-yellow-500',
      percentage: 50
    }
    isPasswordStrong.value = false
  } else {
    passwordStrength.value = {
      text: 'Débil',
      class: 'text-red-600',
      barClass: 'bg-red-500',
      percentage: 25
    }
    isPasswordStrong.value = false
  }
}

// Funciones principales
async function fetchCompany() {
  try {
    company.value = await apiService.getCompany()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'No se pudo cargar la información de la empresa')
    }
  }
}

async function fetchUsers() {
  loading.value = true
  try {
    users.value = await apiService.getUsers()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'Error al cargar los usuarios')
    }
  } finally {
    loading.value = false
  }
}

function editUser(userData) {
  userForm.value = {
    id: userData.id,
    full_name: userData.full_name,
    username: userData.username,
    email: userData.email,
    password: '',
    role: userData.role,
    is_active: userData.is_active
  }
  showEditModal.value = true
}

function deleteUser(userData) {
  deletingUser.value = userData
  showDeleteModal.value = true
}

async function confirmDelete() {
  try {
    await apiService.deleteUser(deletingUser.value.id)
    success('Éxito', 'Usuario eliminado exitosamente')
    showDeleteModal.value = false
    fetchUsers()
    fetchCompany()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al eliminar el usuario')
    }
  }
}

async function manageInventories(userData) {
  selectedUser.value = userData
  loading.value = true
  
  try {
    const [available, assigned] = await Promise.all([
      apiService.getAvailableInventories(userData.id),
      apiService.getAssignedInventories(userData.id)
    ])
    
    availableInventories.value = available
    assignedInventories.value = assigned
    showInventoryModal.value = true
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'Error al cargar los inventarios')
    }
  } finally {
    loading.value = false
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  userForm.value = {
    id: null,
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    is_active: true
  }
  showPassword.value = false
  isPasswordStrong.value = false
  passwordStrength.value = {
    text: 'Débil',
    class: 'text-red-600',
    barClass: 'bg-red-500',
    percentage: 0
  }
}

function closeInventoryModal() {
  showInventoryModal.value = false
  selectedUser.value = null
  availableInventories.value = []
  assignedInventories.value = []
}

async function createUser() {
  creatingUser.value = true
  try {
    console.log('👤 Creando nuevo usuario:', userForm.value)
    
    // 1. Crear el usuario
    const result = await apiService.createUser(userForm.value)
    
    // 2. Enviar correo con credenciales al nuevo usuario
    if (result.success) {
      try {
        const emailResult = await apiService.sendUserCredentials({
          to: userForm.value.email,
          company_name: company.value?.name || 'Nuestra Empresa',
          full_name: userForm.value.full_name,
          username: userForm.value.username,
          password: userForm.value.password,
          role: userForm.value.role
        })
        
        if (emailResult.success) {
          console.log('✅ Correo de credenciales enviado exitosamente')
        } else {
          console.warn('⚠️ Correo de credenciales no enviado:', emailResult.error)
        }
      } catch (emailError) {
        console.warn('⚠️ Error enviando correo de credenciales:', emailError)
      }
    }
    
    success('Éxito', 'Usuario creado exitosamente')
    closeModal()
    fetchUsers()
    fetchCompany()
    
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al crear el usuario')
    }
  } finally {
    creatingUser.value = false
  }
}

async function updateUser() {
  creatingUser.value = true
  try {
    await apiService.updateUser(userForm.value.id, userForm.value)
    success('Éxito', 'Usuario actualizado exitosamente')
    closeModal()
    fetchUsers()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al actualizar el usuario')
    }
  } finally {
    creatingUser.value = false
  }
}

async function toggleUserStatus(userData) {
  try {
    await apiService.updateUser(userData.id, {
      is_active: !userData.is_active
    })
    success('Éxito', `Usuario ${userData.is_active ? 'desactivado' : 'activado'} exitosamente`)
    fetchUsers()
    fetchCompany()
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al cambiar el estado del usuario')
    }
  }
}

async function assignInventory(inventory) {
  try {
    await apiService.assignInventory(selectedUser.value.id, inventory.id, {
      can_edit: false,
      can_delete: false,
      can_upload: false
    })
    
    success('Éxito', 'Inventario asignado exitosamente')
    
    // Actualizar listas
    const [available, assigned] = await Promise.all([
      apiService.getAvailableInventories(selectedUser.value.id),
      apiService.getAssignedInventories(selectedUser.value.id)
    ])
    
    availableInventories.value = available
    assignedInventories.value = assigned
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al asignar el inventario')
    }
  }
}

async function removeInventoryAssignment(inventoryId) {
  try {
    await apiService.removeInventoryAssignment(selectedUser.value.id, inventoryId)
    
    success('Éxito', 'Asignación removida exitosamente')
    
    // Actualizar listas
    const [available, assigned] = await Promise.all([
      apiService.getAvailableInventories(selectedUser.value.id),
      apiService.getAssignedInventories(selectedUser.value.id)
    ])
    
    availableInventories.value = available
    assignedInventories.value = assigned
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al remover la asignación')
    }
  }
}

async function updateInventoryPermission(inventoryId, permission, value) {
  try {
    const inventory = assignedInventories.value.find(inv => inv.id === inventoryId)
    if (!inventory) return

    const permissions = {
      can_edit: inventory.can_edit,
      can_upload: inventory.can_upload,
      [permission]: value
    }

    await apiService.assignInventory(selectedUser.value.id, inventoryId, permissions)
    
    // Actualizar localmente
    const index = assignedInventories.value.findIndex(inv => inv.id === inventoryId)
    if (index !== -1) {
      assignedInventories.value[index] = {
        ...assignedInventories.value[index],
        [permission]: value
      }
    }
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'Error al actualizar los permisos')
    }
  }
}

onMounted(() => {
  fetchCompany()
  fetchUsers()
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