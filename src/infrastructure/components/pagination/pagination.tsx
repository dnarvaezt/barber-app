import { Pagination as AntdPagination } from 'antd'
import type { PaginationMeta } from '../../../application/domain/common'
import './pagination.scss'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  showLimitSelector?: boolean
  simple?: boolean
  showTotal?: boolean
  hideOnSinglePage?: boolean
  showLessItems?: boolean
  size?: 'small' | 'default'
  className?: string
}

export const Pagination = ({
  meta,
  onPageChange,
  onLimitChange,
  showLimitSelector = false,
  simple = false,
  showTotal = false,
  hideOnSinglePage = true,
  showLessItems = true,
  size = 'default',
  className = '',
}: PaginationProps) => {
  const { page, limit, total } = meta

  if (total === 0) {
    return null
  }

  return (
    <div className={`pagination ${className}`}>
      <AntdPagination
        size={size}
        responsive
        simple={simple}
        hideOnSinglePage={hideOnSinglePage}
        showLessItems={showLessItems}
        current={page}
        total={total}
        pageSize={limit}
        onChange={nextPage => onPageChange(nextPage)}
        showTotal={
          showTotal
            ? (tot, range) =>
                `Mostrando ${range[0]} a ${range[1]} de ${tot} resultados`
            : undefined
        }
        showSizeChanger={Boolean(showLimitSelector && onLimitChange)}
        onShowSizeChange={(_, pageSize) =>
          onLimitChange && onLimitChange(pageSize)
        }
      />
    </div>
  )
}
