import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from './client.model'

export interface ClientRepository {
  // Métodos heredados de UserRepository
  find(searchTerm: string): Promise<Client[]>
  findById(id: string): Promise<Client | null>
  findByBirthMonth(month: number): Promise<Client[]>
  create(clientData: CreateClientRequest): Promise<Client>
  update(clientData: UpdateClientRequest): Promise<Client>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
