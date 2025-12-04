import { ref, computed } from 'vue'

export function useAuth() {
  const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
  const token = ref(localStorage.getItem('token') || '')

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value.id
  })

  const hasRole = (role) => {
    return user.value.role === role
  }

  const isAdmin = computed(() => {
    return user.value.role === 'admin' || user.value.role === 'superadmin'
  })

  const isSuperAdmin = computed(() => {
    return user.value.role === 'superadmin'
  })

  const login = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  const logout = () => {
    user.value = {}
    token.value = ''
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  return {
    user,
    token,
    isAuthenticated,
    hasRole,
    isAdmin,
    isSuperAdmin,
    login,
    logout,
    updateUser
  }
}