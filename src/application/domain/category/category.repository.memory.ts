import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './category.model'
import type { CategoryRepository } from './category.repository.interface'

export class CategoryRepositoryMemory implements CategoryRepository {
  private categories: Category[] = []

  constructor() {
    // Datos de ejemplo para testing
    this.categories = [
      {
        id: 'cat_001',
        name: 'Cortes de Cabello',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'cat_002',
        name: 'Barba',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'cat_003',
        name: 'Tratamientos',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'cat_004',
        name: 'Coloración',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'cat_005',
        name: 'Peinados',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
    ]
  }

  async findAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Category>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validatedPagination

    // Ordenar categorías
    const sortedCategories = [...this.categories].sort((a, b) => {
      const aValue = a[sortBy as keyof Category] as string
      const bValue = b[sortBy as keyof Category] as string

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    // Calcular paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCategories = sortedCategories.slice(startIndex, endIndex)

    return {
      data: paginatedCategories,
      meta: {
        page,
        limit,
        total: this.categories.length,
        totalPages: Math.ceil(this.categories.length / limit),
        hasNextPage: endIndex < this.categories.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Category>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const category = this.categories.find(cat => cat.id === id)

    return {
      data: category ? [category] : [],
      meta: {
        page: validatedPagination.page,
        limit: validatedPagination.limit,
        total: category ? 1 : 0,
        totalPages: category ? 1 : 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Category>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validatedPagination

    // Filtrar categorías que coincidan con el término de búsqueda
    const filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Ordenar categorías filtradas
    const sortedCategories = filteredCategories.sort((a, b) => {
      const aValue = a[sortBy as keyof Category] as string
      const bValue = b[sortBy as keyof Category] as string

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    // Calcular paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCategories = sortedCategories.slice(startIndex, endIndex)

    return {
      data: paginatedCategories,
      meta: {
        page,
        limit,
        total: filteredCategories.length,
        totalPages: Math.ceil(filteredCategories.length / limit),
        hasNextPage: endIndex < filteredCategories.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    const newCategory: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    }

    this.categories.push(newCategory)
    return newCategory
  }

  async update(data: UpdateCategoryRequest): Promise<Category> {
    const categoryIndex = this.categories.findIndex(cat => cat.id === data.id)
    if (categoryIndex === -1) {
      throw new Error('Category not found')
    }

    const updatedCategory: Category = {
      ...this.categories[categoryIndex],
      ...(data.name && { name: data.name.trim() }),
      updatedAt: new Date(),
      updatedBy: data.updatedBy,
    }

    this.categories[categoryIndex] = updatedCategory
    return updatedCategory
  }

  async delete(id: string): Promise<boolean> {
    const categoryIndex = this.categories.findIndex(cat => cat.id === id)
    if (categoryIndex === -1) {
      return false
    }

    this.categories.splice(categoryIndex, 1)
    return true
  }

  async exists(id: string): Promise<boolean> {
    return this.categories.some(cat => cat.id === id)
  }
}
