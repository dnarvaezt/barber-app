import type {
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest,
} from './employee.model'

export interface EmployeeRepository {
  // Métodos heredados de UserRepository
  find(searchTerm: string): Promise<Employee[]>
  findById(id: string): Promise<Employee | null>
  findByBirthMonth(month: number): Promise<Employee[]>
  create(employeeData: CreateEmployeeRequest): Promise<Employee>
  update(employeeData: UpdateEmployeeRequest): Promise<Employee>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
