import { useCallback, useEffect, useState } from 'react'

interface EntityListConfig<T> {
  loadEntities: () => Promise<T[]>
  filterEntities: (
    entities: T[],
    searchTerm: string,
    birthMonthFilter: number | ''
  ) => T[]
}

export const useEntityList = <T>(config: EntityListConfig<T>) => {
  const [entities, setEntities] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [birthMonthFilter, setBirthMonthFilter] = useState<number | ''>('')
  const [filteredEntities, setFilteredEntities] = useState<T[]>([])

  // Cargar entidades al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const loadedEntities = await config.loadEntities()
        setEntities(loadedEntities)
      } catch (error) {
        console.error('Error loading entities:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [config])

  // Filtrar entidades cuando cambian los datos o filtros
  useEffect(() => {
    const filtered = config.filterEntities(
      entities,
      searchTerm,
      birthMonthFilter
    )
    setFilteredEntities(filtered)
  }, [config, entities, searchTerm, birthMonthFilter])

  // Buscar entidades
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

  // Crear entidad
  const createEntity = useCallback(
    async (entityData: any, createFn: (data: any) => Promise<T>) => {
      try {
        const newEntity = await createFn(entityData)
        setEntities(prev => [...prev, newEntity])
        return newEntity
      } catch (error) {
        console.error('Error creating entity:', error)
        throw error
      }
    },
    []
  )

  // Actualizar entidad
  const updateEntity = useCallback(
    async (entityData: any, updateFn: (data: any) => Promise<T>) => {
      try {
        const updatedEntity = await updateFn(entityData)
        setEntities(prev =>
          prev.map(entity =>
            (entity as any).id === entityData.id ? updatedEntity : entity
          )
        )
        return updatedEntity
      } catch (error) {
        console.error('Error updating entity:', error)
        throw error
      }
    },
    []
  )

  // Eliminar entidad
  const deleteEntity = useCallback(
    async (entityId: string, deleteFn: (id: string) => Promise<void>) => {
      try {
        await deleteFn(entityId)
        setEntities(prev =>
          prev.filter(entity => (entity as any).id !== entityId)
        )
      } catch (error) {
        console.error('Error deleting entity:', error)
      }
    },
    []
  )

  return {
    entities: filteredEntities,
    loading,
    searchTerm,
    birthMonthFilter,
    handleSearch,
    handleBirthMonthFilter,
    clearFilters,
    createEntity,
    updateEntity,
    deleteEntity,
  }
}
