import { useCallback } from 'react'
import type { Activity } from '../../../../application/domain/activity'
import { activityService } from '../../../../application/domain/activity/activity.provider'
import { useEntityDetail } from '../../../hooks/use-entity-detail.hook'
import { useUtils } from '../../../hooks/use-utils.hook'
import { RouteIds } from '../../../routes'

export const useActivityDetail = () => {
  const { formatDate, formatCurrency } = useUtils()

  // Función para cargar una actividad usando el servicio
  const loadActivity = useCallback(
    async (id: string): Promise<Activity | null> => {
      try {
        const response = await activityService.getActivityById(id, {
          page: 1,
          limit: 1,
        })
        return response.data[0] || null
      } catch (error) {
        console.error('Error loading activity:', error)
        return null
      }
    },
    []
  )

  const config = {
    entityName: 'actividad',
    entityIdParam: 'activityId',
    editRouteId: RouteIds.ACTIVITY_FORM_EDIT,
    listRouteId: RouteIds.ACTIVITIES,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadActivity,
    errorMessages: {
      notFound: 'Actividad no encontrada',
      loadError: 'Error al cargar la actividad',
    },
  }

  const entityDetail = useEntityDetail(config)

  return {
    ...entityDetail,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidActivity: entityDetail.isValidEntity,
    activity: entityDetail.entity,
    formatDate,
    formatCurrency,
  }
}
