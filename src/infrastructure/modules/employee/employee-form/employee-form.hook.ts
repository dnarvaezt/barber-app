import { useCallback, useEffect, useRef } from 'react'
import type { Employee } from '../../../../application/domain/employee'
import { useEntityForm, useMockData, useValidation } from '../../../hooks'
import { RouteIds } from '../../../routes'

export const useEmployeeForm = () => {
  const { loadMockEmployee } = useMockData()
  const { validateEmployeeForm } = useValidation()

  const config = {
    entityName: 'empleado',
    entityIdParam: 'employeeId',
    editRouteId: RouteIds.EMPLOYEE_FORM_EDIT,
    detailRouteId: RouteIds.EMPLOYEE_DETAIL,
    listRouteId: 'employees',
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadMockEmployee,
    validateForm: validateEmployeeForm,
    errorMessages: {
      notFound: 'Empleado no encontrado',
      loadError: 'Error al cargar el empleado',
      saveError: 'Error al guardar el empleado',
    },
  }

  const entityForm = useEntityForm<Employee>(config)
  const entityFormRef = useRef(entityForm)
  entityFormRef.current = entityForm

  // Configurar formData inicial para empleados
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (!currentEntityForm.isEditing && !currentEntityForm.formData.name) {
      currentEntityForm.setFormData({
        name: '',
        phoneNumber: '',
        birthDate: '',
        percentage: '',
      })
    }
  }, [entityForm.isEditing, entityForm.setFormData])

  // Configurar formData cuando se carga un empleado para editar
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (currentEntityForm.entity && currentEntityForm.isEditing) {
      currentEntityForm.setFormData({
        name: currentEntityForm.entity.name,
        phoneNumber: currentEntityForm.entity.phoneNumber,
        birthDate: currentEntityForm.entity.birthDate
          .toISOString()
          .split('T')[0],
        percentage: currentEntityForm.entity.percentage.toString(),
      })
    }
  }, [entityForm.entity, entityForm.isEditing, entityForm.setFormData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      const saveEmployee = async (): Promise<string> => {
        let savedEmployeeId: string
        if (entityForm.isEditing) {
          savedEmployeeId = entityForm.entity!.id
        } else {
          savedEmployeeId = `employee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }

        return savedEmployeeId
      }

      await entityForm.handleSubmit(e, saveEmployee)
    },
    [entityForm]
  )

  return {
    ...entityForm,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidEmployee: entityForm.isValidEntity,
    employee: entityForm.entity,
    handleSubmit,
  }
}
