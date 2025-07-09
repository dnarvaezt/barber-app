import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from './icons'
import { useLayout } from './layout/useLayout'

import type { ReactNode } from 'react'
export interface SidebarItem {
  id: string
  title: string
  path?: string
  icon?: ReactNode
  children?: SidebarItem[]
}

export const Sidebar = () => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const version = __APP_VERSION__

  const { sidebarItems, sidebarOpen, sidebarVisible, closeSidebar } =
    useLayout()

  if (!sidebarVisible) {
    return null
  }

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const handleItemClick = (item: SidebarItem) => {
    if (item.path && window.innerWidth < 1024) closeSidebar()
  }

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id)
    const isActive = item.path && location.pathname === item.path
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id}>
        <div
          className={`
            flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-all duration-200 cursor-pointer
            ${level > 0 ? 'ml-6' : ''}
            ${
              isActive
                ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.id)
            }
            handleItemClick(item)
          }}
        >
          <div className='flex items-center space-x-3'>
            {item.icon && (
              <div className='flex-shrink-0 w-5 h-5'>{item.icon}</div>
            )}
            {item.path ? (
              <Link
                to={item.path}
                className='flex-1'
                onClick={e => e.stopPropagation()}
              >
                {item.title}
              </Link>
            ) : (
              <span className='flex-1'>{item.title}</span>
            )}
          </div>
          {hasChildren && (
            <Icon
              name='chevronRight'
              className={`transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}
              size='sm'
            />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className='mt-1'>
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 w-64 h-screen bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-40
      `}
    >
      <div className='h-full flex flex-col'>
        <div className='p-4 border-b border-gray-200 flex-shrink-0 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>Filter Docs</h2>
          <button
            onClick={closeSidebar}
            className='lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          >
            <Icon name='times' size='lg' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto py-4'>
          <nav className='space-y-1'>
            {sidebarItems.map(item => renderItem(item))}
          </nav>
        </div>

        <div className='p-4 border-t border-gray-200 flex-shrink-0'>
          <div className='text-xs text-gray-500 text-center'>
            Versión: {version}
          </div>
        </div>
      </div>
    </aside>
  )
}
