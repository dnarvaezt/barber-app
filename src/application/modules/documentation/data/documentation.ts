export interface DocFile {
  id: string;
  title: string;
  content: string;
}

export const documentationFiles: DocFile[] = [
  {
    id: 'README',
    title: 'Inicio',
    content: `# @andes-project/filter

[![codecov](https://codecov.io/github/AndesProject/andes-filter/branch/master/graph/badge.svg?token=KT8REBY8K1)](https://codecov.io/github/AndesProject/andes-filter)
[![codecov](https://codecov.io/github/AndesProject/andes-filter/branch/master/graphs/sunburst.svg?token=KT8REBY8K1)](https://codecov.io/github/AndesProject/andes-filter)

## ¿Qué es Andes Filter?

**Andes Filter** es una librería de filtrado avanzada desarrollada en TypeScript
que permite aplicar filtros complejos y condiciones a colecciones de datos de
manera intuitiva y programática. Utiliza objetos para definir condiciones,
permitiendo combinar operadores lógicos y relacionales para construir consultas
eficientes y escalables.

### Características Principales

- 🎯 **Filtrado Intuitivo**: Define filtros complejos usando objetos
- 🔗 **Operadores Lógicos**: Combina múltiples condiciones con AND, OR, NOT
- 📊 **Escalabilidad**: Diseñado para manejar grandes volúmenes de datos
- 🚀 **Alto Rendimiento**: Optimizado para consultas eficientes
- 🛡️ **Type Safety**: Desarrollado en TypeScript para máxima seguridad de tipos
- 🔧 **Fácil de Usar**: Sintaxis clara y consistente

## Instalación

\`\`\`bash
npm install @andes-project/filter
\`\`\`

\`\`\`bash
yarn add @andes-project/filter
\`\`\`

\`\`\`bash
pnpm add @andes-project/filter
\`\`\`

### Requisitos

- **Node.js**: >= 22.0.0
- **TypeScript**: >= 5.4.5 (recomendado)
- **Navegadores**: Compatible con ES6+

## Uso Básico

\`\`\`typescript
import { createFilterEngine } from '@andes-project/filter'

// Datos de ejemplo
const users = [
  { id: 1, name: 'Alice', age: 25, email: 'alice@example.com', active: true },
  { id: 2, name: 'Bob', age: 30, email: 'bob@example.com', active: false },
  {
    id: 3,
    name: 'Charlie',
    age: 35,
    email: 'charlie@example.com',
    active: true,
  },
]

// Crear el motor de filtros
const filter = createFilterEngine(users)

// Buscar usuarios activos mayores de 25 años
const result = filter.findMany({
  where: {
    active: { equals: true },
    age: { gt: 25 },
  },
})

console.log(result.data) // [Charlie]
\`\`\`

## API Principal

### \`createFilterEngine<T>(dataSource: T[])\`

Crea un motor de filtros para una colección de datos.

**Parámetros:**

- \`dataSource\`: Array de objetos a filtrar

**Retorna:**

- Objeto con métodos \`findMany\` y \`findUnique\`

### \`findMany(query: FilterQuery<T>)\`

Busca múltiples elementos que coincidan con los criterios.

### \`findUnique(query: FilterQuery<T>)\`

Busca un único elemento que coincida con los criterios.

## Compatibilidad

- **Node.js**: >= 22.0.0
- **TypeScript**: >= 5.4.5
- **Navegadores**: Compatible con ES6+

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo \`LICENSE\` para más
detalles.`
  },
  {
    id: 'operadores',
    title: 'Operadores',
    content: `# Operadores de Filtrado

## Operadores de Comparación Básica

### \`equals\`

Igual a un valor específico.

\`\`\`typescript
// Buscar usuarios con nombre "Alice"
filter.findMany({
  where: { name: { equals: 'Alice' } },
})
\`\`\`

### \`not\`

No igual a un valor específico.

\`\`\`typescript
// Buscar usuarios que NO se llamen "Alice"
filter.findMany({
  where: { name: { not: 'Alice' } },
})
\`\`\`

### \`in\` / \`notIn\`

Dentro o fuera de un conjunto de valores.

\`\`\`typescript
// Buscar usuarios con nombres específicos
filter.findMany({
  where: { name: { in: ['Alice', 'Bob', 'Charlie'] } },
})

// Buscar usuarios que NO tengan estos nombres
filter.findMany({
  where: { name: { notIn: ['Alice', 'Bob'] } },
})
\`\`\`

## Operadores Numéricos

### \`lt\` / \`lte\` / \`gt\` / \`gte\`

Comparaciones numéricas.

\`\`\`typescript
// Usuarios menores de 30 años
filter.findMany({
  where: { age: { lt: 30 } },
})

// Usuarios de 25 años o más
filter.findMany({
  where: { age: { gte: 25 } },
})
\`\`\`

## Operadores de String

### \`contains\` / \`notContains\`

Contiene o no contiene una subcadena.

\`\`\`typescript
// Emails que contengan "example"
filter.findMany({
  where: { email: { contains: 'example' } },
})

// Emails que NO contengan "test"
filter.findMany({
  where: { email: { notContains: 'test' } },
})
\`\`\`

### \`startsWith\` / \`notStartsWith\`

Comienza o no comienza con una subcadena.

\`\`\`typescript
// Nombres que empiecen con "A"
filter.findMany({
  where: { name: { startsWith: 'A' } },
})
\`\`\`

### \`endsWith\` / \`notEndsWith\`

Termina o no termina con una subcadena.

\`\`\`typescript
// Emails que terminen en ".com"
filter.findMany({
  where: { email: { endsWith: '.com' } },
})
\`\`\`

### \`mode: 'insensitive'\`

Comparación insensible a mayúsculas/minúsculas.

\`\`\`typescript
// Buscar "alice" sin importar mayúsculas
filter.findMany({
  where: { name: { equals: 'alice', mode: 'insensitive' } },
})
\`\`\`

### \`regex\`

Filtrado con expresiones regulares.

\`\`\`typescript
// Emails que coincidan con un patrón
filter.findMany({
  where: { email: { regex: /^[a-z]+@example\\.com$/ } },
})

// Con flags personalizados
filter.findMany({
  where: { email: { regex: { pattern: 'example', flags: 'i' } } },
})
\`\`\`

## Operadores de Fecha y Número

### \`before\` / \`after\`

Para fechas y números.

\`\`\`typescript
// Usuarios creados antes de una fecha
filter.findMany({
  where: { createdAt: { before: new Date('2023-01-01') } },
})

// Usuarios con edad mayor a 25
filter.findMany({
  where: { age: { after: 25 } },
})
\`\`\`

### \`between\`

Rango entre dos valores.

\`\`\`typescript
// Usuarios entre 25 y 35 años
filter.findMany({
  where: { age: { between: [25, 35] } },
})
\`\`\`

## Operadores de Array

### \`has\` / \`hasEvery\` / \`hasSome\`

Para arrays de valores.

\`\`\`typescript
const users = [
  { id: 1, tags: ['admin', 'user'] },
  { id: 2, tags: ['user'] },
  { id: 3, tags: ['admin', 'moderator'] },
]

// Usuarios con tag "admin"
filter.findMany({
  where: { tags: { has: 'admin' } },
})

// Usuarios con TODOS los tags especificados
filter.findMany({
  where: { tags: { hasEvery: ['admin', 'user'] } },
})

// Usuarios con AL MENOS UNO de los tags especificados
filter.findMany({
  where: { tags: { hasSome: ['admin', 'moderator'] } },
})
\`\`\`

### \`length\`

Filtrado por longitud del array.

\`\`\`typescript
// Usuarios con más de 2 tags
filter.findMany({
  where: { tags: { length: { gt: 2 } } },
})
\`\`\`

## Operadores de Relación

### \`some\` / \`every\` / \`none\`

Para relaciones y arrays de objetos.

\`\`\`typescript
const users = [
  {
    id: 1,
    posts: [
      { title: 'Post 1', published: true },
      { title: 'Post 2', published: false },
    ],
  },
  {
    id: 2,
    posts: [{ title: 'Post 3', published: true }],
  },
]

// Usuarios con AL MENOS UN post publicado
filter.findMany({
  where: {
    posts: {
      some: { published: { equals: true } },
    },
  } as any,
})

// Usuarios con TODOS los posts publicados
filter.findMany({
  where: {
    posts: {
      every: { published: { equals: true } },
    },
  } as any,
})

// Usuarios con NINGÚN post publicado
filter.findMany({
  where: {
    posts: {
      none: { published: { equals: true } },
    },
  } as any,
})
\`\`\`

## Operadores Lógicos

### \`AND\` / \`OR\` / \`NOT\`

Combinación de múltiples condiciones.

\`\`\`typescript
// Usuarios activos Y mayores de 25 años
filter.findMany({
  where: {
    AND: [{ active: { equals: true } }, { age: { gt: 25 } }],
  },
})

// Usuarios activos O mayores de 30 años
filter.findMany({
  where: {
    OR: [{ active: { equals: true } }, { age: { gt: 30 } }],
  },
})

// Usuarios que NO sean "Alice"
filter.findMany({
  where: {
    NOT: { name: { equals: 'Alice' } },
  },
})
\`\`\`

## Operadores Especiales

### \`isNull\`

Verificar si un campo es null.

\`\`\`typescript
// Usuarios sin email
filter.findMany({
  where: { email: { isNull: true } },
})
\`\`\``
  },
  {
    id: 'paginacion',
    title: 'Paginación',
    content: `# Paginación y Ordenamiento

## Paginación

La librería soporta paginación para manejar grandes volúmenes de datos de manera eficiente.

### Uso Básico

\`\`\`typescript
// Obtener primera página con 10 elementos
const result = filter.findMany({
  where: { active: { equals: true } },
  pagination: {
    page: 1,
    size: 10,
  },
})

console.log(result.pagination)
// {
//   page: 1,
//   size: 10,
//   totalItems: 25,
//   totalPages: 3,
//   hasNext: true,
//   hasPrev: false
// }
\`\`\`

### Propiedades de Paginación

- **page**: Número de página (comienza en 1)
- **size**: Número de elementos por página
- **totalItems**: Total de elementos que coinciden con el filtro
- **totalPages**: Total de páginas disponibles
- **hasNext**: Indica si hay una página siguiente
- **hasPrev**: Indica si hay una página anterior

### Navegación entre Páginas

\`\`\`typescript
// Primera página
const firstPage = filter.findMany({
  where: { active: { equals: true } },
  pagination: { page: 1, size: 10 },
})

// Segunda página
const secondPage = filter.findMany({
  where: { active: { equals: true } },
  pagination: { page: 2, size: 10 },
})

// Última página
const lastPage = filter.findMany({
  where: { active: { equals: true } },
  pagination: { page: result.pagination.totalPages, size: 10 },
})
\`\`\`

## Ordenamiento

### Ordenamiento Básico

\`\`\`typescript
// Ordenar por edad ascendente
filter.findMany({
  where: { active: { equals: true } },
  orderBy: { age: 'asc' },
})

// Ordenar por nombre descendente
filter.findMany({
  where: { active: { equals: true } },
  orderBy: { name: 'desc' },
})
\`\`\`

### Ordenamiento Múltiple

\`\`\`typescript
// Ordenar por edad ascendente, luego por nombre descendente
filter.findMany({
  where: { active: { equals: true } },
  orderBy: {
    age: 'asc',
    name: 'desc'
  },
})
\`\`\`

### Direcciones de Ordenamiento

- **asc**: Orden ascendente (A-Z, 1-9)
- **desc**: Orden descendente (Z-A, 9-1)

## Combinando Paginación y Ordenamiento

\`\`\`typescript
const result = filter.findMany({
  where: {
    active: { equals: true },
    age: { gte: 18 }
  },
  pagination: {
    page: 1,
    size: 20
  },
  orderBy: {
    age: 'asc',
    name: 'asc'
  },
})
\`\`\`

## Ejemplos Prácticos

### Lista de Usuarios Paginada

\`\`\`typescript
const getUsersPage = (page: number, size: number, filters: any) => {
  return filter.findMany({
    where: filters,
    pagination: { page, size },
    orderBy: { createdAt: 'desc' },
  })
}

// Uso
const usersPage = getUsersPage(1, 10, { active: { equals: true } })
\`\`\`

### Búsqueda con Paginación

\`\`\`typescript
const searchUsers = (searchTerm: string, page: number = 1) => {
  return filter.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    pagination: { page, size: 15 },
    orderBy: { name: 'asc' },
  })
}
\`\`\`

### Filtrado de Productos con Paginación

\`\`\`typescript
const filterProducts = (
  category: string,
  priceRange: [number, number],
  page: number = 1
) => {
  return filter.findMany({
    where: {
      category: { equals: category },
      price: { between: priceRange },
    },
    pagination: { page, size: 12 },
    orderBy: { price: 'asc' },
  })
}
\`\`\`

## Mejores Prácticas

1. **Tamaño de página razonable**: Usa tamaños entre 10-50 elementos para mejor rendimiento
2. **Ordenamiento consistente**: Mantén un ordenamiento por defecto para resultados predecibles
3. **Validación de página**: Verifica que la página solicitada no exceda el total de páginas
4. **Caché de resultados**: Considera cachear resultados para consultas frecuentes

## Rendimiento

- La paginación mejora significativamente el rendimiento con grandes datasets
- El ordenamiento se aplica después del filtrado para mayor eficiencia
- Los índices en las propiedades de ordenamiento pueden mejorar el rendimiento`
  },
  {
    id: 'ejemplos',
    title: 'Ejemplos',
    content: `# Ejemplos Avanzados

## Filtros Complejos

### Consultas con Múltiples Condiciones

\`\`\`typescript
const result = filter.findMany({
  where: {
    OR: [
      {
        AND: [
          { age: { gte: 25 } },
          { email: { contains: 'example' } }
        ]
      },
      {
        AND: [
          { active: { equals: true } },
          { name: { startsWith: 'A' } }
        ]
      }
    ]
  },
  pagination: { page: 1, size: 20 },
  orderBy: { name: 'asc' }
})
\`\`\`

### Filtros con Relaciones Anidadas

\`\`\`typescript
const result = filter.findMany({
  where: {
    posts: {
      some: {
        AND: [
          { published: { equals: true } },
          { category: { in: ['tech', 'news'] } }
        ]
      }
    },
    profile: {
      every: {
        verified: { equals: true }
      }
    }
  } as any,
})
\`\`\`

## Casos de Uso Comunes

### Búsqueda de Usuarios

\`\`\`typescript
const searchUsers = (searchTerm: string, filters: any) => {
  return filter.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ],
      ...filters
    },
    pagination: { page: 1, size: 50 },
    orderBy: { name: 'asc' }
  })
}

// Uso
const results = searchUsers('john', {
  active: { equals: true },
  age: { gte: 18 }
})
\`\`\`

### Filtrado de Productos

\`\`\`typescript
const filterProducts = (
  category: string,
  priceRange: [number, number],
  tags: string[]
) => {
  return filter.findMany({
    where: {
      category: { equals: category },
      price: { between: priceRange },
      tags: { hasSome: tags }
    },
    pagination: { page: 1, size: 20 },
    orderBy: { price: 'asc' }
  })
}

// Uso
const products = filterProducts('electronics', [100, 500], ['wireless', 'bluetooth'])
\`\`\`

### Sistema de Notificaciones

\`\`\`typescript
const getNotifications = (userId: number, filters: any) => {
  return filter.findMany({
    where: {
      userId: { equals: userId },
      read: { equals: false },
      ...filters
    },
    pagination: { page: 1, size: 25 },
    orderBy: { createdAt: 'desc' }
  })
}

// Uso
const unreadNotifications = getNotifications(123, {
  type: { in: ['alert', 'message'] },
  priority: { gte: 2 }
})
\`\`\`

### Análisis de Datos

\`\`\`typescript
const getAnalytics = (dateRange: [Date, Date], metrics: string[]) => {
  return filter.findMany({
    where: {
      createdAt: { between: dateRange },
      metric: { in: metrics },
      value: { gt: 0 }
    },
    orderBy: { createdAt: 'asc' }
  })
}

// Uso
const analytics = getAnalytics(
  [new Date('2023-01-01'), new Date('2023-12-31')],
  ['pageviews', 'clicks', 'conversions']
)
\`\`\`

## Patrones Avanzados

### Filtros Dinámicos

\`\`\`typescript
const buildDynamicFilter = (filters: Record<string, any>) => {
  const whereClause: any = {}

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'string') {
        whereClause[key] = { contains: value, mode: 'insensitive' }
      } else if (Array.isArray(value)) {
        whereClause[key] = { in: value }
      } else if (typeof value === 'object' && value.min !== undefined) {
        whereClause[key] = { gte: value.min, lte: value.max }
      } else {
        whereClause[key] = { equals: value }
      }
    }
  })

  return whereClause
}

// Uso
const filters = {
  name: 'john',
  age: { min: 25, max: 35 },
  tags: ['admin', 'moderator']
}

const result = filter.findMany({
  where: buildDynamicFilter(filters)
})
\`\`\`

### Búsqueda con Autocompletado

\`\`\`typescript
const searchAutocomplete = (query: string, field: string) => {
  return filter.findMany({
    where: {
      [field]: {
        startsWith: query,
        mode: 'insensitive'
      }
    },
    pagination: { page: 1, size: 10 },
    orderBy: { [field]: 'asc' }
  })
}

// Uso
const suggestions = searchAutocomplete('al', 'name')
\`\`\`

### Filtros por Rango de Fechas

\`\`\`typescript
const getDateRangeFilter = (startDate: Date, endDate: Date) => {
  return {
    createdAt: {
      gte: startDate,
      lte: endDate
    }
  }
}

// Uso
const recentUsers = filter.findMany({
  where: {
    ...getDateRangeFilter(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
      new Date()
    ),
    active: { equals: true }
  }
})
\`\`\`

## Optimización de Rendimiento

### Consultas Eficientes

\`\`\`typescript
// ✅ Buena práctica: Filtros específicos
const efficientQuery = filter.findMany({
  where: {
    active: { equals: true },
    role: { in: ['admin', 'moderator'] }
  },
  pagination: { page: 1, size: 20 }
})

// ❌ Evitar: Consultas muy amplias
const inefficientQuery = filter.findMany({
  where: {
    OR: [
      { name: { contains: 'a' } },
      { email: { contains: 'a' } },
      { description: { contains: 'a' } }
    ]
  }
})
\`\`\`

### Caché de Consultas

\`\`\`typescript
const queryCache = new Map()

const cachedQuery = (key: string, queryFn: () => any) => {
  if (queryCache.has(key)) {
    return queryCache.get(key)
  }

  const result = queryFn()
  queryCache.set(key, result)
  return result
}

// Uso
const users = cachedQuery('active-users', () =>
  filter.findMany({
    where: { active: { equals: true } },
    pagination: { page: 1, size: 50 }
  })
)
\`\`\`

## Integración con APIs

### REST API Helper

\`\`\`typescript
const createFilterFromQuery = (queryParams: URLSearchParams) => {
  const where: any = {}

  // Parámetros de filtro
  if (queryParams.get('search')) {
    where.OR = [
      { name: { contains: queryParams.get('search'), mode: 'insensitive' } },
      { email: { contains: queryParams.get('search'), mode: 'insensitive' } }
    ]
  }

  if (queryParams.get('active')) {
    where.active = { equals: queryParams.get('active') === 'true' }
  }

  if (queryParams.get('minAge')) {
    where.age = { gte: parseInt(queryParams.get('minAge')!) }
  }

  return {
    where,
    pagination: {
      page: parseInt(queryParams.get('page') || '1'),
      size: parseInt(queryParams.get('size') || '20')
    },
    orderBy: {
      [queryParams.get('sortBy') || 'createdAt']:
      queryParams.get('sortOrder') || 'desc'
    }
  }
}

// Uso en API
const filterQuery = createFilterFromQuery(new URLSearchParams(
  'search=john&active=true&minAge=25&page=1&size=10&sortBy=name&sortOrder=asc'
))

const results = filter.findMany(filterQuery)
\`\`\`

## Testing

### Datos de Prueba

\`\`\`typescript
const createTestData = () => [
  { id: 1, name: 'Alice', age: 25, email: 'alice@test.com', active: true },
  { id: 2, name: 'Bob', age: 30, email: 'bob@test.com', active: false },
  { id: 3, name: 'Charlie', age: 35, email: 'charlie@test.com', active: true },
  { id: 4, name: 'Diana', age: 28, email: 'diana@test.com', active: true },
  { id: 5, name: 'Eve', age: 22, email: 'eve@test.com', active: false }
]

// Tests
const testFilter = createFilterEngine(createTestData())

// Test filtro básico
const activeUsers = testFilter.findMany({
  where: { active: { equals: true } }
})
console.log('Active users:', activeUsers.data.length) // 3

// Test filtro complejo
const complexFilter = testFilter.findMany({
  where: {
    AND: [
      { active: { equals: true } },
      { age: { gte: 25 } }
    ]
  }
})
console.log('Complex filter results:', complexFilter.data.length) // 3
\`\`\``
  }
];

export const getDocumentationFile = (id: string): DocFile | undefined => {
  return documentationFiles.find(doc => doc.id === id);
};

export const getAllDocumentationFiles = (): DocFile[] => {
  return documentationFiles;
};