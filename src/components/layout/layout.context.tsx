import { createContext } from 'react'

import type { ReactNode } from 'react'
import type { RouteItem } from '../../routes'

export interface LayoutState {
  headerTitle: string
  headerSubtitle?: string
  headerVisible: boolean
  headerActions?: ReactNode
  sidebarOpen: boolean
  sidebarItems: RouteItem[]
  sidebarVisible: boolean
  overlayVisible: boolean
  overlayContent?: ReactNode
}

export interface LayoutContextType extends LayoutState {
  setHeaderTitle: (title: string) => void
  setHeaderSubtitle: (subtitle: string) => void
  setHeaderActions: (actions: ReactNode) => void
  setHeaderVisible: (visible: boolean) => void
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
  setSidebarItems: (items: RouteItem[]) => void
  setSidebarVisible: (visible: boolean) => void
  setOverlayVisible: (visible: boolean, content?: ReactNode) => void
  hideOverlay: () => void
  resetLayout: () => void
}

export const LayoutContext = createContext<LayoutContextType | undefined>(
  undefined
)
