import { useCallback } from 'react'
import type { Client } from '../../../../application/domain/client'
import { clientService } from '../../../../application/domain/client/client.provider'
import type { PaginationParams } from '../../../../application/domain/common'
import { usePaginatedList, useUtils } from '../../../hooks'

// Tipos para los filtros de clientes
interface ClientFilters {
  birthMonth: number | null
}

export const useClientPage = () => {
  const { formatDate, formatPhone, getBirthMonthNumber, getMonthName } =
    useUtils()

  // Función para cargar clientes con filtros y paginación
  const loadClientsWithFilters = useCallback(
    async (
      pagination: PaginationParams,
      filters: Partial<ClientFilters>,
      search: string
    ) => {
      try {
        // Si hay búsqueda válida (no vacía), usar el método de búsqueda del servicio
        if (search && search.trim().length > 0) {
          const searchResponse = await clientService.findClients(
            search.trim(),
            pagination
          )
          return searchResponse
        }

        // Si hay filtro de mes de nacimiento, usar el método específico
        if (filters.birthMonth && filters.birthMonth !== null) {
          const monthResponse = await clientService.getClientsByBirthMonth(
            filters.birthMonth,
            pagination
          )
          return monthResponse
        }

        // Si no hay filtros, obtener todos los clientes con paginación
        const response = await clientService.getAllClients(pagination)
        return response
      } catch (error) {
        console.error('Error loading clients:', error)
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
  const listState = usePaginatedList<Client, ClientFilters>({
    loadEntities: loadClientsWithFilters,
    urlConfig: {
      filters: {
        birthMonth: {
          type: 'number',
          defaultValue: null,
          transform: (value: string) => {
            const num = Number(value)
            return isNaN(num) ? null : num
          },
        },
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

  // Crear cliente usando el servicio
  const createClient = useCallback(
    async (clientData: any) => {
      try {
        const newClient = await clientService.createClient({
          name: clientData.name,
          phoneNumber: clientData.phoneNumber,
          birthDate: new Date(clientData.birthDate),
          createdBy: 'admin_001',
        })

        // Recargar datos después de crear
        listState.refresh()
        return newClient
      } catch (error) {
        console.error('Error creating client:', error)
        throw error
      }
    },
    [listState]
  )

  // Actualizar cliente usando el servicio
  const updateClient = useCallback(
    async (clientData: any) => {
      try {
        const updatedClient = await clientService.updateClient({
          id: clientData.id,
          name: clientData.name,
          phoneNumber: clientData.phoneNumber,
          birthDate: new Date(clientData.birthDate),
          updatedBy: 'admin_001',
        })

        // Recargar datos después de actualizar
        listState.refresh()
        return updatedClient
      } catch (error) {
        console.error('Error updating client:', error)
        throw error
      }
    },
    [listState]
  )

  // Eliminar cliente usando el servicio
  const deleteClient = useCallback(
    async (clientId: string) => {
      try {
        const success = await clientService.deleteClient(clientId)
        if (success) {
          // Recargar datos después de eliminar
          listState.refresh()
        } else {
          throw new Error('Failed to delete client')
        }
      } catch (error) {
        console.error('Error deleting client:', error)
        throw error
      }
    },
    [listState]
  )

  return {
    // Datos y estado
    clients: listState.data,
    loading: listState.loading,
    error: listState.error,
    meta: listState.meta,
    // Filtros y búsqueda
    searchTerm: listState.search,
    birthMonthFilter: listState.filters.birthMonth || null,
    // Métodos de actualización
    handleSearch: listState.updateSearch,
    handleBirthMonthFilter: (month: number | null) => {
      listState.updateFilters({ birthMonth: month })
    },
    clearFilters: listState.clearFilters,
    handlePageChange: (page: number) => listState.updatePagination({ page }),
    handleLimitChange: (limit: number) =>
      listState.updatePagination({ limit, page: 1 }),
    // Métodos CRUD
    createClient,
    updateClient,
    deleteClient,
    // Utilidades
    formatDate,
    formatPhone,
    getBirthMonth: getBirthMonthNumber,
    getMonthName,
  }
}
