import { PaginationMockService } from '../../../infrastructure/services/pagination-mock.service'
import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest,
} from './employee.model'
import type { EmployeeRepository } from './employee.repository.interface'

export class EmployeeRepositoryMemory implements EmployeeRepository {
  private employees: Employee[]

  constructor(initialEmployees: Employee[] = []) {
    this.employees = initialEmployees
  }

  async findAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    return PaginationMockService.paginateData(this.employees, pagination)
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    return PaginationMockService.searchWithPagination(
      this.employees,
      searchTerm,
      pagination
    )
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    const employee = this.employees.find(emp => emp.id === id)
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
    return PaginationMockService.filterByBirthMonthWithPagination(
      this.employees,
      month,
      pagination
    )
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
    this.employees.push(newEmployee)
    return newEmployee
  }

  async update(employeeData: UpdateEmployeeRequest): Promise<Employee> {
    const index = this.employees.findIndex(emp => emp.id === employeeData.id)
    if (index === -1) {
      throw new Error('Employee not found')
    }

    const updatedEmployee: Employee = {
      ...this.employees[index],
      ...employeeData,
      updatedAt: new Date(),
      updatedBy: 'system',
    }
    this.employees[index] = updatedEmployee
    return updatedEmployee
  }

  async delete(id: string): Promise<boolean> {
    const index = this.employees.findIndex(emp => emp.id === id)
    if (index === -1) {
      return false
    }
    this.employees.splice(index, 1)
    return true
  }

  async exists(id: string): Promise<boolean> {
    return this.employees.some(emp => emp.id === id)
  }
}
