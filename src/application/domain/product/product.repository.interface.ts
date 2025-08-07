import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from './product.model'

export interface ProductRepository {
  findAll(pagination: PaginationParams): Promise<PaginatedResponse<Product>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>>
  find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>>
  findByCategory(
    categoryId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>>
  create(data: CreateProductRequest): Promise<Product>
  update(data: UpdateProductRequest): Promise<Product>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
