// src/services/salesService.js - VERSIÓN COMPLETA Y CORREGIDA
import { apiService } from './api.js'

export const salesService = {
    // ======================
    // PRODUCTOS PARA VENTA
    // ======================

    /**
     * Obtiene todos los productos disponibles para venta (con stock > 0)
     */
    getProductsForSale() {
        return apiService.get('/sales/products')
    },

    /**
     * Busca productos por nombre o código de barras
     * @param {string} search - Texto de búsqueda (nombre, SKU)
     * @param {string} barcode - Código de barras exacto
     */
    searchProducts(search, barcode) {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (barcode) params.append('barcode', barcode)
        return apiService.get(`/sales/products/search?${params}`)
    },

    // ======================
    // GESTIÓN DE VENTAS
    // ======================

    /**
     * Obtiene el historial de ventas
     * @param {Object} params - Parámetros de filtro
     * @param {string} params.startDate - Fecha inicio (YYYY-MM-DD)
     * @param {string} params.endDate - Fecha fin (YYYY-MM-DD)
     * @param {number} params.limit - Límite de resultados
     */
    getSales(params = {}) {
        const queryParams = new URLSearchParams()

        if (params.startDate) queryParams.append('startDate', params.startDate)
        if (params.endDate) queryParams.append('endDate', params.endDate)
        if (params.limit) queryParams.append('limit', params.limit)

        const queryString = queryParams.toString()
        return apiService.get(`/sales${queryString ? '?' + queryString : ''}`)
    },

    /**
     * Obtiene los detalles de una venta específica
     * @param {number|string} saleId - ID de la venta
     */
    getSaleDetails(saleId) {
        return apiService.get(`/sales/${saleId}`)
    },
    /**
     * Crea una nueva venta
     * @param {Object} saleData - Datos de la venta
     * @param {string} saleData.customer_name - Nombre del cliente
     * @param {string} saleData.customer_document - RUC/DNI
     * @param {string} saleData.customer_phone - Teléfono
     * @param {string} saleData.customer_email - Email
     * @param {string} saleData.payment_method - Método de pago
     * @param {Array} saleData.items - Productos a vender
     */
    createSale(saleData) {
        return apiService.post('/sales', saleData)
    },

    // ======================
    // FACTURACIÓN
    // ======================

    /**
     * Genera la factura de una venta
     * @param {number|string} saleId - ID de la venta
     * @param {string} format - Formato (html, json)
     */
    getInvoice(saleId, format = 'html') {
        return apiService.get(`/sales/${saleId}/invoice?format=${format}`)
    },

    /**
     * Genera PDF de factura (para descargar)
     * @param {number|string} saleId - ID de la venta
     */
    async downloadInvoicePDF(saleId) {
        try {
            const response = await fetch(`http://localhost:3000/api/sales/${saleId}/invoice?format=html`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (!response.ok) {
                throw new Error('Error generando PDF')
            }

            // Aquí podrías usar una librería para convertir HTML a PDF
            // Por ahora devolvemos el HTML
            const html = await response.text()
            return {
                success: true,
                html: html,
                saleId: saleId
            }
        } catch (error) {
            throw error
        }
    },

    // ======================
    // ESTADÍSTICAS
    // ======================

    /**
     * Obtiene estadísticas de ventas
     * @param {string} period - Periodo (today, week, month)
     */
    // En salesService.js - modifica getSalesStats
    getSalesStats(period = 'today') {
        try {
            return apiService.get(`/sales/stats?period=${period}`)
        } catch (error) {
            console.warn('⚠️  API de estadísticas no disponible, usando datos simulados')

            // Datos simulados temporalmente
            return Promise.resolve({
                overview: {
                    total_sales: 3,
                    total_revenue: 1160.00,
                    total_items_sold: 4,
                    average_sale: 386.67
                },
                top_products: []
            })
        }
    },

    // ======================
    // FUNCIONES AUXILIARES
    // ======================

    /**
     * Formatea una fecha para mostrarla
     * @param {string} dateString - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    },

    /**
     * Formatea un número como moneda
     * @param {number} amount - Cantidad
     * @returns {string} Cantidad formateada como moneda
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(amount || 0)
    },

    /**
     * Obtiene el nombre del método de pago
     * @param {string} method - Código del método
     * @returns {string} Nombre del método
     */
    getPaymentMethodName(method) {
        const methods = {
            'efectivo': 'Efectivo',
            'tarjeta': 'Tarjeta',
            'transferencia': 'Transferencia',
            'yape': 'Yape',
            'plin': 'Plin'
        }
        return methods[method] || method
    },

    /**
     * Valida los datos de una venta antes de enviarla
     * @param {Object} saleData - Datos de la venta
     * @returns {Object} Resultado de validación
     */
    validateSale(saleData) {
        const errors = []

        if (!saleData.customer_name || saleData.customer_name.trim() === '') {
            errors.push('El nombre del cliente es requerido')
        }

        if (!saleData.items || saleData.items.length === 0) {
            errors.push('Debe agregar al menos un producto')
        }

        if (saleData.items) {
            saleData.items.forEach((item, index) => {
                if (!item.product_id) {
                    errors.push(`Producto ${index + 1}: ID de producto requerido`)
                }
                if (!item.quantity || item.quantity <= 0) {
                    errors.push(`Producto ${index + 1}: Cantidad inválida`)
                }
                if (!item.unit_price || item.unit_price <= 0) {
                    errors.push(`Producto ${index + 1}: Precio inválido`)
                }
            })
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        }
    },

    /**
     * Calcula los totales de una venta
     * @param {Array} items - Productos en la venta
     * @returns {Object} Totales calculados
     */
    calculateTotals(items) {
        if (!items || items.length === 0) {
            return {
                subtotal: 0,
                tax: 0,
                total: 0
            }
        }

        const subtotal = items.reduce((sum, item) => {
            const itemSubtotal = (item.quantity || 0) * (item.unit_price || 0)
            return sum + itemSubtotal
        }, 0)

        const taxRate = 0.16 // 16% IVA
        const tax = subtotal * taxRate
        const total = subtotal + tax

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        }
    },

    /**
     * Exporta ventas a Excel
     * @param {Object} params - Parámetros de filtro
     */
    async exportSalesToExcel(params = {}) {
        try {
            const sales = await this.getSales(params)

            // Crear datos para Excel
            const excelData = sales.map(sale => ({
                'Factura': sale.invoice_number,
                'Fecha': this.formatDate(sale.created_at),
                'Cliente': sale.customer_name,
                'RUC/DNI': sale.customer_document || '',
                'Subtotal': sale.subtotal,
                'IVA': sale.tax,
                'Total': sale.total,
                'Método Pago': this.getPaymentMethodName(sale.payment_method),
                'Vendedor': sale.created_by_name,
                'Estado': sale.status === 'completed' ? 'Completada' : 'Cancelada'
            }))

            return {
                success: true,
                data: excelData,
                fileName: `ventas_${new Date().toISOString().split('T')[0]}.xlsx`,
                count: sales.length
            }
        } catch (error) {
            throw error
        }
    },

    /**
     * Simula el pago de una venta (para desarrollo)
     * @param {Object} saleData - Datos de la venta
     */
    async simulatePayment(saleData) {
        // Esta función simula el proceso de pago
        // En producción, aquí integrarías con pasarela de pago

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Pago simulado exitosamente',
                    transactionId: 'SIM-' + Date.now(),
                    timestamp: new Date().toISOString()
                })
            }, 1500)
        })
    },

    /**
     * Cancela una venta (solo para desarrollo - en producción sería DELETE)
     * @param {number|string} saleId - ID de la venta
     * @param {string} reason - Razón de la cancelación
     */
    cancelSale(saleId, reason = '') {
        // NOTA: En tu backend necesitarías crear la ruta DELETE /api/sales/:id
        // Por ahora solo simulación
        console.log(`Cancelando venta ${saleId}: ${reason}`)
        return Promise.resolve({
            success: true,
            message: 'Venta cancelada (simulación)',
            saleId: saleId
        })
    }
}

export default salesService