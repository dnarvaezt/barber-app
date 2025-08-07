export interface Activity {
  id: string
  name: string
  price: number
  categoryId: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface CreateActivityRequest {
  name: string
  price: number
  categoryId: string
  createdBy: string
}

export interface UpdateActivityRequest {
  id: string
  name?: string
  price?: number
  categoryId?: string
  updatedBy: string
}
