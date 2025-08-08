import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  ClientInvoiceFilters,
  CreateInvoiceRequest,
  EmployeeServiceHistoryFilters,
  EmployeeServiceHistoryRecord,
  Invoice,
  UpdateInvoiceRequest,
} from './invoice.model'
import type { InvoiceRepository } from './invoice.repository.interface'

function calculateTotals(
  services: Invoice['services'],
  products: Invoice['products']
): Invoice['totals'] {
  const servicesTotal = services.reduce((sum, s) => sum + (s.price || 0), 0)
  const productsTotal = products.reduce(
    (sum, p) => sum + p.unitPrice * p.quantity,
    0
  )
  return {
    servicesTotal,
    productsTotal,
    grandTotal: servicesTotal + productsTotal,
  }
}

export class InvoiceRepositoryMemory implements InvoiceRepository {
  private invoices: Invoice[] = []

  async findAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>> {
    const validated = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validated

    const sorted = sortBy
      ? [...this.invoices].sort((a: any, b: any) => {
          const aValue = a[sortBy as keyof Invoice]
          const bValue = b[sortBy as keyof Invoice]
          if (aValue == null || bValue == null) return 0
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
          if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'asc'
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime()
          }
          return 0
        })
      : this.invoices

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = sorted.slice(startIndex, endIndex)

    return {
      data,
      meta: {
        page,
        limit,
        total: this.invoices.length,
        totalPages: Math.ceil(this.invoices.length / limit),
        hasNextPage: endIndex < this.invoices.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>> {
    const validated = PaginationHelper.validateParams(pagination)
    const inv = this.invoices.find(i => i.id === id)
    return {
      data: inv ? [inv] : [],
      meta: {
        page: validated.page,
        limit: validated.limit,
        total: inv ? 1 : 0,
        totalPages: inv ? 1 : 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>> {
    const validated = PaginationHelper.validateParams(pagination)
    const term = searchTerm.trim().toLowerCase()
    const filtered = this.invoices.filter(i => {
      if (i.comment && i.comment.toLowerCase().includes(term)) return true
      if (i.id.toLowerCase().includes(term)) return true
      return false
    })
    const { page, limit } = validated
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = filtered.slice(startIndex, endIndex)
    return {
      data,
      meta: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNextPage: endIndex < filtered.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findByClient(
    clientId: string,
    filters: ClientInvoiceFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>> {
    const validated = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validated

    // Filtrar por cliente y rango de fechas
    const start = new Date(filters.dateFrom)
    start.setHours(0, 0, 0, 0)
    const end = new Date(filters.dateTo)
    end.setHours(23, 59, 59, 999)

    const filtered = this.invoices.filter(inv => {
      if (inv.clientId !== clientId) return false
      const date = inv.createdAt
      if (date < start || date > end) return false
      if (filters.status && filters.status !== 'ALL') {
        if (inv.status !== filters.status) return false
      }
      return true
    })

    // Ordenamiento
    const sorted = sortBy
      ? [...filtered].sort((a: any, b: any) => {
          const aValue = a[sortBy as keyof Invoice]
          const bValue = b[sortBy as keyof Invoice]
          if (aValue == null || bValue == null) return 0
          if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'asc'
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime()
          }
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
          return 0
        })
      : filtered

    // Paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = sorted.slice(startIndex, endIndex)

    return {
      data,
      meta: {
        page,
        limit,
        total: sorted.length,
        totalPages: Math.ceil(sorted.length / limit),
        hasNextPage: endIndex < sorted.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findEmployeeServiceHistory(
    employeeId: string,
    filters: EmployeeServiceHistoryFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<EmployeeServiceHistoryRecord>> {
    const validated = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validated

    // Rango de fechas sobre finalizedAt y solo facturas FINALIZED
    const start = new Date(filters.dateFrom)
    start.setHours(0, 0, 0, 0)
    const end = new Date(filters.dateTo)
    end.setHours(23, 59, 59, 999)

    // Expandir servicios de cada factura a registros
    const flattened: EmployeeServiceHistoryRecord[] = []
    for (const inv of this.invoices) {
      if (inv.status !== 'FINALIZED') continue
      const ts = inv.finalizedAt ?? inv.createdAt
      if (ts < start || ts > end) continue
      for (const s of inv.services) {
        if (s.employeeId !== employeeId) continue
        if (filters.activityId && s.activityId !== filters.activityId) continue
        flattened.push({
          invoiceId: inv.id,
          clientId: inv.clientId,
          employeeId: s.employeeId,
          timestamp: ts,
          service: {
            activityId: s.activityId,
            activityName: s.activityName,
            price: s.price,
          },
        })
      }
    }

    // Ordenamiento por timestamp o campo deseado
    const sorted = sortBy
      ? [...flattened].sort((a: any, b: any) => {
          const aValue = a[sortBy as keyof EmployeeServiceHistoryRecord]
          const bValue = b[sortBy as keyof EmployeeServiceHistoryRecord]
          if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'asc'
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime()
          }
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
          return 0
        })
      : flattened

    // Paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = sorted.slice(startIndex, endIndex)

    return {
      data,
      meta: {
        page,
        limit,
        total: sorted.length,
        totalPages: Math.ceil(sorted.length / limit),
        hasNextPage: endIndex < sorted.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async getClientInvoicesAggregate(
    clientId: string,
    filters: ClientInvoiceFilters
  ): Promise<{ count: number; totalAmount: number }> {
    const start = new Date(filters.dateFrom)
    start.setHours(0, 0, 0, 0)
    const end = new Date(filters.dateTo)
    end.setHours(23, 59, 59, 999)

    const filtered = this.invoices.filter(inv => {
      if (inv.clientId !== clientId) return false
      const date = inv.createdAt
      if (date < start || date > end) return false
      if (filters.status && filters.status !== 'ALL') {
        if (inv.status !== filters.status) return false
      }
      return true
    })

    const count = filtered.length
    const totalAmount = filtered.reduce(
      (sum, inv) => sum + (inv.totals?.grandTotal || 0),
      0
    )
    return { count, totalAmount }
  }

  async getEmployeeServiceHistoryAggregate(
    employeeId: string,
    filters: EmployeeServiceHistoryFilters
  ): Promise<{ count: number }> {
    const start = new Date(filters.dateFrom)
    start.setHours(0, 0, 0, 0)
    const end = new Date(filters.dateTo)
    end.setHours(23, 59, 59, 999)

    let count = 0
    for (const inv of this.invoices) {
      if (inv.status !== 'FINALIZED') continue
      const ts = inv.finalizedAt ?? inv.createdAt
      if (ts < start || ts > end) continue
      for (const s of inv.services) {
        if (s.employeeId !== employeeId) continue
        if (filters.activityId && s.activityId !== filters.activityId) continue
        count += 1
      }
    }
    return { count }
  }

  async create(data: CreateInvoiceRequest): Promise<Invoice> {
    const now = new Date()
    const services = (data.services ?? []).map(s => ({ ...s }))
    const products = (data.products ?? []).map(p => ({ ...p }))
    const totals = calculateTotals(services, products)

    const invoice: Invoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      status: 'PENDING',
      clientId: data.clientId,
      services,
      products,
      courtesyProductId: data.courtesyProductId,
      comment: data.comment,
      payment: { ...data.payment },
      totals,
      createdAt: now,
      createdBy: data.createdBy,
      updatedAt: now,
      updatedBy: data.createdBy,
    }

    this.invoices.unshift(invoice)
    return invoice
  }

  async update(data: UpdateInvoiceRequest): Promise<Invoice> {
    const index = this.invoices.findIndex(i => i.id === data.id)
    if (index === -1) throw new Error('Invoice not found')
    const existing = this.invoices[index]
    // Permitir actualización de estado (finalizar/cancelar) aunque no sea PENDING edit
    const isStatusChange = data.status && data.status !== existing.status
    if (!isStatusChange && existing.status !== 'PENDING')
      throw new Error('Only PENDING invoices can be edited')

    const updated: Invoice = {
      ...existing,
      ...(data.clientId && { clientId: data.clientId }),
      ...(data.services && { services: data.services.map(s => ({ ...s })) }),
      ...(data.products && { products: data.products.map(p => ({ ...p })) }),
      ...(data.courtesyProductId !== undefined && {
        courtesyProductId: data.courtesyProductId || undefined,
      }),
      ...(data.comment !== undefined && { comment: data.comment || undefined }),
      ...(data.payment && { payment: { ...data.payment } }),
      ...(data.status && { status: data.status }),
      ...(data.finalizedAt && { finalizedAt: data.finalizedAt }),
      ...(data.finalizedBy && { finalizedBy: data.finalizedBy }),
      ...(data.canceledAt && { canceledAt: data.canceledAt }),
      ...(data.canceledBy && { canceledBy: data.canceledBy }),
      updatedAt: new Date(),
      updatedBy: data.updatedBy,
    }

    // Recalcular totales si cambian items
    if (data.services || data.products) {
      updated.totals = calculateTotals(updated.services, updated.products)
    }

    this.invoices[index] = updated
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const index = this.invoices.findIndex(i => i.id === id)
    if (index === -1) return false
    this.invoices.splice(index, 1)
    return true
  }

  async exists(id: string): Promise<boolean> {
    return this.invoices.some(i => i.id === id)
  }
}
