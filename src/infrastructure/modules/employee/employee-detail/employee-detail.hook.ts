import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Employee } from '../../../../application/domain/employee'
import { RouteIds, useRoutes } from '../../../routes'

export const useEmployeeDetail = () => {
  const navigate = useNavigate()
  const { employeeId } = useParams<{ employeeId: string }>()
  const { getRoutePathById } = useRoutes()
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidEmployee, setIsValidEmployee] = useState(false)

  const editPath = useMemo(
    () => getRoutePathById(RouteIds.EMPLOYEE_FORM_EDIT),
    [getRoutePathById]
  )
  const employeeListPath = useMemo(
    () => getRoutePathById('employees'),
    [getRoutePathById]
  )
  const notFoundPath = useMemo(
    () => getRoutePathById(RouteIds.NOT_FOUND),
    [getRoutePathById]
  )

  const loadEmployee = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
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
          setError('Empleado no encontrado')
          setIsValidEmployee(false)
          if (notFoundPath) {
            navigate(notFoundPath, { replace: true })
          }
          return
        }

        setEmployee(mockEmployee)
      } catch (error) {
        console.error('Error loading employee:', error)
        setError('Error al cargar el empleado')
        setIsValidEmployee(false)
        if (employeeListPath) {
          navigate(employeeListPath, { replace: true })
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate, notFoundPath, employeeListPath]
  )

  const validateEmployeeId = useCallback(
    async (id: string) => {
      setIsValidating(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 500))

        const isValid = id && id.length > 0

        if (!isValid) {
          setIsValidEmployee(false)
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
        if (employeeListPath) {
          navigate(employeeListPath, { replace: true })
        }
      } finally {
        setIsValidating(false)
      }
    },
    [navigate, loadEmployee, notFoundPath, employeeListPath]
  )

  const handleEditMemoized = useCallback(() => {
    if (employeeId && editPath) {
      navigate(editPath.replace(':employeeId', employeeId))
    }
  }, [navigate, employeeId, editPath])

  const handleBackMemoized = useCallback(() => {
    if (employeeListPath) {
      navigate(employeeListPath)
    }
  }, [navigate, employeeListPath])

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  const formatPhone = useCallback((phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 12 && cleaned.startsWith('57')) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
    }
    return phone
  }, [])

  const getAge = useCallback((birthDate: Date) => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    return age
  }, [])

  const getBirthMonth = useCallback((birthDate: Date) => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    return months[birthDate.getMonth()]
  }, [])

  useEffect(() => {
    if (employeeId) {
      validateEmployeeId(employeeId)
    }
  }, [employeeId, validateEmployeeId])

  return {
    loading,
    isValidating,
    isValidEmployee,
    employee,
    error,
    handleEdit: handleEditMemoized,
    handleBack: handleBackMemoized,
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
  }
}
