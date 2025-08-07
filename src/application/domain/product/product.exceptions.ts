export class ProductNotFoundException extends Error {
  constructor(id: string) {
    super(`Product with ID ${id} not found`)
    this.name = 'ProductNotFoundException'
  }
}

export class ProductAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`Product with name "${name}" already exists`)
    this.name = 'ProductAlreadyExistsException'
  }
}

export class ProductValidationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProductValidationException'
  }
}

export class InvalidProductPriceException extends Error {
  constructor(price: number) {
    super(`Invalid price: ${price}. Price must be between 0 and 999,999.99`)
    this.name = 'InvalidProductPriceException'
  }
}

export class InvalidSalePriceException extends Error {
  constructor(salePrice: number, costPrice: number) {
    super(
      `Sale price (${salePrice}) cannot be less than cost price (${costPrice})`
    )
    this.name = 'InvalidSalePriceException'
  }
}
