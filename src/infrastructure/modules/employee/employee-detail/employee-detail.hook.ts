import { useEntityDetail, useMockData, useUtils } from '../../../hooks'
import { RouteIds } from '../../../routes'

export const useEmployeeDetail = () => {
  const { loadMockEmployee } = useMockData()
  const { formatDate, formatPhone, getAge, getBirthMonth } = useUtils()

  const config = {
    entityName: 'empleado',
    entityIdParam: 'employeeId',
    editRouteId: RouteIds.EMPLOYEE_FORM_EDIT,
    listRouteId: 'employees',
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadMockEmployee,
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
