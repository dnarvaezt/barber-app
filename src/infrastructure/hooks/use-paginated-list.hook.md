# Hook usePaginatedList - Lista Paginada con Estado en URL

## Descripción

El hook `usePaginatedList` combina la funcionalidad de paginación con el estado en URL, proporcionando una solución completa para listas paginadas con filtros y búsqueda. Es ideal para:

- Listas de datos con paginación
- Filtros persistentes en URL
- Búsquedas con estado compartible
- Ordenamiento configurable

## Características

### ✅ **Funcionalidades Integradas**

- Paginación automática
- Filtros en URL
- Búsqueda persistente
- Ordenamiento configurable
- Carga de datos optimizada
- Estado sincronizado

### ✅ **Beneficios**

- URLs compartibles con filtros
- Navegación con botones del navegador
- Estado persistente entre recargas
- Código simplificado y reutilizable

## Uso Básico

### 1. **Configuración Simple**

```typescript
import { usePaginatedList } from '../hooks'

interface ProductFilters {
  category: string
  price: number
}

const ProductList = () => {
  const listState = usePaginatedList<Product, ProductFilters>({
    loadEntities: async (pagination, filters, search) => {
      // Función para cargar datos
      return await api.getProducts({ pagination, filters, search })
    },
    urlConfig: {
      filters: {
        category: {
          type: 'string',
          defaultValue: 'all'
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
        key: 'search',
        defaultValue: ''
      }
    }
  })

  return (
    <div>
      <p>Productos: {listState.data.length}</p>
      <p>Página: {listState.meta.page}</p>
      <p>Búsqueda: {listState.search}</p>
    </div>
  )
}
```

### 2. **Interfaz Completa**

```typescript
interface PaginatedListState<T, F> {
  // Datos y estado
  data: T[]
  loading: boolean
  error: string | null
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  // Filtros y búsqueda
  filters: Partial<F>
  search: string
  // Métodos de actualización
  updateFilters: (filters: Partial<F>) => void
  updateSearch: (search: string) => void
  updatePagination: (
    pagination: Partial<{
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }>
  ) => void
  clearFilters: () => void
  clearAll: () => void
  refresh: () => void
}
```

## Implementación Completa

### 1. **Lista de Productos**

```typescript
const ProductList = () => {
  const listState = usePaginatedList<Product, ProductFilters>({
    loadEntities: async (pagination, filters, search) => {
      const allProducts = await loadProducts()
      let filteredProducts = allProducts

      // Aplicar búsqueda
      if (search) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Aplicar filtros
      if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
          product.category === filters.category
        )
      }

      if (filters.price && filters.price > 0) {
        filteredProducts = filteredProducts.filter(product =>
          product.price <= filters.price
        )
      }

      // Aplicar paginación
      const start = (pagination.page - 1) * pagination.limit
      const end = start + pagination.limit
      const paginatedProducts = filteredProducts.slice(start, end)

      return {
        data: paginatedProducts,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / pagination.limit),
          hasNextPage: end < filteredProducts.length,
          hasPrevPage: pagination.page > 1
        }
      }
    },
    urlConfig: {
      filters: {
        category: {
          type: 'string',
          defaultValue: 'all'
        },
        price: {
          type: 'number',
          defaultValue: 0
        }
      },
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: 12 },
        sortBy: { defaultValue: 'name' },
        sortOrder: { defaultValue: 'asc' }
      },
      search: {
        key: 'search',
        defaultValue: ''
      }
    }
  })

  return (
    <div>
      {/* Búsqueda */}
      <SearchInput
        value={listState.search}
        onChange={listState.updateSearch}
        placeholder="Buscar productos..."
      />

      {/* Filtros */}
      <div className="filters">
        <select
          value={listState.filters.category || 'all'}
          onChange={(e) => listState.updateFilters({ category: e.target.value })}
        >
          <option value="all">Todas las categorías</option>
          <option value="electronics">Electrónicos</option>
          <option value="clothing">Ropa</option>
        </select>

        <input
          type="number"
          value={listState.filters.price || 0}
          onChange={(e) => listState.updateFilters({ price: Number(e.target.value) })}
          placeholder="Precio máximo"
        />
      </div>

      {/* Lista de productos */}
      {listState.loading ? (
        <div>Cargando...</div>
      ) : listState.error ? (
        <div>Error: {listState.error}</div>
      ) : (
        <div className="products">
          {listState.data.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Paginación */}
      <Pagination
        meta={listState.meta}
        onPageChange={listState.updatePagination}
        onLimitChange={(limit) => listState.updatePagination({ limit, page: 1 })}
      />

      {/* Botones de acción */}
      <div className="actions">
        <button onClick={listState.clearFilters}>
          Limpiar filtros
        </button>
        <button onClick={listState.clearAll}>
          Limpiar todo
        </button>
        <button onClick={listState.refresh}>
          Recargar
        </button>
      </div>
    </div>
  )
}
```

### 2. **Lista de Usuarios con Filtros Avanzados**

```typescript
interface UserFilters {
  role: string
  status: string
  age: number
  joinDate: string
}

const UserList = () => {
  const listState = usePaginatedList<User, UserFilters>({
    loadEntities: async (pagination, filters, search) => {
      const allUsers = await loadUsers()
      let filteredUsers = allUsers

      // Aplicar búsqueda
      if (search) {
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Aplicar filtros
      if (filters.role && filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role)
      }

      if (filters.status && filters.status !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status)
      }

      if (filters.age && filters.age > 0) {
        filteredUsers = filteredUsers.filter(user => user.age <= filters.age)
      }

      if (filters.joinDate) {
        const joinDate = new Date(filters.joinDate)
        filteredUsers = filteredUsers.filter(user =>
          new Date(user.joinDate) >= joinDate
        )
      }

      // Aplicar ordenamiento
      if (pagination.sortBy) {
        filteredUsers.sort((a, b) => {
          const aValue = a[pagination.sortBy as keyof User]
          const bValue = b[pagination.sortBy as keyof User]

          if (pagination.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1
          }
          return aValue > bValue ? 1 : -1
        })
      }

      // Aplicar paginación
      const start = (pagination.page - 1) * pagination.limit
      const end = start + pagination.limit
      const paginatedUsers = filteredUsers.slice(start, end)

      return {
        data: paginatedUsers,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / pagination.limit),
          hasNextPage: end < filteredUsers.length,
          hasPrevPage: pagination.page > 1
        }
      }
    },
    urlConfig: {
      filters: {
        role: {
          type: 'string',
          defaultValue: 'all'
        },
        status: {
          type: 'string',
          defaultValue: 'all'
        },
        age: {
          type: 'number',
          defaultValue: 0
        },
        joinDate: {
          type: 'string',
          defaultValue: ''
        }
      },
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: 20 },
        sortBy: { defaultValue: 'name' },
        sortOrder: { defaultValue: 'asc' }
      },
      search: {
        key: 'search',
        defaultValue: ''
      }
    }
  })

  return (
    <div>
      {/* Filtros avanzados */}
      <div className="advanced-filters">
        <select
          value={listState.filters.role || 'all'}
          onChange={(e) => listState.updateFilters({ role: e.target.value })}
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
          <option value="moderator">Moderador</option>
        </select>

        <select
          value={listState.filters.status || 'all'}
          onChange={(e) => listState.updateFilters({ status: e.target.value })}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="suspended">Suspendido</option>
        </select>

        <input
          type="number"
          value={listState.filters.age || ''}
          onChange={(e) => listState.updateFilters({ age: Number(e.target.value) })}
          placeholder="Edad máxima"
        />

        <input
          type="date"
          value={listState.filters.joinDate || ''}
          onChange={(e) => listState.updateFilters({ joinDate: e.target.value })}
        />
      </div>

      {/* Tabla de usuarios */}
      <table>
        <thead>
          <tr>
            <th onClick={() => listState.updatePagination({ sortBy: 'name' })}>
              Nombre {listState.meta.sortBy === 'name' && (listState.meta.sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => listState.updatePagination({ sortBy: 'email' })}>
              Email {listState.meta.sortBy === 'email' && (listState.meta.sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => listState.updatePagination({ sortBy: 'joinDate' })}>
              Fecha de registro {listState.meta.sortBy === 'joinDate' && (listState.meta.sortOrder === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {listState.data.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.joinDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <Pagination
        meta={listState.meta}
        onPageChange={listState.updatePagination}
        onLimitChange={(limit) => listState.updatePagination({ limit, page: 1 })}
      />
    </div>
  )
}
```

## URLs Generadas

### **Ejemplos de URLs**

```
// Sin filtros
/users

// Con búsqueda
/users?search=john

// Con filtros
/users?role=admin&status=active&age=30

// Con paginación
/users?page=2&limit=20

// Con ordenamiento
/users?sortBy=name&sortOrder=desc

// Combinación completa
/users?search=john&role=admin&status=active&page=2&limit=20&sortBy=name&sortOrder=desc
```

## Ventajas del Hook Combinado

### ✅ **Simplicidad**

- Un solo hook para toda la funcionalidad
- Configuración declarativa
- Menos código boilerplate

### ✅ **Consistencia**

- Comportamiento uniforme en toda la aplicación
- Patrones reutilizables
- Fácil mantenimiento

### ✅ **Funcionalidad Completa**

- Paginación automática
- Filtros persistentes
- Búsqueda en tiempo real
- Ordenamiento configurable

### ✅ **UX Mejorada**

- URLs compartibles
- Navegación con botones del navegador
- Estado persistente
- Carga optimizada

## Consideraciones de Rendimiento

### ⚠️ **Optimizaciones Recomendadas**

```typescript
// 1. Debounce para búsquedas
const debouncedSearch = useMemo(
  () => debounce(listState.updateSearch, 300),
  [listState.updateSearch]
)

// 2. Memoización de datos filtrados
const filteredData = useMemo(() => {
  return expensiveFilterOperation(listState.data, listState.filters)
}, [listState.data, listState.filters])

// 3. Lazy loading para grandes datasets
const loadMoreData = useCallback(() => {
  if (listState.meta.hasNextPage) {
    listState.updatePagination({ page: listState.meta.page + 1 })
  }
}, [listState])
```

### ⚠️ **Limitaciones**

- Actualizaciones de URL en cada cambio
- Sincronización con el historial del navegador
- Considerar el tamaño de los parámetros de URL

## Testing

### **Ejemplos de Tests**

```typescript
import { renderHook, act } from '@testing-library/react'
import { usePaginatedList } from '../hooks'

test('should load data with filters', async () => {
  const mockLoadEntities = jest.fn()

  const { result } = renderHook(() =>
    usePaginatedList({
      loadEntities: mockLoadEntities,
      urlConfig: {
        filters: {
          category: { type: 'string', defaultValue: 'all' },
        },
        pagination: {
          page: { defaultValue: 1 },
          limit: { defaultValue: 10 },
        },
      },
    })
  )

  await act(async () => {
    result.current.updateFilters({ category: 'electronics' })
  })

  expect(mockLoadEntities).toHaveBeenCalledWith(
    expect.any(Object),
    { category: 'electronics' },
    ''
  )
})
```
