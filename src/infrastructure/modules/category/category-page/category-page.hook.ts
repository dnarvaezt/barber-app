import { useCallback } from 'react'
import type { Category } from '../../../../application/domain/category'
import { categoryService } from '../../../../application/domain/category/category.provider'
import type { PaginationParams } from '../../../../application/domain/common'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useURLState } from '../../../hooks/use-url-state.hook'
import { useUtils } from '../../../hooks/use-utils.hook'

// Tipos para los filtros de categorías (por ahora vacío, pero extensible)
type CategoryFilters = Record<never, never>

export const useCategoryPage = () => {
  const { formatDate } = useUtils()

  // Hook para obtener parámetros de URL
  const urlState = useURLState<CategoryFilters>({
    filters: {
      // Futuros filtros pueden agregarse aquí
    },
    pagination: {
      page: { defaultValue: 1 },
      limit: { defaultValue: 10 },
      sortBy: { defaultValue: 'name' },
      sortOrder: { defaultValue: 'asc' },
    },
    search: {
      key: 'search',
      defaultValue: '',
    },
  })

  // Función para cargar categorías con filtros y paginación
  const loadCategoriesWithFilters = useCallback(
    async (
      pagination: PaginationParams,
      filters: Partial<CategoryFilters>,
      search: string
    ) => {
      try {
        // Si hay búsqueda válida (no vacía), usar el método de búsqueda del servicio
        if (search && search.trim().length > 0) {
          const searchResponse = await categoryService.findCategories(
            search.trim(),
            pagination
          )
          return searchResponse
        }

        // Si no hay filtros, obtener todas las categorías con paginación
        const response = await categoryService.getAllCategories(pagination)
        return response
      } catch (error) {
        console.error('Error loading categories:', error)
        return {
          data: [],
          meta: {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }
      }
    },
    []
  )

  // Hook combinado de paginación y URL
  const listState = usePaginatedList<Category, CategoryFilters>({
    loadEntities: loadCategoriesWithFilters,
    urlConfig: {
      filters: {
        // Futuros filtros pueden agregarse aquí
      },
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: 10 },
        sortBy: { defaultValue: 'name' },
        sortOrder: { defaultValue: 'asc' },
      },
      search: {
        key: 'search',
        defaultValue: '',
      },
    },
  })

  // Crear categoría usando el servicio
  const createCategory = useCallback(
    async (categoryData: any) => {
      try {
        const newCategory = await categoryService.createCategory({
          name: categoryData.name,
          createdBy: 'admin_001',
        })

        // Recargar datos después de crear
        listState.refresh()
        return newCategory
      } catch (error) {
        console.error('Error creating category:', error)
        throw error
      }
    },
    [listState]
  )

  // Actualizar categoría usando el servicio
  const updateCategory = useCallback(
    async (categoryData: any) => {
      try {
        const updatedCategory = await categoryService.updateCategory({
          id: categoryData.id,
          name: categoryData.name,
          updatedBy: 'admin_001',
        })

        // Recargar datos después de actualizar
        listState.refresh()
        return updatedCategory
      } catch (error) {
        console.error('Error updating category:', error)
        throw error
      }
    },
    [listState]
  )

  // Eliminar categoría usando el servicio
  const deleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        const success = await categoryService.deleteCategory(categoryId)
        if (success) {
          // Recargar datos después de eliminar
          listState.refresh()
        } else {
          throw new Error('Failed to delete category')
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        throw error
      }
    },
    [listState]
  )

  return {
    // Datos y estado
    categories: listState.data,
    loading: listState.loading,
    error: listState.error,
    meta: listState.meta,
    // Filtros y búsqueda
    searchTerm: listState.search,
    // Métodos de actualización
    handleSearch: listState.updateSearch,
    clearFilters: listState.clearFilters,
    handlePageChange: (page: number) => listState.updatePagination({ page }),
    handleLimitChange: (limit: number) =>
      listState.updatePagination({ limit, page: 1 }),
    // Métodos de ordenamiento
    handleSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => {
      listState.updatePagination({ sortBy, sortOrder, page: 1 })
    },
    // Estado de ordenamiento
    sortBy: urlState.pagination.sortBy || 'name',
    sortOrder: urlState.pagination.sortOrder || 'asc',
    // Métodos CRUD
    createCategory,
    updateCategory,
    deleteCategory,
    // Utilidades
    formatDate,
  }
}
