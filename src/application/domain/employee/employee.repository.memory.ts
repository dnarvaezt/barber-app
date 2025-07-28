import type { PaginatedResponse, PaginationParams } from '../common'
import { BaseRepository } from '../common/base.repository'
import type {
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest,
} from './employee.model'
import type { EmployeeRepository } from './employee.repository.interface'

export class EmployeeRepositoryMemory
  extends BaseRepository<Employee>
  implements EmployeeRepository
{
  protected data: Employee[]

  constructor(initialEmployees: Employee[] = []) {
    super()
    this.data = initialEmployees
  }

  async findAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    return this.paginateAndSort(this.data, pagination)
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    const filteredEmployees = this.searchEntities(searchTerm, [
      'name',
      'phoneNumber',
    ])
    return this.paginateAndSort(filteredEmployees, pagination)
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    const employee = this.data.find(emp => emp.id === id)
    return {
      data: employee ? [employee] : [],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: employee ? 1 : 0,
        totalPages: employee ? 1 : 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  async findByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    const filteredEmployees = this.filterByBirthMonth(month)
    return this.paginateAndSort(filteredEmployees, pagination)
  }

  async create(employeeData: CreateEmployeeRequest): Promise<Employee> {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...employeeData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: 'system',
    }
    this.data.push(newEmployee)
    return newEmployee
  }

  async update(employeeData: UpdateEmployeeRequest): Promise<Employee> {
    const index = this.data.findIndex(emp => emp.id === employeeData.id)
    if (index === -1) {
      throw new Error('Employee not found')
    }

    const updatedEmployee: Employee = {
      ...this.data[index],
      ...employeeData,
      updatedAt: new Date(),
      updatedBy: 'system',
    }
    this.data[index] = updatedEmployee
    return updatedEmployee
  }

  async delete(id: string): Promise<boolean> {
    console.log('🔍 EmployeeRepository: Deleting employee with ID:', id)
    console.log(
      '🔍 EmployeeRepository: Total employees before delete:',
      this.data.length
    )

    const index = this.data.findIndex(emp => emp.id === id)
    console.log('🔍 EmployeeRepository: Found at index:', index)

    if (index === -1) {
      console.log('🔍 EmployeeRepository: Employee not found')
      return false
    }

    this.data.splice(index, 1)
    console.log(
      '🔍 EmployeeRepository: Total employees after delete:',
      this.data.length
    )
    return true
  }

  async exists(id: string): Promise<boolean> {
    const exists = this.data.some(emp => emp.id === id)
    console.log(
      '🔍 EmployeeRepository: Checking if employee exists:',
      id,
      'Result:',
      exists
    )
    return exists
  }
}
