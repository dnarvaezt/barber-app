export interface Product {
  id: string
  name: string
  description: string
  category: string
  costPrice: number
  salePrice: number
  categoryId: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface CreateProductRequest {
  name: string
  description: string
  category: string
  costPrice: number
  salePrice: number
  categoryId: string
  createdBy: string
}

export interface UpdateProductRequest {
  id: string
  name?: string
  description?: string
  category?: string
  costPrice?: number
  salePrice?: number
  categoryId?: string
  updatedBy: string
}
