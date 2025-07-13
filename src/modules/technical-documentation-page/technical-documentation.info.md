Imagina que tienes una lista de personas y quieres encontrar a alguien específico. En lugar de revisar una por una, esta librería te ayuda a hacer búsquedas inteligentes de forma muy fácil.

**Es como tener un asistente que te ayuda a encontrar exactamente lo que buscas en tus datos.**

## 🚀 ¿Cómo empezar?

### Paso 1: Crear tu "motor de búsqueda"

```typescript
import { createFilterEngine } from '@andes-project/filter'

// Tu lista de datos (puede ser cualquier cosa: usuarios, productos, etc.)
const personas = [
  { id: 1, nombre: 'Ana', edad: 25, ciudad: 'Bogotá', activo: true },
  { id: 2, nombre: 'Bob', edad: 30, ciudad: 'Medellín', activo: false },
  { id: 3, nombre: 'Carlos', edad: 35, ciudad: 'Bogotá', activo: true },
]

// Crear tu motor de búsqueda
const buscador = createFilterEngine(personas)
```

### Paso 2: ¡Empezar a buscar!

```typescript
// Buscar todas las personas activas
const activos = buscador.findMany({
  where: { activo: { equals: true } },
})

console.log(activos.data) // [Ana, Carlos]
```

## 🔍 Los 3 Métodos Principales

### 1️⃣ `createFilterEngine(datos)`

**¿Qué hace?** Crea tu motor de búsqueda personal.

**Entrada:** Tu lista de datos
**Salida:** Un buscador que puedes usar

```typescript
const buscador = createFilterEngine(miListaDeDatos)
```

### 2️⃣ `findMany(consulta)`

**¿Qué hace?** Encuentra varios elementos que cumplan tus condiciones.

**Entrada:** Lo que quieres buscar
**Salida:** Lista de elementos encontrados + información de páginas

```typescript
const resultado = buscador.findMany({
  where: { edad: { gte: 25 } }, // Buscar mayores de 25
  pagination: { page: 1, size: 10 }, // Primera página, 10 elementos
  orderBy: { nombre: 'asc' }, // Ordenar por nombre A-Z
})
```

### 3️⃣ `findUnique(consulta)`

**¿Qué hace?** Encuentra un solo elemento específico.

**Entrada:** Lo que quieres buscar
**Salida:** El elemento encontrado o `null` si no existe

```typescript
const persona = buscador.findUnique({
  where: { id: { equals: 1 } },
})
// Resultado: { id: 1, nombre: 'Ana', edad: 25, ... }
```

## 🛠️ Métodos Extra Útiles

### 4️⃣ `queryFilterToUrlParams(filtro)`

**¿Qué hace?** Convierte tu búsqueda en un texto para la URL.

**Entrada:** Tu filtro de búsqueda
**Salida:** Texto codificado para usar en URLs

```typescript
const filtro = { where: { activo: { equals: true } } }
const urlParams = queryFilterToUrlParams(filtro)
// Resultado: "eyJ3aGVyZSI6eyJhY3Rpdm8iOnsiZXF1YWxzIjp0cnVlfX19"
```

### 5️⃣ `urlParamsToQueryFilter(texto)`

**¿Qué hace?** Convierte el texto de la URL de vuelta a tu filtro.

**Entrada:** Texto codificado de la URL
**Salida:** Tu filtro original

```typescript
const filtroRecuperado = urlParamsToQueryFilter(urlParams)
// Resultado: { where: { activo: { equals: true } } }
```

## 🎯 Operadores de Búsqueda (Los más usados)

### 🔍 Búsquedas Básicas

**Buscar algo exacto:**

```typescript
{
  nombre: {
    equals: 'Ana'
  }
} // Nombre exactamente "Ana"
{
  edad: {
    equals: 25
  }
} // Edad exactamente 25
```

**Buscar algo diferente:**

```typescript
{
  nombre: {
    not: 'Ana'
  }
} // Cualquier nombre excepto "Ana"
{
  activo: {
    not: false
  }
} // Cualquier cosa excepto false
```

**Buscar en una lista:**

```typescript
{ ciudad: { in: ['Bogotá', 'Medellín'] } }  // Bogotá O Medellín
{ edad: { notIn: [18, 19, 20] } }           // Cualquier edad excepto 18, 19, 20
```

### 🔢 Comparaciones Numéricas

```typescript
{
  edad: {
    lt: 30
  }
} // Menor que 30
{
  edad: {
    lte: 30
  }
} // Menor o igual a 30
{
  edad: {
    gt: 25
  }
} // Mayor que 25
{
  edad: {
    gte: 25
  }
} // Mayor o igual a 25
{
  edad: {
    between: [25, 35]
  }
} // Entre 25 y 35 (incluyendo)
```

### 📝 Búsquedas de Texto

```typescript
{ nombre: { contains: 'an' } }          // Contiene "an" (Ana, Juan, etc.)
{ email: { startsWith: 'ana' } }        // Empieza con "ana"
{ email: { endsWith: '.com' } }         // Termina con ".com"
{ nombre: { contains: 'ana', mode: 'insensitive' } }  // Ignorar mayúsculas
```

### 📅 Fechas y Tiempo

```typescript
{
  fechaNacimiento: {
    before: new Date('2000-01-01')
  }
} // Antes del 2000
{
  fechaCreacion: {
    after: new Date('2023-01-01')
  }
} // Después del 2023
{
  edad: {
    between: [18, 65]
  }
} // Entre 18 y 65 años
```

### 📦 Listas y Arrays

```typescript
{
  etiquetas: {
    has: 'admin'
  }
} // Tiene la etiqueta "admin"
{
  etiquetas: {
    hasSome: ['admin', 'moderador']
  }
} // Tiene al menos una
{
  etiquetas: {
    hasEvery: ['admin', 'usuario']
  }
} // Tiene todas
{
  etiquetas: {
    length: {
      gt: 2
    }
  }
} // Tiene más de 2 etiquetas
```

### 🧠 Combinaciones Lógicas

**Y lógico (todas deben cumplirse):**

```typescript
{
  AND: [{ activo: { equals: true } }, { edad: { gte: 25 } }]
}
```

**O lógico (al menos una debe cumplirse):**

```typescript
{
  OR: [{ ciudad: { equals: 'Bogotá' } }, { ciudad: { equals: 'Medellín' } }]
}
```

**No lógico (negar una condición):**

```typescript
{
  NOT: {
    nombre: {
      equals: 'Ana'
    }
  }
}
```

## 📊 Paginación (Para listas grandes)

```typescript
const resultado = buscador.findMany({
  where: { activo: { equals: true } },
  pagination: {
    page: 1, // Primera página
    size: 10, // 10 elementos por página
  },
})

console.log(resultado.pagination)
// {
//   page: 1,           // Página actual
//   size: 10,          // Elementos por página
//   totalItems: 25,    // Total de elementos
//   totalPages: 3,     // Total de páginas
//   hasNext: true,     // ¿Hay siguiente página?
//   hasPrev: false     // ¿Hay página anterior?
// }
```

## 🔄 Ordenamiento

```typescript
// Ordenar por nombre A-Z
{ orderBy: { nombre: 'asc' } }

// Ordenar por edad de mayor a menor
{ orderBy: { edad: 'desc' } }

// Ordenar por múltiples campos
{ orderBy: { ciudad: 'asc', nombre: 'asc' } }
```

## 🎨 Ejemplos Prácticos

### 🔍 Búsqueda de Usuarios Avanzada

```typescript
const buscarUsuarios = (termino, filtros = {}) => {
  return buscador.findMany({
    where: {
      OR: [
        { nombre: { contains: termino, mode: 'insensitive' } },
        { email: { contains: termino, mode: 'insensitive' } },
      ],
      ...filtros,
    },
    pagination: { page: 1, size: 20 },
    orderBy: { nombre: 'asc' },
  })
}

// Uso:
const resultado = buscarUsuarios('ana', { activo: { equals: true } })
```

### 🛍️ Filtro de Productos

```typescript
const filtrarProductos = (categoria, precioMin, precioMax, etiquetas) => {
  return buscador.findMany({
    where: {
      categoria: { equals: categoria },
      precio: { between: [precioMin, precioMax] },
      etiquetas: { hasSome: etiquetas },
    },
    pagination: { page: 1, size: 20 },
    orderBy: { precio: 'asc' },
  })
}

// Uso:
const productos = filtrarProductos('ropa', 10000, 50000, ['nuevo', 'oferta'])
```

### 📱 Búsqueda Compleja

```typescript
const búsquedaCompleja = buscador.findMany({
  where: {
    OR: [
      {
        AND: [{ edad: { gte: 25 } }, { email: { contains: 'gmail' } }],
      },
      {
        AND: [{ activo: { equals: true } }, { nombre: { startsWith: 'A' } }],
      },
    ],
  },
  pagination: { page: 1, size: 15 },
  orderBy: { nombre: 'asc' },
})
```

## 💡 Consejos Útiles

1. **Empieza simple:** Usa `equals` y `contains` para búsquedas básicas
2. **Combina operadores:** Usa `AND`, `OR` para búsquedas complejas
3. **Usa paginación:** Para listas grandes, siempre usa paginación
4. **Ignora mayúsculas:** Usa `mode: 'insensitive'` para búsquedas de texto
5. **Guarda filtros:** Usa `queryFilterToUrlParams` para guardar búsquedas en URLs

## 🚀 ¿Por qué usar esta librería?

- ✅ **Fácil de usar:** Sintaxis simple y clara
- ✅ **Potente:** Puedes hacer búsquedas muy complejas
- ✅ **Rápida:** Optimizada para grandes cantidades de datos
- ✅ **Segura:** TypeScript te ayuda a evitar errores
- ✅ **Flexible:** Funciona con cualquier tipo de datos
- ✅ **Mantenible:** Código limpio y fácil de entender

¡Con estos métodos tienes todo lo que necesitas para crear búsquedas inteligentes en tu aplicación! 🎯
