import React from 'react'

export interface RouteItem {
  id: string
  name: string
  title: string
  icon?: React.ReactNode
  path?: string
  inheritPath?: boolean
  internal?: boolean
  component?: React.ComponentType
  children?: RouteItem[]
}

export interface RoutePage {
  path: string
  name: string
  component: React.ComponentType
}
