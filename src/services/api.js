// src/services/api.js - Métodos actualizados
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
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const url = this.getFullUrl(endpoint)
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

  async registerCount(inventoryId, barcode, quantity) {
    return this.request(`/inventories/${inventoryId}/count`, {
      method: 'POST',
      body: JSON.stringify({
        barcode: barcode,
        quantity: quantity
      })
    })
  }

  async uploadProducts(inventoryId, file, overwrite = false) {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', file)
    if (overwrite) {
      formData.append('overwrite', 'true')
    }

    const url = this.getFullUrl(`/inventories/${inventoryId}/upload`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
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

  async exportInventory(inventoryId, format = 'excel', type = 'all') {
    const url = this.getFullUrl(`/inventories/${inventoryId}/export?format=${format}&type=${type}`)
    const token = localStorage.getItem('token')
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
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

  async getProducts(inventoryId) {
    return this.request(`/inventories/${inventoryId}/products`)
  }

  // Método para enviar correo de bienvenida
  async sendWelcomeEmail(emailData) {
    const response = await fetch(this.getFullUrl('/send-welcome-email'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      throw new Error('Error enviando correo de bienvenida');
    }
    
    return await response.json();
  }

  // Método para recuperación de contraseña
  async forgotPassword(email) {
    const response = await fetch(this.getFullUrl('/forgot-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      throw new Error('Error en la solicitud de recuperación');
    }
    
    return await response.json();
  }

  // Método para enviar correos genéricos
  async sendEmail(emailData) {
    return this.request('/email/send', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }

  // Método para enviar credenciales a nuevo usuario
async sendUserCredentials(emailData) {
  const response = await fetch(this.getFullUrl('/send-user-credentials'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });
  
  return await response.json();
}

// En tu archivo apiService.js
async deleteUser(userId) {
  const response = await fetch(`${this.baseUrl}/users/${userId}`, {
    method: 'DELETE',
    headers: this.getHeaders()
  });
  return this.handleResponse(response);
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
}

export const apiService = new ApiService()