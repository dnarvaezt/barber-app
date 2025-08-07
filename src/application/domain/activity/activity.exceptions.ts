export class ActivityNotFoundException extends Error {
  constructor(id: string) {
    super(`Activity with ID ${id} not found`)
    this.name = 'ActivityNotFoundException'
  }
}

export class ActivityAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`Activity with name "${name}" already exists`)
    this.name = 'ActivityAlreadyExistsException'
  }
}

export class ActivityValidationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ActivityValidationException'
  }
}

export class InvalidPriceException extends Error {
  constructor(price: number) {
    super(`Invalid price: ${price}. Price must be between 0 and 999,999.99`)
    this.name = 'InvalidPriceException'
  }
}
