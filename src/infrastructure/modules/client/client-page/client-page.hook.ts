import { useCallback, useState } from 'react'
import type { Client } from '../../../../application/domain/client'
import type { PaginationParams } from '../../../../application/domain/common'
import { useMockData, usePagination, useUtils } from '../../../hooks'
import { PaginationMockService } from '../../../services/pagination-mock.service'

export const useClientPage = () => {
  const { loadMockClients } = useMockData()
  const { formatDate, formatPhone, getBirthMonthNumber, getMonthName } =
    useUtils()

  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [birthMonthFilter, setBirthMonthFilter] = useState<number | ''>('')

  // Función para cargar clientes con filtros y paginación
  const loadClientsWithFilters = useCallback(
    async (pagination: PaginationParams) => {
      const allClients = await loadMockClients()
      let filteredClients = allClients

      // Aplicar filtro de búsqueda
      if (searchTerm) {
        const searchResult = PaginationMockService.searchWithPagination(
          allClients,
          searchTerm,
          pagination
        )
        filteredClients = searchResult.data
      }

      // Aplicar filtro de mes de nacimiento
      if (birthMonthFilter !== '') {
        const monthResult =
          PaginationMockService.filterByBirthMonthWithPagination(
            allClients,
            birthMonthFilter,
            pagination
          )
        filteredClients = monthResult.data
      }

      // Si no hay filtros, usar paginación simple
      if (!searchTerm && birthMonthFilter === '') {
        return PaginationMockService.paginateData(allClients, pagination)
      }

      // Combinar filtros si ambos están activos
      if (searchTerm && birthMonthFilter !== '') {
        const searchFiltered = allClients.filter(client => {
          const searchableFields = ['name', 'phoneNumber']
          return searchableFields.some(field => {
            const value = (client as any)[field]
            if (value && typeof value === 'string') {
              return value.toLowerCase().includes(searchTerm.toLowerCase())
            }
            return false
          })
        })

        const monthFiltered = searchFiltered.filter(client => {
          const birthDate = client.birthDate
          if (!birthDate) return false
          const itemMonth = new Date(birthDate).getMonth() + 1
          return itemMonth === birthMonthFilter
        })

        return PaginationMockService.paginateData(monthFiltered, pagination)
      }

      // Retornar datos paginados
      return PaginationMockService.paginateData(filteredClients, pagination)
    },
    [loadMockClients, searchTerm, birthMonthFilter]
  )

  // Hook de paginación
  const pagination = usePagination<Client>({
    loadEntities: loadClientsWithFilters,
    initialPage: 1,
    initialLimit: 10,
  })

  // Manejadores de filtros
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term)
      // Reset a la primera página cuando cambia la búsqueda
      pagination.handlePageChange(1)
    },
    [pagination]
  )

  const handleBirthMonthFilter = useCallback(
    (month: number | '') => {
      setBirthMonthFilter(month)
      // Reset a la primera página cuando cambia el filtro
      pagination.handlePageChange(1)
    },
    [pagination]
  )

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setBirthMonthFilter('')
    // Reset a la primera página cuando se limpian los filtros
    pagination.handlePageChange(1)
  }, [pagination])

  // Crear cliente
  const createClient = useCallback(
    async (clientData: any) => {
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Client

      // Recargar datos después de crear
      pagination.refresh()
      return newClient
    },
    [pagination]
  )

  // Actualizar cliente
  const updateClient = useCallback(
    async (clientData: any) => {
      const updatedClient: Client = {
        ...clientData,
        updatedAt: new Date(),
      } as Client

      // Recargar datos después de actualizar
      pagination.refresh()
      return updatedClient
    },
    [pagination]
  )

  // Eliminar cliente
  const deleteClient = useCallback(
    async (clientId: string) => {
      // Simulación de eliminación
      console.log('Eliminando cliente:', clientId)

      // Recargar datos después de eliminar
      pagination.refresh()
    },
    [pagination]
  )

  return {
    clients: pagination.data,
    loading: pagination.loading,
    error: pagination.error,
    meta: pagination.meta,
    searchTerm,
    birthMonthFilter,
    handleSearch,
    handleBirthMonthFilter,
    clearFilters,
    handlePageChange: pagination.handlePageChange,
    handleLimitChange: pagination.handleLimitChange,
    createClient,
    updateClient,
    deleteClient,
    formatDate,
    formatPhone,
    getBirthMonth: getBirthMonthNumber,
    getMonthName,
  }
}
