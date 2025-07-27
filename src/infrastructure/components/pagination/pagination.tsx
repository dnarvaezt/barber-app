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
  const { page, limit, total, totalPages, hasNextPage, hasPrevPage } = meta

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage)
    }
  }

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    if (onLimitChange) {
      onLimitChange(newLimit)
    }
  }

  // Generar array de páginas a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si hay pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Mostrar páginas con ellipsis
      if (page <= 3) {
        // Páginas iniciales
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        // Páginas finales
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Páginas intermedias
        pages.push(1)
        pages.push('...')
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (total === 0) {
    return null
  }

  return (
    <div className={`pagination ${className}`}>
      <div className='pagination__info'>
        <span className='pagination__info-text'>
          Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, total)}{' '}
          de {total} resultados
        </span>
      </div>

      <div className='pagination__controls'>
        {/* Selector de límite por página */}
        {showLimitSelector && onLimitChange && (
          <div className='pagination__limit-selector'>
            <label htmlFor='limit-select' className='pagination__limit-label'>
              Por página:
            </label>
            <select
              id='limit-select'
              value={limit}
              onChange={handleLimitChange}
              className='pagination__limit-select'
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}

        {/* Navegación de páginas */}
        <div className='pagination__navigation'>
          {/* Botón anterior */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPrevPage}
            className='pagination__button pagination__button--prev'
            aria-label='Página anterior'
          >
            ← Anterior
          </button>

          {/* Números de página */}
          <div className='pagination__page-numbers'>
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNumber === 'number'
                    ? handlePageChange(pageNumber)
                    : undefined
                }
                disabled={pageNumber === '...'}
                className={`pagination__page-button ${
                  pageNumber === page
                    ? 'pagination__page-button--active'
                    : pageNumber === '...'
                      ? 'pagination__page-button--ellipsis'
                      : ''
                }`}
                aria-label={
                  typeof pageNumber === 'number'
                    ? `Ir a página ${pageNumber}`
                    : undefined
                }
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNextPage}
            className='pagination__button pagination__button--next'
            aria-label='Página siguiente'
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  )
}
