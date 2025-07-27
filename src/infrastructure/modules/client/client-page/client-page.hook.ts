import { useCallback } from 'react'
import type { Client } from '../../../../application/domain/client'
import { useEntityList, useMockData, useUtils } from '../../../hooks'
import { EntityFilterService } from '../../../services/entity-filter.service'

export const useClientPage = () => {
  const { loadMockClients } = useMockData()
  const { formatDate, formatPhone, getBirthMonthNumber, getMonthName } =
    useUtils()

  const entityList = useEntityList<Client>({
    loadEntities: loadMockClients,
    filterEntities: EntityFilterService.filterEntities,
  })

  // Crear cliente
  const createClient = useCallback(
    async (clientData: any) => {
      const createFn = async (data: any): Promise<Client> => {
        return {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Client
      }

      return entityList.createEntity(clientData, createFn)
    },
    [entityList]
  )

  // Actualizar cliente
  const updateClient = useCallback(
    async (clientData: any) => {
      const updateFn = async (data: any): Promise<Client> => {
        return {
          ...data,
          updatedAt: new Date(),
        } as Client
      }

      return entityList.updateEntity(clientData, updateFn)
    },
    [entityList]
  )

  // Eliminar cliente
  const deleteClient = useCallback(
    async (clientId: string) => {
      const deleteFn = async (): Promise<void> => {
        // Simulación de eliminación
      }

      return entityList.deleteEntity(clientId, deleteFn)
    },
    [entityList]
  )

  return {
    clients: entityList.entities,
    loading: entityList.loading,
    searchTerm: entityList.searchTerm,
    birthMonthFilter: entityList.birthMonthFilter,
    handleSearch: entityList.handleSearch,
    handleBirthMonthFilter: entityList.handleBirthMonthFilter,
    clearFilters: entityList.clearFilters,
    createClient,
    updateClient,
    deleteClient,
    formatDate,
    formatPhone,
    getBirthMonth: getBirthMonthNumber,
    getMonthName,
  }
}
