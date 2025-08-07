import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './category.model'
import type { CategoryRepository } from './category.repository.interface'

export class CategoryService {
  private readonly categoryRepository: CategoryRepository

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository
  }

  // Método para obtener todas las categorías
  async getAllCategories(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Category>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)

    // Aplicar ordenamiento por nombre por defecto si no se especifica
    const paginationWithSort = {
      ...validatedPagination,
      sortBy: validatedPagination.sortBy || 'name',
      sortOrder: validatedPagination.sortOrder || 'asc',
    }

    return this.categoryRepository.findAll(paginationWithSort)
  }

  // Método para buscar categorías
  async findCategories(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Category>> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.categoryRepository.find(searchTerm, validatedPagination)
  }

  // Método para obtener categoría por ID
  async getCategoryById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Category>> {
    if (!id) {
      throw new Error('Category ID is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.categoryRepository.findById(id, validatedPagination)
  }

  // Método para crear categoría
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    this.validateCategoryData(categoryData)

    const defaultPagination: PaginationParams = { page: 1, limit: 100 }
    const existingCategories = await this.categoryRepository.find(
      categoryData.name,
      defaultPagination
    )
    const existingCategory = existingCategories.data.find(
      category =>
        category.name.toLowerCase() === categoryData.name?.toLowerCase()
    )
    if (existingCategory) {
      throw new Error('Category with this name already exists')
    }

    return this.categoryRepository.create(categoryData)
  }

  // Método para actualizar categoría
  async updateCategory(categoryData: UpdateCategoryRequest): Promise<Category> {
    if (!categoryData.id) {
      throw new Error('Category ID is required for update')
    }

    const defaultPagination: PaginationParams = { page: 1, limit: 1 }
    const existingCategoryResponse = await this.categoryRepository.findById(
      categoryData.id,
      defaultPagination
    )
    const existingCategory = existingCategoryResponse.data[0]
    if (!existingCategory) {
      throw new Error('Category not found')
    }

    if (
      categoryData.name &&
      categoryData.name.toLowerCase() !== existingCategory.name.toLowerCase()
    ) {
      const categoriesWithName = await this.categoryRepository.find(
        categoryData.name,
        defaultPagination
      )
      const categoryWithName = categoriesWithName.data.find(
        category =>
          category.name.toLowerCase() === categoryData.name?.toLowerCase()
      )
      if (categoryWithName) {
        throw new Error('Category name is already in use')
      }
    }

    return this.categoryRepository.update(categoryData)
  }

  // Método para eliminar categoría
  async deleteCategory(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Category ID is required')
    }

    const categoryExists = await this.categoryRepository.exists(id)

    if (!categoryExists) {
      throw new Error('Category not found')
    }

    const result = await this.categoryRepository.delete(id)
    return result
  }

  private validateCategoryData(categoryData: CreateCategoryRequest): void {
    if (!categoryData.name || categoryData.name.trim().length === 0) {
      throw new Error('Category name is required')
    }

    if (categoryData.name.trim().length < 2) {
      throw new Error('Category name must be at least 2 characters long')
    }

    if (categoryData.name.trim().length > 50) {
      throw new Error('Category name must be less than 50 characters')
    }

    if (!categoryData.createdBy) {
      throw new Error('Created by user ID is required')
    }
  }
}
