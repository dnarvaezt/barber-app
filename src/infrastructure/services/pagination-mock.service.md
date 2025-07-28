# PaginationMockService - Servicio de Paginación y Búsqueda

## Descripción

El `PaginationMockService` proporciona funcionalidades de paginación, búsqueda y filtrado para datos en memoria. Es especialmente útil para desarrollo frontend sin backend real.

## Funcionalidades Principales

### ✅ **Paginación**

- División de datos en páginas
- Cálculo de metadatos de paginación
- Ordenamiento configurable
- Límites personalizables

### ✅ **Búsqueda Inteligente**

- Búsqueda por nombre y teléfono
- Normalización de términos de búsqueda
- Búsqueda parcial y exacta
- Limpieza de formatos de teléfono

### ✅ **Filtros Avanzados**

- Filtrado por mes de nacimiento
- Búsqueda por ID
- Combinación de múltiples filtros

## Sistema de Búsqueda

### 🔍 **Campos de Búsqueda**

El sistema busca en los siguientes campos:

- `name`: Nombre completo
- `phoneNumber`: Número de teléfono
- `email`: Dirección de correo electrónico

### 🎯 **Tipos de Búsqueda**

#### 1. **Búsqueda por Nombre**

```typescript
// Búsqueda completa
"Juan Pérez" → encuentra "Juan Pérez"

// Búsqueda parcial
"Juan" → encuentra "Juan Pérez", "Juan Carlos", etc.

// Búsqueda por palabras individuales
"Pérez" → encuentra "Juan Pérez", "María Pérez", etc.

// Búsqueda insensible a mayúsculas
"juan" → encuentra "Juan Pérez"
```

#### 2. **Búsqueda por Teléfono**

```typescript
// Búsqueda con formato
"123-456-7890" → encuentra "123-456-7890"

// Búsqueda sin formato
"1234567890" → encuentra "123-456-7890", "(123) 456-7890"

// Búsqueda parcial
"123" → encuentra "123-456-7890", "123-555-0000"

// Limpieza automática de formatos
"(123) 456-7890" → encuentra "123-456-7890"
```

#### 3. **Búsqueda por Email**

```typescript
// Búsqueda completa
"juan@email.com" → encuentra "juan@email.com"

// Búsqueda parcial
"juan@" → encuentra "juan@email.com", "juan@work.com"

// Búsqueda insensible a mayúsculas
"JUAN@EMAIL.COM" → encuentra "juan@email.com"
```

## Implementación Técnica

### 🔧 **Función de Búsqueda**

```typescript
static searchWithPagination<T>(
  data: T[],
  searchTerm: string,
  pagination: PaginationParams
): PaginatedResponse<T> {
  // 1. Normalizar el término de búsqueda
  const normalizedSearchTerm = searchTerm.toLowerCase().trim()

  if (!normalizedSearchTerm) {
    return this.paginateData(data, pagination)
  }

  // 2. Filtrar por término de búsqueda
  const filteredData = data.filter(item => {
    const searchableFields = ['name', 'phoneNumber', 'email']

    return searchableFields.some(field => {
      const value = (item as any)[field]

      if (!value) return false

      // 3. Convertir a string y normalizar
      const stringValue = String(value).toLowerCase().trim()

      // 4. Búsqueda exacta o parcial
      if (stringValue.includes(normalizedSearchTerm)) {
        return true
      }

      // 5. Búsqueda especializada por campo
      if (field === 'phoneNumber') {
        // Limpiar formato de teléfono
        const cleanPhone = stringValue.replace(/[\s\-\(\)]/g, '')
        const cleanSearch = normalizedSearchTerm.replace(/[\s\-\(\)]/g, '')
        if (cleanPhone.includes(cleanSearch)) {
          return true
        }
      }

      if (field === 'name') {
        // Búsqueda por palabras individuales
        const nameWords = stringValue.split(/\s+/)
        const searchWords = normalizedSearchTerm.split(/\s+/)

        return searchWords.some(searchWord =>
          nameWords.some(nameWord => nameWord.includes(searchWord))
        )
      }

      return false
    })
  })

  // 6. Aplicar paginación
  return this.paginateData(filteredData, pagination)
}
```

### 🎨 **Características de la Búsqueda**

#### ✅ **Normalización**

- Conversión a minúsculas
- Eliminación de espacios en blanco
- Manejo de valores nulos/undefined

#### ✅ **Búsqueda Inteligente**

- Búsqueda parcial (contains)
- Búsqueda por palabras individuales
- Limpieza de formatos de teléfono

#### ✅ **Rendimiento**

- Filtrado eficiente en memoria
- Paginación optimizada
- Cálculo de metadatos preciso

## Uso en la Aplicación

### 📱 **Página de Clientes**

```typescript
// Hook de la página de clientes
const loadClientsWithFilters = useCallback(
  async (pagination, filters, search) => {
    const allClients = await loadMockClients()
    let filteredClients = allClients

    // Aplicar búsqueda por nombre o teléfono
    if (search && search.trim()) {
      const searchResult = PaginationMockService.searchWithPagination(
        allClients,
        search.trim(),
        pagination
      )
      filteredClients = searchResult.data
    }

    // Aplicar filtros adicionales
    if (filters.birthMonth) {
      filteredClients = filteredClients.filter(client => {
        const birthDate = client.birthDate
        if (!birthDate) return false
        const itemMonth = new Date(birthDate).getMonth() + 1
        return itemMonth === filters.birthMonth
      })
    }

    return PaginationMockService.paginateData(filteredClients, pagination)
  },
  [loadMockClients]
)
```

### 👥 **Página de Empleados**

```typescript
// Hook de la página de empleados
const loadEmployeesWithFilters = useCallback(
  async (pagination, filters, search) => {
    const allEmployees = await loadMockEmployees()
    let filteredEmployees = allEmployees

    // Aplicar búsqueda por nombre o teléfono
    if (search && search.trim()) {
      const searchResult = PaginationMockService.searchWithPagination(
        allEmployees,
        search.trim(),
        pagination
      )
      filteredEmployees = searchResult.data
    }

    // Aplicar filtros adicionales
    if (filters.birthMonth) {
      filteredEmployees = filteredEmployees.filter(employee => {
        const birthDate = employee.birthDate
        if (!birthDate) return false
        const itemMonth = new Date(birthDate).getMonth() + 1
        return itemMonth === filters.birthMonth
      })
    }

    return PaginationMockService.paginateData(filteredEmployees, pagination)
  },
  [loadMockEmployees]
)
```

## Ejemplos de Búsqueda

### 🔍 **Casos de Uso Comunes**

#### **Búsqueda por Nombre**

```
Entrada: "Juan"
Resultado: Encuentra todos los clientes/empleados con "Juan" en el nombre
- Juan Pérez
- Juan Carlos López
- María Juanita
```

#### **Búsqueda por Teléfono**

```
Entrada: "123"
Resultado: Encuentra todos los números que contengan "123"
- 123-456-7890
- 123-555-0000
- (123) 456-7890
```

#### **Búsqueda Combinada**

```
Entrada: "Juan 123"
Resultado: Encuentra clientes/empleados que tengan "Juan" en el nombre Y "123" en el teléfono
```

### 🎯 **Búsquedas Especializadas**

#### **Nombres con Apellidos**

```typescript
// Búsqueda por apellido
"Pérez" → encuentra "Juan Pérez", "María Pérez"

// Búsqueda por nombre completo
"Juan Pérez" → encuentra "Juan Pérez"
```

#### **Teléfonos con Diferentes Formatos**

```typescript
// Formato con guiones
"123-456-7890" → encuentra "123-456-7890"

// Formato con paréntesis
"(123) 456-7890" → encuentra "(123) 456-7890"

// Formato sin separadores
"1234567890" → encuentra ambos formatos anteriores
```

## Optimizaciones

### ⚡ **Rendimiento**

#### ✅ **Filtrado Eficiente**

- Uso de `Array.filter()` optimizado
- Búsqueda temprana para reducir el dataset
- Paginación aplicada al final

#### ✅ **Memoria**

- No se crean copias innecesarias de datos
- Reutilización de arrays filtrados
- Limpieza automática de referencias

#### ✅ **Algoritmos**

- Búsqueda lineal optimizada
- Normalización eficiente de strings
- Cálculo de metadatos preciso

### 🔧 **Mantenibilidad**

#### ✅ **Código Limpio**

- Funciones con responsabilidad única
- Tipos TypeScript completos
- Documentación clara

#### ✅ **Extensibilidad**

- Fácil agregar nuevos campos de búsqueda
- Configuración flexible de filtros
- Patrones reutilizables

## Consideraciones

### ⚠️ **Limitaciones**

- Búsqueda en memoria (no escalable para grandes datasets)
- No soporta búsqueda fuzzy/aproximada
- Limitado a campos específicos

### ⚠️ **Rendimiento**

- Complejidad O(n) para búsquedas
- No optimizado para datasets muy grandes
- Sin índices de búsqueda

### ✅ **Ventajas**

- Búsqueda rápida para datasets pequeños
- Fácil de implementar y mantener
- Perfecto para desarrollo y prototipado
- Sin dependencias externas
