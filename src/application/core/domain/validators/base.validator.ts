import type { IValidator, ValidationResult } from '../entity.interface'

// ============================================================================
// BASE VALIDATOR - Patrón Template Method + Strategy
// ============================================================================

export abstract class BaseValidator<T> implements IValidator<T> {
  validate(data: Partial<T>): ValidationResult {
    const errors: Record<string, string> = {}

    // Validaciones comunes
    this.validateRequiredFields(data, errors)
    this.validateFieldTypes(data, errors)
    this.validateFieldFormats(data, errors)
    this.validateBusinessRules(data, errors)

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  // ============================================================================
  // PROTECTED METHODS - Métodos para subclases
  // ============================================================================

  protected validateRequiredFields(
    data: Partial<T>,
    errors: Record<string, string>
  ): void {
    const requiredFields = this.getRequiredFields()

    for (const field of requiredFields) {
      const value = (data as any)[field]
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        errors[field] = `${this.getFieldDisplayName(field)} es requerido`
      }
    }
  }

  protected validateFieldTypes(
    data: Partial<T>,
    errors: Record<string, string>
  ): void {
    const typeValidations = this.getTypeValidations()

    for (const [field, validation] of Object.entries(typeValidations)) {
      const value = (data as any)[field]
      if (value !== undefined && value !== null) {
        const isValid = this.validateFieldType(field, value, validation)
        if (!isValid) {
          errors[field] =
            `${this.getFieldDisplayName(field)} debe ser de tipo ${validation.type}`
        }
      }
    }
  }

  protected validateFieldFormats(
    data: Partial<T>,
    errors: Record<string, string>
  ): void {
    const formatValidations = this.getFormatValidations()

    for (const [field, validation] of Object.entries(formatValidations)) {
      const value = (data as any)[field]
      if (value !== undefined && value !== null) {
        const isValid = this.validateFieldFormat(field, value, validation)
        if (!isValid) {
          errors[field] =
            validation.errorMessage ||
            `${this.getFieldDisplayName(field)} tiene un formato inválido`
        }
      }
    }
  }

  protected validateBusinessRules(
    data: Partial<T>,
    errors: Record<string, string>
  ): void {
    // Implementación base que valida reglas de negocio comunes
    // Las subclases pueden sobrescribir para agregar validaciones específicas

    if (!data || Object.keys(data).length === 0) {
      return // No hay datos para validar
    }

    // Validación base: verificar que los campos requeridos no estén vacíos
    const requiredFields = this.getRequiredFields()
    for (const field of requiredFields) {
      if (
        data[field as keyof T] === undefined ||
        data[field as keyof T] === null
      ) {
        const displayName = this.getFieldDisplayName(field)
        errors[field] = `${displayName} es requerido`
      }
    }

    // Validación de longitud mínima para campos de texto
    const formatValidations = this.getFormatValidations()
    for (const [field, validation] of Object.entries(formatValidations)) {
      if (validation.minLength && data[field as keyof T]) {
        const value = data[field as keyof T]
        if (typeof value === 'string' && value.length < validation.minLength) {
          const displayName = this.getFieldDisplayName(field)
          errors[field] =
            `${displayName} debe tener al menos ${validation.minLength} caracteres`
        }
      }
    }
  }

  protected validateFieldType(
    field: string,
    value: any,
    validation: any
  ): boolean {
    switch (validation.type) {
      case 'string':
        return typeof value === 'string'
      case 'number':
        return typeof value === 'number' && !isNaN(value)
      case 'date':
        return value instanceof Date || !isNaN(Date.parse(value))
      case 'email':
        return typeof value === 'string' && this.isValidEmail(value)
      case 'phone':
        return typeof value === 'string' && this.isValidPhone(value)
      default:
        return true
    }
  }

  protected validateFieldFormat(
    field: string,
    value: any,
    validation: any
  ): boolean {
    switch (validation.format) {
      case 'email':
        return this.isValidEmail(value)
      case 'phone':
        return this.isValidPhone(value)
      case 'date':
        return this.isValidDate(value)
      case 'minLength':
        return (
          typeof value === 'string' &&
          value.length >= (validation.minLength || 0)
        )
      case 'maxLength':
        return (
          typeof value === 'string' &&
          value.length <= (validation.maxLength || 0)
        )
      case 'pattern':
        return new RegExp(validation.pattern).test(value)
      default:
        return true
    }
  }

  protected isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  protected isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[0-9\s\-()]{7,15}$/
    return phoneRegex.test(phone)
  }

  protected isValidDate(date: any): boolean {
    if (date instanceof Date) {
      return !isNaN(date.getTime())
    }
    if (typeof date === 'string') {
      const parsed = new Date(date)
      return !isNaN(parsed.getTime())
    }
    return false
  }

  protected getFieldDisplayName(field: string): string {
    const displayNames: Record<string, string> = {
      name: 'Nombre',
      email: 'Email',
      phoneNumber: 'Número de teléfono',
      birthDate: 'Fecha de nacimiento',
      address: 'Dirección',
      createdBy: 'Creado por',
      updatedBy: 'Actualizado por',
    }
    return displayNames[field] || field
  }

  // ============================================================================
  // ABSTRACT METHODS - Deben ser implementados por subclases
  // ============================================================================

  protected abstract getRequiredFields(): string[]
  protected abstract getTypeValidations(): Record<string, { type: string }>
  protected abstract getFormatValidations(): Record<
    string,
    {
      format: string
      errorMessage?: string
      minLength?: number
      maxLength?: number
      pattern?: RegExp
    }
  >
}
