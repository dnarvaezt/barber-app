# Hook usePagination - Solución de Bucle Infinito

## Problema Identificado

El hook `usePagination` tenía un problema de "Maximum update depth exceeded" causado por un bucle infinito en el `useEffect`. Este error ocurría porque:

1. **Dependencias inestables**: El `config` se recreaba en cada render
2. **useCallback con dependencias cambiantes**: `loadData` se recreaba constantemente
3. **useEffect con dependencias dinámicas**: Se ejecutaba infinitamente

## Solución Implementada

### 1. **Uso de useRef para config estable**

```typescript
// Antes (problemático)
const loadData = useCallback(
  async (pagination: PaginationParams) => {
    const response = await config.loadEntities(pagination)
    // ...
  },
  [config] // ❌ config cambia en cada render
)

// Después (solución)
const configRef = useRef(config)
configRef.current = config

const loadData = useCallback(
  async (pagination: PaginationParams) => {
    const response = await configRef.current.loadEntities(pagination)
    // ...
  },
  [] // ✅ Sin dependencias, no se recrea
)
```

### 2. **useEffect simplificado**

```typescript
// Antes (problemático)
useEffect(() => {
  loadData(initialPagination)
}, [loadData, config.initialPage, config.initialLimit]) // ❌ Muchas dependencias

// Después (solución)
useEffect(() => {
  loadData(initialPagination)
}, []) // ✅ Solo se ejecuta al montar
```

### 3. **Optimizaciones adicionales**

```typescript
// Evitar llamadas innecesarias
const handlePageChange = useCallback(
  (newPage: number) => {
    if (newPage === meta.page) return // ✅ Evitar llamadas duplicadas

    const newPagination: PaginationParams = {
      ...meta,
      page: newPage,
    }
    loadData(newPagination)
  },
  [meta, loadData]
)
```

## Beneficios de la Solución

### ✅ **Rendimiento**

- Eliminación del bucle infinito
- Menos re-renders innecesarios
- Llamadas optimizadas a la API

### ✅ **Estabilidad**

- Configuración estable con useRef
- Dependencias controladas
- Comportamiento predecible

### ✅ **Mantenibilidad**

- Código más limpio y comprensible
- Menos efectos secundarios
- Fácil de debuggear

## Patrones Utilizados

### 1. **useRef Pattern**

```typescript
const configRef = useRef(config)
configRef.current = config
```

- Mantiene referencia estable al config
- Permite acceso a valores actuales sin recrear funciones

### 2. **Stable Callback Pattern**

```typescript
const loadData = useCallback(
  async (pagination: PaginationParams) => {
    // Lógica estable
  },
  [] // Sin dependencias
)
```

- Función que no se recrea
- Evita re-renders innecesarios

### 3. **Mount-Only Effect Pattern**

```typescript
useEffect(() => {
  // Solo se ejecuta al montar
}, [])
```

- Efecto que se ejecuta una sola vez
- Ideal para inicialización

## Uso Correcto

### ✅ **Implementación Recomendada**

```typescript
const MyComponent = () => {
  const pagination = usePagination({
    loadEntities: async (pagination) => {
      // Función estable que no cambia
      return await api.getData(pagination)
    },
    initialPage: 1,
    initialLimit: 10,
  })

  return (
    <div>
      <Pagination
        meta={pagination.meta}
        onPageChange={pagination.handlePageChange}
        onLimitChange={pagination.handleLimitChange}
      />
    </div>
  )
}
```

### ❌ **Implementación Problemática**

```typescript
const MyComponent = () => {
  // ❌ Función que se recrea en cada render
  const loadEntities = useCallback(async pagination => {
    return await api.getData(pagination)
  }, []) // Dependencias vacías pero función se recrea

  const pagination = usePagination({
    loadEntities, // ❌ Se pasa una función que cambia
    initialPage: 1,
    initialLimit: 10,
  })
}
```

## Lecciones Aprendidas

1. **useRef es clave** para mantener referencias estables
2. **Dependencias vacías** en useCallback pueden ser correctas
3. **useEffect al montar** es mejor que dependencias dinámicas
4. **Optimizaciones tempranas** evitan problemas de rendimiento
5. **Patrones consistentes** mejoran la mantenibilidad

## Compatibilidad

- ✅ React 18+
- ✅ TypeScript
- ✅ Strict Mode
- ✅ Concurrent Features
- ✅ Suspense
