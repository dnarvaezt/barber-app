import { stockService } from '../stock'
import { InvoiceRepositoryMemory } from './invoice.repository.memory'
import { InvoiceService } from './invoice.service'

const invoiceRepository = new InvoiceRepositoryMemory()

export const invoiceService = new InvoiceService(
  invoiceRepository,
  stockService
)
