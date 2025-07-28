# Hook useURLState - Estado en URL

## Descripción

El hook `useURLState` permite sincronizar el estado de filtros, paginación y búsqueda con los parámetros de la URL. Esto permite que los usuarios puedan:

- Compartir URLs con filtros específicos
- Usar el botón atrás/adelante del navegador
- Bookmarkear páginas con filtros
- Navegar directamente a URLs con parámetros

## Características

### ✅ **Funcionalidades**

- Sincronización automática con URL
- Soporte para múltiples tipos de filtros (string, number, boolean, array)
- Transformación personalizada de valores
- Valores por defecto configurables
- Navegación sin recargar la página
- **Optimización de rendimiento con debounce**
- **Prevención de bucles infinitos**

### ✅ **Tipos de Filtros Soportados**

- `string`: Texto simple
- `number`: Números
- `boolean`: Valores true/false
- `array`: Arrays (se serializan como CSV)

## Solución de Problemas de Rendimiento

### 🔧 **Bucle Infinito Solucionado**

El hook anterior tenía un problema de "Maximum update depth exceeded" causado por:

1. **Dependencias inestables** en useEffect
2. **Actualizaciones excesivas** de URL
3. **Sincronización circular** entre estado y URL

#### ✅ **Solución Implementada**

```typescript
// 1. useRef para config estable
const configRef = useRef(config)
configRef.current = config

// 2. Debounce para actualizaciones de URL
const updateURL = useCallback(
  (newFilters, newPagination, newSearch) => {
    if (isUpdatingRef.current) return // Evitar actualizaciones simultáneas

    isUpdatingRef.current = true

    setTimeout(() => {
      // Actualizar URL
      navigate(newURL, { replace: true })
      isUpdatingRef.current = false
    }, 100) // Debounce de 100ms
  },
  [location.pathname, location.search, navigate]
)

// 3. useEffect optimizado
useEffect(() => {
  if (isUpdatingRef.current) return // Evitar sincronización durante actualización

  // Sincronizar solo cuando cambia la URL
}, [urlParams]) // Solo depende de urlParams
```

### 🚀 **Optimizaciones de Rendimiento**

#### ✅ **Debounce en Actualizaciones**

- Actualizaciones de URL con delay de 100ms
- Evita múltiples navegaciones simultáneas
- Mejora la experiencia del usuario

#### ✅ **Prevención de Bucles**

- Flag `isUpdatingRef` para evitar actualizaciones simultáneas
- Dependencias controladas en useEffect
- Sincronización unidireccional

#### ✅ **Referencias Estables**

- `useRef` para config estable
- Evita recreación de funciones
- Reduce re-renders innecesarios

## Uso Básico

### 1. **Configuración Simple**

```typescript
import { useURLState } from '../hooks'

interface MyFilters {
  category: string
  status: boolean
  price: number
}

const MyComponent = () => {
  const urlState = useURLState<MyFilters>({
    filters: {
      category: {
        type: 'string',
        defaultValue: 'all'
      },
      status: {
        type: 'boolean',
        defaultValue: true
      },
      price: {
        type: 'number',
        defaultValue: 0
      }
    },
    pagination: {
      page: { defaultValue: 1 },
      limit: { defaultValue: 10 }
    },
    search: {
      key: 'q',
      defaultValue: ''
    }
  })

  return (
    <div>
      <p>Filtros actuales: {JSON.stringify(urlState.filters)}</p>
      <p>Búsqueda: {urlState.search}</p>
      <p>Página: {urlState.pagination.page}</p>
    </div>
  )
}
```

### 2. **Actualizar Filtros**

```typescript
// Actualizar un filtro
urlState.updateFilters({ category: 'electronics' })

// Actualizar múltiples filtros
urlState.updateFilters({
  category: 'electronics',
  status: false,
})

// Limpiar filtros
urlState.clearFilters()

// Limpiar todo
urlState.clearAll()
```

### 3. **Actualizar Búsqueda**

```typescript
// Actualizar búsqueda
urlState.updateSearch('laptop')

// Limpiar búsqueda
urlState.updateSearch('')
```

### 4. **Actualizar Paginación**

```typescript
// Cambiar página
urlState.updatePagination({ page: 2 })

// Cambiar límite
urlState.updatePagination({ limit: 20, page: 1 })

// Cambiar ordenamiento
urlState.updatePagination({
  sortBy: 'name',
  sortOrder: 'desc',
})
```

## Configuración Avanzada

### 1. **Transformación Personalizada**

```typescript
const urlState = useURLState<MyFilters>({
  filters: {
    date: {
      type: 'string',
      defaultValue: new Date().toISOString(),
      transform: (value: string) => {
        // Transformar string a Date
        return new Date(value)
      },
    },
    tags: {
      type: 'array',
      defaultValue: [],
      transform: (value: string) => {
        // Transformar CSV a array
        return value.split(',').map(tag => tag.trim())
      },
    },
  },
})
```

### 2. **Configuración Completa**

```typescript
const urlState = useURLState<MyFilters>({
  filters: {
    category: {
      type: 'string',
      defaultValue: 'all',
    },
    price: {
      type: 'number',
      defaultValue: 0,
    },
    inStock: {
      type: 'boolean',
      defaultValue: true,
    },
    tags: {
      type: 'array',
      defaultValue: [],
    },
  },
  pagination: {
    page: { defaultValue: 1 },
    limit: { defaultValue: 20 },
    sortBy: { defaultValue: 'name' },
    sortOrder: { defaultValue: 'asc' },
  },
  search: {
    key: 'search',
    defaultValue: '',
  },
})
```

## Ejemplos de URL Generadas

### **URLs de Ejemplo**

```
// Sin filtros
/products

// Con búsqueda
/products?search=laptop

// Con filtros
/products?category=electronics&price=500&inStock=true

// Con paginación
/products?page=2&limit=20

// Con ordenamiento
/products?sortBy=price&sortOrder=desc

// Combinación completa
/products?search=laptop&category=electronics&price=500&page=2&limit=20&sortBy=price&sortOrder=desc
```

## Integración con React Router

### **Sincronización Automática**

El hook se integra automáticamente con React Router:

```typescript
import { useLocation, useNavigate } from 'react-router-dom'

// El hook maneja internamente:
// - useLocation() para leer la URL actual
// - useNavigate() para actualizar la URL
```

### **Navegación Programática**

```typescript
// Navegar a una URL específica
navigate('/products?category=electronics&page=2')

// El hook detectará los cambios y actualizará el estado
```

## Casos de Uso Comunes

### 1. **Lista de Productos**

```typescript
const ProductList = () => {
  const urlState = useURLState<ProductFilters>({
    filters: {
      category: { type: 'string', defaultValue: 'all' },
      price: { type: 'number', defaultValue: 0 },
      inStock: { type: 'boolean', defaultValue: true }
    },
    pagination: {
      page: { defaultValue: 1 },
      limit: { defaultValue: 12 }
    },
    search: { key: 'q', defaultValue: '' }
  })

  // Usar los filtros para cargar datos
  useEffect(() => {
    loadProducts(urlState.filters, urlState.pagination, urlState.search)
  }, [urlState.filters, urlState.pagination, urlState.search])

  return (
    <div>
      <SearchInput
        value={urlState.search}
        onChange={urlState.updateSearch}
      />
      <FilterSelect
        value={urlState.filters.category}
        onChange={(category) => urlState.updateFilters({ category })}
      />
      <Pagination
        currentPage={urlState.pagination.page}
        onPageChange={(page) => urlState.updatePagination({ page })}
      />
    </div>
  )
}
```

### 2. **Dashboard con Múltiples Filtros**

```typescript
const Dashboard = () => {
  const urlState = useURLState<DashboardFilters>({
    filters: {
      dateRange: { type: 'string', defaultValue: '7d' },
      status: { type: 'string', defaultValue: 'all' },
      priority: { type: 'string', defaultValue: 'all' }
    },
    pagination: {
      page: { defaultValue: 1 },
      limit: { defaultValue: 50 }
    }
  })

  return (
    <div>
      <DateRangePicker
        value={urlState.filters.dateRange}
        onChange={(dateRange) => urlState.updateFilters({ dateRange })}
      />
      <StatusFilter
        value={urlState.filters.status}
        onChange={(status) => urlState.updateFilters({ status })}
      />
    </div>
  )
}
```

## Beneficios

### ✅ **UX Mejorada**

- URLs compartibles
- Navegación con botones del navegador
- Bookmarking de filtros específicos
- **Rendimiento optimizado**

### ✅ **SEO Friendly**

- URLs semánticas
- Parámetros de búsqueda indexables
- Mejor rastreo por crawlers

### ✅ **Desarrollo Simplificado**

- Estado centralizado
- Sincronización automática
- Menos código boilerplate
- **Sin bucles infinitos**

### ✅ **Mantenibilidad**

- Lógica reutilizable
- Configuración declarativa
- Fácil testing
- **Código estable**

## Consideraciones

### ⚠️ **Limitaciones**

- Solo funciona con React Router
- Requiere configuración inicial
- Los arrays se serializan como CSV

### ⚠️ **Rendimiento**

- **Debounce implementado** para evitar actualizaciones excesivas
- **Prevención de bucles** con flags de control
- **Referencias estables** para evitar re-renders

### ⚠️ **Compatibilidad**

- Requiere navegadores modernos
- Depende de la History API
- Considerar fallbacks para navegadores antiguos

## Troubleshooting

### 🔧 **Problemas Comunes**

#### **Bucle Infinito**

```typescript
// ❌ Problemático
useEffect(() => {
  // Lógica que actualiza estado
}, [filters, pagination, search]) // Dependencias que cambian

// ✅ Solución
useEffect(() => {
  if (isUpdatingRef.current) return // Evitar sincronización
  // Lógica que actualiza estado
}, [urlParams]) // Solo depende de URL
```

#### **Actualizaciones Excesivas**

```typescript
// ❌ Problemático
const updateURL = useCallback(() => {
  navigate(newURL) // Sin debounce
}, [navigate])

// ✅ Solución
const updateURL = useCallback(() => {
  setTimeout(() => {
    navigate(newURL) // Con debounce
  }, 100)
}, [navigate])
```

### 🚀 **Mejores Prácticas**

1. **Usar useRef** para configuraciones estables
2. **Implementar debounce** para actualizaciones de URL
3. **Controlar dependencias** en useEffect
4. **Evitar actualizaciones simultáneas** con flags
5. **Optimizar re-renders** con referencias estables
