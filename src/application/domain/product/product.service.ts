import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from './product.model'
import type { ProductRepository } from './product.repository.interface'

export class ProductService {
  private readonly productRepository: ProductRepository

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  // Método para obtener todos los productos
  async getAllProducts(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)

    // Aplicar ordenamiento por nombre por defecto si no se especifica
    const paginationWithSort = {
      ...validatedPagination,
      sortBy: validatedPagination.sortBy || 'name',
      sortOrder: validatedPagination.sortOrder || 'asc',
    }

    return this.productRepository.findAll(paginationWithSort)
  }

  // Método para buscar productos
  async findProducts(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.productRepository.find(searchTerm, validatedPagination)
  }

  // Método para obtener producto por ID
  async getProductById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    if (!id) {
      throw new Error('Product ID is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.productRepository.findById(id, validatedPagination)
  }

  // Método para obtener productos por categoría
  async getProductsByCategory(
    categoryId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Product>> {
    if (!categoryId) {
      throw new Error('Category ID is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.productRepository.findByCategory(
      categoryId,
      validatedPagination
    )
  }

  // Método para crear producto
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    this.validateProductData(productData)

    const defaultPagination: PaginationParams = { page: 1, limit: 100 }
    const existingProducts = await this.productRepository.find(
      productData.name,
      defaultPagination
    )
    const existingProduct = existingProducts.data.find(
      product => product.name.toLowerCase() === productData.name.toLowerCase()
    )
    if (existingProduct) {
      throw new Error('Product with this name already exists')
    }

    return this.productRepository.create(productData)
  }

  // Método para actualizar producto
  async updateProduct(productData: UpdateProductRequest): Promise<Product> {
    if (!productData.id) {
      throw new Error('Product ID is required for update')
    }

    const defaultPagination: PaginationParams = { page: 1, limit: 1 }
    const existingProductResponse = await this.productRepository.findById(
      productData.id,
      defaultPagination
    )
    const existingProduct = existingProductResponse.data[0]
    if (!existingProduct) {
      throw new Error('Product not found')
    }

    if (
      productData.name &&
      productData.name.toLowerCase() !== existingProduct.name.toLowerCase()
    ) {
      const productsWithName = await this.productRepository.find(
        productData.name,
        defaultPagination
      )
      const productWithName = productsWithName.data.find(
        product =>
          product.name.toLowerCase() === productData.name?.toLowerCase()
      )
      if (productWithName) {
        throw new Error('Product name is already in use')
      }
    }

    return this.productRepository.update(productData)
  }

  // Método para eliminar producto
  async deleteProduct(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Product ID is required')
    }

    const productExists = await this.productRepository.exists(id)

    if (!productExists) {
      throw new Error('Product not found')
    }

    const result = await this.productRepository.delete(id)
    return result
  }

  private validateProductData(productData: CreateProductRequest): void {
    if (!productData.name || productData.name.trim().length === 0) {
      throw new Error('Product name is required')
    }

    if (productData.name.trim().length < 2) {
      throw new Error('Product name must be at least 2 characters long')
    }

    if (productData.name.trim().length > 100) {
      throw new Error('Product name must be less than 100 characters')
    }

    if (
      !productData.description ||
      productData.description.trim().length === 0
    ) {
      throw new Error('Product description is required')
    }

    if (productData.description.trim().length < 10) {
      throw new Error('Product description must be at least 10 characters long')
    }

    if (productData.description.trim().length > 500) {
      throw new Error('Product description must be less than 500 characters')
    }

    if (!productData.category || productData.category.trim().length === 0) {
      throw new Error('Product category is required')
    }

    if (productData.category.trim().length < 2) {
      throw new Error('Product category must be at least 2 characters long')
    }

    if (productData.category.trim().length > 50) {
      throw new Error('Product category must be less than 50 characters')
    }

    if (productData.costPrice < 0) {
      throw new Error('Cost price cannot be negative')
    }

    if (productData.costPrice > 999999.99) {
      throw new Error('Cost price cannot exceed 999,999.99')
    }

    if (productData.salePrice < 0) {
      throw new Error('Sale price cannot be negative')
    }

    if (productData.salePrice > 999999.99) {
      throw new Error('Sale price cannot exceed 999,999.99')
    }

    if (productData.salePrice < productData.costPrice) {
      throw new Error('Sale price cannot be less than cost price')
    }

    if (!productData.categoryId || productData.categoryId.trim().length === 0) {
      throw new Error('Category ID is required')
    }

    if (!productData.createdBy) {
      throw new Error('Created by user ID is required')
    }
  }
}
