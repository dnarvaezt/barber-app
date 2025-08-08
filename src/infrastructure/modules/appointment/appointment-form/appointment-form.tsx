import { Link } from 'react-router-dom'
import { RouteIds, useRoutes } from '../../../routes'
import { useAppointmentForm } from './appointment-form.hook'
import './appointment-form.scss'

export const AppointmentForm = () => {
  const { buildRoutePath } = useRoutes()
  const {
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
  } = useAppointmentForm()

  return (
    <div className='appointment-form'>
      <div className='appointment-form__container'>
        <div className='flex items-center justify-between mb-2'>
          <h1 className='appointment-form__title'>
            {isEditing ? 'Editar Cita' : 'Nueva Cita'}
          </h1>
          <Link
            to={buildRoutePath(RouteIds.CLIENT_FORM_NEW) || '/clients/form/new'}
            className='appointment-form__btn appointment-form__btn--secondary'
          >
            Nuevo Cliente
          </Link>
        </div>
        {error && <div className='appointment-form__error'>❌ {error}</div>}
        {successMessage && (
          <div className='appointment-form__success'>✅ {successMessage}</div>
        )}

        <form
          className='appointment-form__grid'
          onSubmit={e => {
            e.preventDefault()
            void save()
          }}
        >
          <div className='appointment-form__field'>
            <label>Cliente</label>
            <select
              value={form.clientId}
              onChange={e => setField('clientId', e.target.value)}
              disabled={loading}
            >
              <option value=''>Selecciona un cliente</option>
              {clients.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className='appointment-form__field'>
            <label>Empleado</label>
            <select
              value={form.employeeId}
              onChange={e => setField('employeeId', e.target.value)}
              disabled={loading}
            >
              <option value=''>Selecciona un empleado</option>
              {employees.map(e => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          <div className='appointment-form__field'>
            <label>Fecha y hora</label>
            <input
              type='datetime-local'
              value={form.scheduledAt}
              onChange={e => setField('scheduledAt', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className='appointment-form__field'>
            <label>Duración (min)</label>
            <input
              type='number'
              min={15}
              step={15}
              value={form.durationMinutes}
              onChange={e => setField('durationMinutes', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Servicio predefinido eliminado según requerimiento */}

          {/* Factura vinculada eliminada del formulario de citas */}

          <div className='appointment-form__field appointment-form__field--full'>
            <label>Nota (opcional)</label>
            <textarea
              value={form.note}
              onChange={e => setField('note', e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className='appointment-form__actions'>
            <button
              type='button'
              className='appointment-form__btn appointment-form__btn--secondary'
              onClick={cancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='appointment-form__btn appointment-form__btn--primary'
              disabled={loading}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
