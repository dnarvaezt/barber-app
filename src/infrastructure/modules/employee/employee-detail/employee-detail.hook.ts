import { useCallback } from 'react'
import type { Employee } from '../../../../application/domain/employee'
import { employeeService } from '../../../../application/domain/employee/employee.provider'
import { useEntityDetail } from '../../../hooks/use-entity-detail.hook'
import { useUtils } from '../../../hooks/use-utils.hook'
import { RouteIds } from '../../../routes'

export const useEmployeeDetail = () => {
  const { formatDate, formatPhone, getAge, getBirthMonth } = useUtils()

  // Función para cargar un empleado usando el servicio
  const loadEmployee = useCallback(
    async (id: string): Promise<Employee | null> => {
      try {
        const response = await employeeService.getEmployeeById(id, {
          page: 1,
          limit: 1,
        })
        return response.data[0] || null
      } catch (error) {
        console.error('Error loading employee:', error)
        return null
      }
    },
    []
  )

  const config = {
    entityName: 'empleado',
    entityIdParam: 'employeeId',
    editRouteId: RouteIds.EMPLOYEE_FORM_EDIT,
    listRouteId: RouteIds.EMPLOYEES,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadEmployee,
    errorMessages: {
      notFound: 'Empleado no encontrado',
      loadError: 'Error al cargar el empleado',
    },
  }

  const entityDetail = useEntityDetail(config)

  return {
    ...entityDetail,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidEmployee: entityDetail.isValidEntity,
    employee: entityDetail.entity,
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
  }
}
