export class EmployeeNotFoundException extends Error {
  constructor(employeeId: string) {
    super(`Employee with ID ${employeeId} not found`)
    this.name = 'EmployeeNotFoundException'
  }
}

export class EmployeeAlreadyExistsException extends Error {
  constructor(phoneNumber: string) {
    super(`Employee with phone number ${phoneNumber} already exists`)
    this.name = 'EmployeeAlreadyExistsException'
  }
}

export class InvalidEmployeeDataException extends Error {
  constructor(message: string) {
    super(`Invalid employee data: ${message}`)
    this.name = 'InvalidEmployeeDataException'
  }
}

export class EmployeeValidationException extends Error {
  constructor(message: string) {
    super(`Employee validation failed: ${message}`)
    this.name = 'EmployeeValidationException'
  }
}
