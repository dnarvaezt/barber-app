import { useEntityDetail, useMockData, useUtils } from '../../../hooks'
import { RouteIds } from '../../../routes'

export const useClientDetail = () => {
  const { loadMockClient } = useMockData()
  const { formatDate, formatPhone, getAge, getBirthMonth } = useUtils()

  const config = {
    entityName: 'cliente',
    entityIdParam: 'clientId',
    editRouteId: RouteIds.CLIENT_FORM_EDIT,
    listRouteId: 'client',
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadMockClient,
    errorMessages: {
      notFound: 'Cliente no encontrado',
      loadError: 'Error al cargar el cliente',
    },
  }

  const entityDetail = useEntityDetail(config)

  return {
    ...entityDetail,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidClient: entityDetail.isValidEntity,
    client: entityDetail.entity,
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
  }
}
