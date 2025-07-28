import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoutes } from '../routes'

interface EntityFormConfig<T> {
  entityName: string
  entityIdParam: string
  editRouteId: string
  detailRouteId: string
  listRouteId: string
  notFoundRouteId: string
  loadEntity: (id: string) => Promise<T | null>
  validateForm: (formData: any) => Record<string, string>
  errorMessages: {
    notFound: string
    loadError: string
    saveError: string
  }
}

export const useEntityForm = <T>(config: EntityFormConfig<T>) => {
  const navigate = useNavigate()
  const params = useParams<Record<string, string>>()
  const { getRoutePathById } = useRoutes()

  const entityId = params[config.entityIdParam]
  const isEditing = entityId && entityId !== 'new'

  const [loading, setLoading] = useState(false)
  const [entity, setEntity] = useState<T | null>(null)
  const [formData, setFormData] = useState<any>({
    name: '',
    phoneNumber: '',
    birthDate: '',
    percentage: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(true)
  const [isValidEntity, setIsValidEntity] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const isValidatingRef = useRef(false)

  const loadEntity = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const loadedEntity = await config.loadEntity(id)

        if (!loadedEntity) {
          setErrors({ general: config.errorMessages.notFound })
          setIsValidEntity(false)
          const notFoundPath = getRoutePathById(config.notFoundRouteId)
          if (notFoundPath) {
            navigate(notFoundPath, { replace: true })
          } else {
            console.error(`Route not found for ID: ${config.notFoundRouteId}`)
          }
          return
        }

        setEntity(loadedEntity)
        // El formData se debe establecer en el hook específico
      } catch (error) {
        console.error(`Error loading ${config.entityName}:`, error)
        setErrors({ general: config.errorMessages.loadError })
        setIsValidEntity(false)
        const listPath = getRoutePathById(config.listRouteId)
        if (listPath) {
          navigate(listPath, { replace: true })
        } else {
          console.error(`Route not found for ID: ${config.listRouteId}`)
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate, config, getRoutePathById]
  )

  const validateEntityId = useCallback(
    async (id: string) => {
      // Evitar validación si ya se está validando usando useRef
      if (isValidatingRef.current) {
        return
      }

      isValidatingRef.current = true
      setIsValidating(true)
      try {
        const isValid = id && id !== 'new' && id.length > 0

        if (!isValid) {
          setIsValidEntity(false)
          const listPath = getRoutePathById(config.listRouteId)
          if (listPath) {
            navigate(listPath, { replace: true })
          } else {
            console.error(`Route not found for ID: ${config.listRouteId}`)
          }
          return
        }

        await loadEntity(id)
        setIsValidEntity(true)
      } catch (error) {
        console.error(`Error validating ${config.entityName} ID:`, error)
        setIsValidEntity(false)
        const listPath = getRoutePathById(config.listRouteId)
        if (listPath) {
          navigate(listPath, { replace: true })
        } else {
          console.error(`Route not found for ID: ${config.listRouteId}`)
        }
      } finally {
        setIsValidating(false)
        isValidatingRef.current = false
      }
    },
    [
      navigate,
      config.listRouteId,
      config.entityName,
      loadEntity,
      getRoutePathById,
    ]
  )

  const validateFormData = useCallback(() => {
    const newErrors = config.validateForm(formData)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, config])

  const handleSubmit = useCallback(
    async (e: React.FormEvent, saveEntity: (data: any) => Promise<string>) => {
      e.preventDefault()

      if (!validateFormData()) {
        return
      }

      setLoading(true)
      try {
        const savedEntityId = await saveEntity(formData)
        setIsSuccess(true)

        const detailPath = getRoutePathById(config.detailRouteId)
        if (detailPath) {
          const detailPathWithId = detailPath.replace(
            `:${config.entityIdParam}`,
            savedEntityId
          )
          navigate(detailPathWithId)
        } else {
          console.error(`Route not found for ID: ${config.detailRouteId}`)
        }
      } catch (error) {
        console.error(`Error submitting ${config.entityName} form:`, error)
        setErrors({ general: config.errorMessages.saveError })
      } finally {
        setLoading(false)
      }
    },
    [formData, validateFormData, config, navigate, getRoutePathById]
  )

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev: any) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    },
    [errors]
  )

  const handleCancel = useCallback(() => {
    const listPath = getRoutePathById(config.listRouteId)
    if (listPath) {
      navigate(listPath)
    } else {
      console.error(`Route not found for ID: ${config.listRouteId}`)
    }
  }, [navigate, getRoutePathById, config.listRouteId])

  // Usar useRef para almacenar la función y evitar loops infinitos
  const validateEntityIdRef = useRef(validateEntityId)
  validateEntityIdRef.current = validateEntityId

  useEffect(() => {
    if (isEditing && entityId) {
      validateEntityIdRef.current(entityId)
    } else if (!isEditing) {
      setIsValidating(false)
      setIsValidEntity(true)
    }
  }, [entityId, isEditing])

  return {
    loading,
    isValidating,
    isValidEntity,
    isSuccess,
    entity,
    formData,
    setFormData,
    errors,
    isEditing,
    handleSubmit,
    handleInputChange,
    handleCancel,
  }
}
