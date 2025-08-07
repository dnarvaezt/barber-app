import { useCallback } from 'react'
import type { Category } from '../../../../application/domain/category'
import { categoryService } from '../../../../application/domain/category/category.provider'
import { useEntityDetail } from '../../../hooks/use-entity-detail.hook'
import { useUtils } from '../../../hooks/use-utils.hook'
import { RouteIds } from '../../../routes'

export const useCategoryDetail = () => {
  const { formatDate } = useUtils()

  // Función para cargar una categoría usando el servicio
  const loadCategory = useCallback(
    async (id: string): Promise<Category | null> => {
      try {
        const response = await categoryService.getCategoryById(id, {
          page: 1,
          limit: 1,
        })
        return response.data[0] || null
      } catch (error) {
        console.error('Error loading category:', error)
        return null
      }
    },
    []
  )

  const config = {
    entityName: 'categoría',
    entityIdParam: 'categoryId',
    editRouteId: RouteIds.CATEGORY_FORM_EDIT,
    listRouteId: RouteIds.CATEGORIES,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadCategory,
    errorMessages: {
      notFound: 'Categoría no encontrada',
      loadError: 'Error al cargar la categoría',
    },
  }

  const entityDetail = useEntityDetail(config)

  return {
    ...entityDetail,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidCategory: entityDetail.isValidEntity,
    category: entityDetail.entity,
    formatDate,
  }
}
