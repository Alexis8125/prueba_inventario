<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Mi Perfil</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="updateProfile">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <input
              v-model="profileForm.full_name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
              placeholder="Tu nombre completo"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="profileForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
              placeholder="tu@email.com"
            >
          </div>

          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Cambiar Contraseña</h4>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                <input
                  v-model="profileForm.current_password"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
                  placeholder="Contraseña actual"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                <input
                  v-model="profileForm.new_password"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
                  placeholder="Nueva contraseña"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                <input
                  v-model="profileForm.confirm_password"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900"
                  placeholder="Confirmar nueva contraseña"
                >
              </div>
            </div>
          </div>

          <!-- Información de cuenta -->
          <div class="bg-gray-50 p-3 rounded-lg">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Información de la Cuenta</h4>
            <div class="text-xs text-gray-600 space-y-1">
              <p><strong>Usuario:</strong> {{ user.username }}</p>
              <p><strong>Rol:</strong> {{ user.role === 'superadmin' ? 'SuperAdministrador' : user.role === 'admin' ? 'Administrador' : 'Usuario' }}</p>
              <p><strong>Empresa:</strong> {{ user.company_name || 'Sistema' }}</p>
              <p><strong>Miembro desde:</strong> {{ formatDate(user.created_at) }}</p>
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="updatingProfile"
            class="flex-1 bg-[#8557FB] hover:bg-[#6B45C8] disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <svg v-if="updatingProfile" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ updatingProfile ? 'Guardando...' : 'Guardar Cambios' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { apiService } from '@/services/api'

const { success, error } = useNotifications()
const emit = defineEmits(['close', 'updated'])

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const updatingProfile = ref(false)

const profileForm = ref({
  full_name: '',
  email: '',
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// Funciones de utilidad
function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

// Funciones principales
async function loadProfile() {
  try {
    const profile = await apiService.getProfile()
    profileForm.value.full_name = profile.full_name
    profileForm.value.email = profile.email
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', 'No se pudo cargar el perfil')
    }
  }
}

async function updateProfile() {
  // Validar contraseñas si se están cambiando
  if (profileForm.value.new_password) {
    if (!profileForm.value.current_password) {
      error('Error', 'La contraseña actual es requerida para cambiar la contraseña')
      return
    }
    
    if (profileForm.value.new_password !== profileForm.value.confirm_password) {
      error('Error', 'Las contraseñas nuevas no coinciden')
      return
    }
    
    if (profileForm.value.new_password.length < 6) {
      error('Error', 'La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
  }

  updatingProfile.value = true
  try {
    await apiService.updateProfile(profileForm.value)
    
    // Actualizar datos del usuario en localStorage
    const updatedUser = { ...user.value }
    updatedUser.full_name = profileForm.value.full_name
    updatedUser.email = profileForm.value.email
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    success('Éxito', 'Perfil actualizado correctamente')
    emit('updated')
    emit('close')
  } catch (err) {
    if (err.message !== 'Unauthorized') {
      error('Error', err.message || 'Error al actualizar el perfil')
    }
  } finally {
    updatingProfile.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>