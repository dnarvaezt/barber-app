import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { appointmentService } from '../../../../application/domain/appointment'
import { clientService } from '../../../../application/domain/client'
import { employeeService } from '../../../../application/domain/employee'
import { RouteIds, useRoutes } from '../../../routes'

type SelectOption = { value: string; label: string }

export const useAppointmentForm = () => {
  const { buildRoutePath } = useRoutes()
  const navigate = useNavigate()
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const isEditing = useMemo(
    () => Boolean(appointmentId && appointmentId !== 'new'),
    [appointmentId]
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [clients, setClients] = useState<SelectOption[]>([])
  const [employees, setEmployees] = useState<SelectOption[]>([])

  const [form, setForm] = useState({
    clientId: '',
    employeeId: '',
    scheduledAt: '',
    durationMinutes: '60',
    note: '',
  })

  useEffect(() => {
    const load = async () => {
      const [cli, emp] = await Promise.all([
        clientService.getAllClients({ page: 1, limit: 200 }),
        employeeService.getAllEmployees({ page: 1, limit: 200 }),
      ])
      setClients(cli.data.map(c => ({ value: c.id, label: c.name })))
      setEmployees(emp.data.map(e => ({ value: e.id, label: e.name })))
    }
    load()
  }, [])

  // Cargar cita para edición
  useEffect(() => {
    const toLocalInput = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0')
      const yyyy = d.getFullYear()
      const mm = pad(d.getMonth() + 1)
      const dd = pad(d.getDate())
      const hh = pad(d.getHours())
      const mi = pad(d.getMinutes())
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
    }
    const loadAppointment = async (id: string) => {
      try {
        setLoading(true)
        setError(null)
        const res = await appointmentService.getById(id, { page: 1, limit: 1 })
        const a = res.data[0]
        if (!a) return
        setForm({
          clientId: a.clientId || '',
          employeeId: a.employeeId || '',
          scheduledAt: toLocalInput(new Date(a.scheduledAt)),
          durationMinutes: String(a.durationMinutes || 60),
          note: a.note || '',
        })
      } catch (e: any) {
        setError(e?.message || 'Error al cargar la cita')
      } finally {
        setLoading(false)
      }
    }
    if (isEditing && appointmentId) void loadAppointment(appointmentId)
  }, [isEditing, appointmentId])

  const setField = useCallback((key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

  const validate = useCallback((): string | null => {
    if (!form.clientId) return 'El cliente es obligatorio'
    if (!form.scheduledAt) return 'La fecha y hora son obligatorias'
    const dt = new Date(form.scheduledAt)
    const now = new Date()
    if (dt.getTime() < now.getTime())
      return 'No se pueden agendar citas en el pasado'
    const dur = Number(form.durationMinutes)
    if (!Number.isFinite(dur) || dur <= 0) return 'Duración inválida'
    return null
  }, [form])

  const save = useCallback(async () => {
    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (isEditing && appointmentId) {
        const updated = await appointmentService.update({
          id: appointmentId,
          clientId: form.clientId,
          // Permitir quitar/omitir empleado si no se selecciona
          ...(form.employeeId ? { employeeId: form.employeeId } : {}),
          scheduledAt: new Date(form.scheduledAt),
          durationMinutes: Number(form.durationMinutes),
          note: form.note || null,
          updatedBy: 'admin_001',
        })
        // Si venimos de reprogramación, pasar a PENDING
        if (updated.status === 'RESCHEDULED') {
          await appointmentService.changeStatus(updated.id, 'PENDING', {
            userId: 'admin_001',
          })
        }
        setSuccessMessage('Cita actualizada')
        const path = buildRoutePath(RouteIds.APPOINTMENT_DETAIL)
        if (path) navigate(path.replace(':appointmentId', appointmentId))
      } else {
        const created = await appointmentService.create({
          clientId: form.clientId,
          ...(form.employeeId ? { employeeId: form.employeeId } : {}),
          scheduledAt: new Date(form.scheduledAt),
          durationMinutes: Number(form.durationMinutes),
          note: form.note || undefined,
          createdBy: 'admin_001',
        })
        setSuccessMessage('Cita creada')
        const path = buildRoutePath(RouteIds.APPOINTMENT_DETAIL)
        if (path) navigate(path.replace(':appointmentId', created.id))
      }
    } catch (e: any) {
      setError(e?.message || 'Error al crear cita')
    } finally {
      setLoading(false)
    }
  }, [form, buildRoutePath, navigate, isEditing, appointmentId])

  const cancel = useCallback(() => {
    const path = buildRoutePath(RouteIds.APPOINTMENTS)
    navigate(path || '/appointments')
  }, [buildRoutePath, navigate])

  return {
    loading,
    error,
    successMessage,
    clients,
    employees,
    form,
    setField,
    save,
    cancel,
    isEditing,
  }
}
