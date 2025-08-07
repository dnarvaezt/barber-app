import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from './product.model'
import type { ProductRepository } from './product.repository.interface'

export class ProductRepositoryMemory implements ProductRepository {
  private products: Product[] = []

  constructor() {
    // Datos de ejemplo para testing
    this.products = [
      {
        id: 'prod_001',
        name: 'Aceite para Barba Premium',
        description:
          'Aceite hidratante de alta calidad para mantener la barba suave y brillante. Contiene ingredientes naturales como jojoba y argán.',
        category: 'Cuidado Personal',
        costPrice: 15000,
        salePrice: 25000,
        categoryId: 'cat_001',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'prod_002',
        name: 'Cepillo de Barba Profesional',
        description:
          'Cepillo de cerdas naturales para peinar y dar forma a la barba. Ideal para distribuir aceites y ceras.',
        category: 'Accesorios',
        costPrice: 8000,
        salePrice: 15000,
        categoryId: 'cat_002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'prod_003',
        name: 'Cera Modeladora para Barba',
        description:
          'Cera de abeja natural para dar forma y mantener el estilo de la barba. Proporciona un agarre fuerte y natural.',
        category: 'Cuidado Personal',
        costPrice: 12000,
        salePrice: 20000,
        categoryId: 'cat_001',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'prod_004',
        name: 'Tijeras de Barba Profesionales',
        description:
          'Tijeras de alta precisión para recortar y dar forma a la barba. Hojas de acero inoxidable de calidad profesional.',
        category: 'Herramientas',
        costPrice: 25000,
        salePrice: 45000,
        categoryId: 'cat_003',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'prod_005',
        name: 'Shampoo para Barba',
        description:
          'Shampoo especializado para limpiar y nutrir la barba. Libre de sulfatos y con ingredientes hidratantes.',
        category: 'Cuidado Personal',
        costPrice: 18000,
        salePrice: 30000,
        categoryId: 'cat_001',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'prod_006',
        name: 'Kit de Barba Completo',
        description:
          'Kit completo que incluye aceite, cera, cepillo y tijeras. Todo lo necesario para el cuidado profesional de la barba.',
        category: 'Kits',
        costPrice: 45000,
        salePrice: 75000,
        categoryId: 'cat_004',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
    ]
  }

  async findAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validatedPagination

    // Ordenar productos
    const sortedProducts = [...this.products].sort((a, b) => {
      const aValue = a[sortBy as keyof Product] as string | number
      const bValue = b[sortBy as keyof Product] as string | number

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }
      return 0
    })

    // Calcular paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

    return {
      data: paginatedProducts,
      meta: {
        page,
        limit,
        total: this.products.length,
        totalPages: Math.ceil(this.products.length / limit),
        hasNextPage: endIndex < this.products.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const product = this.products.find(prod => prod.id === id)

    return {
      data: product ? [product] : [],
      meta: {
        page: validatedPagination.page,
        limit: validatedPagination.limit,
        total: product ? 1 : 0,
        totalPages: product ? 1 : 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validatedPagination

    // Filtrar productos que coincidan con el término de búsqueda
    const filteredProducts = this.products.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Ordenar productos filtrados
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aValue = a[sortBy as keyof Product] as string | number
      const bValue = b[sortBy as keyof Product] as string | number

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }
      return 0
    })

    // Calcular paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

    return {
      data: paginatedProducts,
      meta: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findByCategory(
    categoryId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validatedPagination

    // Filtrar productos por categoría
    const filteredProducts = this.products.filter(
      product => product.categoryId === categoryId
    )

    // Ordenar productos filtrados
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aValue = a[sortBy as keyof Product] as string | number
      const bValue = b[sortBy as keyof Product] as string | number

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }
      return 0
    })

    // Calcular paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

    return {
      data: paginatedProducts,
      meta: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async create(data: CreateProductRequest): Promise<Product> {
    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      costPrice: data.costPrice,
      salePrice: data.salePrice,
      categoryId: data.categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    }

    this.products.push(newProduct)
    return newProduct
  }

  async update(data: UpdateProductRequest): Promise<Product> {
    const productIndex = this.products.findIndex(prod => prod.id === data.id)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    const updatedProduct: Product = {
      ...this.products[productIndex],
      ...(data.name && { name: data.name.trim() }),
      ...(data.description && { description: data.description.trim() }),
      ...(data.category && { category: data.category.trim() }),
      ...(data.costPrice !== undefined && { costPrice: data.costPrice }),
      ...(data.salePrice !== undefined && { salePrice: data.salePrice }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      updatedAt: new Date(),
      updatedBy: data.updatedBy,
    }

    this.products[productIndex] = updatedProduct
    return updatedProduct
  }

  async delete(id: string): Promise<boolean> {
    const productIndex = this.products.findIndex(prod => prod.id === id)
    if (productIndex === -1) {
      return false
    }

    this.products.splice(productIndex, 1)
    return true
  }

  async exists(id: string): Promise<boolean> {
    return this.products.some(prod => prod.id === id)
  }
}
