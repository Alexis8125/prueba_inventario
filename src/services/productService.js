import { apiService } from './api'

function normalizeProduct(p) {
  if (!p) return p
  return {
    id: p.id ?? p.product_id ?? null,
    inventory_id: p.inventory_id ?? p.inventoryId ?? null,
    barcode: p.barcode ?? p.bar_code ?? null,
    sku: p.sku ?? p.SKU ?? null,
    name: p.name ?? p.product_name ?? p.productName ?? null,
    description: p.description ?? p.desc ?? '',
    category: p.category ?? p.category_name ?? null,
    location: p.location ?? p.location_name ?? null,
    expected_quantity: p.expected_quantity ?? p.expected_stock ?? p.expectedStock ?? 0,
    counted_quantity: p.counted_quantity ?? p.counted_stock ?? p.countedStock ?? 0,
    count_date: p.count_date ?? p.countDate ?? null,
    counted_by: p.counted_by ?? p.countedBy ?? null,
    counted_by_name: p.counted_by_name ?? p.countedByName ?? null,
    status: p.status ?? null,
    difference: p.difference ?? null,
    difference_percentage: p.difference_percentage ?? null,
    progress_percentage: p.progress_percentage ?? null
  }
}

export const productService = {
  // Get all products for an inventory
  async getProductsByInventory(inventoryId) {
    try {
      const response = await apiService.get(`/inventories/${inventoryId}/products`)
      // Normalize backend product fields to frontend-friendly keys
      if (response && Array.isArray(response.products)) {
        const normalized = response.products.map(normalizeProduct)
        return { ...response, products: normalized }
      }
      return response
    } catch (error) {
      throw error
    }
  },

  // Add a new product
  async addProduct(inventoryId, productData) {
    try {
      const response = await apiService.post(`/inventories/${inventoryId}/products`, productData)
      if (response && response.product) return normalizeProduct(response.product)
      return response.product
    } catch (error) {
      throw error
    }
  },

  // Update a product
  async updateProduct(inventoryId, productId, productData) {
    try {
      const response = await apiService.put(`/inventories/${inventoryId}/products/${productId}`, productData)
      return response.product
    } catch (error) {
      throw error
    }
  },

  // Delete a product
  async deleteProduct(inventoryId, productId) {
    try {
      const response = await apiService.delete(`/inventories/${inventoryId}/products/${productId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Upload products from Excel
  async uploadProductsFromExcel(inventoryId, file, mapping = null) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (mapping) {
        formData.append('mapping', JSON.stringify(mapping))
      }

      const response = await apiService.post(`/inventories/${inventoryId}/products/upload`, formData)
      if (response && Array.isArray(response.products)) {
        return { ...response, products: response.products.map(normalizeProduct) }
      }
      return response
    } catch (error) {
      throw error
    }
  },

  // Export products to Excel
  async exportProducts(inventoryId) {
    try {
      const response = await apiService.get(`/inventories/${inventoryId}/products/export`, {
        responseType: 'blob'
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Search products
  async searchProducts(inventoryId, query, filters = {}) {
    try {
      const params = { q: query, ...filters }
      const response = await apiService.get(`/inventories/${inventoryId}/products/search`, { params })
      return response
    } catch (error) {
      throw error
    }
  }
,

  // Categories
  async getCategories(inventoryId) {
    try {
      const response = await apiService.get(`/inventories/${inventoryId}/categories`)
      return Array.isArray(response) ? response : []
    } catch (error) {
      throw error
    }
  },

  async addCategory(inventoryId, name) {
    try {
      const response = await apiService.post(`/inventories/${inventoryId}/categories`, { name })
      return response
    } catch (error) {
      throw error
    }
  }
}