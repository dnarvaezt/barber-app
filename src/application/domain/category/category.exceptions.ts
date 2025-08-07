export class CategoryNotFoundException extends Error {
  constructor(id: string) {
    super(`Category with ID ${id} not found`)
    this.name = 'CategoryNotFoundException'
  }
}

export class CategoryAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`Category with name "${name}" already exists`)
    this.name = 'CategoryAlreadyExistsException'
  }
}

export class CategoryValidationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CategoryValidationException'
  }
}
