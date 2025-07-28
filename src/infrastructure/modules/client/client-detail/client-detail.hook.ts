import { useCallback } from 'react'
import type { Client } from '../../../../application/domain/client'
import { clientService } from '../../../../application/domain/client/client.provider'
import { useEntityDetail, useUtils } from '../../../hooks'
import { RouteIds } from '../../../routes'

export const useClientDetail = () => {
  const { formatDate, formatPhone, getAge, getBirthMonth } = useUtils()

  // Función para cargar un cliente usando el servicio
  const loadClient = useCallback(async (id: string): Promise<Client | null> => {
    try {
      const response = await clientService.getClientById(id, {
        page: 1,
        limit: 1,
      })
      return response.data[0] || null
    } catch (error) {
      console.error('Error loading client:', error)
      return null
    }
  }, [])

  const config = {
    entityName: 'cliente',
    entityIdParam: 'clientId',
    editRouteId: RouteIds.CLIENT_FORM_EDIT,
    listRouteId: 'client',
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadClient,
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
