import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Client } from '../../../../application/domain/client'
import { useRoutes } from '../../../routes'

export const useClientForm = () => {
  const navigate = useNavigate()
  const { clientId } = useParams<{ clientId: string }>()
  const { getRoutePathById } = useRoutes()
  const [loading, setLoading] = useState(false)
  const [client, setClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    birthDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(true)
  const [isValidClient, setIsValidClient] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const isEditing = clientId && clientId !== 'new'

  const loadClient = useCallback(
    async (id: string) => {
      setLoading(true)
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
          console.log(
            'Cliente no encontrado para edición:',
            id,
            'redirigiendo a 404'
          )
          setErrors({ general: 'Cliente no encontrado' })
          setIsValidClient(false)
          const notFoundPath = getRoutePathById('not-found')
          if (notFoundPath) {
            navigate(notFoundPath, { replace: true })
          }
          return
        }

        console.log('Cargando cliente para edición:', id, mockClient)
        setClient(mockClient)
        setFormData({
          name: mockClient.name,
          phoneNumber: mockClient.phoneNumber,
          birthDate: mockClient.birthDate.toISOString().split('T')[0],
        })
      } catch (error) {
        console.error('Error loading client:', error)
        setErrors({ general: 'Error al cargar el cliente' })
        setIsValidClient(false)
        const clientListPath = getRoutePathById('client')
        if (clientListPath) {
          navigate(clientListPath, { replace: true })
        }
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
        // Por ahora aceptamos cualquier ID que no sea 'new' y tenga al menos 1 carácter
        const isValid = id && id !== 'new' && id.length > 0

        console.log('Validating client ID:', id, 'isValid:', isValid)

        if (!isValid) {
          console.log('Invalid client ID, redirecting to /clients')
          setIsValidClient(false)
          const clientListPath = getRoutePathById('client')
          if (clientListPath) {
            navigate(clientListPath, { replace: true })
          }
          return
        }

        // Si el ID es válido, cargar el cliente
        await loadClient(id)
        setIsValidClient(true)
      } catch (error) {
        console.error('Error validating client ID:', error)
        setIsValidClient(false)
        const clientListPath = getRoutePathById('client')
        if (clientListPath) {
          navigate(clientListPath, { replace: true })
        }
      } finally {
        setIsValidating(false)
      }
    },
    [navigate, loadClient]
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
        const submitData = {
          name: formData.name.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          birthDate: new Date(formData.birthDate),
          ...(isEditing
            ? { id: clientId!, updatedBy: 'current-user' }
            : { createdBy: 'current-user' }),
        }

        // Simulación de llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000))

        let savedClientId: string

        if (isEditing) {
          console.log('Actualizando cliente:', submitData)
          // await clientService.updateClient(submitData as UpdateClientRequest)
          savedClientId = clientId!
        } else {
          console.log('Creando cliente:', submitData)
          // await clientService.createClient(submitData as CreateClientRequest)
          // En una implementación real, el servicio devolvería el ID del cliente creado
          // Generar un ID único para el mock
          savedClientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }

        // Mostrar estado de éxito y redirigir después de un breve delay
        setIsSuccess(true)
        console.log(
          'Cliente guardado exitosamente, redirigiendo al detalle:',
          savedClientId
        )

        // Redirigir después de 1.5 segundos para que el usuario vea el mensaje de éxito
        setTimeout(() => {
          const detailPath = getRoutePathById('client-detail')
          if (detailPath) {
            navigate(detailPath.replace(':clientId', savedClientId))
          }
        }, 1500)
      } catch (error) {
        console.error('Error submitting form:', error)
        setErrors({ general: 'Error al guardar el cliente' })
      } finally {
        setLoading(false)
      }
    },
    [formData, validateForm, isEditing, clientId, navigate]
  )

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      // Limpiar error del campo cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    },
    [errors]
  )

  const handleCancel = useCallback(() => {
    const clientListPath = getRoutePathById('client')
    if (clientListPath) {
      navigate(clientListPath)
    }
  }, [navigate, getRoutePathById])

  // Validar que el clientId sea válido (solo para edición)
  useEffect(() => {
    if (isEditing && clientId) {
      validateClientId(clientId)
    } else if (!isEditing) {
      // Si no es edición (es creación), permitir acceso
      setIsValidating(false)
      setIsValidClient(true)
    }
  }, [clientId, isEditing])

  return {
    loading,
    isValidating,
    isValidClient,
    isSuccess,
    client,
    formData,
    errors,
    isEditing,
    handleSubmit,
    handleInputChange,
    handleCancel,
  }
}
