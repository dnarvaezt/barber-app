export class UserNotFoundException extends Error {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`)
    this.name = 'UserNotFoundException'
  }
}

export class UserAlreadyExistsException extends Error {
  constructor(phoneNumber: string) {
    super(`User with phone number ${phoneNumber} already exists`)
    this.name = 'UserAlreadyExistsException'
  }
}

export class InvalidUserDataException extends Error {
  constructor(message: string) {
    super(`Invalid user data: ${message}`)
    this.name = 'InvalidUserDataException'
  }
}

export class UserValidationException extends Error {
  constructor(message: string) {
    super(`User validation failed: ${message}`)
    this.name = 'UserValidationException'
  }
}
