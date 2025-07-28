import { useCallback, useEffect, useRef } from 'react'
import type { Employee } from '../../../../application/domain/employee'
import { employeeService } from '../../../../application/domain/employee/employee.provider'
import { useEntityForm } from '../../../hooks/use-entity-form.hook'
import { useValidation } from '../../../hooks/use-validation.hook'
import { RouteIds } from '../../../routes'

export const useEmployeeForm = () => {
  const { validateEmployeeForm } = useValidation()

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
    detailRouteId: RouteIds.EMPLOYEE_DETAIL,
    listRouteId: RouteIds.EMPLOYEES,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadEmployee,
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
        try {
          if (entityForm.isEditing) {
            // Actualizar empleado existente
            const updatedEmployee = await employeeService.updateEmployee({
              id: entityForm.entity!.id,
              name: entityForm.formData.name,
              phoneNumber: entityForm.formData.phoneNumber,
              birthDate: new Date(entityForm.formData.birthDate),
              updatedBy: 'admin_001',
              percentage: Number(entityForm.formData.percentage),
            })
            return updatedEmployee.id
          } else {
            // Crear nuevo empleado
            const newEmployee = await employeeService.createEmployee({
              name: entityForm.formData.name,
              phoneNumber: entityForm.formData.phoneNumber,
              birthDate: new Date(entityForm.formData.birthDate),
              createdBy: 'admin_001',
              percentage: Number(entityForm.formData.percentage),
            })
            return newEmployee.id
          }
        } catch (error) {
          console.error('Error saving employee:', error)
          throw error
        }
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
