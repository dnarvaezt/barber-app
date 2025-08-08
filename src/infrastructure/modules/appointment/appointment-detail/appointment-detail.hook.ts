import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Appointment } from '../../../../application/domain'
import { appointmentService } from '../../../../application/domain/appointment'
import { clientService } from '../../../../application/domain/client'
import { employeeService } from '../../../../application/domain/employee'

export const useAppointmentDetail = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [appt, setAppt] = useState<Appointment | null>(null)
  const [employeeName, setEmployeeName] = useState('')
  const [clientName, setClientName] = useState('')

  const load = useCallback(async () => {
    if (!appointmentId) return
    try {
      setLoading(true)
      setError(null)
      const res = await appointmentService.getById(appointmentId, {
        page: 1,
        limit: 1,
      })
      const a = res.data[0]
      setAppt(a || null)
      if (a) {
        const [emp, cli] = await Promise.all([
          a.employeeId
            ? employeeService.getEmployeeById(a.employeeId, {
                page: 1,
                limit: 1,
              })
            : Promise.resolve({ data: [] as any[] } as any),
          clientService.getClientById(a.clientId, { page: 1, limit: 1 }),
        ])
        setEmployeeName(a.employeeId ? emp.data[0]?.name || a.employeeId : '')
        setClientName(cli.data[0]?.name || a.clientId)
      }
    } catch (e: any) {
      setError(e?.message || 'Error al cargar cita')
    } finally {
      setLoading(false)
    }
  }, [appointmentId])

  useEffect(() => {
    load()
  }, [load])

  const actions = useMemo(() => {
    if (!appt)
      return [] as {
        key: string
        label: string
        variant: 'primary' | 'secondary' | 'danger'
        onClick: () => void
      }[]
    const list: {
      key: string
      label: string
      variant: 'primary' | 'secondary' | 'danger'
      onClick: () => void
    }[] = []
    const change = async (
      status:
        | 'CONFIRMED'
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'CANCELED'
        | 'NO_SHOW'
        | 'RESCHEDULED'
    ) => {
      try {
        await appointmentService.changeStatus(appt.id, status, {
          userId: 'admin_001',
        })
      } catch (e: any) {
        alert(e?.message || 'No se pudo cambiar el estado')
      }
      await load()
    }
    if (appt.status === 'PENDING') {
      list.push({
        key: 'confirm',
        label: 'Confirmar',
        variant: 'secondary',
        onClick: () => void change('CONFIRMED'),
      })
      list.push({
        key: 'cancel',
        label: 'Cancelar',
        variant: 'danger',
        onClick: () => void change('CANCELED'),
      })
      list.push({
        key: 'reschedule',
        label: 'Reprogramar',
        variant: 'secondary',
        onClick: async () => {
          await change('RESCHEDULED')
          window.location.assign(
            window.location.pathname.replace(
              '/appointments/',
              '/appointments/form/'
            )
          )
        },
      })
    }
    if (appt.status === 'CONFIRMED') {
      if (appt.employeeId) {
        list.push({
          key: 'start',
          label: 'Iniciar',
          variant: 'secondary',
          onClick: () => void change('IN_PROGRESS'),
        })
      }
      list.push({
        key: 'cancel',
        label: 'Cancelar',
        variant: 'danger',
        onClick: () => void change('CANCELED'),
      })
      const canNoShow = Date.now() >= new Date(appt.scheduledAt).getTime()
      if (canNoShow) {
        list.push({
          key: 'no_show',
          label: 'No asistió',
          variant: 'secondary',
          onClick: () => void change('NO_SHOW'),
        })
      }
      list.push({
        key: 'reschedule',
        label: 'Reprogramar',
        variant: 'secondary',
        onClick: async () => {
          await change('RESCHEDULED')
          window.location.assign(
            window.location.pathname.replace(
              '/appointments/',
              '/appointments/form/'
            )
          )
        },
      })
    }
    if (appt.status === 'IN_PROGRESS') {
      list.push({
        key: 'finish',
        label: 'Finalizar',
        variant: 'primary',
        onClick: () => void change('COMPLETED'),
      })
      list.push({
        key: 'cancel',
        label: 'Cancelar',
        variant: 'danger',
        onClick: () => void change('CANCELED'),
      })
    }
    return list
  }, [appt, load])

  return { loading, error, appt, employeeName, clientName, actions }
}
