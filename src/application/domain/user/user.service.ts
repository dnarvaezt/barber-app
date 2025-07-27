import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type { CreateUserRequest, UpdateUserRequest, User } from './user.model'
import type { UserRepository } from './user.repository.interface'

export class UserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async findUsers(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.userRepository.find(searchTerm, validatedPagination)
  }

  async getUserById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    if (!id) {
      throw new Error('User ID is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.userRepository.findById(id, validatedPagination)
  }

  async getUsersByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.userRepository.findByBirthMonth(month, validatedPagination)
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    this.validateUserData(userData)

    const defaultPagination: PaginationParams = { page: 1, limit: 100 }
    const existingUsers = await this.userRepository.find(
      userData.phoneNumber,
      defaultPagination
    )
    const existingUser = existingUsers.data.find(
      user => user.phoneNumber === userData.phoneNumber
    )
    if (existingUser) {
      throw new Error('User with this phone number already exists')
    }

    return this.userRepository.create(userData)
  }

  async updateUser(userData: UpdateUserRequest): Promise<User> {
    if (!userData.id) {
      throw new Error('User ID is required for update')
    }

    const defaultPagination: PaginationParams = { page: 1, limit: 1 }
    const existingUserResponse = await this.userRepository.findById(
      userData.id,
      defaultPagination
    )
    const existingUser = existingUserResponse.data[0]
    if (!existingUser) {
      throw new Error('User not found')
    }

    if (
      userData.phoneNumber &&
      userData.phoneNumber !== existingUser.phoneNumber
    ) {
      const usersWithPhone = await this.userRepository.find(
        userData.phoneNumber,
        defaultPagination
      )
      const userWithPhone = usersWithPhone.data.find(
        user => user.phoneNumber === userData.phoneNumber
      )
      if (userWithPhone) {
        throw new Error('Phone number is already in use by another user')
      }
    }

    return this.userRepository.update(userData)
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('User ID is required')
    }

    const userExists = await this.userRepository.exists(id)
    if (!userExists) {
      throw new Error('User not found')
    }

    return this.userRepository.delete(id)
  }

  private validateUserData(userData: CreateUserRequest): void {
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error('User name is required')
    }

    if (!userData.phoneNumber || userData.phoneNumber.trim().length === 0) {
      throw new Error('Phone number is required')
    }

    if (!userData.birthDate) {
      throw new Error('Birth date is required')
    }

    if (userData.birthDate > new Date()) {
      throw new Error('Birth date cannot be in the future')
    }

    if (!userData.createdBy) {
      throw new Error('Created by user ID is required')
    }
  }
}
