import { useCallback, useEffect, useRef, useState } from 'react'

interface UseSearchInputConfig {
  onSearch: (value: string) => void
  debounceMs?: number
  initialValue?: string
}

interface UseSearchInputReturn {
  searchValue: string
  handleInputChange: (value: string) => void
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  handleSearch: () => void
  clearSearch: () => void
  isSearching: boolean
}

/**
 * Hook personalizado para manejar búsquedas con debounce y eventos de teclado
 *
 * @param config - Configuración del hook
 * @param config.onSearch - Función que se ejecuta cuando se realiza la búsqueda
 * @param config.debounceMs - Tiempo de debounce en milisegundos (por defecto: 300ms)
 * @param config.initialValue - Valor inicial del campo de búsqueda
 *
 * @returns Objeto con funciones y estado para manejar la búsqueda
 */
export const useSearchInput = ({
  onSearch,
  debounceMs = 300,
  initialValue = '',
}: UseSearchInputConfig): UseSearchInputReturn => {
  const [searchValue, setSearchValue] = useState(initialValue)
  const [isSearching, setIsSearching] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const onSearchRef = useRef(onSearch)

  // Mantener referencia actualizada de onSearch
  onSearchRef.current = onSearch

  // Función para realizar la búsqueda
  const performSearch = useCallback((value: string) => {
    setIsSearching(true)
    onSearchRef.current(value)
    setIsSearching(false)
  }, [])

  // Función para limpiar la búsqueda
  const clearSearch = useCallback(() => {
    setSearchValue('')

    // Limpiar debounce si existe
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    performSearch('')
  }, [performSearch])

  // Función para manejar cambios en el input con debounce
  const handleInputChange = useCallback(
    (value: string) => {
      setSearchValue(value)

      // Limpiar debounce anterior
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // Si el valor está vacío, buscar inmediatamente
      if (!value.trim()) {
        performSearch('')
        return
      }

      // Aplicar debounce para búsquedas con contenido
      debounceRef.current = setTimeout(() => {
        performSearch(value)
      }, debounceMs)
    },
    [debounceMs, performSearch]
  )

  // Función para manejar eventos de teclado
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()

        // Limpiar debounce si existe
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
          debounceRef.current = null
        }

        // Realizar búsqueda inmediata
        performSearch(searchValue)
      } else if (event.key === 'Escape') {
        event.preventDefault()
        clearSearch()
      }
    },
    [searchValue, performSearch, clearSearch]
  )

  // Función para realizar búsqueda manual
  const handleSearch = useCallback(() => {
    // Limpiar debounce si existe
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    performSearch(searchValue)
  }, [searchValue, performSearch])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    searchValue,
    handleInputChange,
    handleKeyDown,
    handleSearch,
    clearSearch,
    isSearching,
  }
}
