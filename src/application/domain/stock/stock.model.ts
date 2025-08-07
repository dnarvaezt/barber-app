export type StockMovementType = 'IN' | 'OUT'

export interface StockMovement {
  id: string
  productId: string
  type: StockMovementType
  quantity: number
  date: Date
  note?: string
  userId?: string
  createdAt: Date
}

export interface CreateStockMovementRequest {
  productId: string
  type: StockMovementType
  quantity: number
  date?: Date
  note?: string
  userId?: string
}

export interface StockMovementFilters {
  dateFrom?: Date
  dateTo?: Date
  type?: StockMovementType
  productId?: string
  productIds?: string[]
}

export interface ProductStockSummary {
  productId: string
  stock: number
}
