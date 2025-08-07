import { useCallback } from 'react'
import type { Product } from '../../../../application/domain/product'
import { productService } from '../../../../application/domain/product/product.provider'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useURLState } from '../../../hooks/use-url-state.hook'
import { useUtils } from '../../../hooks/use-utils.hook'

// Tipos para los filtros de productos (por ahora vacío, pero extensible)
type ProductFilters = Record<never, never>

export const useProductPage = () => {
  const { formatDate, formatCurrency } = useUtils()

  // Hook para obtener parámetros de URL
  const urlState = useURLState<ProductFilters>({
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

  // Función para cargar productos con filtros y paginación
  const loadProductsWithFilters = useCallback(
    async (
      pagination: any,
      filters: Partial<ProductFilters>,
      search: string
    ) => {
      try {
        // Si hay búsqueda válida (no vacía), usar el método de búsqueda del servicio
        if (search && search.trim().length > 0) {
          const searchResponse = await productService.findProducts(
            search.trim(),
            pagination
          )
          return searchResponse
        }

        // Si no hay filtros, obtener todos los productos con paginación
        const response = await productService.getAllProducts(pagination)
        return response
      } catch (error) {
        console.error('Error loading products:', error)
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
  const listState = usePaginatedList<Product, ProductFilters>({
    loadEntities: loadProductsWithFilters,
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

  // Crear producto usando el servicio
  const createProduct = useCallback(
    async (productData: any) => {
      try {
        const newProduct = await productService.createProduct({
          name: productData.name,
          description: productData.description,
          category: productData.category,
          costPrice: productData.costPrice,
          salePrice: productData.salePrice,
          categoryId: productData.categoryId,
          createdBy: 'admin_001',
        })

        // Recargar datos después de crear
        listState.refresh()
        return newProduct
      } catch (error) {
        console.error('Error creating product:', error)
        throw error
      }
    },
    [listState]
  )

  // Actualizar producto usando el servicio
  const updateProduct = useCallback(
    async (productData: any) => {
      try {
        const updatedProduct = await productService.updateProduct({
          id: productData.id,
          name: productData.name,
          description: productData.description,
          category: productData.category,
          costPrice: productData.costPrice,
          salePrice: productData.salePrice,
          categoryId: productData.categoryId,
          updatedBy: 'admin_001',
        })

        // Recargar datos después de actualizar
        listState.refresh()
        return updatedProduct
      } catch (error) {
        console.error('Error updating product:', error)
        throw error
      }
    },
    [listState]
  )

  // Eliminar producto usando el servicio
  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        const result = await productService.deleteProduct(id)

        // Recargar datos después de eliminar
        if (result) {
          listState.refresh()
        }

        return result
      } catch (error) {
        console.error('Error deleting product:', error)
        throw error
      }
    },
    [listState]
  )

  return {
    // Estado de la lista
    products: listState.data,
    loading: listState.loading,
    error: listState.error,
    refresh: listState.refresh,

    // Paginación
    pagination: listState.meta,
    hasNextPage: listState.meta.hasNextPage,
    hasPrevPage: listState.meta.hasPrevPage,
    totalPages: listState.meta.totalPages,
    total: listState.meta.total,

    // Búsqueda
    searchTerm: listState.search,
    setSearchTerm: listState.updateSearch,

    // Ordenamiento
    sortBy: urlState.pagination.sortBy,
    sortOrder: urlState.pagination.sortOrder,
    setSortBy: (sortBy: string) => urlState.updatePagination({ sortBy }),
    setSortOrder: (sortOrder: 'asc' | 'desc') =>
      urlState.updatePagination({ sortOrder }),

    // Acciones CRUD
    createProduct,
    updateProduct,
    deleteProduct,

    // Utilidades
    formatDate,
    formatCurrency,
  }
}
