<template>
  <div class="dashboard-container">
    <!-- Sidebar fijo a la izquierda -->
    <div class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <!-- Logo -->
      <div class="sidebar-header">
        <div v-if="!sidebarCollapsed" class="logo-container">
          <div class="logo-wrapper">
            <div class="logo-placeholder">
              INV
            </div>
          </div>
          <div class="company-info">
            <h2 class="company-name">Sistema Inventario</h2>
            <p class="company-subtitle">{{ currentUser?.company_name || currentUser?.company || 'Empresa' }}</p>
          </div>
        </div>
        <div v-else class="logo-mini">
          <div class="logo-icon">I</div>
        </div>
        
        <button @click="sidebarCollapsed = !sidebarCollapsed" class="sidebar-toggle">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="sidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Navegación -->
      <nav class="sidebar-nav">
        <!-- Grupo Principal -->
        <div class="nav-group">
          <div v-if="!sidebarCollapsed" class="nav-group-title">
            Principal
          </div>
          <div class="nav-items">
            <router-link to="/dashboard" class="nav-item active">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span v-if="!sidebarCollapsed" class="nav-label">Dashboard</span>
            </router-link>
            
            <router-link to="/inventarios" class="nav-item">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span v-if="!sidebarCollapsed" class="nav-label">Inventarios</span>
            </router-link>
            
            <router-link to="/conteos" class="nav-item">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span v-if="!sidebarCollapsed" class="nav-label">Conteos</span>
            </router-link>
            
            <router-link v-if="currentUser?.role === 'admin' || currentUser?.role === 'superadmin'" to="/reportes" class="nav-item">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span v-if="!sidebarCollapsed" class="nav-label">Reportes</span>
            </router-link>
          </div>
        </div>

        <!-- Grupo Administración -->
        <div v-if="currentUser?.role === 'admin' || currentUser?.role === 'superadmin'" class="nav-group">
          <div v-if="!sidebarCollapsed" class="nav-group-title">
            Administración
          </div>
          <div class="nav-items">
            <router-link v-if="currentUser?.role === 'admin' || currentUser?.role === 'superadmin'" to="/usuarios" class="nav-item">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <span v-if="!sidebarCollapsed" class="nav-label">Usuarios</span>
            </router-link>
            
            <router-link v-if="currentUser?.role === 'superadmin'" to="/empresas" class="nav-item">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span v-if="!sidebarCollapsed" class="nav-label">Empresas</span>
            </router-link>
            
            <router-link v-if="currentUser?.role === 'superadmin'" to="/auditoria" class="nav-item">
              <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span v-if="!sidebarCollapsed" class="nav-label">Auditoría</span>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Información del usuario -->
      <div class="sidebar-footer">
        <div class="user-info" @click="$router.push('/perfil')">
          <div class="avatar">
            {{ getUserInitials() }}
          </div>
          <div v-if="!sidebarCollapsed" class="user-details">
            <p class="user-name">{{ currentUser?.full_name }}</p>
            <p class="user-role">{{ getUserRoleName() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <header class="main-header">
        <div class="header-content">
          <div>
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">Bienvenido, {{ currentUser?.full_name }}</p>
          </div>
          
          <div class="header-actions">
            <button class="mobile-menu-btn" @click="sidebarCollapsed = !sidebarCollapsed">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="sidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div class="user-menu-container">
              <button class="user-menu-btn" @click="toggleUserMenu">
                <div class="user-avatar">
                  {{ getUserInitials() }}
                </div>
                <span class="user-name-sm">{{ currentUser?.full_name }}</span>
              </button>
              
              <div v-if="userMenuOpen" class="user-menu-dropdown">
                <router-link to="/perfil" class="dropdown-item" @click="userMenuOpen = false">
                  Mi Perfil
                </router-link>
                <button class="dropdown-item logout-btn" @click="logout">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Loading mientras se obtiene el usuario -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>

      <!-- Contenido del Dashboard (solo si hay usuario) -->
      <main v-else class="dashboard-content">
        <!-- Estadísticas principales -->
        <div class="stats-grid">
          <!-- Tarjeta 1 - Diferente según rol -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon" :class="currentUser?.role === 'superadmin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="currentUser?.role === 'superadmin'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
            <div class="stat-body">
              <h3 class="stat-title">
                {{ currentUser?.role === 'superadmin' ? 'Empresas Totales' : 
                   currentUser?.role === 'admin' ? 'Inventarios Empresa' : 'Mis Inventarios' }}
              </h3>
              <p class="stat-value">{{ stats.total_inventories || stats.total_companies || 0 }}</p>
            </div>
          </div>
          
          <!-- Tarjeta 2 - Diferente según rol -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon" :class="currentUser?.role === 'user' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="currentUser?.role === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <div class="stat-body">
              <h3 class="stat-title">
                {{ currentUser?.role === 'superadmin' ? 'Usuarios Totales' : 
                   currentUser?.role === 'admin' ? 'Usuarios Empresa' : 'Productos Totales' }}
              </h3>
              <p class="stat-value">{{ stats.total_users || stats.total_products || 0 }}</p>
            </div>
          </div>
          
          <!-- Tarjeta 3 - Para todos -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon bg-purple-100 text-purple-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="stat-body">
              <h3 class="stat-title">Contados</h3>
              <p class="stat-value">{{ stats.total_counted || 0 }}</p>
            </div>
          </div>
          
          <!-- Tarjeta 4 - Para todos -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon bg-orange-100 text-orange-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-body">
              <h3 class="stat-title">Progreso</h3>
              <p class="stat-value">{{ stats.progress || 0 }}%</p>
            </div>
          </div>
        </div>

        <!-- Sección específica para superadmin -->
        <div v-if="currentUser?.role === 'superadmin'" class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">Resumen del Sistema</h2>
            <div class="section-subtitle">
              Última actualización: {{ formatDateTime(new Date()) }}
            </div>
          </div>
          
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-content">
                <div>
                  <p class="summary-label">Empresas Activas</p>
                  <p class="summary-value">{{ stats.total_companies || 0 }}</p>
                </div>
                <div class="summary-icon text-green-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="summary-content">
                <div>
                  <p class="summary-label">Total de Usuarios</p>
                  <p class="summary-value">{{ stats.total_users || 0 }}</p>
                  <p class="summary-detail">
                    {{ stats.active_users || 0 }} activos
                  </p>
                </div>
                <div class="summary-icon text-blue-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="summary-content">
                <div>
                  <p class="summary-label">Inventarios Totales</p>
                  <p class="summary-value">{{ stats.total_inventories || 0 }}</p>
                  <p class="summary-detail">
                    {{ stats.completed_inventories || 0 }} completados
                  </p>
                </div>
                <div class="summary-icon text-purple-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección específica para admin -->
        <div v-if="currentUser?.role === 'admin'" class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">Resumen de Empresa</h2>
            <div class="section-subtitle">
              Empresa: {{ currentUser?.company_name || 'Sin nombre' }}
            </div>
          </div>
          
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-content">
                <div>
                  <p class="summary-label">Usuarios Empresa</p>
                  <p class="summary-value">{{ stats.total_users || 0 }}</p>
                  <p class="summary-detail">
                    {{ stats.active_users || 0 }} activos
                  </p>
                </div>
                <div class="summary-icon text-blue-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="summary-content">
                <div>
                  <p class="summary-label">Inventarios Empresa</p>
                  <p class="summary-value">{{ stats.total_inventories || 0 }}</p>
                  <p class="summary-detail">
                    {{ stats.completed_inventories || 0 }} completados
                  </p>
                </div>
                <div class="summary-icon text-green-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="summary-content">
                <div>
                  <p class="summary-label">Productos Totales</p>
                  <p class="summary-value">{{ stats.total_products || 0 }}</p>
                  <p class="summary-detail">
                    {{ stats.counted_products || 0 }} contados
                  </p>
                </div>
                <div class="summary-icon text-purple-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventarios recientes -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">
              {{ currentUser?.role === 'user' ? 'Mis Inventarios Asignados' : 'Inventarios Recientes' }}
            </h2>
            <router-link to="/inventarios" class="section-action">
              {{ currentUser?.role === 'user' ? 'Ver mis inventarios' : 'Ver todos' }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
          
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Productos</th>
                  <th>Progreso</th>
                  <th>Creado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="inventory in recentInventories" :key="inventory.id">
                  <td>
                    <div class="inventory-name">{{ inventory.name }}</div>
                    <div class="inventory-desc">{{ inventory.description || 'Sin descripción' }}</div>
                  </td>
                  <td>
                    <div class="product-count">
                      {{ inventory.counted_products || 0 }}/{{ inventory.total_products || 0 }}
                    </div>
                  </td>
                  <td>
                    <div class="progress-container">
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: calculateProgress(inventory) + '%' }"></div>
                      </div>
                      <span class="progress-text">{{ Math.round(calculateProgress(inventory)) }}%</span>
                    </div>
                  </td>
                  <td class="text-gray-600">{{ formatDate(inventory.created_at) }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(inventory.status)" class="status-badge">
                      {{ getStatusText(inventory.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button
                        @click="startCounting(inventory)"
                        class="action-btn text-blue-600 hover:text-blue-800"
                        v-if="inventory.status !== 'completed' && inventory.status !== 'cancelled'"
                      >
                        Contar
                      </button>
                      <button
                        @click="viewInventory(inventory)"
                        class="action-btn text-green-600 hover:text-green-800"
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="recentInventories.length === 0">
                  <td colspan="6" class="no-data">
                    {{ currentUser?.role === 'user' ? 'No tienes inventarios asignados' : 'No hay inventarios recientes' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Acciones rápidas y actividad -->
        <div class="dashboard-grid">
          <!-- Acciones rápidas -->
          <div class="dashboard-card">
            <h3 class="card-title">Acciones Rápidas</h3>
            <div class="quick-actions">
              <button
                v-if="currentUser?.role === 'admin' || currentUser?.role === 'superadmin'"
                @click="$router.push('/inventarios/crear')"
                class="quick-action-btn"
              >
                <div class="quick-action-icon bg-blue-100 text-blue-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div class="quick-action-content">
                  <p class="quick-action-title">Crear Inventario</p>
                  <p class="quick-action-desc">Crea un nuevo inventario</p>
                </div>
                <svg class="quick-action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              
              <button
                v-if="currentUser?.role === 'user' || hasInventories"
                @click="$router.push('/conteos')"
                class="quick-action-btn"
              >
                <div class="quick-action-icon bg-green-100 text-green-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="quick-action-content">
                  <p class="quick-action-title">Iniciar Conteo</p>
                  <p class="quick-action-desc">Continúa con el conteo</p>
                </div>
                <svg class="quick-action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              
              <button
                v-if="currentUser?.role === 'admin' || currentUser?.role === 'superadmin'"
                @click="$router.push('/reportes')"
                class="quick-action-btn"
              >
                <div class="quick-action-icon bg-purple-100 text-purple-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div class="quick-action-content">
                  <p class="quick-action-title">Ver Reportes</p>
                  <p class="quick-action-desc">Reportes detallados</p>
                </div>
                <svg class="quick-action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              
              <button
                v-if="currentUser?.role === 'superadmin'"
                @click="$router.push('/empresas')"
                class="quick-action-btn"
              >
                <div class="quick-action-icon bg-orange-100 text-orange-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div class="quick-action-content">
                  <p class="quick-action-title">Gestionar Empresas</p>
                  <p class="quick-action-desc">Administrar empresas</p>
                </div>
                <svg class="quick-action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Actividad reciente -->
          <div class="dashboard-card">
            <h3 class="card-title">Actividad Reciente</h3>
            <div class="activity-list">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                <div :class="activity.color" class="activity-icon">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="activity.type === 'inventory'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    <path v-if="activity.type === 'counting'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    <path v-if="activity.type === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    <path v-if="activity.type === 'company'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div class="activity-content">
                  <p class="activity-message">{{ activity.message }}</p>
                  <p class="activity-time">{{ activity.time }}</p>
                </div>
              </div>
              <div v-if="recentActivity.length === 0" class="no-activity">
                No hay actividad reciente
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ══════════════════════════════════════════════════════════════════════════════
// USUARIO DESDE LA SESIÓN
// ══════════════════════════════════════════════════════════════════════════════
const currentUser = ref(null)
const loading = ref(true)

// Estados
const sidebarCollapsed = ref(false)
const userMenuOpen = ref(false)
const stats = ref({
  total_inventories: 0,
  total_products: 0,
  total_counted: 0,
  progress: 0,
  total_companies: 0,
  total_users: 0,
  active_users: 0,
  completed_inventories: 0,
  counted_products: 0
})

const recentInventories = ref([])
const recentActivity = ref([])

// Computed
const hasInventories = computed(() => {
  return recentInventories.value.length > 0
})

// Datos de ejemplo según rol
const mockData = {
  superadmin: {
    stats: {
      total_companies: 5,
      total_users: 42,
      total_inventories: 18,
      total_products: 1250,
      total_counted: 850,
      progress: 68,
      active_users: 38,
      completed_inventories: 12
    },
    inventories: [
      { id: 1, name: 'Inventario General', description: 'Inventario completo', created_at: '2025-12-01', total_products: 200, counted_products: 150, status: 'counting' },
      { id: 2, name: 'Almacén Central', description: 'Productos electrónicos', created_at: '2025-11-28', total_products: 350, counted_products: 350, status: 'completed' },
      { id: 3, name: 'Bodega Norte', description: 'Materiales de construcción', created_at: '2025-11-25', total_products: 180, counted_products: 90, status: 'counting' }
    ],
    activity: [
      { id: 1, type: 'company', message: 'Nueva empresa registrada: "TechCorp"', time: 'Hace 2 horas', color: 'bg-purple-100 text-purple-600' },
      { id: 2, type: 'user', message: 'Usuario "Juan Pérez" completó un conteo', time: 'Hace 4 horas', color: 'bg-blue-100 text-blue-600' },
      { id: 3, type: 'inventory', message: 'Inventario "General" actualizado', time: 'Hace 1 día', color: 'bg-green-100 text-green-600' }
    ]
  },
  admin: {
    stats: {
      total_users: 8,
      total_inventories: 6,
      total_products: 420,
      total_counted: 320,
      progress: 76,
      active_users: 7,
      completed_inventories: 4,
      counted_products: 320
    },
    inventories: [
      { id: 1, name: 'Inventario Oficina', description: 'Material de oficina', created_at: '2025-12-01', total_products: 85, counted_products: 85, status: 'completed' },
      { id: 2, name: 'Almacén Principal', description: 'Productos en stock', created_at: '2025-11-29', total_products: 200, counted_products: 150, status: 'counting' },
      { id: 3, name: 'Sala de Servidores', description: 'Equipos tecnológicos', created_at: '2025-11-27', total_products: 45, counted_products: 45, status: 'completed' }
    ],
    activity: [
      { id: 1, type: 'user', message: 'Usuario "María García" inició conteo', time: 'Hace 1 hora', color: 'bg-blue-100 text-blue-600' },
      { id: 2, type: 'inventory', message: 'Inventario "Oficina" completado', time: 'Hace 3 horas', color: 'bg-green-100 text-green-600' },
      { id: 3, type: 'counting', message: '85 productos contados hoy', time: 'Hace 5 horas', color: 'bg-purple-100 text-purple-600' }
    ]
  },
  user: {
    stats: {
      total_inventories: 3,
      total_products: 145,
      total_counted: 98,
      progress: 68,
      completed_inventories: 1
    },
    inventories: [
      { id: 1, name: 'Pasillo A', description: 'Productos de limpieza', created_at: '2025-12-02', total_products: 65, counted_products: 45, status: 'counting' },
      { id: 2, name: 'Estantería B', description: 'Material de oficina', created_at: '2025-11-30', total_products: 50, counted_products: 50, status: 'completed' },
      { id: 3, name: 'Almacén Pequeño', description: 'Productos varios', created_at: '2025-11-28', total_products: 30, counted_products: 3, status: 'created' }
    ],
    activity: [
      { id: 1, type: 'counting', message: 'Contaste 45 productos hoy', time: 'Hace 2 horas', color: 'bg-green-100 text-green-600' },
      { id: 2, type: 'inventory', message: 'Inventario "Pasillo A" asignado', time: 'Ayer', color: 'bg-blue-100 text-blue-600' },
      { id: 3, type: 'counting', message: 'Progreso: 68% completado', time: 'Esta semana', color: 'bg-orange-100 text-orange-600' }
    ]
  }
}

onMounted(async () => {
  // Obtener usuario de la sesión
  await getUserFromSession()
  
  if (currentUser.value) {
    // Cargar datos del dashboard según el rol del usuario
    loadDashboardData()
  } else {
    // Si no hay usuario, redirigir al login
    router.push('/login')
  }
})

// FUNCIÓN PARA OBTENER USUARIO DE LA SESIÓN
async function getUserFromSession() {
  loading.value = true
  
  try {
    // OPCIÓN 1: Desde localStorage (después del login)
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (userData && token) {
      // Si hay datos en localStorage, usarlos
      currentUser.value = JSON.parse(userData)
    } else {
      // OPCIÓN 2: Llamar a la API para obtener usuario actual
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          currentUser.value = userData
          // Guardar en localStorage para próximas veces
          localStorage.setItem('user', JSON.stringify(userData))
        } else {
          throw new Error('No autenticado')
        }
      } catch (apiError) {
        console.log('No se pudo obtener usuario de API:', apiError)
        
        // OPCIÓN 3: Usar datos de ejemplo según el token/rol
        // Esto es solo para desarrollo/testing
        const userRole = getRoleFromToken(token)
        currentUser.value = getMockUserByRole(userRole)
      }
    }
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    // Redirigir al login si no se puede obtener el usuario
    router.push('/login')
  } finally {
    loading.value = false
  }
}

// Funciones auxiliares para desarrollo/testing
function getRoleFromToken(token) {
  if (!token) return 'user'
  
  // En desarrollo, podrías tener tokens como:
  // 'superadmin-token', 'admin-token', 'user-token'
  if (token.includes('superadmin')) return 'superadmin'
  if (token.includes('admin')) return 'admin'
  return 'user'
}

function getMockUserByRole(role) {
  const mockUsers = {
    superadmin: {
      id: 1,
      username: 'superadmin',
      email: 'superadmin@inventory.com',
      full_name: 'Super Administrador',
      role: 'superadmin',
      company_id: null,
      company_name: 'Sistema Central'
    },
    admin: {
      id: 2,
      username: 'admin',
      email: 'admin@tmsoft.com',
      full_name: 'Administrador Tmsoft',
      role: 'admin',
      company_id: 4,
      company_name: 'Tmsoft'
    },
    user: {
      id: 3,
      username: 'usuario1',
      email: 'usuario@tmsoft.com',
      full_name: 'Usuario Normal',
      role: 'user',
      company_id: 4,
      company_name: 'Tmsoft'
    }
  }
  
  return mockUsers[role] || mockUsers.user
}

function loadDashboardData() {
  if (!currentUser.value) return
  
  // Simular carga de datos según rol
  const roleData = mockData[currentUser.value.role] || mockData.user
  
  stats.value = roleData.stats
  recentInventories.value = roleData.inventories
  recentActivity.value = roleData.activity
}

function calculateProgress(inventory) {
  const total = inventory.total_products || 0
  const counted = inventory.counted_products || 0
  if (total === 0) return 0
  return (counted / total) * 100
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatDateTime(date) {
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusText(status) {
  const statusMap = {
    'created': 'Creado',
    'counting': 'En conteo',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return statusMap[status] || status
}

function getStatusBadgeClass(status) {
  const classes = {
    'created': 'status-created',
    'counting': 'status-counting',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return classes[status] || 'status-default'
}

function startCounting(inventory) {
  router.push(`/conteo/${inventory.id}`)
}

function viewInventory(inventory) {
  router.push(`/inventarios/${inventory.id}`)
}

function getUserInitials() {
  if (!currentUser.value?.full_name) return 'U'
  return currentUser.value.full_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getUserRoleName() {
  const roles = {
    'superadmin': 'Super Admin',
    'admin': 'Administrador',
    'user': 'Usuario'
  }
  return roles[currentUser.value?.role] || 'Usuario'
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

function logout() {
  // Limpiar datos de sesión
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // Redirigir al login
  router.push('/login')
}
</script>

<style scoped>
/* Contenedor principal */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Sidebar */
.sidebar {
  width: 256px;
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 50;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.logo-wrapper {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-placeholder {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e40af;
}

.company-info {
  text-align: center;
}

.company-name {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.company-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.25rem 0 0 0;
}

.logo-mini {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  font-size: 1rem;
  font-weight: bold;
  color: #1e40af;
}

.sidebar-toggle {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.5rem;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 1.5rem;
}

.nav-group-title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.75rem;
  padding: 0 0.75rem;
  font-weight: 600;
}

.sidebar.collapsed .nav-group-title {
  display: none;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  font-weight: 600;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  stroke-width: 1.5;
}

.sidebar.collapsed .nav-label {
  display: none;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.125rem 0 0 0;
}

.sidebar.collapsed .user-details {
  display: none;
}

/* Contenido principal */
.main-content {
  flex: 1;
  margin-left: 256px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.main-content.sidebar-collapsed {
  margin-left: 64px;
}

.main-header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  max-width: 100%;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #4b5563;
  background: transparent;
  border: none;
  cursor: pointer;
}

.user-menu-container {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.user-menu-btn:hover {
  background: #f9fafb;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name-sm {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.user-menu-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  width: 12rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  z-index: 50;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.logout-btn {
  color: #dc2626;
  border-top: 1px solid #e5e7eb;
}

/* Loading spinner */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Contenido del dashboard */
.dashboard-content {
  padding: 1.5rem;
  max-width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-body {
  margin-top: 0.5rem;
}

.stat-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
  line-height: 1;
}

/* Secciones */
.dashboard-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.section-action {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.section-action:hover {
  color: #1d4ed8;
}

/* Grid de resumen */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.summary-card {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.summary-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
  line-height: 1;
}

.summary-detail {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.25rem 0 0 0;
}

.summary-icon {
  flex-shrink: 0;
}

/* Tabla */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: #f9fafb;
}

.data-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.inventory-name {
  font-weight: 500;
  color: #111827;
}

.inventory-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.product-count {
  font-weight: 500;
  color: #374151;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 2.5rem;
}

/* Badges de estado */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}

.status-created {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-counting {
  background-color: #fef3c7;
  color: #92400e;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-default {
  background-color: #f3f4f6;
  color: #374151;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.2s;
}

.no-data {
  text-align: center;
  padding: 2rem !important;
  color: #9ca3af;
  font-style: italic;
}

/* Grid de dashboard */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.dashboard-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

/* Acciones rápidas */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
}

.quick-action-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.quick-action-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-action-content {
  flex: 1;
  margin: 0 1rem;
}

.quick-action-title {
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.quick-action-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.quick-action-arrow {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  flex-shrink: 0;
}

/* Actividad */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.activity-item:hover {
  background-color: #f9fafb;
}

.activity-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-message {
  font-size: 0.875rem;
  color: #374151;
  margin: 0 0 0.25rem 0;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.no-activity {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.collapsed {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0 !important;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .header-content {
    padding: 1rem;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .user-name-sm {
    display: none;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-action {
    align-self: flex-end;
  }
}
</style>