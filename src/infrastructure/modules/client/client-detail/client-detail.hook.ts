import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Client } from '../../../../application/domain/client'

export const useClientDetail = () => {
  const navigate = useNavigate()
  const { clientId } = useParams<{ clientId: string }>()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<Client | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidClient, setIsValidClient] = useState(false)

  const loadClient = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        // Simulación de llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock data - generar datos diferentes para cada cliente basado en su ID
        const mockClients: Record<string, Client> = {
          '1': {
            id: '1',
            name: 'Juan Pérez',
            phoneNumber: '+573001234567',
            birthDate: new Date('1990-05-15'),
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            createdBy: 'admin',
            updatedBy: 'admin',
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
          },
        }

        // Buscar el cliente por ID - solo aceptar IDs válidos
        const mockClient = mockClients[id]

        if (!mockClient) {
          console.log('Cliente no encontrado:', id, 'redirigiendo a 404')
          setError('Cliente no encontrado')
          setIsValidClient(false)
          navigate('/404', { replace: true })
          return
        }

        console.log('Cargando cliente:', id, mockClient)
        setClient(mockClient)
      } catch (error) {
        console.error('Error loading client:', error)
        setError('Error al cargar el cliente')
        setIsValidClient(false)
        navigate('/clients', { replace: true })
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const validateClientId = useCallback(
    async (id: string) => {
      setIsValidating(true)
      try {
        // Simulación de validación de API
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock validation - en una implementación real esto vendría del servicio
        // Por ahora aceptamos cualquier ID que tenga al menos 1 carácter
        const isValid = id && id.length > 0

        console.log('Validating client ID for detail:', id, 'isValid:', isValid)

        if (!isValid) {
          console.log('Invalid client ID for detail, redirecting to /clients')
          setIsValidClient(false)
          navigate('/clients', { replace: true })
          return
        }

        // Si el ID es válido, cargar el cliente
        await loadClient(id)
        setIsValidClient(true)
      } catch (error) {
        console.error('Error validating client ID:', error)
        setIsValidClient(false)
        navigate('/clients', { replace: true })
      } finally {
        setIsValidating(false)
      }
    },
    [navigate, loadClient]
  )

  const handleEdit = useCallback(() => {
    if (clientId) {
      navigate(`/clients/form/${clientId}`)
    }
  }, [navigate, clientId])

  const handleBack = useCallback(() => {
    navigate('/clients')
  }, [navigate])

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  const formatPhone = useCallback((phone: string) => {
    // Formatear número de teléfono para mejor legibilidad
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

  // Validar y cargar cliente
  useEffect(() => {
    if (clientId) {
      validateClientId(clientId)
    }
  }, [clientId, validateClientId])

  return {
    loading,
    isValidating,
    isValidClient,
    client,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
  }
}
