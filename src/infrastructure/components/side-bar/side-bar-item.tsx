import { Link } from 'react-router-dom'
import { Icon } from '../icons'

import type { RouteItem } from '../../routes'
import type { SideBarState } from './side-bar.hook'

interface SideBarItemProps {
  item: RouteItem
  level?: number
  parentPath?: string
  sideBarState: SideBarState
  onNavigate?: (path: string) => void
}

export const SideBarItem = ({
  item,
  level = 0,
  parentPath = '',
  sideBarState,
  onNavigate,
}: SideBarItemProps) => {
  const {
    isItemActive,
    isExpanded,
    handleItemClick,
    handleExpandClick,
    getFullPath,
  } = sideBarState

  const isActive = isItemActive(item, parentPath)
  const hasChildren = item.children && item.children.length > 0
  const hasPath = !!item.path
  const fullPath = getFullPath(item, parentPath)

  const renderContentItem = () => {
    return (
      <>
        {item.icon && (
          <div
            className={`
                side-bar-item__icon
                ${isActive ? 'side-bar-item__icon--active' : 'side-bar-item__icon--inactive'}
              `}
          >
            {item.icon}
          </div>
        )}
        <span className='side-bar-item__text'>{item.title}</span>
      </>
    )
  }
  const renderContentLink = () => {
    return (
      <Link
        to={fullPath}
        className='side-bar-item__link'
        onClick={e => {
          e.stopPropagation()
          if (onNavigate && fullPath) {
            onNavigate(fullPath)
          }
        }}
      >
        {renderContentItem()}
      </Link>
    )
  }

  const renderContentButton = () => {
    return (
      <button
        onClick={e => handleExpandClick(item, e)}
        className={`side-bar-item__button`}
      >
        {renderContentItem()}
      </button>
    )
  }

  const renderExpandButton = () => {
    return (
      <button
        onClick={e => handleExpandClick(item, e)}
        className={`
              side-bar-item__expand-button
              ${
                isActive
                  ? 'side-bar-item__expand-button--active'
                  : 'side-bar-item__expand-button--inactive'
              }
            `}
        title={isExpanded(item.id) ? 'Contraer' : 'Expandir'}
      >
        <Icon
          name={isExpanded(item.id) ? 'chevron-up' : 'chevron-down'}
          className='transition-transform duration-150'
          size='sm'
        />
      </button>
    )
  }

  const renderSubMenu = () => {
    return (
      <div className='side-bar-item__children'>
        {item.children!.map(child => (
          <SideBarItem
            key={child.id}
            item={child}
            level={level + 1}
            parentPath={fullPath}
            sideBarState={sideBarState}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div
        className={`
          side-bar-item__container
          ${level > 0 ? 'side-bar-item__container--nested' : ''}
          ${isActive ? 'side-bar-item__container--active' : 'side-bar-item__container--inactive'}
        `}
        onClick={e => handleItemClick(item, e)}
      >
        <div className='side-bar-item__content'>
          {hasPath && item.component
            ? renderContentLink()
            : renderContentButton()}
        </div>

        {hasChildren && renderExpandButton()}
      </div>

      {hasChildren && isExpanded(item.id) && renderSubMenu()}
    </div>
  )
}
