export type InvoiceStatus = 'PENDING' | 'FINALIZED' | 'CANCELED'

export type PaymentMethod = 'CASH' | 'TRANSFER'

export interface InvoiceServiceItem {
  activityId: string
  activityName?: string
  price: number
  employeeId: string
}

export interface InvoiceProductItem {
  productId: string
  name?: string
  unitPrice: number
  quantity: number
}

export interface InvoiceTotals {
  servicesTotal: number
  productsTotal: number
  grandTotal: number
}

export interface InvoicePayment {
  method: PaymentMethod
  amountReceived?: number
  change?: number
}

export interface Invoice {
  id: string
  status: InvoiceStatus
  clientId: string
  services: InvoiceServiceItem[]
  products: InvoiceProductItem[]
  courtesyProductId?: string // Solo uno permitido
  comment?: string
  payment: InvoicePayment
  totals: InvoiceTotals
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  finalizedAt?: Date
  finalizedBy?: string
  canceledAt?: Date
  canceledBy?: string
}

export interface CreateInvoiceRequest {
  clientId: string
  services?: InvoiceServiceItem[]
  products?: InvoiceProductItem[]
  courtesyProductId?: string
  comment?: string
  payment: InvoicePayment
  createdBy: string
}

export interface UpdateInvoiceRequest {
  id: string
  clientId?: string
  services?: InvoiceServiceItem[]
  products?: InvoiceProductItem[]
  courtesyProductId?: string | null // null para eliminar cortesía
  comment?: string | null
  payment?: InvoicePayment
  status?: InvoiceStatus
  finalizedAt?: Date
  finalizedBy?: string
  canceledAt?: Date
  canceledBy?: string
  updatedBy: string
}
