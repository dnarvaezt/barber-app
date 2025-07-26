import type { CreateUserRequest, UpdateUserRequest, User } from './user.model'

export interface UserRepository {
  find(searchTerm: string): Promise<User[]>
  findById(id: string): Promise<User | null>
  findByBirthMonth(month: number): Promise<User[]>
  create(userData: CreateUserRequest): Promise<User>
  update(userData: UpdateUserRequest): Promise<User>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
