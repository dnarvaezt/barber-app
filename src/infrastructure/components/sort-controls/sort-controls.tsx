import { useCallback } from 'react'
import './sort-controls.scss'

export interface SortControlsProps {
  currentSortBy?: string
  currentSortOrder?: 'asc' | 'desc'
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  className?: string
}

export const SortControls = ({
  currentSortBy = 'name',
  currentSortOrder = 'asc',
  onSortChange,
  className = '',
}: SortControlsProps) => {
  const handleSortChange = useCallback(
    (sortBy: string) => {
      const newSortOrder =
        currentSortBy === sortBy && currentSortOrder === 'asc' ? 'desc' : 'asc'
      onSortChange(sortBy, newSortOrder)
    },
    [currentSortBy, currentSortOrder, onSortChange]
  )

  const getSortIcon = (field: string) => {
    if (currentSortBy !== field) {
      return '↕️'
    }
    return currentSortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <div className={`sort-controls ${className}`}>
      <div className='sort-controls__container'>
        <span className='sort-controls__label'>Ordenar por:</span>
        <div className='sort-controls__buttons'>
          <button
            onClick={() => handleSortChange('name')}
            className={`sort-controls__button ${
              currentSortBy === 'name' ? 'sort-controls__button--active' : ''
            }`}
            title='Ordenar por nombre'
          >
            Nombre {getSortIcon('name')}
          </button>
          <button
            onClick={() => handleSortChange('phoneNumber')}
            className={`sort-controls__button ${
              currentSortBy === 'phoneNumber'
                ? 'sort-controls__button--active'
                : ''
            }`}
            title='Ordenar por teléfono'
          >
            Teléfono {getSortIcon('phoneNumber')}
          </button>
        </div>
        <div className='sort-controls__status'>
          <small className='sort-controls__status-text'>
            Estado:{' '}
            {currentSortBy === 'name'
              ? currentSortOrder === 'asc'
                ? 'A-Z'
                : 'Z-A'
              : currentSortBy === 'phoneNumber'
                ? currentSortOrder === 'asc'
                  ? '0-9'
                  : '9-0'
                : 'No ordenado'}
          </small>
        </div>
      </div>
    </div>
  )
}
