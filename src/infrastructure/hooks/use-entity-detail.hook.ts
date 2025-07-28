import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoutes } from '../routes'

interface EntityDetailConfig<T> {
  entityName: string
  entityIdParam: string
  editRouteId: string
  listRouteId: string
  notFoundRouteId: string
  loadEntity: (id: string) => Promise<T | null>
  errorMessages: {
    notFound: string
    loadError: string
  }
}

export const useEntityDetail = <T>(config: EntityDetailConfig<T>) => {
  const navigate = useNavigate()
  const params = useParams<Record<string, string>>()
  const { getRoutePathById } = useRoutes()

  const entityId = params[config.entityIdParam]

  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidEntity, setIsValidEntity] = useState(false)
  const isValidatingRef = useRef(false)

  const editPath = useMemo(
    () => getRoutePathById(config.editRouteId),
    [getRoutePathById, config.editRouteId]
  )
  const listPath = useMemo(
    () => getRoutePathById(config.listRouteId),
    [getRoutePathById, config.listRouteId]
  )
  const notFoundPath = useMemo(
    () => getRoutePathById(config.notFoundRouteId),
    [getRoutePathById, config.notFoundRouteId]
  )

  const loadEntity = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      try {
        const loadedEntity = await config.loadEntity(id)

        if (!loadedEntity) {
          setError(config.errorMessages.notFound)
          setIsValidEntity(false)
          if (notFoundPath) {
            navigate(notFoundPath, { replace: true })
          } else {
            console.error(`Route not found for ID: ${config.notFoundRouteId}`)
          }
          return
        }

        setEntity(loadedEntity)
      } catch (error) {
        console.error(`Error loading ${config.entityName}:`, error)
        setError(config.errorMessages.loadError)
        setIsValidEntity(false)
        if (listPath) {
          navigate(listPath, { replace: true })
        } else {
          console.error(`Route not found for ID: ${config.listRouteId}`)
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate, notFoundPath, listPath, config]
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
        const isValid = id && id.length > 0

        if (!isValid) {
          setIsValidEntity(false)
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
    [navigate, loadEntity, listPath, config.entityName, config.listRouteId]
  )

  const handleEdit = useCallback(() => {
    if (entityId && editPath) {
      const editPathWithId = editPath.replace(
        `:${config.entityIdParam}`,
        entityId
      )
      navigate(editPathWithId)
    } else {
      console.error(`Route not found for ID: ${config.editRouteId}`)
    }
  }, [navigate, entityId, editPath, config.entityIdParam, config.editRouteId])

  const handleBack = useCallback(() => {
    if (listPath) {
      navigate(listPath)
    } else {
      console.error(`Route not found for ID: ${config.listRouteId}`)
    }
  }, [navigate, listPath, config.listRouteId])

  // Usar useRef para almacenar la función y evitar loops infinitos
  const validateEntityIdRef = useRef(validateEntityId)
  validateEntityIdRef.current = validateEntityId

  useEffect(() => {
    if (entityId) {
      validateEntityIdRef.current(entityId)
    }
  }, [entityId])

  return {
    loading,
    isValidating,
    isValidEntity,
    entity,
    error,
    handleEdit,
    handleBack,
  }
}
