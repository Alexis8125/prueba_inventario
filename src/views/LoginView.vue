<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <!-- Modal de recuperación de contraseña -->
    <ForgotPasswordModal 
      v-if="showForgotPassword"
      @close="showForgotPassword = false"
      @success="handlePasswordRecoverySuccess"
    />
    
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-[#8557FB] to-[#8557FB] p-6 text-center">
          <h1 class="text-2xl font-bold text-white mb-2">Sistema de Inventario</h1>
          <p class="text-blue-100 text-sm">Gestión de conteos por empresas</p>
        </div>
        
        <div class="p-8">
          <!-- Solo modo login -->
          <div class="text-center mb-6">
            <h2 class="text-xl font-semibold text-gray-800">Iniciar Sesión</h2>
            <p class="text-gray-600 text-sm mt-1">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <!-- Formulario de Login -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200"
                placeholder="Ingresa tu usuario"
                autocomplete="username"
              >
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="credentials.password"
                  :type="showLoginPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200"
                  placeholder="Ingresa tu contraseña"
                  autocomplete="current-password"
                >
                <button
                  type="button"
                  @click="showLoginPassword = !showLoginPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg v-if="showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[#8557FB] hover:bg-[#6A32F2] disabled:bg-[#9F7BFC] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </form>
          
          <div class="mt-6 text-center space-y-2">
            <button
              @click="showForgotPassword = true"
              class="block w-full text-[#8557FB] hover:text-[#6A32F2] text-sm font-medium transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- Información de acceso superadmin -->
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-xs text-blue-800 text-center">
              <strong>Acceso SuperAdmin:</strong> admin / password
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { apiService } from '@/services/api'
import ForgotPasswordModal from '@/components/ForgotPasswordModal.vue'

const router = useRouter()
const { success, error } = useNotifications()

const isLoading = ref(false)
const showForgotPassword = ref(false)
const showLoginPassword = ref(false)

const credentials = ref({
  username: '',
  password: ''
})

async function handleLogin() {
  isLoading.value = true
  
  try {
    console.log('Intentando login...', credentials.value)
    
    const data = await apiService.login(credentials.value)
    console.log('Respuesta completa:', data)
    
    if (data.success) {
      success('¡Éxito!', 'Inicio de sesión exitoso')
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Redirigir según el rol - CORREGIDO
      setTimeout(() => {
        if (data.user.role === 'superadmin') {
          router.push('/superadmin')
        } else {
          router.push('/inventarios')
        }
      }, 1000)
    } else {
      const errorMessage = data.error || data.message || 'Credenciales incorrectas'
      console.log('Error de login:', errorMessage)
      error('Error de inicio de sesión', errorMessage)
    }
  } catch (err) {
    console.error('Error de conexión:', err)
    if (err.message !== 'Unauthorized') {
      error('Error de conexión', 'No se pudo conectar con el servidor')
    }
  } finally {
    isLoading.value = false
  }
}

function handlePasswordRecoverySuccess() {
  success('Éxito', 'Se ha enviado tu contraseña al correo electrónico')
}

onMounted(() => {
  console.log('LoginView montado')
})
</script>