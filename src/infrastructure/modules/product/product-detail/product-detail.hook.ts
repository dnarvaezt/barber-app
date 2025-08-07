import { useCallback } from 'react'
import type { Product } from '../../../../application/domain/product'
import { productService } from '../../../../application/domain/product/product.provider'
import { useEntityDetail } from '../../../hooks/use-entity-detail.hook'
import { useUtils } from '../../../hooks/use-utils.hook'
import { RouteIds } from '../../../routes'

export const useProductDetail = () => {
  const { formatDate, formatCurrency } = useUtils()

  // Función para cargar un producto usando el servicio
  const loadProduct = useCallback(
    async (id: string): Promise<Product | null> => {
      try {
        const response = await productService.getProductById(id, {
          page: 1,
          limit: 1,
        })
        return response.data[0] || null
      } catch (error) {
        console.error('Error loading product:', error)
        return null
      }
    },
    []
  )

  const config = {
    entityName: 'producto',
    entityIdParam: 'productId',
    editRouteId: RouteIds.PRODUCT_FORM_EDIT,
    listRouteId: RouteIds.PRODUCTS,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadProduct,
    errorMessages: {
      notFound: 'Producto no encontrado',
      loadError: 'Error al cargar el producto',
    },
  }

  const entityDetail = useEntityDetail(config)

  return {
    ...entityDetail,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidProduct: entityDetail.isValidEntity,
    product: entityDetail.entity,
    formatDate,
    formatCurrency,
  }
}
