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

  // Métodos heredados de UserService
  async findEmployees(searchTerm: string): Promise<Employee[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }
    return this.employeeRepository.find(searchTerm)
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    if (!id) {
      throw new Error('Employee ID is required')
    }
    return this.employeeRepository.findById(id)
  }

  async getEmployeesByBirthMonth(month: number): Promise<Employee[]> {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12')
    }
    return this.employeeRepository.findByBirthMonth(month)
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    this.validateEmployeeData(employeeData)

    const existingEmployees = await this.employeeRepository.find(
      employeeData.phoneNumber
    )
    const existingEmployee = existingEmployees.find(
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

    const existingEmployee = await this.employeeRepository.findById(
      employeeData.id
    )
    if (!existingEmployee) {
      throw new Error('Employee not found')
    }

    if (
      employeeData.phoneNumber &&
      employeeData.phoneNumber !== existingEmployee.phoneNumber
    ) {
      const employeesWithPhone = await this.employeeRepository.find(
        employeeData.phoneNumber
      )
      const employeeWithPhone = employeesWithPhone.find(
        employee => employee.phoneNumber === employeeData.phoneNumber
      )
      if (employeeWithPhone) {
        throw new Error('Phone number is already in use by another employee')
      }
    }

    return this.employeeRepository.update(employeeData)
  }

  async deleteEmployee(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Employee ID is required')
    }

    const employeeExists = await this.employeeRepository.exists(id)
    if (!employeeExists) {
      throw new Error('Employee not found')
    }

    return this.employeeRepository.delete(id)
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
  }
}
