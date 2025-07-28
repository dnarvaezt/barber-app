import { BaseService } from '../../core/domain/base.service'
import type {
  PaginatedResponse,
  PaginationParams,
} from '../../core/domain/entity.interface'
import { BaseValidator } from '../../core/domain/validators/base.validator'
import { EventBus, EventFactory } from '../../core/events/event.bus'
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from './client.model'
import type { ClientRepository } from './client.repository.interface'

// ============================================================================
// CLIENT VALIDATOR - Validador específico para clientes
// ============================================================================

export class ClientValidator extends BaseValidator<Client> {
  protected getRequiredFields(): string[] {
    return ['name', 'phoneNumber', 'birthDate', 'createdBy']
  }

  protected getTypeValidations(): Record<string, { type: string }> {
    return {
      name: { type: 'string' },
      phoneNumber: { type: 'string' },
      birthDate: { type: 'date' },
      createdBy: { type: 'string' },
    }
  }

  protected getFormatValidations(): Record<
    string,
    {
      format: string
      errorMessage?: string
      minLength?: number
      pattern?: RegExp
    }
  > {
    return {
      name: {
        format: 'minLength',
        minLength: 2,
        errorMessage: 'El nombre debe tener al menos 2 caracteres',
      },
      phoneNumber: {
        format: 'pattern',
        pattern: /^[+]?[0-9\s\-()]{7,15}$/,
        errorMessage: 'El número de teléfono tiene un formato inválido',
      },
      birthDate: {
        format: 'date',
        errorMessage: 'La fecha de nacimiento es inválida',
      },
    }
  }

  protected validateBusinessRules(
    data: Partial<Client>,
    errors: Record<string, string>
  ): void {
    // Validar que la fecha de nacimiento no sea en el futuro
    if (data.birthDate && data.birthDate > new Date()) {
      errors.birthDate = 'La fecha de nacimiento no puede ser en el futuro'
    }
  }
}

// ============================================================================
// CLIENT SERVICE REFACTORED - Servicio refactorizado usando la nueva arquitectura
// ============================================================================

export class ClientServiceRefactored extends BaseService<Client> {
  private eventBus: EventBus

  constructor(repository: ClientRepository, validator?: ClientValidator) {
    super(repository, validator || new ClientValidator())
    this.eventBus = EventBus.getInstance()
  }

  // ============================================================================
  // OVERRIDE METHODS - Métodos sobrescritos para funcionalidad específica
  // ============================================================================

  protected getSearchableFields(): string[] {
    return ['name', 'phoneNumber']
  }

  protected getUniqueConstraints(): string[] {
    return ['phoneNumber']
  }

  protected getDefaultSortBy(): string {
    return 'name'
  }

  // ============================================================================
  // PUBLIC METHODS - API pública extendida
  // ============================================================================

  async createClient(clientData: CreateClientRequest): Promise<Client> {
    try {
      const client = await this.create(clientData as any)

      // Publicar evento de creación
      const event = EventFactory.createEntityCreated(client, 'client')
      await this.eventBus.publish(event)

      return client
    } catch (error) {
      // Publicar evento de error de validación
      if (
        error instanceof Error &&
        error.message.includes('Validation failed')
      ) {
        const event = EventFactory.createValidationFailed(
          { message: error.message },
          'client'
        )
        await this.eventBus.publish(event)
      }
      throw error
    }
  }

  async updateClient(clientData: UpdateClientRequest): Promise<Client> {
    try {
      const client = await this.update(clientData)

      // Publicar evento de actualización
      const event = EventFactory.createEntityUpdated(client, 'client')
      await this.eventBus.publish(event)

      return client
    } catch (error) {
      // Publicar evento de error de validación
      if (
        error instanceof Error &&
        error.message.includes('Validation failed')
      ) {
        const event = EventFactory.createValidationFailed(
          { message: error.message },
          'client'
        )
        await this.eventBus.publish(event)
      }
      throw error
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    const deleted = await this.delete(id)

    if (deleted) {
      // Publicar evento de eliminación
      const event = EventFactory.createEntityDeleted(id, 'client')
      await this.eventBus.publish(event)
    }

    return deleted
  }

  async findClients(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    const result = await this.search(searchTerm, pagination)

    // Publicar evento de búsqueda
    const event = EventFactory.createSearchPerformed(searchTerm, 'client')
    await this.eventBus.publish(event)

    return result
  }

  async getClientsByBirthMonth(
    month: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Client>> {
    this.validateMonth(month)
    this.validatePaginationParams(pagination)

    // Usar el repositorio específico de clientes
    const clientRepository = this.repository as any
    return clientRepository.findByBirthMonth(
      month,
      this.normalizePagination(pagination)
    )
  }

  // ============================================================================
  // PRIVATE METHODS - Métodos privados para validaciones específicas
  // ============================================================================

  private validateMonth(month: number): void {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12')
    }
  }

  // ============================================================================
  // OVERRIDE VALIDATION METHODS - Validaciones específicas para clientes
  // ============================================================================

  protected async validateUniqueConstraints(
    data: Partial<Client>,
    excludeId?: string
  ): Promise<void> {
    const defaultPagination: PaginationParams = { page: 1, limit: 100 }

    // Validar número de teléfono único
    if (data.phoneNumber) {
      const existingClients = await this.repository.find(
        data.phoneNumber,
        defaultPagination
      )
      const existingClient = existingClients.data.find(
        client =>
          client.phoneNumber === data.phoneNumber && client.id !== excludeId
      )
      if (existingClient) {
        throw new Error('Client with this phone number already exists')
      }
    }
  }
}
