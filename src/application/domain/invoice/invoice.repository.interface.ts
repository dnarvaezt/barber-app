import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  ClientInvoiceFilters,
  CreateInvoiceRequest,
  EmployeeServiceHistoryFilters,
  EmployeeServiceHistoryRecord,
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
  // Consultas específicas
  findByClient(
    clientId: string,
    filters: ClientInvoiceFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>>
  findEmployeeServiceHistory(
    employeeId: string,
    filters: EmployeeServiceHistoryFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<EmployeeServiceHistoryRecord>>
  // Agregados para resúmenes
  getClientInvoicesAggregate(
    clientId: string,
    filters: ClientInvoiceFilters
  ): Promise<{ count: number; totalAmount: number }>
  getEmployeeServiceHistoryAggregate(
    employeeId: string,
    filters: EmployeeServiceHistoryFilters
  ): Promise<{ count: number }>
  create(data: CreateInvoiceRequest): Promise<Invoice>
  update(data: UpdateInvoiceRequest): Promise<Invoice>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
