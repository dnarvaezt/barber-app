import { useCallback } from 'react'
import type { Activity } from '../../../../application/domain/activity'
import { activityService } from '../../../../application/domain/activity/activity.provider'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useURLState } from '../../../hooks/use-url-state.hook'
import { useUtils } from '../../../hooks/use-utils.hook'

// Tipos para los filtros de actividades (por ahora vacío, pero extensible)
type ActivityFilters = Record<never, never>

export const useActivityPage = () => {
  const { formatDate, formatCurrency } = useUtils()

  // Hook para obtener parámetros de URL
  const urlState = useURLState<ActivityFilters>({
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

  // Función para cargar actividades con filtros y paginación
  const loadActivitiesWithFilters = useCallback(
    async (
      pagination: any,
      filters: Partial<ActivityFilters>,
      search: string
    ) => {
      try {
        // Si hay búsqueda válida (no vacía), usar el método de búsqueda del servicio
        if (search && search.trim().length > 0) {
          const searchResponse = await activityService.findActivities(
            search.trim(),
            pagination
          )
          return searchResponse
        }

        // Si no hay filtros, obtener todas las actividades con paginación
        const response = await activityService.getAllActivities(pagination)
        return response
      } catch (error) {
        console.error('Error loading activities:', error)
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
  const listState = usePaginatedList<Activity, ActivityFilters>({
    loadEntities: loadActivitiesWithFilters,
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

  // Crear actividad usando el servicio
  const createActivity = useCallback(
    async (activityData: any) => {
      try {
        const newActivity = await activityService.createActivity({
          name: activityData.name,
          price: activityData.price,
          categoryId: activityData.categoryId,
          createdBy: 'admin_001',
        })

        // Recargar datos después de crear
        listState.refresh()
        return newActivity
      } catch (error) {
        console.error('Error creating activity:', error)
        throw error
      }
    },
    [listState]
  )

  // Actualizar actividad usando el servicio
  const updateActivity = useCallback(
    async (activityData: any) => {
      try {
        const updatedActivity = await activityService.updateActivity({
          id: activityData.id,
          name: activityData.name,
          price: activityData.price,
          categoryId: activityData.categoryId,
          updatedBy: 'admin_001',
        })

        // Recargar datos después de actualizar
        listState.refresh()
        return updatedActivity
      } catch (error) {
        console.error('Error updating activity:', error)
        throw error
      }
    },
    [listState]
  )

  // Eliminar actividad usando el servicio
  const deleteActivity = useCallback(
    async (id: string) => {
      try {
        const result = await activityService.deleteActivity(id)

        // Recargar datos después de eliminar
        if (result) {
          listState.refresh()
        }

        return result
      } catch (error) {
        console.error('Error deleting activity:', error)
        throw error
      }
    },
    [listState]
  )

  return {
    // Estado de la lista
    activities: listState.data,
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
    createActivity,
    updateActivity,
    deleteActivity,

    // Utilidades
    formatDate,
    formatCurrency,
  }
}
