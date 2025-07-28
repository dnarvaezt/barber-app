import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest,
} from './employee.model'
import type { EmployeeRepository } from './employee.repository.interface'

export class EmployeeService {
  private readonly employeeRepository: EmployeeRepository

  constructor(employeeRepository: EmployeeRepository) {
    this.employeeRepository = employeeRepository
  }

  // Método para obtener todos los empleados
  async getAllEmployees(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)

    // Aplicar ordenamiento por nombre por defecto si no se especifica
    const paginationWithSort = {
      ...validatedPagination,
      sortBy: validatedPagination.sortBy || 'name',
      sortOrder: validatedPagination.sortOrder || 'asc',
    }

    return this.employeeRepository.findAll(paginationWithSort)
  }

  // Métodos heredados de UserService
  async findEmployees(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.employeeRepository.find(searchTerm, validatedPagination)
  }

  async getEmployeeById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    if (!id) {
      throw new Error('Employee ID is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.employeeRepository.findById(id, validatedPagination)
  }

  async getEmployeesByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.employeeRepository.findByBirthMonth(month, validatedPagination)
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    this.validateEmployeeData(employeeData)

    const defaultPagination: PaginationParams = { page: 1, limit: 100 }
    const existingEmployees = await this.employeeRepository.find(
      employeeData.phoneNumber,
      defaultPagination
    )
    const existingEmployee = existingEmployees.data.find(
      employee => employee.phoneNumber === employeeData.phoneNumber
    )
    if (existingEmployee) {
      throw new Error('Employee with this phone number already exists')
    }

    return this.employeeRepository.create(employeeData)
  }

  async updateEmployee(employeeData: UpdateEmployeeRequest): Promise<Employee> {
    if (!employeeData.id) {
      throw new Error('Employee ID is required for update')
    }

    const defaultPagination: PaginationParams = { page: 1, limit: 1 }
    const existingEmployeeResponse = await this.employeeRepository.findById(
      employeeData.id,
      defaultPagination
    )
    const existingEmployee = existingEmployeeResponse.data[0]
    if (!existingEmployee) {
      throw new Error('Employee not found')
    }

    if (
      employeeData.phoneNumber &&
      employeeData.phoneNumber !== existingEmployee.phoneNumber
    ) {
      const employeesWithPhone = await this.employeeRepository.find(
        employeeData.phoneNumber,
        defaultPagination
      )
      const employeeWithPhone = employeesWithPhone.data.find(
        employee => employee.phoneNumber === employeeData.phoneNumber
      )
      if (employeeWithPhone) {
        throw new Error('Phone number is already in use by another employee')
      }
    }

    return this.employeeRepository.update(employeeData)
  }

  async deleteEmployee(id: string): Promise<boolean> {
    console.log('🔍 EmployeeService: Deleting employee with ID:', id)

    if (!id) {
      throw new Error('Employee ID is required')
    }

    const employeeExists = await this.employeeRepository.exists(id)
    console.log('🔍 EmployeeService: Employee exists:', employeeExists)

    if (!employeeExists) {
      throw new Error('Employee not found')
    }

    const result = await this.employeeRepository.delete(id)
    console.log('🔍 EmployeeService: Delete result:', result)
    return result
  }

  private validateEmployeeData(employeeData: CreateEmployeeRequest): void {
    if (!employeeData.name || employeeData.name.trim().length === 0) {
      throw new Error('Employee name is required')
    }

    if (
      !employeeData.phoneNumber ||
      employeeData.phoneNumber.trim().length === 0
    ) {
      throw new Error('Phone number is required')
    }

    if (!employeeData.birthDate) {
      throw new Error('Birth date is required')
    }

    if (employeeData.birthDate > new Date()) {
      throw new Error('Birth date cannot be in the future')
    }

    if (!employeeData.createdBy) {
      throw new Error('Created by user ID is required')
    }

    // Validación específica para el campo percentage
    if (typeof employeeData.percentage !== 'number') {
      throw new Error('Percentage must be a number')
    }

    if (employeeData.percentage < 0 || employeeData.percentage > 100) {
      throw new Error('Percentage must be between 0 and 100')
    }
  }
}
