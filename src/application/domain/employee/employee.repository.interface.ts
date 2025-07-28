import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest,
} from './employee.model'

export interface EmployeeRepository {
  // Método para obtener todos los empleados
  findAll(pagination: PaginationParams): Promise<PaginatedResponse<Employee>>
  // Métodos heredados de UserRepository
  find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>>
  findByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>>
  create(employeeData: CreateEmployeeRequest): Promise<Employee>
  update(employeeData: UpdateEmployeeRequest): Promise<Employee>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
