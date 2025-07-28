import { employeeMockData } from './employee.mock.data'
import { EmployeeRepositoryMemory } from './employee.repository.memory'
import { EmployeeService } from './employee.service'

export const employeeService = new EmployeeService(
  new EmployeeRepositoryMemory(employeeMockData)
)
