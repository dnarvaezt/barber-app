import { AppointmentRepositoryMemory } from './appointment.repository.memory'
import { AppointmentService } from './appointment.service'

const appointmentRepository = new AppointmentRepositoryMemory()

export const appointmentService = new AppointmentService(appointmentRepository)
