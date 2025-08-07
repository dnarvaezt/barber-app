import { ProductRepositoryMemory } from './product.repository.memory'
import { ProductService } from './product.service'

// Crear instancia del repositorio
const productRepository = new ProductRepositoryMemory()

// Crear instancia del servicio
export const productService = new ProductService(productRepository)
