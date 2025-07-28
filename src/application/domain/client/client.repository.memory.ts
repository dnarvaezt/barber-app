import { PaginationMockService } from '../../../infrastructure/services/pagination-mock.service'
import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from './client.model'
import type { ClientRepository } from './client.repository.interface'

export class ClientRepositoryMemory implements ClientRepository {
  private clients: Client[]

  constructor(initialClients: Client[] = []) {
    this.clients = initialClients
  }

  async findAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    return PaginationMockService.paginateData(this.clients, pagination)
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    return PaginationMockService.searchWithPagination(
      this.clients,
      searchTerm,
      pagination
    )
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    const client = this.clients.find(cli => cli.id === id)
    return {
      data: client ? [client] : [],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: client ? 1 : 0,
        totalPages: client ? 1 : 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  async findByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    return PaginationMockService.filterByBirthMonthWithPagination(
      this.clients,
      month,
      pagination
    )
  }

  async create(clientData: CreateClientRequest): Promise<Client> {
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: 'system',
    }
    this.clients.push(newClient)
    return newClient
  }

  async update(clientData: UpdateClientRequest): Promise<Client> {
    const index = this.clients.findIndex(cli => cli.id === clientData.id)
    if (index === -1) {
      throw new Error('Client not found')
    }

    const updatedClient: Client = {
      ...this.clients[index],
      ...clientData,
      updatedAt: new Date(),
      updatedBy: 'system',
    }
    this.clients[index] = updatedClient
    return updatedClient
  }

  async delete(id: string): Promise<boolean> {
    const index = this.clients.findIndex(cli => cli.id === id)
    if (index === -1) {
      return false
    }
    this.clients.splice(index, 1)
    return true
  }

  async exists(id: string): Promise<boolean> {
    return this.clients.some(cli => cli.id === id)
  }
}
