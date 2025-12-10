// src/services/api.js - MÉTODOS COMPLETOS Y CORREGIDOS
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
  }

  getFullUrl(endpoint) {
    return `${this.baseURL}${endpoint}`
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token')

    const config = {
      headers: {
        ...(!options.body || !(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const url = this.getFullUrl(endpoint)
      console.log(`🌐 API Request: ${url}`, config.method || 'GET')
      const response = await fetch(url, config)

      if (response.status === 401) {
        this.handleUnauthorized()
        throw new Error('Unauthorized')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      console.error('API request failed:', err)
      throw err
    }
  }

  handleUnauthorized() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  // === MÉTODOS GENÉRICOS HTTP ===
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET'
    })
  }

  async post(endpoint, data = {}, options = {}) {
    const isFormData = data instanceof FormData
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data)
    })
  }

  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE'
    })
  }

  // === MÉTODOS DE AUTENTICACIÓN ===
  async login(credentials) {
    const url = this.getFullUrl('/login')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  async register(data) {
    const url = this.getFullUrl('/register')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // === MÉTODOS DE EMPRESA ===
  async getCompany() {
    return this.request('/company')
  }

  // === MÉTODOS DE USUARIOS ===
  async getUsers() {
    return this.request('/users')
  }

  async createUser(data) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE'
    })
  }

  // === MÉTODOS PARA GESTIÓN DE INVENTARIOS DE USUARIOS ===
  async getAvailableInventories(userId) {
    return this.request(`/users/${userId}/available-inventories`)
  }

  async getAssignedInventories(userId) {
    return this.request(`/users/${userId}/assigned-inventories`)
  }

  async assignInventory(userId, inventoryId, permissions) {
    return this.request(`/users/${userId}/assign-inventory/${inventoryId}`, {
      method: 'POST',
      body: JSON.stringify(permissions)
    })
  }

  async removeInventoryAssignment(userId, inventoryId) {
    return this.request(`/users/${userId}/assign-inventory/${inventoryId}`, {
      method: 'DELETE'
    })
  }

  // === MÉTODOS PARA INVENTARIOS ===
  async getInventories() {
    return this.request('/inventories')
  }

  async getInventory(inventoryId) {
    return this.request(`/inventories/${inventoryId}`)
  }

  async createInventory(data) {
    return this.request('/inventories', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateInventory(id, data) {
    return this.request(`/inventories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteInventory(id) {
    return this.request(`/inventories/${id}`, {
      method: 'DELETE'
    })
  }

  async searchProducts(inventoryId, barcode) {
    return this.request(`/inventories/${inventoryId}/products/search?barcode=${encodeURIComponent(barcode)}`)
  }

  async getProducts(inventoryId) {
    return this.request(`/inventories/${inventoryId}/products`)
  }

  async registerCount(inventoryId, barcode, quantity) {
    return this.request(`/inventories/${inventoryId}/count`, {
      method: 'POST',
      body: JSON.stringify({
        barcode: barcode,
        quantity: quantity
      })
    })
  }

  async exportInventory(inventoryId, format = 'excel', type = 'all') {
    const token = localStorage.getItem('token')
    const url = this.getFullUrl(`/inventories/${inventoryId}/export?format=${format}&type=${type}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })

    if (response.status === 401) {
      this.handleUnauthorized()
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.blob()
  }

  // === MÉTODOS PARA SUBIR ARCHIVOS (CORREGIDOS) ===
  
  // Método para subir productos desde Excel (usando upload endpoint)
  async uploadProducts(inventoryId, file, overwrite = false) {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', file)
    if (overwrite) {
      formData.append('overwrite', 'true')
    }

    const url = this.getFullUrl(`/inventories/${inventoryId}/upload`)

    console.log('📤 Subiendo productos a inventario:', {
      inventoryId,
      fileName: file.name,
      fileSize: file.size
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
        // NOTA: NO agregar 'Content-Type' aquí, fetch lo hará automáticamente
      },
      body: formData
    })

    if (response.status === 401) {
      this.handleUnauthorized()
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // Método para leer columnas de Excel - CORREGIDO
  async getExcelColumns(file) {
    console.log('📊 Iniciando getExcelColumns para archivo:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    const formData = new FormData()
    formData.append('file', file)

    const url = this.getFullUrl('/utils/excel-columns')
    console.log('📤 Enviando a URL:', url)

    const response = await fetch(url, {
      method: 'POST',
      // NOTA: NO agregar 'Content-Type' header
      // fetch automáticamente establece 'Content-Type: multipart/form-data' con el boundary correcto
      body: formData
    })

    console.log('📊 Respuesta recibida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (response.status === 401) {
      this.handleUnauthorized()
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error response text:', errorText)
      
      let errorData = {}
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Resultado exitoso:', result)
    return result
  }

  // Método para subir con mapeo de columnas
  async uploadProductsWithMapping(inventoryId, file, columnMapping, overwrite = false) {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('column_mapping', JSON.stringify(columnMapping))

    if (overwrite) {
      formData.append('overwrite', 'true')
    }

    const url = this.getFullUrl(`/inventories/${inventoryId}/upload-with-mapping`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    })

    if (response.status === 401) {
      this.handleUnauthorized()
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // === MÉTODOS DE EMAIL ===
  async sendWelcomeEmail(emailData) {
    const response = await fetch(this.getFullUrl('/send-welcome-email'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      throw new Error('Error enviando correo de bienvenida')
    }

    return await response.json()
  }

  async forgotPassword(email) {
    const response = await fetch(this.getFullUrl('/forgot-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      throw new Error('Error en la solicitud de recuperación')
    }

    return await response.json()
  }

  async sendEmail(emailData) {
    return this.request('/email/send', {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  }

  async sendUserCredentials(emailData) {
    const response = await fetch(this.getFullUrl('/send-user-credentials'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    return await response.json()
  }

  // === MÉTODOS DE SUPERADMIN ===
  async getSuperAdminStats() {
    return this.request('/superadmin/stats')
  }

  async getCompanies() {
    return this.request('/superadmin/companies')
  }

  async createCompany(data) {
    return this.request('/superadmin/companies', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getCompanyUsers(companyId) {
    return this.request(`/superadmin/companies/${companyId}/users`)
  }

  async getCompanyInventories(companyId) {
    return this.request(`/superadmin/companies/${companyId}/inventories`)
  }

  async getAuditLogs() {
    return this.request('/superadmin/audit-logs')
  }

  // === MÉTODOS DE PERFIL ===
  async getProfile() {
    return this.request('/profile')
  }

  async updateProfile(data) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // === MÉTODOS DE HEALTH CHECK ===
  async healthCheck() {
    try {
      const url = this.getFullUrl('/health')
      console.log('🩺 Health check:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('🩺 Health response:', {
        status: response.status,
        ok: response.ok
      })
      
      if (!response.ok) {
        return { status: 'ERROR', message: `HTTP ${response.status}` }
      }
      
      return await response.json()
    } catch (error) {
      console.error('🩺 Health check error:', error)
      return { status: 'ERROR', message: error.message }
    }
  }

  // === MÉTODO PARA DEPURACIÓN ===
  async debugRoute(endpoint, method = 'GET', data = null) {
    try {
      const url = this.getFullUrl(endpoint)
      console.log(`🔍 Debug route: ${method} ${url}`)
      
      const config = {
        method: method
      }
      
      if (data) {
        config.headers = {
          'Content-Type': 'application/json'
        }
        config.body = JSON.stringify(data)
      }
      
      const response = await fetch(url, config)
      
      console.log(`🔍 Debug response: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('🔍 Error response:', errorText)
        
        try {
          const errorJson = JSON.parse(errorText)
          return { 
            success: false, 
            status: response.status,
            error: errorJson 
          }
        } catch {
          return { 
            success: false, 
            status: response.status,
            error: errorText 
          }
        }
      }
      
      const result = await response.json().catch(() => ({}))
      return { 
        success: true, 
        status: response.status,
        data: result 
      }
      
    } catch (error) {
      console.error('🔍 Debug error:', error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  }
}

export const apiService = new ApiService()