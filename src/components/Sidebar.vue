<template>
  <!-- Mobile Menu Button -->
  <button
    v-if="isMobile"
    class="mobile-menu-button"
    @click="toggleMobile"
  >
    <Menu class="menu-icon" />
  </button>

  <!-- Sidebar -->
  <div
    class="sidebar-container"
    :class="{
      'hidden lg:block': !isMobileOpen,
      'block': isMobileOpen
    }"
    :style="{ width: isExpanded ? '12rem' : '4rem' }"
    @mouseenter="expandOnHover"
    @mouseleave="collapseOnHover"
  >
    <div class="sidebar-inner">
      <!-- Logo Section -->
      <div class="logo-section" @click="redirectTo('dashboard')">
        <div class="logo-wrapper">
          <img 
            :src="logoUrl"
            alt="Logo"
            :class="[
              'logo',
              isExpanded ? 'logo-expanded' : 'logo-collapsed'
            ]"
          />
        </div>
        <div v-if="isExpanded" class="logo-text">
          <h2 class="company-name">Sistema Inventario</h2>
          <p class="company-subtitle">{{ user?.company_name || 'Empresa' }}</p>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="menu-container">
        <nav class="menu-nav">
          <ul class="menu-list">
            <!-- Menu Items para todos los usuarios -->
            <li
              v-for="item in mainMenuItems"
              :key="item.id"
              class="menu-item-wrapper"
            >
              <a
                :class="[
                  'menu-item',
                  !isExpanded && 'menu-item-collapsed',
                  isExpanded && activeMenu === item.route ? 'menu-item-active' : 'menu-item-inactive',
                  !isExpanded && activeMenu === item.route && 'menu-item-collapsed-active'
                ]"
                @click="redirectTo(item.route)"
                @mouseenter="onItemPointerEnter(item.id)"
                @mouseleave="onItemPointerLeave(item.id)"
              >
                <!-- Icono -->
                <component 
                  :is="item.icon" 
                  class="menu-icon-item"
                  :class="[
                    isExpanded && activeMenu === item.route ? 'icon-white' : 'icon-gray',
                    !isExpanded && activeMenu === item.route ? 'icon-white' : 'icon-purple'
                  ]"
                />
                <!-- Texto -->
                <span v-if="isExpanded" class="menu-label">
                  {{ item.name }}
                </span>
                <!-- Tooltip para estado colapsado -->
                <span v-if="!isExpanded" class="menu-tooltip">
                  {{ item.name }}
                </span>
              </a>
            </li>
          </ul>

          <!-- Admin Section (only for superadmin and admin) -->
          <template v-if="userRole === 'superadmin' || userRole === 'admin'">
            <div class="admin-divider"></div>
            <div class="admin-section">
              <div v-if="isExpanded" class="admin-title">
                <Shield class="admin-icon" />
                <span class="admin-label">Administración</span>
              </div>
              <ul class="admin-list">
                <li
                  v-for="item in adminMenuItems"
                  :key="item.id"
                  class="admin-item-wrapper"
                >
                  <a
                    :class="[
                      'admin-item',
                      !isExpanded && 'admin-item-collapsed',
                      isExpanded && activeMenu === item.route ? 'admin-item-active' : 'admin-item-inactive',
                      !isExpanded && activeMenu === item.route && 'admin-item-collapsed-active'
                    ]"
                    @click="redirectTo(item.route)"
                    @mouseenter="onItemPointerEnter(item.id)"
                    @mouseleave="onItemPointerLeave(item.id)"
                  >
                    <!-- Icono -->
                    <component 
                      :is="item.icon" 
                      class="admin-icon-item"
                      :class="[
                        isExpanded && activeMenu === item.route ? 'icon-white' : 'icon-gray',
                        !isExpanded && activeMenu === item.route ? 'icon-white' : 'icon-purple'
                      ]"
                    />
                    <!-- Texto -->
                    <span v-if="isExpanded" class="admin-label-text">
                      {{ item.name }}
                    </span>
                    <!-- Tooltip para estado colapsado -->
                    <span v-if="!isExpanded" class="admin-tooltip">
                      {{ item.name }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </template>
        </nav>
      </div>

      <!-- User Section -->
      <div class="user-section">
        <div
          class="user-info-wrapper"
          @click="toggleUserMenu"
          @mouseenter="showUserMenu = true"
          @mouseleave="startUserMenuHideTimer"
        >
          <div class="user-avatar">
            {{ getUserInitials() }}
          </div>
          <div v-if="isExpanded" class="user-details">
            <span class="user-name">{{ user?.full_name }}</span>
            <span class="user-role">{{ getUserRoleName() }}</span>
          </div>
          <ChevronDown 
            v-if="isExpanded" 
            class="user-chevron"
            :class="{ 'rotate-180': showUserMenu }"
          />
        </div>

        <!-- User Menu Dropdown -->
        <transition name="fade">
          <div
            v-if="showUserMenu"
            class="user-menu-dropdown"
            @mouseenter="clearUserMenuHideTimer"
            @mouseleave="startUserMenuHideTimer"
          >
            <ul class="dropdown-list">
              <li
                class="dropdown-item"
                @click="redirectTo('perfil')"
              >
                <Settings class="dropdown-icon" />
                <span>Configuración</span>
              </li>
              <li
                class="dropdown-item"
                @click="toggleTheme"
              >
                <component :is="theme === 'light' ? Moon : Sun" class="dropdown-icon" />
                <span>{{ theme === 'dark' ? 'Modo claro' : 'Modo oscuro' }}</span>
              </li>
              <li class="dropdown-item dropdown-language">
                <div
                  class="language-header"
                  @click.stop="showLangMenu = !showLangMenu"
                >
                  <Globe class="dropdown-icon" />
                  <span>Idioma</span>
                  <ChevronDown class="language-chevron" :class="{ 'rotate-180': showLangMenu }" />
                </div>

                <transition name="fade">
                  <ul
                    v-if="showLangMenu"
                    class="language-dropdown"
                  >
                    <li
                      v-for="lang in languages"
                      :key="lang.value"
                      class="language-item"
                      @click="changeLang(lang.value)"
                    >
                      {{ lang.text }}
                    </li>
                  </ul>
                </transition>
              </li>
              <li
                class="dropdown-item"
                @click="logOut"
              >
                <LogOut class="dropdown-icon" />
                <span>Cerrar sesión</span>
              </li>
            </ul>
          </div>
        </transition>
        
        <!-- Version -->
        <div v-if="isExpanded" class="version">
          Sistema Inventario v2.1.0
        </div>
      </div>
    </div>

    <!-- Pin/Unpin Button (Desktop) -->
    <button
      v-if="!isMobile"
      class="pin-button"
      :class="{ 'pin-button-expanded': isExpanded }"
      @click="togglePin"
      :title="isPin ? 'Desbloquear sidebar' : 'Bloquear sidebar'"
    >
      <component :is="isPin ? Lock : Unlock" class="pin-icon" />
    </button>

    <!-- Close Button (Mobile) -->
    <button
      v-if="isMobile"
      class="close-button"
      :class="{ 'close-button-expanded': isExpanded }"
      @click="toggleMobile"
    >
      <X class="close-icon" />
    </button>
  </div>

  <!-- Overlay para móvil -->
  <div 
    v-if="isMobile && isMobileOpen" 
    class="mobile-overlay"
    @click="toggleMobile"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  // Iconos generales
  Menu,
  X,
  ChevronDown,
  Settings,
  Moon,
  Sun,
  Globe,
  LogOut,
  Lock,
  Unlock,
  Shield,
  
  // Iconos de menú
  LayoutDashboard,
  Package,
  ShoppingCart,
  Scan,
  BarChart3,
  Users,
  Building2,
  FileSearch
} from 'lucide-vue-next'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()

// Refs reactivos
const isExpanded = ref(false)
const isPin = ref(false)
const isMobileOpen = ref(false)
const isMobile = ref(false)
const showUserMenu = ref(false)
const showLangMenu = ref(false)
const activeMenu = ref(null)
const hideUserMenuTimer = ref(null)
const hoveredItem = ref(null)

// Computed properties
const userRole = computed(() => props.user?.role || 'user')

// Logo URL
const logoUrl = ref('/logo.png')

// Menu principal basado en rol
const mainMenuItems = computed(() => {
  const items = []
  
  // Dashboard es común para todos
  items.push(
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, route: 'dashboard' }
  )
  
  switch (userRole.value) {
    case 'superadmin':
      items.push(
        { id: 'reportes', name: 'Reportes', icon: BarChart3, route: 'reportes' },
        { id: 'empresas', name: 'Empresas', icon: Building2, route: 'empresas' },
        { id: 'auditoria', name: 'Auditoría', icon: FileSearch, route: 'auditoria' }
      )
      break
      
    case 'admin':
      items.push(
        { id: 'inventarios', name: 'Inventarios', icon: Package, route: 'inventarios' },
        { id: 'ventas', name: 'Ventas', icon: ShoppingCart, route: 'ventas' },
        { id: 'conteos', name: 'Conteos', icon: Scan, route: 'conteos' },
        { id: 'reportes', name: 'Reportes', icon: BarChart3, route: 'reportes' }
      )
      break
      
    case 'user':
      items.push(
        { id: 'inventarios', name: 'Inventarios', icon: Package, route: 'inventarios' },
        { id: 'ventas', name: 'Ventas', icon: ShoppingCart, route: 'ventas' },
        { id: 'conteos', name: 'Conteos', icon: Scan, route: 'conteos' }
      )
      break
  }
  
  return items
})

// Menu de administración basado en rol
const adminMenuItems = computed(() => {
  const items = []
  
  switch (userRole.value) {
    case 'superadmin':
      // Superadmin ya tiene todo en el menú principal
      return []
      
    case 'admin':
      items.push(
        { id: 'usuarios', name: 'Usuarios', icon: Users, route: 'usuarios' }
      )
      break
  }
  
  return items
})

// Languages
const languages = [
  { value: 'es', text: 'Español' },
  { value: 'en', text: 'English' }
]

// Theme
const theme = ref('dark')

// Methods
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const expandOnHover = () => {
  if (!isExpanded.value && !isPin.value && !isMobile.value) {
    isExpanded.value = true
  }
}

const collapseOnHover = () => {
  if (isExpanded.value && !isPin.value && !isMobile.value) {
    isExpanded.value = false
  }
}

const toggleMobile = () => {
  isMobileOpen.value = !isMobileOpen.value
  isPin.value = true
  isExpanded.value = true
}

const togglePin = () => {
  isPin.value = !isPin.value
}

const changeLang = (lang) => {
  localStorage.setItem('user-language', lang)
  showLangMenu.value = false
  showUserMenu.value = false
  // Recargar para aplicar cambios
  location.reload()
}

const redirectTo = (routeName) => {
  activeMenu.value = routeName
  router.push({ name: routeName })
  
  if (isMobile.value) {
    isMobileOpen.value = false
  }
}

const onItemPointerEnter = (id) => {
  hoveredItem.value = id
}

const onItemPointerLeave = (id) => {
  hoveredItem.value = null
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
  // Aquí podrías emitir un evento para cambiar el tema globalmente
}

const clearUserMenuHideTimer = () => {
  if (hideUserMenuTimer.value) {
    clearTimeout(hideUserMenuTimer.value)
    hideUserMenuTimer.value = null
  }
}

const startUserMenuHideTimer = () => {
  clearUserMenuHideTimer()
  hideUserMenuTimer.value = setTimeout(() => {
    showUserMenu.value = false
    hideUserMenuTimer.value = null
  }, 200)
}

const logOut = () => {
  // Lógica de logout
  router.push('/login')
}

const getUserInitials = () => {
  if (!props.user?.full_name) return 'U'
  return props.user.full_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getUserRoleName = () => {
  const roles = {
    'superadmin': 'Super Admin',
    'admin': 'Administrador',
    'user': 'Usuario'
  }
  return roles[props.user?.role] || 'Usuario'
}

// Detectar tamaño de pantalla
const checkScreenSize = () => {
  const width = window.innerWidth
  isMobile.value = width < 1024
  
  if (isMobile.value) {
    isExpanded.value = false
    isPin.value = false
    isMobileOpen.value = false
  } else {
    isExpanded.value = true
    isPin.value = true
    isMobileOpen.value = false
  }
}

// Cerrar sidebar en móvil al navegar
watch(() => route.path, () => {
  if (isMobile.value && isMobileOpen.value) {
    isMobileOpen.value = false
  }
})

// Set active menu based on current route
watch(() => route.name, (newRoute) => {
  activeMenu.value = newRoute
})

// Lifecycle hooks
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  activeMenu.value = route.name
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  if (hideUserMenuTimer.value) clearTimeout(hideUserMenuTimer.value)
})
</script>

<style scoped>
/* Estilos base */
* {
  box-sizing: border-box;
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  background: linear-gradient(135deg, #704699 0%, #8557FB 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(112, 70, 153, 0.3);
  transition: all 0.3s ease;
}

.mobile-menu-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(112, 70, 153, 0.4);
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Sidebar Container */
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 40;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  background: linear-gradient(180deg, 
    #0f172a 0%, 
    #1e293b 40%, 
    #334155 100%);
}

@media (max-width: 1023px) {
  .mobile-menu-button {
    display: block;
  }
  
  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 60;
    box-shadow: 16px 0 48px rgba(0, 0, 0, 0.4);
  }
  
  .sidebar-container.hidden {
    display: none;
  }
  
  .sidebar-container.block {
    display: block;
    animation: slideInMobile 0.3s ease;
  }
  
  @keyframes slideInMobile {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
}

/* Sidebar Inner */
.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, 
    #0f172a 0%, 
    #1e293b 40%, 
    #334155 100%);
}

/* Logo Section */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-wrapper {
  width: 3rem;
  height: 3rem;
  background: white;
  border-radius: 1rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.logo-section:hover .logo-wrapper {
  transform: scale(1.05);
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-expanded {
  width: 4rem;
  height: 4rem;
}

.logo-collapsed {
  width: 2.5rem;
  height: 2.5rem;
}

.logo-text {
  margin-top: 1rem;
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
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
  color: rgba(255, 255, 255, 0.7);
  margin: 0.25rem 0 0 0;
}

/* Menu Container */
.menu-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

/* Menu Items */
.menu-item-wrapper {
  margin: 0.25rem 0.75rem;
}

.menu-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
  color: white;
}

.menu-item-collapsed {
  justify-content: center;
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0.5rem;
  background: white;
}

.menu-item-inactive {
  background: transparent;
}

.menu-item-active {
  background: #8557FB;
}

.menu-item-collapsed-active {
  background: #8557FB;
}

.menu-item:hover {
  background: rgba(133, 87, 251, 0.2);
}

.menu-item-active:hover {
  background: #8557FB;
}

.menu-icon-item {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.menu-item:hover .menu-icon-item {
  transform: scale(1.1);
}

.menu-label {
  margin-left: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.menu-tooltip {
  position: absolute;
  left: calc(100% + 0.75rem);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.95);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.menu-tooltip::before {
  content: '';
  position: absolute;
  left: -0.375rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 0.375rem solid transparent;
  border-bottom: 0.375rem solid transparent;
  border-right: 0.375rem solid rgba(15, 23, 42, 0.95);
}

.menu-item-collapsed:hover .menu-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0.25rem);
}

/* Admin Section */
.admin-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 1rem 0.75rem;
}

.admin-section {
  margin-top: auto;
}

.admin-title {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.admin-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 2;
}

.admin-label {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admin-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-item-wrapper {
  margin: 0.25rem 0.75rem;
}

.admin-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
  color: white;
}

.admin-item-collapsed {
  justify-content: center;
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0.5rem;
  background: white;
}

.admin-item-inactive {
  background: transparent;
}

.admin-item-active {
  background: #8557FB;
}

.admin-item-collapsed-active {
  background: #8557FB;
}

.admin-item:hover {
  background: rgba(133, 87, 251, 0.2);
}

.admin-item-active:hover {
  background: #8557FB;
}

.admin-icon-item {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.admin-item:hover .admin-icon-item {
  transform: scale(1.1);
}

.admin-label-text {
  margin-left: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.admin-tooltip {
  position: absolute;
  left: calc(100% + 0.75rem);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.95);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.admin-tooltip::before {
  content: '';
  position: absolute;
  left: -0.375rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 0.375rem solid transparent;
  border-bottom: 0.375rem solid transparent;
  border-right: 0.375rem solid rgba(15, 23, 42, 0.95);
}

.admin-item-collapsed:hover .admin-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0.25rem);
}

/* User Section */
.user-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  position: relative;
}

.user-info-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.user-info-wrapper:hover {
  background: rgba(133, 87, 251, 0.2);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: #704699;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8rem;
}

.user-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: capitalize;
}

.user-chevron {
  width: 1rem;
  height: 1rem;
  margin-left: auto;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* User Menu Dropdown */
.user-menu-dropdown {
  position: absolute;
  bottom: 5rem;
  left: 1rem;
  right: 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
}

.dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1e293b;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 2;
  color: #64748b;
  flex-shrink: 0;
}

.dropdown-language {
  position: relative;
}

.language-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  cursor: pointer;
}

.language-chevron {
  width: 1rem;
  height: 1rem;
  margin-left: auto;
  color: #64748b;
  transition: transform 0.3s ease;
}

.language-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
}

.language-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1e293b;
  font-size: 0.875rem;
}

.language-item:hover {
  background: #f1f5f9;
}

/* Version */
.version {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 1rem;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

/* Pin/Close Buttons */
.pin-button,
.close-button {
  position: absolute;
  top: 1rem;
  right: -0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.pin-button:hover,
.close-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.pin-button-expanded {
  right: -0.75rem;
}

.close-button-expanded {
  right: -0.75rem;
}

.pin-icon,
.close-icon {
  width: 1rem;
  height: 1rem;
  color: #704699;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 55;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

/* Icon Color Classes */
.icon-white {
  color: white !important;
  stroke: white !important;
}

.icon-purple {
  color: #704699 !important;
  stroke: #704699 !important;
}

.icon-gray {
  color: #cbd5e1 !important;
  stroke: #cbd5e1 !important;
}

/* Scrollbar */
.menu-container::-webkit-scrollbar {
  width: 4px;
}

.menu-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.menu-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Transition Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 1023px) {
  .pin-button {
    display: none;
  }
  
  .close-button {
    display: block;
  }
  
  .logo-expanded {
    width: 3rem;
    height: 3rem;
  }
}

@media (min-width: 1024px) {
  .pin-button {
    display: flex;
  }
  
  .close-button {
    display: none;
  }
  
  .mobile-overlay {
    display: none;
  }
}
</style>