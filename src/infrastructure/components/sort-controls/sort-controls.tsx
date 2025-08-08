import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { Button, Space, Typography } from 'antd'
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
    if (currentSortBy !== field) return null
    return currentSortOrder === 'asc' ? (
      <SortAscendingOutlined />
    ) : (
      <SortDescendingOutlined />
    )
  }

  return (
    <div className={`sort-controls ${className}`}>
      <Space
        direction='vertical'
        size='small'
        className='sort-controls__container'
      >
        <Typography.Text className='sort-controls__label'>
          Ordenar por:
        </Typography.Text>
        <Space wrap className='sort-controls__buttons'>
          <Button
            size='small'
            type={currentSortBy === 'name' ? 'primary' : 'default'}
            onClick={() => handleSortChange('name')}
            title='Ordenar por nombre'
          >
            Nombre {getSortIcon('name')}
          </Button>
          <Button
            size='small'
            type={currentSortBy === 'phoneNumber' ? 'primary' : 'default'}
            onClick={() => handleSortChange('phoneNumber')}
            title='Ordenar por teléfono'
          >
            Teléfono {getSortIcon('phoneNumber')}
          </Button>
        </Space>
        <div className='sort-controls__status'>
          <Typography.Text
            type='secondary'
            className='sort-controls__status-text'
          >
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
          </Typography.Text>
        </div>
      </Space>
    </div>
  )
}
