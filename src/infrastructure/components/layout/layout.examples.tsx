import type { ReactNode } from 'react'
import type { RouteItem } from '../../routes'
import {
  AdminLayoutProvider,
  LayoutProvider,
  MinimalLayoutProvider,
  MobileLayoutProvider,
  useHeader,
  useLayout,
  useLayoutReset,
  useSidebar,
} from './index'

// ============================================================================
// EJEMPLOS DE USO - Sistema de Layout Refactorizado
// ============================================================================

// Ejemplo 1: Layout básico con provider por defecto
export const BasicLayoutExample = ({ children }: { children: ReactNode }) => {
  const sidebarItems: RouteItem[] = [
    {
      id: 'dashboard',
      name: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
    },
    { id: 'clients', name: 'clients', title: 'Clientes', path: '/clients' },
    {
      id: 'appointments',
      name: 'appointments',
      title: 'Citas',
      path: '/appointments',
    },
  ]

  return (
    <LayoutProvider initialSidebarItems={sidebarItems}>
      {children}
    </LayoutProvider>
  )
}

// Ejemplo 2: Layout minimal (sin sidebar)
export const MinimalLayoutExample = ({ children }: { children: ReactNode }) => {
  return <MinimalLayoutProvider>{children}</MinimalLayoutProvider>
}

// Ejemplo 3: Layout móvil (sidebar cerrado por defecto)
export const MobileLayoutExample = ({ children }: { children: ReactNode }) => {
  const sidebarItems: RouteItem[] = [
    {
      id: 'dashboard',
      name: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
    },
    { id: 'clients', name: 'clients', title: 'Clientes', path: '/clients' },
  ]

  return (
    <MobileLayoutProvider sidebarItems={sidebarItems}>
      {children}
    </MobileLayoutProvider>
  )
}

// Ejemplo 4: Layout admin (solo rutas admin)
export const AdminLayoutExample = ({ children }: { children: ReactNode }) => {
  const adminItems: RouteItem[] = [
    {
      id: 'admin-users',
      name: 'admin-users',
      title: 'Usuarios',
      path: '/admin/users',
    },
    {
      id: 'admin-settings',
      name: 'admin-settings',
      title: 'Configuración',
      path: '/admin/settings',
    },
  ]

  return (
    <AdminLayoutProvider sidebarItems={adminItems}>
      {children}
    </AdminLayoutProvider>
  )
}

// ============================================================================
// EJEMPLOS DE HOOKS - Uso de hooks especializados
// ============================================================================

// Ejemplo 5: Componente que usa hooks especializados
export const HeaderController = () => {
  const { state: header, commands } = useHeader()
  const { commands: sidebarCommands } = useSidebar()
  const resetLayout = useLayoutReset()

  const handleSetTitle = () => {
    commands.setTitle('Nuevo Título')
  }

  const handleToggleSidebar = () => {
    sidebarCommands.toggle()
  }

  const handleReset = () => {
    resetLayout()
  }

  return (
    <div>
      <h2>Header Controller</h2>
      <p>Título actual: {header.title}</p>
      <p>Visible: {header.visible ? 'Sí' : 'No'}</p>

      <button onClick={handleSetTitle}>Cambiar Título</button>

      <button onClick={handleToggleSidebar}>Toggle Sidebar</button>

      <button onClick={handleReset}>Reset Layout</button>
    </div>
  )
}

// Ejemplo 6: Componente que observa cambios del layout
export const LayoutObserver = () => {
  const layout = useLayout()
  const { addObserver, removeObserver } = layout

  const observer = {
    onHeaderChange: (headerState: any) => {
      console.log('Header cambió:', headerState)
    },
    onSidebarChange: (sidebarState: any) => {
      console.log('Sidebar cambió:', sidebarState)
    },
    onLayoutChange: (layoutState: any) => {
      console.log('Layout completo cambió:', layoutState)
    },
  }

  // Suscribirse a cambios
  const handleSubscribe = () => {
    addObserver(observer)
  }

  // Desuscribirse de cambios
  const handleUnsubscribe = () => {
    removeObserver(observer)
  }

  return (
    <div>
      <h2>Layout Observer</h2>
      <button onClick={handleSubscribe}>Suscribirse a cambios</button>
      <button onClick={handleUnsubscribe}>Desuscribirse</button>
    </div>
  )
}

// ============================================================================
// EJEMPLO COMPLETO - Integración completa
// ============================================================================

export const CompleteLayoutExample = () => {
  const sidebarItems: RouteItem[] = [
    {
      id: 'dashboard',
      name: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
    },
    { id: 'clients', name: 'clients', title: 'Clientes', path: '/clients' },
    {
      id: 'appointments',
      name: 'appointments',
      title: 'Citas',
      path: '/appointments',
    },
    {
      id: 'reports',
      name: 'reports',
      title: 'Reportes',
      path: '/reports',
      hideSidebar: true,
    },
  ]

  return (
    <LayoutProvider
      initialSidebarItems={sidebarItems}
      initialState={{
        header: {
          title: 'Barber App - Dashboard',
          subtitle: 'Gestiona tu negocio',
          visible: true,
        },
        sidebar: {
          open: true,
          visible: true,
          items: [],
        },
      }}
    >
      <div>
        <HeaderController />
        <LayoutObserver />
        <p>Contenido principal de la aplicación</p>
      </div>
    </LayoutProvider>
  )
}
