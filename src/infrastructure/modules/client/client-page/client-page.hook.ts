import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Client } from '../../../../application/domain/client'

export const useClientPage = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [birthMonthFilter, setBirthMonthFilter] = useState<number | ''>('')
  const [filteredClients, setFilteredClients] = useState<Client[]>([])

  // Simulación de datos de clientes (en una implementación real, esto vendría del servicio)
  const mockClients = useMemo<Client[]>(
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
      },
    ],
    []
  )

  // Cargar clientes
  const loadClients = useCallback(async () => {
    setLoading(true)
    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setClients(mockClients)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }, [mockClients])

  // Filtrar clientes
  const filterClients = useCallback(() => {
    let filtered = clients

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        client =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phoneNumber.includes(searchTerm)
      )
    }

    // Filtro por mes de cumpleaños
    if (birthMonthFilter !== '') {
      filtered = filtered.filter(client => {
        const birthMonth = client.birthDate.getMonth() + 1 // getMonth() retorna 0-11
        return birthMonth === birthMonthFilter
      })
    }

    setFilteredClients(filtered)
  }, [clients, searchTerm, birthMonthFilter])

  // Efecto para cargar clientes al montar el componente
  useEffect(() => {
    loadClients()
  }, [loadClients])

  // Efecto para filtrar clientes cuando cambian los filtros
  useEffect(() => {
    filterClients()
  }, [filterClients])

  // Buscar clientes
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

  // Crear cliente
  const createClient = useCallback(async (clientData: any) => {
    try {
      // Simulación de creación
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newClient: Client = {
        id: Date.now().toString(), // Simulación de ID generado
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setClients(prev => [...prev, newClient])
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }, [])

  // Actualizar cliente
  const updateClient = useCallback(async (clientData: any) => {
    try {
      // Simulación de actualización
      await new Promise(resolve => setTimeout(resolve, 1000))
      setClients(prev =>
        prev.map(client =>
          client.id === clientData.id
            ? { ...client, ...clientData, updatedAt: new Date() }
            : client
        )
      )
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }, [])

  // Eliminar cliente
  const deleteClient = useCallback(async (clientId: string) => {
    try {
      // Simulación de eliminación
      await new Promise(resolve => setTimeout(resolve, 500))
      setClients(prev => prev.filter(client => client.id !== clientId))
    } catch (error) {
      console.error('Error deleting client:', error)
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
    clients: filteredClients,
    loading,
    searchTerm,
    birthMonthFilter,
    handleSearch,
    handleBirthMonthFilter,
    clearFilters,
    createClient,
    updateClient,
    deleteClient,
    formatDate,
    formatPhone,
    getBirthMonth,
    getMonthName,
  }
}
