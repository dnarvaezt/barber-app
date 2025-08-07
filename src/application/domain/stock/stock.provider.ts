import { StockRepositoryMemory } from './stock.repository.memory'
import { StockService } from './stock.service'

const stockRepository = new StockRepositoryMemory()

export const stockService = new StockService(stockRepository)
