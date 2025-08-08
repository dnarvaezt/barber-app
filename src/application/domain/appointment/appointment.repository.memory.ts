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

export class AppointmentRepositoryMemory implements AppointmentRepository {
  private appointments: Appointment[] = []

  private overlaps(
    aStart: Date,
    aEnd: Date,
    bStart: Date,
    bEnd: Date
  ): boolean {
    return aStart < bEnd && bStart < aEnd
  }

  private applyFilters(
    filters: AppointmentFilters,
    source: Appointment[]
  ): Appointment[] {
    return source.filter(a => {
      if (
        filters.status &&
        filters.status !== 'ALL' &&
        a.status !== filters.status
      )
        return false
      if (filters.employeeId && a.employeeId !== filters.employeeId)
        return false
      if (filters.clientId && a.clientId !== filters.clientId) return false
      if (filters.dateFrom && a.scheduledAt < filters.dateFrom) return false
      if (filters.dateTo) {
        const end = new Date(
          a.scheduledAt.getTime() + a.durationMinutes * 60000
        )
        if (end > filters.dateTo) return false
      }
      return true
    })
  }

  private paginate<T>(
    items: T[],
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    const validated = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validated

    const sorted = sortBy
      ? [...items].sort((a: any, b: any) => {
          const aValue = a[sortBy as keyof T]
          const bValue = b[sortBy as keyof T]
          if (aValue === undefined || bValue === undefined) return 0
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
          }
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
          }
          if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'asc'
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime()
          }
          return 0
        })
      : items

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = sorted.slice(startIndex, endIndex)

    return {
      data,
      meta: {
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
        hasNextPage: endIndex < items.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findAll(
    filters: AppointmentFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Appointment>> {
    const filtered = this.applyFilters(filters, this.appointments)
    return this.paginate(filtered, pagination)
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Appointment>> {
    const appt = this.appointments.find(a => a.id === id)
    return {
      data: appt ? [appt] : [],
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: appt ? 1 : 0,
        totalPages: appt ? 1 : 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  async findByEmployeeOverlap(
    employeeId: string,
    start: Date,
    end: Date
  ): Promise<Appointment[]> {
    return this.appointments.filter(a => {
      if (a.employeeId !== employeeId) return false
      const aStart = a.scheduledAt
      const aEnd = new Date(a.scheduledAt.getTime() + a.durationMinutes * 60000)
      return this.overlaps(aStart, aEnd, start, end)
    })
  }

  async create(data: CreateAppointmentRequest): Promise<Appointment> {
    const now = new Date()
    const duration = data.durationMinutes ?? 60
    const end = new Date(data.scheduledAt.getTime() + duration * 60000)
    // Si hay empleado asignado, validar que no haya traslape
    if (data.employeeId) {
      const overlaps = await this.findByEmployeeOverlap(
        data.employeeId,
        data.scheduledAt,
        end
      )
      if (overlaps.length > 0) {
        throw new Error(
          'Existe un traslape de cita para el empleado en ese horario'
        )
      }
    }

    const appt: Appointment = {
      id: `appt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      clientId: data.clientId,
      employeeId: data.employeeId,
      scheduledAt: new Date(data.scheduledAt),
      durationMinutes: duration,
      note: data.note,
      status: 'PENDING',
      createdAt: now,
      createdBy: data.createdBy,
      updatedAt: now,
      updatedBy: data.createdBy,
    }

    this.appointments.unshift(appt)
    return appt
  }

  async update(data: UpdateAppointmentRequest): Promise<Appointment> {
    const index = this.appointments.findIndex(a => a.id === data.id)
    if (index === -1) throw new Error('Appointment not found')

    const current = this.appointments[index]
    const next: Appointment = {
      ...current,
      ...('clientId' in data ? { clientId: data.clientId! } : {}),
      ...('employeeId' in data ? { employeeId: data.employeeId } : {}),
      ...('scheduledAt' in data ? { scheduledAt: data.scheduledAt! } : {}),
      ...('durationMinutes' in data
        ? { durationMinutes: data.durationMinutes! }
        : {}),
      ...('note' in data ? { note: data.note || undefined } : {}),
      updatedAt: new Date(),
      updatedBy: data.updatedBy,
    }

    // Validar overlap si cambió horario o empleado
    const changedScheduleOrEmployee =
      next.employeeId !== current.employeeId ||
      next.scheduledAt.getTime() !== current.scheduledAt.getTime() ||
      next.durationMinutes !== current.durationMinutes
    if (changedScheduleOrEmployee) {
      const end = new Date(
        next.scheduledAt.getTime() + next.durationMinutes * 60000
      )
      if (next.employeeId) {
        const overlaps = (
          await this.findByEmployeeOverlap(
            next.employeeId,
            next.scheduledAt,
            end
          )
        ).filter(a => a.id !== next.id)
        if (overlaps.length > 0) {
          throw new Error(
            'Existe un traslape de cita para el empleado en ese horario'
          )
        }
      }
    }

    this.appointments[index] = next
    return next
  }

  async changeStatus(
    id: string,
    status: AppointmentStatus,
    audit: { userId: string; reason?: string }
  ): Promise<Appointment> {
    const index = this.appointments.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Appointment not found')
    const current = this.appointments[index]

    // Reglas de transición
    const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELED', 'RESCHEDULED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELED', 'NO_SHOW', 'RESCHEDULED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELED'],
      COMPLETED: [],
      CANCELED: [],
      NO_SHOW: [],
      RESCHEDULED: ['PENDING'],
    }
    if (!validTransitions[current.status].includes(status)) {
      throw new Error('Transición de estado no permitida')
    }

    const now = new Date()
    // Regla adicional: NO_SHOW solo desde CONFIRMED y si ya pasó la hora
    if (status === 'NO_SHOW') {
      if (current.status !== 'CONFIRMED') {
        throw new Error(
          'Solo se puede marcar No asistió desde estado Confirmada'
        )
      }
      if (now.getTime() < current.scheduledAt.getTime()) {
        throw new Error(
          'Aún no ha pasado la hora de la cita para marcar No asistió'
        )
      }
    }
    // Regla: para pasar a IN_PROGRESS debe existir empleado asignado
    if (status === 'IN_PROGRESS' && !current.employeeId) {
      throw new Error('Debe asignarse un empleado para iniciar la cita')
    }

    const next: Appointment = {
      ...current,
      status,
      updatedAt: now,
      updatedBy: audit.userId,
      completedAt: status === 'COMPLETED' ? now : current.completedAt,
      completedBy: status === 'COMPLETED' ? audit.userId : current.completedBy,
      canceledAt: status === 'CANCELED' ? now : current.canceledAt,
      canceledBy: status === 'CANCELED' ? audit.userId : current.canceledBy,
      cancelReason: status === 'CANCELED' ? audit.reason : current.cancelReason,
    }

    this.appointments[index] = next
    return next
  }
}
