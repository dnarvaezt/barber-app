export interface Category {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface CreateCategoryRequest {
  name: string
  createdBy: string
}

export interface UpdateCategoryRequest {
  id: string
  name?: string
  updatedBy: string
}
