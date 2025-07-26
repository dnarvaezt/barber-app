import type { User } from '../user/user.model'

export type Client = User

export interface CreateClientRequest {
  name: string
  phoneNumber: string
  birthDate: Date
  createdBy: string
}

export interface UpdateClientRequest {
  id: string
  name?: string
  phoneNumber?: string
  birthDate?: Date
  updatedBy: string
}
