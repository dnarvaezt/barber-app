import { useCallback } from 'react'
import type { IEntity } from '../../../application/core/domain/entity.interface'
import type { EntityHookState } from '../../hooks/use-entity.hook'
import { Pagination } from '../pagination'
import { SortControls } from '../sort-controls'

// ============================================================================
// ENTITY LIST PROPS - Props para el componente de lista de entidades
// ============================================================================

export interface EntityListProps<
  T extends IEntity,
  F extends Record<string, any> = Record<string, any>,
> {
  // Estado del hook de entidad
  entityState: EntityHookState<T, F>

  // Configuración de la entidad
  entityConfig: {
    entityType: string
    displayName: string
    displayNamePlural: string
    searchableFields: string[]
    sortableFields: Array<{
      key: string
      label: string
    }>
  }

  // Renderizado de elementos
  renderEntity: (entity: T, index: number) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderLoading?: () => React.ReactNode
  renderError?: (error: string) => React.ReactNode

  // Acciones
  onEntityCreate?: () => void

  // Configuración de UI
  showSearch?: boolean
  showSort?: boolean
  showPagination?: boolean
  showActions?: boolean

  // Clases CSS
  className?: string
  listClassName?: string
  itemClassName?: string
}

// ============================================================================
// ENTITY LIST COMPONENT - Componente genérico para listar entidades
// ============================================================================

export const EntityList = <
  T extends IEntity,
  F extends Record<string, any> = Record<string, any>,
>({
  entityState,
  entityConfig,
  renderEntity,
  renderEmpty,
  renderLoading,
  renderError,
  onEntityCreate,
  showSearch = true,
  showSort = true,
  showPagination = true,
  showActions = true,
  className = '',
  listClassName = '',
  itemClassName = '',
}: EntityListProps<T, F>) => {
  const {
    data,
    loading,
    error,
    meta,
    search,
    updateSearch,
    updatePagination,
    clearFilters,
    clearAll,
    refresh,
    creating,
    operationError,
  } = entityState

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      updateSearch(newSearch)
    },
    [updateSearch]
  )

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: 'asc' | 'desc') => {
      updatePagination({ sortBy, sortOrder })
    },
    [updatePagination]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updatePagination({ page })
    },
    [updatePagination]
  )

  const handleLimitChange = useCallback(
    (limit: number) => {
      updatePagination({ limit, page: 1 })
    },
    [updatePagination]
  )

  const handleRefresh = useCallback(() => {
    refresh()
  }, [refresh])

  const handleClearFilters = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  const handleClearAll = useCallback(() => {
    clearAll()
  }, [clearAll])

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSearchBar = () => {
    if (!showSearch) return null

    return (
      <div className='mb-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder={`Buscar ${entityConfig.displayNamePlural.toLowerCase()}...`}
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              ✕
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderSortControls = () => {
    if (!showSort) return null

    return (
      <div className='mb-4'>
        <SortControls onSortChange={handleSortChange} />
      </div>
    )
  }

  const renderActions = () => {
    if (!showActions) return null

    return (
      <div className='mb-4 flex gap-2'>
        {onEntityCreate && (
          <button
            onClick={onEntityCreate}
            disabled={creating}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
          >
            {creating ? 'Creando...' : `Crear ${entityConfig.displayName}`}
          </button>
        )}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50'
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
        <button
          onClick={handleClearFilters}
          className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
        >
          Limpiar Filtros
        </button>
        <button
          onClick={handleClearAll}
          className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
        >
          Limpiar Todo
        </button>
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return renderLoading ? (
        renderLoading()
      ) : (
        <div className='flex justify-center items-center py-8'>
          <div className='text-lg'>
            Cargando {entityConfig.displayNamePlural.toLowerCase()}...
          </div>
        </div>
      )
    }

    if (error) {
      return renderError ? (
        renderError(error)
      ) : (
        <div className='text-red-600 text-center py-8'>Error: {error}</div>
      )
    }

    if (data.length === 0) {
      return renderEmpty ? (
        renderEmpty()
      ) : (
        <div className='text-center py-8 text-gray-500'>
          No se encontraron {entityConfig.displayNamePlural.toLowerCase()}
        </div>
      )
    }

    return (
      <div className={listClassName}>
        {data.map((entity, index) => (
          <div key={entity.id} className={itemClassName}>
            {renderEntity(entity, index)}
          </div>
        ))}
      </div>
    )
  }

  const renderPagination = () => {
    if (!showPagination || data.length === 0) return null

    return (
      <div className='mt-4'>
        <Pagination
          meta={meta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    )
  }

  const renderOperationError = () => {
    if (!operationError) return null

    return (
      <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
        {operationError}
      </div>
    )
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className={`entity-list ${className}`}>
      {/* Barra de búsqueda */}
      {renderSearchBar()}

      {/* Controles de ordenamiento */}
      {renderSortControls()}

      {/* Acciones */}
      {renderActions()}

      {/* Error de operación */}
      {renderOperationError()}

      {/* Contenido principal */}
      {renderContent()}

      {/* Paginación */}
      {renderPagination()}
    </div>
  )
}
