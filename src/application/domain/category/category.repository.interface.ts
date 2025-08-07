import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './category.model'

export interface CategoryRepository {
  findAll(pagination: PaginationParams): Promise<PaginatedResponse<Category>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Category>>
  find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Category>>
  create(data: CreateCategoryRequest): Promise<Category>
  update(data: UpdateCategoryRequest): Promise<Category>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
