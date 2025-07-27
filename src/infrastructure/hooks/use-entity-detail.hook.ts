import { useCallback, useEffect, useMemo, useState } from 'react'
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
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate, notFoundPath, listPath, config]
  )

  const validateEntityId = useCallback(
    async (id: string) => {
      setIsValidating(true)
      try {
        const isValid = id && id.length > 0

        if (!isValid) {
          setIsValidEntity(false)
          if (listPath) {
            navigate(listPath, { replace: true })
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
        }
      } finally {
        setIsValidating(false)
      }
    },
    [navigate, loadEntity, listPath, config.entityName]
  )

  const handleEdit = useCallback(() => {
    if (entityId && editPath) {
      const editPathWithId = editPath.replace(
        `:${config.entityIdParam}`,
        entityId
      )
      navigate(editPathWithId)
    }
  }, [navigate, entityId, editPath, config.entityIdParam])

  const handleBack = useCallback(() => {
    if (listPath) {
      navigate(listPath)
    }
  }, [navigate, listPath])

  useEffect(() => {
    if (entityId) {
      validateEntityId(entityId)
    }
  }, [entityId, validateEntityId])

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
