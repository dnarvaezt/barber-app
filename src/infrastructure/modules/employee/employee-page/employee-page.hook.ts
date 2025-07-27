import { useCallback } from 'react'
import type { Employee } from '../../../../application/domain/employee'
import { useEntityList, useMockData, useUtils } from '../../../hooks'
import { EntityFilterService } from '../../../services/entity-filter.service'

export const useEmployeePage = () => {
  const { loadMockEmployees } = useMockData()
  const { formatDate, formatPhone, getBirthMonthNumber, getMonthName } =
    useUtils()

  const entityList = useEntityList<Employee>({
    loadEntities: loadMockEmployees,
    filterEntities: EntityFilterService.filterEntities,
  })

  // Crear empleado
  const createEmployee = useCallback(
    async (employeeData: any) => {
      const createFn = async (data: any): Promise<Employee> => {
        return {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Employee
      }

      return entityList.createEntity(employeeData, createFn)
    },
    [entityList]
  )

  // Actualizar empleado
  const updateEmployee = useCallback(
    async (employeeData: any) => {
      const updateFn = async (data: any): Promise<Employee> => {
        return {
          ...data,
          updatedAt: new Date(),
        } as Employee
      }

      return entityList.updateEntity(employeeData, updateFn)
    },
    [entityList]
  )

  // Eliminar empleado
  const deleteEmployee = useCallback(
    async (employeeId: string) => {
      const deleteFn = async (): Promise<void> => {
        // Simulación de eliminación
      }

      return entityList.deleteEntity(employeeId, deleteFn)
    },
    [entityList]
  )

  return {
    employees: entityList.entities,
    loading: entityList.loading,
    searchTerm: entityList.searchTerm,
    birthMonthFilter: entityList.birthMonthFilter,
    handleSearch: entityList.handleSearch,
    handleBirthMonthFilter: entityList.handleBirthMonthFilter,
    clearFilters: entityList.clearFilters,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    formatDate,
    formatPhone,
    getBirthMonth: getBirthMonthNumber,
    getMonthName,
  }
}
