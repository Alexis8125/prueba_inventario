<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md">
      <div class="flex items-center space-x-3 mb-4">
        <div :class="`p-2 rounded-full ${iconColorClass}`">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="confirmColor === 'red'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </div>

      <p class="text-gray-600 mb-6">
        {{ message }}
      </p>

      <div class="flex space-x-3">
        <button @click="$emit('cancel')"
          class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors duration-300">
          Cancel
        </button>
        <button @click="$emit('confirm')"
          :class="`flex-1 ${confirmButtonClass} text-white py-3 rounded-lg transition-colors duration-300`">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  confirmColor: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'red', 'green', 'yellow'].includes(value)
  }
})

defineEmits(['confirm', 'cancel'])

const iconColorClass = computed(() => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  }
  return colors[props.confirmColor] || colors.blue
})

const confirmButtonClass = computed(() => {
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    red: 'bg-red-600 hover:bg-red-700',
    green: 'bg-green-600 hover:bg-green-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700'
  }
  return colors[props.confirmColor] || colors.blue
})
</script>