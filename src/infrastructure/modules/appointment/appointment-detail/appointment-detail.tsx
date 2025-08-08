import { useAppointmentDetail } from './appointment-detail.hook'
import './appointment-detail.scss'

export const AppointmentDetail = () => {
  const { loading, error, appt, clientName, employeeName, actions } =
    useAppointmentDetail()

  if (loading) return <div className='appointment-detail'>Cargando...</div>
  if (error)
    return <div className='appointment-detail'>❌ Error: {String(error)}</div>
  if (!appt) return <div className='appointment-detail'>No encontrado</div>

  const start = new Date(appt.scheduledAt)
  const date = start.toLocaleDateString()
  const time = start.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className='appointment-detail'>
      <div className='appointment-detail__card'>
        <h1 className='appointment-detail__title'>Detalle Cita</h1>
        <div className='appointment-detail__row'>
          <span>Cliente:</span>
          <strong>{clientName}</strong>
        </div>
        <div className='appointment-detail__row'>
          <span>Empleado:</span>
          <strong>{employeeName || '—'}</strong>
        </div>
        <div className='appointment-detail__row'>
          <span>Fecha:</span>
          <strong>{date}</strong>
        </div>
        <div className='appointment-detail__row'>
          <span>Hora:</span>
          <strong>{time}</strong>
        </div>
        {/* Servicio eliminado del modelo */}
        {appt.note && (
          <div className='appointment-detail__row'>
            <span>Nota:</span>
            <strong>{appt.note}</strong>
          </div>
        )}

        <div className='appointment-detail__actions'>
          {actions.map(a => (
            <button
              key={a.key}
              className={`appointment-detail__btn appointment-detail__btn--${a.variant}`}
              onClick={a.onClick}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
