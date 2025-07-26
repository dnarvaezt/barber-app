import type { User } from '../user/user.model'

export type Employee = User

export interface CreateEmployeeRequest {
  name: string
  phoneNumber: string
  birthDate: Date
  createdBy: string
}

export interface UpdateEmployeeRequest {
  id: string
  name?: string
  phoneNumber?: string
  birthDate?: Date
  updatedBy: string
}
