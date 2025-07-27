import { useCallback, useState } from 'react'
import type { PaginationParams } from '../../../../application/domain/common'
import type { Employee } from '../../../../application/domain/employee'
import { useMockData, usePagination, useUtils } from '../../../hooks'
import { PaginationMockService } from '../../../services/pagination-mock.service'

export const useEmployeePage = () => {
  const { loadMockEmployees } = useMockData()
  const { formatDate, formatPhone, getBirthMonthNumber, getMonthName } =
    useUtils()

  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [birthMonthFilter, setBirthMonthFilter] = useState<number | ''>('')

  // Función para cargar empleados con filtros y paginación
  const loadEmployeesWithFilters = useCallback(
    async (pagination: PaginationParams) => {
      const allEmployees = await loadMockEmployees()
      let filteredEmployees = allEmployees

      // Aplicar filtro de búsqueda
      if (searchTerm) {
        const searchResult = PaginationMockService.searchWithPagination(
          allEmployees,
          searchTerm,
          pagination
        )
        filteredEmployees = searchResult.data
      }

      // Aplicar filtro de mes de nacimiento
      if (birthMonthFilter !== '') {
        const monthResult =
          PaginationMockService.filterByBirthMonthWithPagination(
            allEmployees,
            birthMonthFilter,
            pagination
          )
        filteredEmployees = monthResult.data
      }

      // Si no hay filtros, usar paginación simple
      if (!searchTerm && birthMonthFilter === '') {
        return PaginationMockService.paginateData(allEmployees, pagination)
      }

      // Combinar filtros si ambos están activos
      if (searchTerm && birthMonthFilter !== '') {
        const searchFiltered = allEmployees.filter(employee => {
          const searchableFields = ['name', 'phoneNumber']
          return searchableFields.some(field => {
            const value = (employee as any)[field]
            if (value && typeof value === 'string') {
              return value.toLowerCase().includes(searchTerm.toLowerCase())
            }
            return false
          })
        })

        const monthFiltered = searchFiltered.filter(employee => {
          const birthDate = employee.birthDate
          if (!birthDate) return false
          const itemMonth = new Date(birthDate).getMonth() + 1
          return itemMonth === birthMonthFilter
        })

        return PaginationMockService.paginateData(monthFiltered, pagination)
      }

      // Retornar datos paginados
      return PaginationMockService.paginateData(filteredEmployees, pagination)
    },
    [loadMockEmployees, searchTerm, birthMonthFilter]
  )

  // Hook de paginación
  const pagination = usePagination<Employee>({
    loadEntities: loadEmployeesWithFilters,
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

  // Crear empleado
  const createEmployee = useCallback(
    async (employeeData: any) => {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...employeeData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Employee

      // Recargar datos después de crear
      pagination.refresh()
      return newEmployee
    },
    [pagination]
  )

  // Actualizar empleado
  const updateEmployee = useCallback(
    async (employeeData: any) => {
      const updatedEmployee: Employee = {
        ...employeeData,
        updatedAt: new Date(),
      } as Employee

      // Recargar datos después de actualizar
      pagination.refresh()
      return updatedEmployee
    },
    [pagination]
  )

  // Eliminar empleado
  const deleteEmployee = useCallback(
    async (employeeId: string) => {
      // Simulación de eliminación
      console.log('Eliminando empleado:', employeeId)

      // Recargar datos después de eliminar
      pagination.refresh()
    },
    [pagination]
  )

  return {
    employees: pagination.data,
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
    createEmployee,
    updateEmployee,
    deleteEmployee,
    formatDate,
    formatPhone,
    getBirthMonth: getBirthMonthNumber,
    getMonthName,
  }
}
