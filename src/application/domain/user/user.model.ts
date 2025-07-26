export interface User {
  id: string
  name: string
  phoneNumber: string
  birthDate: Date
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export interface CreateUserRequest {
  name: string
  phoneNumber: string
  birthDate: Date
  createdBy: string
}

export interface UpdateUserRequest {
  id: string
  name?: string
  phoneNumber?: string
  birthDate?: Date
  updatedBy: string
}
