import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Employee } from '../../../../application/domain/employee'
import { RouteIds, useRoutes } from '../../../routes'

export const useEmployeeForm = () => {
  const navigate = useNavigate()
  const { employeeId } = useParams<{ employeeId: string }>()
  const { getRoutePathById } = useRoutes()
  const [loading, setLoading] = useState(false)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    birthDate: '',
    percentage: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(true)
  const [isValidEmployee, setIsValidEmployee] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const isEditing = employeeId && employeeId !== 'new'

  const loadEmployee = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockEmployees: Record<string, Employee> = {
          '1': {
            id: '1',
            name: 'Juan Pérez',
            phoneNumber: '+573001234567',
            birthDate: new Date('1990-05-15'),
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            createdBy: 'admin',
            updatedBy: 'admin',
            percentage: 25,
          },
          '2': {
            id: '2',
            name: 'María García',
            phoneNumber: '+573001234568',
            birthDate: new Date('1985-08-22'),
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-20'),
            createdBy: 'admin',
            updatedBy: 'admin',
            percentage: 30,
          },
          '3': {
            id: '3',
            name: 'Carlos López',
            phoneNumber: '+573001234569',
            birthDate: new Date('1995-03-10'),
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-02-01'),
            createdBy: 'admin',
            updatedBy: 'admin',
            percentage: 20,
          },
          '4': {
            id: '4',
            name: 'Ana Rodríguez',
            phoneNumber: '+573001234570',
            birthDate: new Date('1988-12-05'),
            createdAt: new Date('2024-02-15'),
            updatedAt: new Date('2024-02-15'),
            createdBy: 'admin',
            updatedBy: 'admin',
            percentage: 35,
          },
          '5': {
            id: '5',
            name: 'Luis Martínez',
            phoneNumber: '+573001234571',
            birthDate: new Date('1992-07-18'),
            createdAt: new Date('2024-03-01'),
            updatedAt: new Date('2024-03-01'),
            createdBy: 'admin',
            updatedBy: 'admin',
            percentage: 28,
          },
        }

        const mockEmployee = mockEmployees[id]

        if (!mockEmployee) {
          setErrors({ general: 'Empleado no encontrado' })
          setIsValidEmployee(false)
          const notFoundPath = getRoutePathById(RouteIds.NOT_FOUND)
          if (notFoundPath) {
            navigate(notFoundPath, { replace: true })
          }
          return
        }
        setEmployee(mockEmployee)
        setFormData({
          name: mockEmployee.name,
          phoneNumber: mockEmployee.phoneNumber,
          birthDate: mockEmployee.birthDate.toISOString().split('T')[0],
          percentage: mockEmployee.percentage.toString(),
        })
      } catch (error) {
        console.error('Error loading employee:', error)
        setErrors({ general: 'Error al cargar el empleado' })
        setIsValidEmployee(false)
        const employeeListPath = getRoutePathById('employees')
        if (employeeListPath) {
          navigate(employeeListPath, { replace: true })
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const validateEmployeeId = useCallback(
    async (id: string) => {
      setIsValidating(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 500))

        const isValid = id && id !== 'new' && id.length > 0

        if (!isValid) {
          setIsValidEmployee(false)
          const employeeListPath = getRoutePathById('employees')
          if (employeeListPath) {
            navigate(employeeListPath, { replace: true })
          }
          return
        }

        await loadEmployee(id)
        setIsValidEmployee(true)
      } catch (error) {
        console.error('Error validating employee ID:', error)
        setIsValidEmployee(false)
        const employeeListPath = getRoutePathById('employees')
        if (employeeListPath) {
          navigate(employeeListPath, { replace: true })
        }
      } finally {
        setIsValidating(false)
      }
    },
    [navigate, loadEmployee]
  )

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El número de teléfono es requerido'
    } else if (!/^\+57\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'El formato debe ser +57 seguido de 10 dígitos'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de cumpleaños es requerida'
    } else {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      if (birthDate > today) {
        newErrors.birthDate = 'La fecha de cumpleaños no puede ser en el futuro'
      }
    }

    if (!formData.percentage.trim()) {
      newErrors.percentage = 'El porcentaje es requerido'
    } else {
      const percentage = Number(formData.percentage)
      if (isNaN(percentage)) {
        newErrors.percentage = 'El porcentaje debe ser un número'
      } else if (percentage < 0 || percentage > 100) {
        newErrors.percentage = 'El porcentaje debe estar entre 0 y 100'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        let savedEmployeeId: string

        if (isEditing) {
          savedEmployeeId = employeeId!
        } else {
          savedEmployeeId = `employee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }

        setIsSuccess(true)

        setTimeout(() => {
          const detailPath = getRoutePathById(RouteIds.EMPLOYEE_DETAIL)
          if (detailPath) {
            navigate(detailPath.replace(':employeeId', savedEmployeeId))
          }
        }, 1500)
      } catch (error) {
        console.error('Error submitting form:', error)
        setErrors({ general: 'Error al guardar el empleado' })
      } finally {
        setLoading(false)
      }
    },
    [formData, validateForm, isEditing, employeeId, navigate]
  )

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    },
    [errors]
  )

  const handleCancel = useCallback(() => {
    const employeeListPath = getRoutePathById('employees')
    if (employeeListPath) {
      navigate(employeeListPath)
    }
  }, [navigate, getRoutePathById])

  useEffect(() => {
    if (isEditing && employeeId) {
      validateEmployeeId(employeeId)
    } else if (!isEditing) {
      setIsValidating(false)
      setIsValidEmployee(true)
    }
  }, [employeeId, isEditing])

  return {
    loading,
    isValidating,
    isValidEmployee,
    isSuccess,
    employee,
    formData,
    errors,
    isEditing,
    handleSubmit,
    handleInputChange,
    handleCancel,
  }
}
