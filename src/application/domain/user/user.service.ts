import type { CreateUserRequest, UpdateUserRequest, User } from './user.model'
import type { UserRepository } from './user.repository.interface'

export class UserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async findUsers(searchTerm: string): Promise<User[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }
    return this.userRepository.find(searchTerm)
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) {
      throw new Error('User ID is required')
    }
    return this.userRepository.findById(id)
  }

  async getUsersByBirthMonth(month: number): Promise<User[]> {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12')
    }
    return this.userRepository.findByBirthMonth(month)
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    this.validateUserData(userData)

    const existingUsers = await this.userRepository.find(userData.phoneNumber)
    const existingUser = existingUsers.find(
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

    const existingUser = await this.userRepository.findById(userData.id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    if (
      userData.phoneNumber &&
      userData.phoneNumber !== existingUser.phoneNumber
    ) {
      const usersWithPhone = await this.userRepository.find(
        userData.phoneNumber
      )
      const userWithPhone = usersWithPhone.find(
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
