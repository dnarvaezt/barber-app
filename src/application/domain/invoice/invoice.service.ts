import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type { StockService } from '../stock'
import type {
  ClientInvoiceFilters,
  CreateInvoiceRequest,
  EmployeeServiceHistoryFilters,
  EmployeeServiceHistoryRecord,
  Invoice,
  InvoiceProductItem,
  InvoiceServiceItem,
  PaymentMethod,
  UpdateInvoiceRequest,
} from './invoice.model'
import type { InvoiceRepository } from './invoice.repository.interface'

export class InvoiceService {
  private readonly invoiceRepository: InvoiceRepository
  private readonly stockService: StockService

  constructor(
    invoiceRepository: InvoiceRepository,
    stockService: StockService
  ) {
    this.invoiceRepository = invoiceRepository
    this.stockService = stockService
  }

  // Queries
  async getAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>> {
    const validated = PaginationHelper.validateParams(pagination)
    const withSort = {
      ...validated,
      sortBy: validated.sortBy || 'createdAt',
      sortOrder: validated.sortOrder || 'desc',
    }
    return this.invoiceRepository.findAll(withSort)
  }

  async getByClient(
    clientId: string,
    filters: ClientInvoiceFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>> {
    if (!clientId) throw new Error('Client ID is required')
    if (!filters?.dateFrom || !filters?.dateTo)
      throw new Error('dateFrom and dateTo are required')
    const validated = PaginationHelper.validateParams(pagination)
    const withSort = {
      ...validated,
      sortBy: validated.sortBy || 'createdAt',
      sortOrder: validated.sortOrder || 'desc',
    }
    return this.invoiceRepository.findByClient(clientId, filters, withSort)
  }

  async getEmployeeServiceHistory(
    employeeId: string,
    filters: EmployeeServiceHistoryFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<EmployeeServiceHistoryRecord>> {
    if (!employeeId) throw new Error('Employee ID is required')
    if (!filters?.dateFrom || !filters?.dateTo)
      throw new Error('dateFrom and dateTo are required')
    const validated = PaginationHelper.validateParams(pagination)
    const withSort = {
      ...validated,
      sortBy: validated.sortBy || 'timestamp',
      sortOrder: validated.sortOrder || 'desc',
    }
    return this.invoiceRepository.findEmployeeServiceHistory(
      employeeId,
      filters,
      withSort
    )
  }

  async getById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>> {
    if (!id) throw new Error('Invoice ID is required')
    const validated = PaginationHelper.validateParams(pagination)
    return this.invoiceRepository.findById(id, validated)
  }

  async search(
    term: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Invoice>> {
    if (!term || term.trim().length === 0)
      throw new Error('Search term is required')
    const validated = PaginationHelper.validateParams(pagination)
    return this.invoiceRepository.find(term, validated)
  }

  // Commands
  async create(data: CreateInvoiceRequest): Promise<Invoice> {
    if (!data.clientId) throw new Error('clientId is required')
    this.validatePayment(data.payment)
    this.validateBusinessRules(
      data.services ?? [],
      data.products ?? [],
      data.courtesyProductId
    )
    return this.invoiceRepository.create({ ...data })
  }

  async update(data: UpdateInvoiceRequest): Promise<Invoice> {
    if (!data.id) throw new Error('Invoice ID is required')
    if (data.clientId !== undefined && !data.clientId)
      throw new Error('clientId cannot be empty')
    if (data.payment) this.validatePayment(data.payment)
    if (
      data.services ||
      data.products ||
      data.courtesyProductId !== undefined
    ) {
      const services = data.services ?? []
      const products = data.products ?? []
      const courtesy = data.courtesyProductId ?? undefined
      this.validateBusinessRules(services, products, courtesy)
    }
    return this.invoiceRepository.update({ ...data })
  }

  async delete(id: string): Promise<boolean> {
    if (!id) throw new Error('Invoice ID is required')
    return this.invoiceRepository.delete(id)
  }

  async finalize(id: string, userId: string): Promise<Invoice> {
    if (!id) throw new Error('Invoice ID is required')
    if (!userId) throw new Error('User ID is required')
    const current = await this.getById(id, { page: 1, limit: 1 })
    const invoice = current.data[0]
    if (!invoice) throw new Error('Invoice not found')
    if (invoice.status !== 'PENDING')
      throw new Error('Only PENDING invoices can be finalized')

    // Descontar stock por productos vendidos y cortesía
    const itemsToDiscount: Array<{
      productId: string
      quantity: number
      note: string
    }> = []
    for (const p of invoice.products) {
      if (p.quantity > 0)
        itemsToDiscount.push({
          productId: p.productId,
          quantity: p.quantity,
          note: `Factura ${invoice.id}`,
        })
    }
    if (invoice.courtesyProductId) {
      itemsToDiscount.push({
        productId: invoice.courtesyProductId,
        quantity: 1,
        note: `Cortesía factura ${invoice.id}`,
      })
    }

    for (const item of itemsToDiscount) {
      await this.stockService.registerExit({
        productId: item.productId,
        quantity: item.quantity,
        note: item.note,
        userId,
      })
    }

    // Marcar como finalizada
    // Persistir cambio en repo
    return this.invoiceRepository.update({
      id: invoice.id,
      updatedBy: userId,
      status: 'FINALIZED',
      finalizedAt: new Date(),
      finalizedBy: userId,
    })
  }

  async cancel(id: string, userId: string): Promise<Invoice> {
    if (!id) throw new Error('Invoice ID is required')
    if (!userId) throw new Error('User ID is required')
    const current = await this.getById(id, { page: 1, limit: 1 })
    const invoice = current.data[0]
    if (!invoice) throw new Error('Invoice not found')
    if (invoice.status !== 'PENDING')
      throw new Error('Only PENDING invoices can be canceled')

    return this.invoiceRepository.update({
      id: invoice.id,
      updatedBy: userId,
      status: 'CANCELED',
      canceledAt: new Date(),
      canceledBy: userId,
    })
  }

  // ----------------------------------------------------------------------------
  // Validaciones de negocio
  // ----------------------------------------------------------------------------

  async getClientInvoicesAggregate(
    clientId: string,
    filters: ClientInvoiceFilters
  ): Promise<{ count: number; totalAmount: number }> {
    if (!clientId) throw new Error('Client ID is required')
    if (!filters?.dateFrom || !filters?.dateTo)
      throw new Error('dateFrom and dateTo are required')
    return this.invoiceRepository.getClientInvoicesAggregate(clientId, filters)
  }

  async getEmployeeServiceHistoryAggregate(
    employeeId: string,
    filters: EmployeeServiceHistoryFilters
  ): Promise<{ count: number }> {
    if (!employeeId) throw new Error('Employee ID is required')
    if (!filters?.dateFrom || !filters?.dateTo)
      throw new Error('dateFrom and dateTo are required')
    return this.invoiceRepository.getEmployeeServiceHistoryAggregate(
      employeeId,
      filters
    )
  }
  private validatePayment(payment: {
    method: PaymentMethod
    amountReceived?: number
    change?: number
  }) {
    if (!payment || !payment.method)
      throw new Error('Payment method is required')
    if (payment.method === 'CASH') {
      if (payment.amountReceived == null || payment.amountReceived < 0)
        throw new Error('amountReceived is required and must be >= 0 for CASH')
    }
  }

  private validateBusinessRules(
    services: InvoiceServiceItem[],
    products: InvoiceProductItem[],
    courtesyProductId?: string
  ) {
    // Cortesía: máximo uno
    // Ya está modelado como un solo id; validar que no sea repetido en productos como cortesía adicional
    if (courtesyProductId && services.length === 0) {
      throw new Error(
        'No se puede agregar producto de cortesía sin al menos un servicio'
      )
    }

    // Cada servicio debe tener empleado
    for (const s of services) {
      if (!s.employeeId)
        throw new Error('Cada servicio debe tener un empleado asignado')
    }

    // Cantidades válidas
    for (const p of products) {
      if (p.quantity <= 0)
        throw new Error('La cantidad de cada producto debe ser > 0')
    }
  }
}
