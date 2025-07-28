# useSearchInput Hook

## Descripción

El hook `useSearchInput` proporciona funcionalidades avanzadas para manejar campos de búsqueda con debounce automático, eventos de teclado y estados de carga. Es ideal para implementar búsquedas en tiempo real con una excelente experiencia de usuario.

## Características Principales

### ✅ **Debounce Automático**

- Búsqueda automática después de un tiempo de inactividad
- Configurable (por defecto: 300ms)
- Búsqueda inmediata para valores vacíos

### ✅ **Eventos de Teclado**

- **Enter**: Realiza búsqueda inmediata
- **Escape**: Limpia el campo de búsqueda
- Prevención de comportamiento por defecto

### ✅ **Estados de Carga**

- Indicador visual durante la búsqueda
- Estado `isSearching` para UI feedback
- Limpieza automática de timeouts

### ✅ **Gestión de Estado**

- Control completo del valor del input
- Sincronización con estado externo
- Limpieza automática de referencias

## API

### Configuración

```typescript
interface UseSearchInputConfig {
  onSearch: (value: string) => void
  debounceMs?: number
  initialValue?: string
}
```

### Retorno

```typescript
interface UseSearchInputReturn {
  searchValue: string
  handleInputChange: (value: string) => void
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  handleSearch: () => void
  clearSearch: () => void
  isSearching: boolean
}
```

## Uso Básico

```typescript
import { useSearchInput } from '../../../hooks'

const MyComponent = () => {
  const handleSearch = (value: string) => {
    // Lógica de búsqueda
    console.log('Buscando:', value)
  }

  const searchInput = useSearchInput({
    onSearch: handleSearch,
    debounceMs: 300,
    initialValue: '',
  })

  return (
    <input
      type="text"
      placeholder="Buscar..."
      value={searchInput.searchValue}
      onChange={e => searchInput.handleInputChange(e.target.value)}
      onKeyDown={searchInput.handleKeyDown}
    />
  )
}
```

## Uso Avanzado

### Con Indicador de Carga

```typescript
const searchInput = useSearchInput({
  onSearch: handleSearch,
  debounceMs: 500,
  initialValue: '',
})

return (
  <div className="search-container">
    <input
      type="text"
      placeholder="Buscar por nombre o teléfono... (Enter para buscar, Esc para limpiar)"
      value={searchInput.searchValue}
      onChange={e => searchInput.handleInputChange(e.target.value)}
      onKeyDown={searchInput.handleKeyDown}
      className="search-input"
    />
    {searchInput.isSearching && (
      <div className="search-loading">
        <div className="search-loading-spinner"></div>
      </div>
    )}
  </div>
)
```

### Con Botón de Limpieza

```typescript
const searchInput = useSearchInput({
  onSearch: handleSearch,
  debounceMs: 300,
  initialValue: '',
})

return (
  <div className="search-container">
    <input
      type="text"
      placeholder="Buscar..."
      value={searchInput.searchValue}
      onChange={e => searchInput.handleInputChange(e.target.value)}
      onKeyDown={searchInput.handleKeyDown}
    />
    {searchInput.searchValue && (
      <button onClick={searchInput.clearSearch}>
        Limpiar
      </button>
    )}
  </div>
)
```

## Implementación Técnica

### 🔧 **Gestión de Debounce**

```typescript
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
```

### 🎯 **Eventos de Teclado**

```typescript
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
  [searchValue, performSearch]
)
```

### 🧹 **Limpieza Automática**

```typescript
useEffect(() => {
  return () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
  }
}, [])
```

## Casos de Uso

### 📱 **Búsqueda en Tiempo Real**

```typescript
// Búsqueda automática mientras el usuario escribe
const searchInput = useSearchInput({
  onSearch: value => {
    // Actualizar resultados de búsqueda
    setSearchResults(searchData(value))
  },
  debounceMs: 300, // Esperar 300ms después de que el usuario deje de escribir
})
```

### 🔍 **Búsqueda con Enter**

```typescript
// Búsqueda solo cuando el usuario presiona Enter
const searchInput = useSearchInput({
  onSearch: value => {
    // Realizar búsqueda completa
    performFullSearch(value)
  },
  debounceMs: 0, // Sin debounce automático
})

// El usuario debe presionar Enter para buscar
```

### 🎨 **Búsqueda con UI Feedback**

```typescript
const searchInput = useSearchInput({
  onSearch: async (value) => {
    setIsLoading(true)
    try {
      const results = await searchAPI(value)
      setResults(results)
    } finally {
      setIsLoading(false)
    }
  },
  debounceMs: 500,
})

return (
  <div className="search-wrapper">
    <input
      value={searchInput.searchValue}
      onChange={e => searchInput.handleInputChange(e.target.value)}
      onKeyDown={searchInput.handleKeyDown}
      placeholder="Buscar..."
    />
    {searchInput.isSearching && <Spinner />}
  </div>
)
```

## Ventajas

### ✅ **Experiencia de Usuario**

- Búsqueda automática sin necesidad de botones
- Feedback visual durante la búsqueda
- Atajos de teclado intuitivos

### ✅ **Rendimiento**

- Debounce para evitar búsquedas excesivas
- Limpieza automática de timeouts
- Referencias estables para evitar re-renders

### ✅ **Flexibilidad**

- Configuración de tiempo de debounce
- Integración fácil con cualquier UI
- Manejo completo de eventos de teclado

### ✅ **Mantenibilidad**

- Lógica centralizada en un hook
- Tipos TypeScript completos
- Documentación clara

## Consideraciones

### ⚠️ **Limitaciones**

- Debounce fijo (no adaptativo)
- No soporta búsqueda con múltiples campos
- Limitado a un solo input por instancia

### ✅ **Mejores Prácticas**

- Usar debounce de 300-500ms para búsquedas en tiempo real
- Proporcionar feedback visual durante la búsqueda
- Incluir atajos de teclado en el placeholder
- Limpiar búsquedas al cambiar de página

### 🔧 **Optimizaciones**

- Referencias estables para evitar re-renders
- Limpieza automática de timeouts
- Manejo eficiente de eventos de teclado
