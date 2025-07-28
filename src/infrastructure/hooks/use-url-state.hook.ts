import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface URLStateConfig<T> {
  // Configuración de filtros
  filters?: {
    [K in keyof T]?: {
      type: 'string' | 'number' | 'boolean' | 'array'
      defaultValue?: T[K]
      transform?: (value: string) => T[K]
    }
  }
  // Configuración de paginación
  pagination?: {
    page: { defaultValue: number }
    limit: { defaultValue: number }
    sortBy?: { defaultValue: string }
    sortOrder?: { defaultValue: 'asc' | 'desc' }
  }
  // Configuración de búsqueda
  search?: {
    key: string
    defaultValue: string
  }
}

export interface URLState<T> {
  // Estado actual
  filters: Partial<T>
  pagination: {
    page: number
    limit: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
  search: string
  // Métodos para actualizar
  updateFilters: (filters: Partial<T>) => void
  updatePagination: (pagination: Partial<URLState<T>['pagination']>) => void
  updateSearch: (search: string) => void
  clearFilters: () => void
  clearAll: () => void
}

export const useURLState = <T extends Record<string, any>>(
  config: URLStateConfig<T>
): URLState<T> => {
  const location = useLocation()
  const navigate = useNavigate()

  // Usar useRef para mantener una referencia estable al config
  const configRef = useRef(config)
  configRef.current = config

  // Ref para evitar actualizaciones excesivas
  const isUpdatingRef = useRef(false)

  // Parsear parámetros de la URL
  const urlParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    const params: Record<string, string> = {}

    for (const [key, value] of searchParams.entries()) {
      params[key] = value
    }

    return params
  }, [location.search])

  // Estado local
  const [filters, setFilters] = useState<Partial<T>>({})
  const [pagination, setPagination] = useState<URLState<T>['pagination']>({
    page: config.pagination?.page.defaultValue || 1,
    limit: config.pagination?.limit.defaultValue || 10,
    sortBy: config.pagination?.sortBy?.defaultValue,
    sortOrder: config.pagination?.sortOrder?.defaultValue || 'asc',
  })
  const [search, setSearch] = useState<string>(
    config.search?.defaultValue || ''
  )

  // Sincronizar estado con URL al cambiar los parámetros
  useEffect(() => {
    if (isUpdatingRef.current) return // Evitar sincronización durante actualización

    // Sincronizar filtros
    const newFilters: Partial<T> = {}
    let hasFilterChanges = false

    if (configRef.current.filters) {
      Object.entries(configRef.current.filters).forEach(
        ([key, filterConfig]) => {
          const urlValue = urlParams[key]
          let newValue: T[keyof T] | undefined

          if (urlValue !== undefined) {
            if (filterConfig.transform) {
              newValue = filterConfig.transform(urlValue)
            } else {
              switch (filterConfig.type) {
                case 'string':
                  newValue = urlValue as T[keyof T]
                  break
                case 'number':
                  newValue = Number(urlValue) as T[keyof T]
                  break
                case 'boolean':
                  newValue = (urlValue === 'true') as T[keyof T]
                  break
                case 'array':
                  newValue = urlValue.split(',') as T[keyof T]
                  break
              }
            }
          } else if (filterConfig.defaultValue !== undefined) {
            newValue = filterConfig.defaultValue
          }

          if (newValue !== filters[key as keyof T]) {
            newFilters[key as keyof T] = newValue
            hasFilterChanges = true
          }
        }
      )
    }

    if (hasFilterChanges) {
      setFilters(prev => ({ ...prev, ...newFilters }))
    }

    // Sincronizar paginación
    const newPage =
      Number(urlParams.page) ||
      configRef.current.pagination?.page.defaultValue ||
      1
    const newLimit =
      Number(urlParams.limit) ||
      configRef.current.pagination?.limit.defaultValue ||
      10
    const newSortBy =
      urlParams.sortBy || configRef.current.pagination?.sortBy?.defaultValue
    const newSortOrder =
      (urlParams.sortOrder as 'asc' | 'desc') ||
      configRef.current.pagination?.sortOrder?.defaultValue ||
      'asc'

    if (
      newPage !== pagination.page ||
      newLimit !== pagination.limit ||
      newSortBy !== pagination.sortBy ||
      newSortOrder !== pagination.sortOrder
    ) {
      setPagination({
        page: newPage,
        limit: newLimit,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      })
    }

    // Sincronizar búsqueda
    const newSearch =
      urlParams[configRef.current.search?.key || 'search'] ||
      configRef.current.search?.defaultValue ||
      ''
    if (newSearch !== search) {
      setSearch(newSearch)
    }
  }, [urlParams, filters, pagination, search])

  // Función para actualizar la URL con debounce
  const updateURL = useCallback(
    (
      newFilters?: Partial<T>,
      newPagination?: Partial<URLState<T>['pagination']>,
      newSearch?: string
    ) => {
      // Evitar actualizaciones si ya se está actualizando
      if (isUpdatingRef.current) return

      isUpdatingRef.current = true

      // Usar setTimeout para debounce
      setTimeout(() => {
        const searchParams = new URLSearchParams(location.search)

        // Actualizar filtros
        if (newFilters !== undefined) {
          Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              if (Array.isArray(value)) {
                searchParams.set(key, value.join(','))
              } else {
                searchParams.set(key, String(value))
              }
            } else {
              searchParams.delete(key)
            }
          })
        }

        // Actualizar paginación
        if (newPagination !== undefined) {
          Object.entries(newPagination).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              searchParams.set(key, String(value))
            } else {
              searchParams.delete(key)
            }
          })
        }

        // Actualizar búsqueda
        if (newSearch !== undefined) {
          const searchKey = configRef.current.search?.key || 'search'
          if (newSearch) {
            searchParams.set(searchKey, newSearch)
          } else {
            searchParams.delete(searchKey)
          }
        }

        // Navegar a la nueva URL
        const newURL = `${location.pathname}?${searchParams.toString()}`
        navigate(newURL, { replace: true })

        isUpdatingRef.current = false
      }, 100) // Debounce de 100ms
    },
    [location.pathname, location.search, navigate]
  )

  // Actualizar filtros
  const updateFilters = useCallback(
    (newFilters: Partial<T>) => {
      setFilters(prev => ({ ...prev, ...newFilters }))
      updateURL(newFilters, undefined, undefined)
    },
    [updateURL]
  )

  // Actualizar paginación
  const updatePagination = useCallback(
    (newPagination: Partial<URLState<T>['pagination']>) => {
      setPagination(prev => ({ ...prev, ...newPagination }))
      updateURL(undefined, newPagination, undefined)
    },
    [updateURL]
  )

  // Actualizar búsqueda
  const updateSearch = useCallback(
    (newSearch: string) => {
      setSearch(newSearch)
      updateURL(undefined, undefined, newSearch)
    },
    [updateURL]
  )

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    const clearedFilters: Partial<T> = {}

    if (configRef.current.filters) {
      Object.keys(configRef.current.filters).forEach(key => {
        const filterConfig = configRef.current.filters![key as keyof T]
        if (filterConfig?.defaultValue !== undefined) {
          clearedFilters[key as keyof T] = filterConfig.defaultValue
        }
      })
    }

    setFilters(clearedFilters)
    updateURL(clearedFilters, undefined, undefined)
  }, [updateURL])

  // Limpiar todo
  const clearAll = useCallback(() => {
    const clearedFilters: Partial<T> = {}

    if (configRef.current.filters) {
      Object.keys(configRef.current.filters).forEach(key => {
        const filterConfig = configRef.current.filters![key as keyof T]
        if (filterConfig?.defaultValue !== undefined) {
          clearedFilters[key as keyof T] = filterConfig.defaultValue
        }
      })
    }

    const defaultPagination = {
      page: configRef.current.pagination?.page.defaultValue || 1,
      limit: configRef.current.pagination?.limit.defaultValue || 10,
      sortBy: configRef.current.pagination?.sortBy?.defaultValue,
      sortOrder:
        configRef.current.pagination?.sortOrder?.defaultValue ||
        ('asc' as const),
    }

    setFilters(clearedFilters)
    setPagination(defaultPagination)
    setSearch(configRef.current.search?.defaultValue || '')

    updateURL(
      clearedFilters,
      defaultPagination,
      configRef.current.search?.defaultValue || ''
    )
  }, [updateURL])

  return {
    filters,
    pagination,
    search,
    updateFilters,
    updatePagination,
    updateSearch,
    clearFilters,
    clearAll,
  }
}
