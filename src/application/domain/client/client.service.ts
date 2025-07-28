import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from './client.model'
import type { ClientRepository } from './client.repository.interface'

export class ClientService {
  private readonly clientRepository: ClientRepository

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository
  }

  // Método para obtener todos los clientes
  async getAllClients(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)

    // Aplicar ordenamiento por nombre por defecto si no se especifica
    const paginationWithSort = {
      ...validatedPagination,
      sortBy: validatedPagination.sortBy || 'name',
      sortOrder: validatedPagination.sortOrder || 'asc',
    }

    return this.clientRepository.findAll(paginationWithSort)
  }

  // Métodos heredados de UserService
  async findClients(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.clientRepository.find(searchTerm, validatedPagination)
  }

  async getClientById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    if (!id) {
      throw new Error('Client ID is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.clientRepository.findById(id, validatedPagination)
  }

  async getClientsByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.clientRepository.findByBirthMonth(month, validatedPagination)
  }

  async createClient(clientData: CreateClientRequest): Promise<Client> {
    this.validateClientData(clientData)

    const defaultPagination: PaginationParams = { page: 1, limit: 100 }
    const existingClients = await this.clientRepository.find(
      clientData.phoneNumber,
      defaultPagination
    )
    const existingClient = existingClients.data.find(
      client => client.phoneNumber === clientData.phoneNumber
    )
    if (existingClient) {
      throw new Error('Client with this phone number already exists')
    }

    return this.clientRepository.create(clientData)
  }

  async updateClient(clientData: UpdateClientRequest): Promise<Client> {
    if (!clientData.id) {
      throw new Error('Client ID is required for update')
    }

    const defaultPagination: PaginationParams = { page: 1, limit: 1 }
    const existingClientResponse = await this.clientRepository.findById(
      clientData.id,
      defaultPagination
    )
    const existingClient = existingClientResponse.data[0]
    if (!existingClient) {
      throw new Error('Client not found')
    }

    if (
      clientData.phoneNumber &&
      clientData.phoneNumber !== existingClient.phoneNumber
    ) {
      const clientsWithPhone = await this.clientRepository.find(
        clientData.phoneNumber,
        defaultPagination
      )
      const clientWithPhone = clientsWithPhone.data.find(
        client => client.phoneNumber === clientData.phoneNumber
      )
      if (clientWithPhone) {
        throw new Error('Phone number is already in use by another client')
      }
    }

    return this.clientRepository.update(clientData)
  }

  async deleteClient(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Client ID is required')
    }

    const clientExists = await this.clientRepository.exists(id)

    if (!clientExists) {
      throw new Error('Client not found')
    }

    const result = await this.clientRepository.delete(id)
    return result
  }

  private validateClientData(clientData: CreateClientRequest): void {
    if (!clientData.name || clientData.name.trim().length === 0) {
      throw new Error('Client name is required')
    }

    if (!clientData.phoneNumber || clientData.phoneNumber.trim().length === 0) {
      throw new Error('Phone number is required')
    }

    if (!clientData.birthDate) {
      throw new Error('Birth date is required')
    }

    if (clientData.birthDate > new Date()) {
      throw new Error('Birth date cannot be in the future')
    }

    if (!clientData.createdBy) {
      throw new Error('Created by user ID is required')
    }
  }
}
