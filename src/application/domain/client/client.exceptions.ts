export class ClientNotFoundException extends Error {
  constructor(clientId: string) {
    super(`Client with ID ${clientId} not found`)
    this.name = 'ClientNotFoundException'
  }
}

export class ClientAlreadyExistsException extends Error {
  constructor(phoneNumber: string) {
    super(`Client with phone number ${phoneNumber} already exists`)
    this.name = 'ClientAlreadyExistsException'
  }
}

export class InvalidClientDataException extends Error {
  constructor(message: string) {
    super(`Invalid client data: ${message}`)
    this.name = 'InvalidClientDataException'
  }
}

export class ClientValidationException extends Error {
  constructor(message: string) {
    super(`Client validation failed: ${message}`)
    this.name = 'ClientValidationException'
  }
}
