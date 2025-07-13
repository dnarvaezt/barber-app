# 🚀 Bienvenido a Andes Filter

**@andes-project/filter** es una potente librería de filtrado desarrollada en TypeScript que te permite filtrar, paginar y ordenar fácilmente datos de cualquier dataset con una sintaxis intuitiva y adaptable al contexto de tus datos.

## ✨ Características Principales

- **Filtrado Avanzado**: Filtra uno o muchos elementos específicos de tu dataset
- **Paginación Inteligente**: Maneja grandes volúmenes de datos eficientemente
- **Ordenamiento Flexible**: Ordena por múltiples criterios
- **Sintaxis Intuitiva**: API fácil de usar y entender

## 📦 Instalación

Instala la librería usando npm:

```bash
npm install @andes-project/filter
```

O usando yarn:

```bash
yarn add @andes-project/filter
```

## 🔗 Enlaces Útiles

- **NPM Package**: [@andes-project/filter](https://www.npmjs.com/package/@andes-project/filter)
- **GitHub Repository**: [AndesProject/andes-filter](https://github.com/AndesProject/andes-filter)

## 📊 Coverage y Calidad

La librería mantiene altos estándares de calidad con:

- Cobertura de pruebas exhaustiva
- Código optimizado para rendimiento
- Documentación completa
- Ejemplos prácticos para todos los casos de uso

## 🚀 Comenzando

```typescript
import { Filter } from '@andes-project/filter'

const data = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false },
  { id: 3, name: 'Charlie', age: 35, active: true },
]

const filter = new Filter(data)

// Filtrado básico
const activeUsers = filter.findMany({
  where: { active: { equals: true } },
})

// Con paginación y ordenamiento
const result = filter.findMany({
  where: { age: { gte: 25 } },
  pagination: { page: 1, size: 10 },
  orderBy: { name: 'asc' },
})
```

¡Explora la documentación para descubrir todas las capacidades de **@andes-project/filter**!
