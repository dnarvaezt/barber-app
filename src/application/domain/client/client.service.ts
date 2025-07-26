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

  // Métodos heredados de UserService
  async findClients(searchTerm: string): Promise<Client[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }
    return this.clientRepository.find(searchTerm)
  }

  async getClientById(id: string): Promise<Client | null> {
    if (!id) {
      throw new Error('Client ID is required')
    }
    return this.clientRepository.findById(id)
  }

  async getClientsByBirthMonth(month: number): Promise<Client[]> {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12')
    }
    return this.clientRepository.findByBirthMonth(month)
  }

  async createClient(clientData: CreateClientRequest): Promise<Client> {
    this.validateClientData(clientData)

    const existingClients = await this.clientRepository.find(
      clientData.phoneNumber
    )
    const existingClient = existingClients.find(
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

    const existingClient = await this.clientRepository.findById(clientData.id)
    if (!existingClient) {
      throw new Error('Client not found')
    }

    if (
      clientData.phoneNumber &&
      clientData.phoneNumber !== existingClient.phoneNumber
    ) {
      const clientsWithPhone = await this.clientRepository.find(
        clientData.phoneNumber
      )
      const clientWithPhone = clientsWithPhone.find(
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

    return this.clientRepository.delete(id)
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
