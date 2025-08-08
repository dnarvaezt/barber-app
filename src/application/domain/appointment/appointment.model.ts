export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELED'
  | 'NO_SHOW'
  | 'RESCHEDULED'

export interface Appointment {
  id: string
  clientId: string
  employeeId?: string
  scheduledAt: Date
  durationMinutes: number
  note?: string
  status: AppointmentStatus
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  completedAt?: Date
  completedBy?: string
  canceledAt?: Date
  canceledBy?: string
  cancelReason?: string
}

export interface CreateAppointmentRequest {
  clientId: string
  employeeId?: string
  scheduledAt: Date
  durationMinutes?: number
  note?: string
  createdBy: string
}

export interface UpdateAppointmentRequest {
  id: string
  clientId?: string
  employeeId?: string
  scheduledAt?: Date
  durationMinutes?: number
  note?: string | null
  updatedBy: string
}

export interface AppointmentFilters {
  dateFrom?: Date
  dateTo?: Date
  employeeId?: string
  clientId?: string
  status?: AppointmentStatus | 'ALL'
}
