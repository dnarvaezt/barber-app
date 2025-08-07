import { CategoryRepositoryMemory } from './category.repository.memory'
import { CategoryService } from './category.service'

// Crear instancia del repositorio
const categoryRepository = new CategoryRepositoryMemory()

// Crear instancia del servicio
export const categoryService = new CategoryService(categoryRepository)
