<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full">
      <div class="bg-gradient-to-r from-[#8557FB] to-[#8557FB] p-6 text-center">
        <h2 class="text-xl font-bold text-white">Recuperar Contraseña</h2>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <div>
            <label for="recovery-email" class="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="recovery-email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8557FB] focus:border-[#8557FB] bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200"
              placeholder="Ingresa tu correo electrónico"
            >
            <p class="text-xs text-gray-500 mt-1">
              Te enviaremos tu contraseña actual a este correo
            </p>
          </div>
          
          <div class="flex space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-[#8557FB] hover:bg-[#6A32F2] disabled:bg-[#9F7BFC] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Enviando...' : 'Enviar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiService } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const { success, error } = useNotifications()
const emit = defineEmits(['close', 'success'])

const email = ref('')
const isLoading = ref(false)

async function handleForgotPassword() {
  if (!email.value) {
    error('Error', 'Por favor ingresa tu correo electrónico')
    return
  }

  isLoading.value = true
  
  try {
    const result = await apiService.forgotPassword(email.value)
    
    if (result.success) {
      success('Correo enviado', 'Se ha enviado tu contraseña al correo electrónico proporcionado')
      emit('success')
      emit('close')
    } else {
      error('Error', result.message || 'No se pudo procesar la solicitud')
    }
  } catch (err) {
    console.error('Error en recuperación:', err)
    error('Error', 'No se pudo enviar el correo. Intenta nuevamente.')
  } finally {
    isLoading.value = false
  }
}
</script>