import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from './client.model'

export interface ClientRepository {
  // Método para obtener todos los clientes
  findAll(pagination: PaginationParams): Promise<PaginatedResponse<Client>>
  // Métodos heredados de UserRepository
  find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>>
  findByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>>
  create(clientData: CreateClientRequest): Promise<Client>
  update(clientData: UpdateClientRequest): Promise<Client>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
