import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  CreateInvoiceRequest,
  Invoice,
  UpdateInvoiceRequest,
} from './invoice.model'

export interface InvoiceRepository {
  findAll(pagination: PaginationParams): Promise<PaginatedResponse<Invoice>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>>
  find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>>
  create(data: CreateInvoiceRequest): Promise<Invoice>
  update(data: UpdateInvoiceRequest): Promise<Invoice>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
