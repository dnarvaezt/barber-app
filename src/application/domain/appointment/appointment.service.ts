import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from './appointment.model'
import type { AppointmentRepository } from './appointment.repository.interface'

export class AppointmentService {
  private readonly repository: AppointmentRepository

  constructor(repository: AppointmentRepository) {
    this.repository = repository
  }

  async list(
    filters: AppointmentFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Appointment>> {
    const validated = PaginationHelper.validateParams(pagination)
    return this.repository.findAll(filters, validated)
  }

  async getById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Appointment>> {
    if (!id) throw new Error('Appointment ID is required')
    const validated = PaginationHelper.validateParams(pagination)
    return this.repository.findById(id, validated)
  }

  async create(data: CreateAppointmentRequest): Promise<Appointment> {
    if (!data.clientId) throw new Error('clientId is required')
    if (!data.scheduledAt) throw new Error('scheduledAt is required')
    const now = new Date()
    if (data.scheduledAt.getTime() < now.getTime()) {
      throw new Error('No se pueden crear citas en el pasado')
    }
    return this.repository.create(data)
  }

  async update(data: UpdateAppointmentRequest): Promise<Appointment> {
    if (!data.id) throw new Error('id is required')
    return this.repository.update(data)
  }

  async changeStatus(
    id: string,
    status: AppointmentStatus,
    audit: { userId: string; reason?: string }
  ): Promise<Appointment> {
    // Sin validación de factura; empleado ya es obligatorio
    return this.repository.changeStatus(id, status, audit)
  }
}
