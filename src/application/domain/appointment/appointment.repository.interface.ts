import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from './appointment.model'

export interface AppointmentRepository {
  // Queries
  findAll(
    filters: AppointmentFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Appointment>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Appointment>>
  findByEmployeeOverlap(
    employeeId: string,
    start: Date,
    end: Date
  ): Promise<Appointment[]>

  // Commands
  create(data: CreateAppointmentRequest): Promise<Appointment>
  update(data: UpdateAppointmentRequest): Promise<Appointment>
  changeStatus(
    id: string,
    status: AppointmentStatus,
    audit: { userId: string; reason?: string }
  ): Promise<Appointment>
}
