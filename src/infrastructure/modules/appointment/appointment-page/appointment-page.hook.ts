import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  Appointment,
  AppointmentStatus,
} from '../../../../application/domain'
import { appointmentService } from '../../../../application/domain/appointment'
import { clientService } from '../../../../application/domain/client'
import { employeeService } from '../../../../application/domain/employee'
import { RouteIds, useRoutes } from '../../../routes'

type SelectOption = { value: string; label: string }

type BoardItem = {
  id: string
  clientName: string
  employeeName: string
  timeLabel: string
  serviceName?: string
  canCreateInvoice: boolean
  actions: {
    key: string
    label: string
    variant: 'primary' | 'secondary' | 'danger'
    onClick: (id: string) => void
  }[]
}

type Column = { status: AppointmentStatus; title: string; items: BoardItem[] }

export const useAppointmentPage = () => {
  const { buildRoutePath } = useRoutes()
  const navigate = useNavigate()

  const [filters, setFiltersBase] = useState<{
    dateFrom?: string
    dateTo?: string
    employeeId?: string
    clientId?: string
  }>({})

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [limit, setLimit] = useState(200)
  const [employees, setEmployees] = useState<SelectOption[]>([])
  const [clients, setClients] = useState<SelectOption[]>([])

  const loadCatalogs = useCallback(async () => {
    const [emp, cli] = await Promise.all([
      employeeService.getAllEmployees({ page: 1, limit: 100 }),
      clientService.getAllClients({ page: 1, limit: 100 }),
    ])
    setEmployees(emp.data.map(e => ({ value: e.id, label: e.name })))
    setClients(cli.data.map(c => ({ value: c.id, label: c.name })))
  }, [])

  const loadAppointments = useCallback(async () => {
    const f = {
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      employeeId: filters.employeeId || undefined,
      clientId: filters.clientId || undefined,
      status: 'ALL' as const,
    }
    const res = await appointmentService.list(f, {
      page: 1,
      limit,
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
    })
    setAppointments(res.data)
  }, [filters, limit])

  useEffect(() => {
    loadCatalogs()
  }, [loadCatalogs])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const setFilters = useCallback((partial: Partial<typeof filters>) => {
    setFiltersBase(prev => ({ ...prev, ...partial }))
  }, [])

  const employeeMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const e of employees) map.set(e.value, e.label)
    return map
  }, [employees])

  const clientMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of clients) map.set(c.value, c.label)
    return map
  }, [clients])

  const changeStatus = useCallback(
    async (id: string, status: AppointmentStatus) => {
      let reason: string | undefined
      if (status === 'CANCELED') {
        reason = window.prompt('Motivo de cancelación (opcional)') || undefined
      }
      try {
        await appointmentService.changeStatus(id, status, {
          userId: 'admin_001',
          reason,
        })
      } catch (e: any) {
        alert(e?.message || 'No se pudo cambiar el estado')
      }
      await loadAppointments()
    },
    [loadAppointments]
  )

  // Facturación eliminada del flujo de citas

  const openEdit = useCallback(
    (id: string) => {
      const path =
        buildRoutePath(RouteIds.APPOINTMENT_FORM_EDIT) ||
        '/appointments/form/:appointmentId'
      navigate(path.replace(':appointmentId', id))
    },
    [buildRoutePath, navigate]
  )

  const reschedule = useCallback(
    (id: string) => {
      // No cambiamos a RESCHEDULED para que la tarjeta no "desaparezca" al ocultar columnas
      openEdit(id)
    },
    [openEdit]
  )

  // Drag & Drop simple con validación de transición
  const [dragging, setDragging] = useState<{
    id: string
    from: AppointmentStatus
  } | null>(null)
  const [hovered, setHovered] = useState<AppointmentStatus | null>(null)
  const onDragStart = useCallback(
    (id: string, from: AppointmentStatus) => setDragging({ id, from }),
    []
  )
  const onDragEnterColumn = useCallback((status: AppointmentStatus) => {
    setHovered(status)
  }, [])
  const onDragLeaveColumn = useCallback((status: AppointmentStatus) => {
    setHovered(prev => (prev === status ? null : prev))
  }, [])
  const onDragEnd = useCallback(() => {
    setDragging(null)
    setHovered(null)
  }, [])
  const isTransitionAllowed = useCallback(
    (from: AppointmentStatus, to: AppointmentStatus) => {
      const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
        PENDING: ['CONFIRMED', 'CANCELED', 'RESCHEDULED'],
        CONFIRMED: ['IN_PROGRESS', 'CANCELED', 'NO_SHOW', 'RESCHEDULED'],
        IN_PROGRESS: ['COMPLETED', 'CANCELED'],
        COMPLETED: [],
        CANCELED: [],
        NO_SHOW: [],
        RESCHEDULED: ['PENDING'],
      }
      return validTransitions[from].includes(to)
    },
    []
  )
  const onDropTo = useCallback(
    async (status: AppointmentStatus) => {
      if (!dragging) return
      if (!isTransitionAllowed(dragging.from, status)) {
        alert('Transición de estado no permitida')
        setDragging(null)
        setHovered(null)
        return
      }
      await changeStatus(dragging.id, status)
      setDragging(null)
      setHovered(null)
    },
    [dragging, changeStatus, isTransitionAllowed]
  )

  const columns: Column[] = useMemo(() => {
    const groups: Record<AppointmentStatus, Appointment[]> = {
      PENDING: [],
      CONFIRMED: [],
      IN_PROGRESS: [],
      COMPLETED: [],
      CANCELED: [],
      NO_SHOW: [],
      RESCHEDULED: [],
    }
    for (const a of appointments) groups[a.status].push(a)

    const makeItem = (a: Appointment): BoardItem => {
      const start = new Date(a.scheduledAt)
      const hh = String(start.getHours()).padStart(2, '0')
      const mm = String(start.getMinutes()).padStart(2, '0')
      const timeLabel = `${hh}:${mm}`
      const clientName = clientMap.get(a.clientId) || a.clientId
      const employeeName = a.employeeId
        ? employeeMap.get(a.employeeId) || a.employeeId
        : '—'
      const actions: BoardItem['actions'] = []
      if (a.status === 'PENDING') {
        actions.push({
          key: 'confirm',
          label: 'Confirmar',
          variant: 'secondary',
          onClick: id => changeStatus(id, 'CONFIRMED'),
        })
        actions.push({
          key: 'cancel',
          label: 'Cancelar',
          variant: 'danger',
          onClick: id => changeStatus(id, 'CANCELED'),
        })
        actions.push({
          key: 'reschedule',
          label: 'Reprogramar',
          variant: 'secondary',
          onClick: id => reschedule(id),
        })
      }
      if (a.status === 'CONFIRMED') {
        if (a.employeeId) {
          actions.push({
            key: 'start',
            label: 'Iniciar',
            variant: 'secondary',
            onClick: id => changeStatus(id, 'IN_PROGRESS'),
          })
        }
        actions.push({
          key: 'cancel',
          label: 'Cancelar',
          variant: 'danger',
          onClick: id => changeStatus(id, 'CANCELED'),
        })
        // Solo permitir No asistió si ya pasó la hora (UI preventiva)
        const start = new Date(a.scheduledAt).getTime()
        const canNoShow = Date.now() >= start
        if (canNoShow) {
          actions.push({
            key: 'no_show',
            label: 'No asistió',
            variant: 'secondary',
            onClick: id => changeStatus(id, 'NO_SHOW'),
          })
        }
        actions.push({
          key: 'reschedule',
          label: 'Reprogramar',
          variant: 'secondary',
          onClick: id => reschedule(id),
        })
      }
      if (a.status === 'IN_PROGRESS') {
        actions.push({
          key: 'finish',
          label: 'Finalizar',
          variant: 'primary',
          onClick: id => changeStatus(id, 'COMPLETED'),
        })
        actions.push({
          key: 'cancel',
          label: 'Cancelar',
          variant: 'danger',
          onClick: id => changeStatus(id, 'CANCELED'),
        })
      }
      return {
        id: a.id,
        clientName,
        employeeName,
        timeLabel,
        serviceName: undefined,
        canCreateInvoice: false,
        actions,
      }
    }

    const mk = (status: AppointmentStatus, title: string): Column => ({
      status,
      title,
      items: groups[status].map(makeItem),
    })

    // Mostrar solo columnas del flujo principal (oculta Cancelada / No asistió / Reprogramada)
    return [
      mk('PENDING', 'Pendiente'),
      mk('CONFIRMED', 'Confirmada'),
      mk('IN_PROGRESS', 'En curso'),
      mk('COMPLETED', 'Completada'),
    ]
  }, [appointments, clientMap, employeeMap, changeStatus])

  return {
    columns,
    filters,
    setFilters,
    employees,
    clients,
    onDragStart,
    onDragEnterColumn,
    onDragLeaveColumn,
    onDragEnd,
    onDropTo,
    appointments,
    loadMore: () => setLimit(prev => prev + 200),
    openEdit,
    dragging,
    hovered,
  }
}
