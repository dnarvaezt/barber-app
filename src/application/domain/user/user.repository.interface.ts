import type { PaginatedResponse, PaginationParams } from '../common'
import type { CreateUserRequest, UpdateUserRequest, User } from './user.model'

export interface UserRepository {
  find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<User>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<User>>
  findByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<User>>
  create(userData: CreateUserRequest): Promise<User>
  update(userData: UpdateUserRequest): Promise<User>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
