import type { User } from '../user/user.model'

export interface Employee extends User {
  percentage: number
}

export interface CreateEmployeeRequest {
  name: string
  phoneNumber: string
  birthDate: Date
  createdBy: string
  percentage: number
}

export interface UpdateEmployeeRequest {
  id: string
  name?: string
  phoneNumber?: string
  birthDate?: Date
  updatedBy: string
  percentage?: number
}
