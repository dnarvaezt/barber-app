import { useCallback } from 'react'
import type { PaginationParams } from '../../../../application/domain/common'
import type { Employee } from '../../../../application/domain/employee'
import { employeeService } from '../../../../application/domain/employee/employee.provider'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useURLState } from '../../../hooks/use-url-state.hook'
import { useUtils } from '../../../hooks/use-utils.hook'

// Tipos para los filtros de empleados
interface EmployeeFilters {
  birthMonth: number | null
}

export const useEmployeePage = () => {
  const { formatDate, formatPhone, getBirthMonthNumber, getMonthName } =
    useUtils()

  // Hook para obtener parámetros de URL
  const urlState = useURLState<EmployeeFilters>({
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
  })

  // Función para cargar empleados con filtros y paginación
  const loadEmployeesWithFilters = useCallback(
    async (
      pagination: PaginationParams,
      filters: Partial<EmployeeFilters>,
      search: string
    ) => {
      try {
        // Si hay búsqueda válida (no vacía), usar el método de búsqueda del servicio
        if (search && search.trim().length > 0) {
          const searchResponse = await employeeService.findEmployees(
            search.trim(),
            pagination
          )
          return searchResponse
        }

        // Si hay filtro de mes de nacimiento, usar el método específico
        if (filters.birthMonth && filters.birthMonth !== null) {
          const monthResponse = await employeeService.getEmployeesByBirthMonth(
            filters.birthMonth,
            pagination
          )
          return monthResponse
        }

        // Si no hay filtros, obtener todos los empleados con paginación
        const response = await employeeService.getAllEmployees(pagination)
        return response
      } catch (error) {
        console.error('Error loading employees:', error)
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
  const listState = usePaginatedList<Employee, EmployeeFilters>({
    loadEntities: loadEmployeesWithFilters,
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

  // Crear empleado usando el servicio
  const createEmployee = useCallback(
    async (employeeData: any) => {
      try {
        const newEmployee = await employeeService.createEmployee({
          name: employeeData.name,
          phoneNumber: employeeData.phoneNumber,
          birthDate: new Date(employeeData.birthDate),
          createdBy: 'admin_001',
          percentage: Number(employeeData.percentage),
        })

        // Recargar datos después de crear
        listState.refresh()
        return newEmployee
      } catch (error) {
        console.error('Error creating employee:', error)
        throw error
      }
    },
    [listState]
  )

  // Actualizar empleado usando el servicio
  const updateEmployee = useCallback(
    async (employeeData: any) => {
      try {
        const updatedEmployee = await employeeService.updateEmployee({
          id: employeeData.id,
          name: employeeData.name,
          phoneNumber: employeeData.phoneNumber,
          birthDate: new Date(employeeData.birthDate),
          updatedBy: 'admin_001',
          percentage: Number(employeeData.percentage),
        })

        // Recargar datos después de actualizar
        listState.refresh()
        return updatedEmployee
      } catch (error) {
        console.error('Error updating employee:', error)
        throw error
      }
    },
    [listState]
  )

  // Eliminar empleado usando el servicio
  const deleteEmployee = useCallback(
    async (employeeId: string) => {
      try {
        const success = await employeeService.deleteEmployee(employeeId)
        if (success) {
          // Recargar datos después de eliminar
          listState.refresh()
        } else {
          throw new Error('Failed to delete employee')
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        throw error
      }
    },
    [listState]
  )

  return {
    // Datos y estado
    employees: listState.data,
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
    // Métodos de ordenamiento
    handleSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => {
      listState.updatePagination({ sortBy, sortOrder, page: 1 })
    },
    // Estado de ordenamiento
    sortBy: urlState.pagination.sortBy || 'name',
    sortOrder: urlState.pagination.sortOrder || 'asc',
    // Métodos CRUD
    createEmployee,
    updateEmployee,
    deleteEmployee,
    // Utilidades
    formatDate,
    formatPhone,
    getBirthMonth: getBirthMonthNumber,
    getMonthName,
  }
}
