import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Employee } from '../../../../application/domain/employee'

export const useEmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [birthMonthFilter, setBirthMonthFilter] = useState<number | ''>('')
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])

  // Simulación de datos de empleados (en una implementación real, esto vendría del servicio)
  const mockEmployees = useMemo<Employee[]>(
    () => [
      {
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
      {
        id: '2',
        name: 'María García',
        phoneNumber: '+573007654321',
        birthDate: new Date('1985-08-22'),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        createdBy: 'admin',
        updatedBy: 'admin',
        percentage: 30,
      },
      {
        id: '3',
        name: 'Carlos López',
        phoneNumber: '+573001112223',
        birthDate: new Date('1992-12-10'),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        createdBy: 'admin',
        updatedBy: 'admin',
        percentage: 20,
      },
    ],
    []
  )

  // Cargar empleados
  const loadEmployees = useCallback(async () => {
    setLoading(true)
    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEmployees(mockEmployees)
    } catch (error) {
      console.error('Error loading employees:', error)
    } finally {
      setLoading(false)
    }
  }, [mockEmployees])

  // Filtrar empleados
  const filterEmployees = useCallback(() => {
    let filtered = employees

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        employee =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.phoneNumber.includes(searchTerm)
      )
    }

    // Filtro por mes de cumpleaños
    if (birthMonthFilter !== '') {
      filtered = filtered.filter(employee => {
        const birthMonth = employee.birthDate.getMonth() + 1 // getMonth() retorna 0-11
        return birthMonth === birthMonthFilter
      })
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, birthMonthFilter])

  // Efecto para cargar empleados al montar el componente
  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  // Efecto para filtrar empleados cuando cambian los filtros
  useEffect(() => {
    filterEmployees()
  }, [filterEmployees])

  // Buscar empleados
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  // Filtrar por mes de cumpleaños
  const handleBirthMonthFilter = useCallback((month: number | '') => {
    setBirthMonthFilter(month)
  }, [])

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setBirthMonthFilter('')
  }, [])

  // Crear empleado
  const createEmployee = useCallback(async (employeeData: any) => {
    try {
      // Simulación de creación
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newEmployee: Employee = {
        id: Date.now().toString(), // Simulación de ID generado
        ...employeeData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setEmployees(prev => [...prev, newEmployee])
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    }
  }, [])

  // Actualizar empleado
  const updateEmployee = useCallback(async (employeeData: any) => {
    try {
      // Simulación de actualización
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEmployees(prev =>
        prev.map(employee =>
          employee.id === employeeData.id
            ? { ...employee, ...employeeData, updatedAt: new Date() }
            : employee
        )
      )
    } catch (error) {
      console.error('Error updating employee:', error)
      throw error
    }
  }, [])

  // Eliminar empleado
  const deleteEmployee = useCallback(async (employeeId: string) => {
    try {
      // Simulación de eliminación
      await new Promise(resolve => setTimeout(resolve, 500))
      setEmployees(prev => prev.filter(employee => employee.id !== employeeId))
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  }, [])

  // Formatear fecha
  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  // Formatear teléfono
  const formatPhone = useCallback((phone: string) => {
    return phone.replace(/(\+57)(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')
  }, [])

  // Obtener mes de cumpleaños
  const getBirthMonth = useCallback((date: Date) => {
    return date.getMonth() + 1
  }, [])

  // Obtener nombre del mes
  const getMonthName = useCallback((month: number) => {
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
    return months[month - 1]
  }, [])

  return {
    employees: filteredEmployees,
    loading,
    searchTerm,
    birthMonthFilter,
    handleSearch,
    handleBirthMonthFilter,
    clearFilters,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    formatDate,
    formatPhone,
    getBirthMonth,
    getMonthName,
  }
}
