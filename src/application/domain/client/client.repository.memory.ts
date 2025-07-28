import type { PaginatedResponse, PaginationParams } from '../common'
import { BaseRepository } from '../common/base.repository'
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from './client.model'
import type { ClientRepository } from './client.repository.interface'

export class ClientRepositoryMemory
  extends BaseRepository<Client>
  implements ClientRepository
{
  protected data: Client[]

  constructor(initialClients: Client[] = []) {
    super()
    this.data = initialClients
  }

  async findAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    return this.paginateAndSort(this.data, pagination)
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    const filteredClients = this.searchEntities(searchTerm, [
      'name',
      'phoneNumber',
    ])
    return this.paginateAndSort(filteredClients, pagination)
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    const client = this.data.find(cli => cli.id === id)
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
    const filteredClients = this.filterByBirthMonth(month)
    return this.paginateAndSort(filteredClients, pagination)
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
    this.data.push(newClient)
    return newClient
  }

  async update(clientData: UpdateClientRequest): Promise<Client> {
    const index = this.data.findIndex(cli => cli.id === clientData.id)
    if (index === -1) {
      throw new Error('Client not found')
    }

    const updatedClient: Client = {
      ...this.data[index],
      ...clientData,
      updatedAt: new Date(),
      updatedBy: 'system',
    }
    this.data[index] = updatedClient
    return updatedClient
  }

  async delete(id: string): Promise<boolean> {
    console.log('🔍 ClientRepository: Deleting client with ID:', id)
    console.log(
      '🔍 ClientRepository: Total clients before delete:',
      this.data.length
    )

    const index = this.data.findIndex(cli => cli.id === id)
    console.log('🔍 ClientRepository: Found at index:', index)

    if (index === -1) {
      console.log('🔍 ClientRepository: Client not found')
      return false
    }

    this.data.splice(index, 1)
    console.log(
      '🔍 ClientRepository: Total clients after delete:',
      this.data.length
    )
    return true
  }

  async exists(id: string): Promise<boolean> {
    const exists = this.data.some(cli => cli.id === id)
    console.log(
      '🔍 ClientRepository: Checking if client exists:',
      id,
      'Result:',
      exists
    )
    return exists
  }
}
