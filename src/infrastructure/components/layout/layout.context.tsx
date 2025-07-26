import { createContext } from 'react'

import type { ReactNode } from 'react'
import type { RouteItem } from '../../routes'

// Header related state
export interface HeaderState {
  title: string
  subtitle?: string
  visible: boolean
  actions?: ReactNode
}

// Sidebar related state
export interface SidebarState {
  open: boolean
  items: RouteItem[]
  sidebarVisible: boolean
}

// Main layout state combining all sections
export interface LayoutState {
  header: HeaderState
  sidebar: SidebarState
}

// Header related methods
export interface HeaderMethods {
  setHeaderTitle: (title: string) => void
  setHeaderSubtitle: (subtitle: string) => void
  setHeaderActions: (actions: ReactNode) => void
  setHeaderVisible: (visible: boolean) => void
}

// Sidebar related methods
export interface SidebarMethods {
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
  setSidebarItems: (items: RouteItem[]) => void
  setSidebarVisible: (visible: boolean) => void
}

// Layout general methods
export interface LayoutMethods {
  resetLayout: () => void
}

// Complete context type inheriting directly from state interfaces
export interface LayoutContextType
  extends HeaderState,
    SidebarState,
    HeaderMethods,
    SidebarMethods,
    LayoutMethods {}

export const LayoutContext = createContext<LayoutContextType | undefined>(
  undefined
)
