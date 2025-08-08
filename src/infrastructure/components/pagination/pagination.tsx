import { Pagination as AntdPagination, Select, Space, Typography } from 'antd'
import type { PaginationMeta } from '../../../application/domain/common'
import './pagination.scss'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  showLimitSelector?: boolean
  className?: string
}

export const Pagination = ({
  meta,
  onPageChange,
  onLimitChange,
  showLimitSelector = false,
  className = '',
}: PaginationProps) => {
  const { page, limit, total } = meta

  if (total === 0) {
    return null
  }

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className={`pagination ${className}`}>
      <Space
        direction='vertical'
        style={{ width: '100%' }}
        size='middle'
        className='pagination__controls'
      >
        <Typography.Text className='pagination__info-text'>
          Mostrando {from} a {to} de {total} resultados
        </Typography.Text>

        <Space wrap align='center' className='pagination__navigation'>
          {showLimitSelector && onLimitChange && (
            <Space size='small' className='pagination__limit-selector'>
              <Typography.Text className='pagination__limit-label'>
                Por página:
              </Typography.Text>
              <Select
                size='small'
                value={limit}
                onChange={value => onLimitChange(value)}
                options={[10, 25, 50, 100].map(v => ({ value: v, label: v }))}
                className='pagination__limit-select'
              />
            </Space>
          )}

          <AntdPagination
            size='small'
            responsive
            current={page}
            total={total}
            pageSize={limit}
            showSizeChanger={false}
            onChange={nextPage => onPageChange(nextPage)}
          />
        </Space>
      </Space>
    </div>
  )
}
