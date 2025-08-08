import { Link } from 'react-router-dom'
import { RouteIds, useRoutes } from '../../../routes'
import { useAppointmentPage } from './appointment-page.hook'
import './appointment-page.scss'

export const AppointmentPage = () => {
  const { buildRoutePath } = useRoutes()
  const {
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
    loadMore,
    openEdit,
    dragging,
    hovered,
  } = useAppointmentPage()

  return (
    <div className='appointment-page'>
      <div className='appointment-page__container'>
        <div className='appointment-page__header'>
          <div className='appointment-page__title-section'>
            <h1 className='appointment-page__title'>Citas</h1>
            <span className='appointment-page__subtitle'>Tablero Kanban</span>
          </div>
          <div>
            <Link
              to={
                buildRoutePath(RouteIds.APPOINTMENT_FORM_NEW) ||
                '/appointments/form/new'
              }
              className='appointment-card__btn appointment-card__btn--primary'
            >
              Nueva Cita
            </Link>
          </div>
        </div>

        <div className='appointment-page__filters'>
          <div className='appointment-page__filter'>
            <label>Desde</label>
            <input
              type='date'
              value={filters.dateFrom || ''}
              onChange={e => setFilters({ dateFrom: e.target.value })}
            />
          </div>
          <div className='appointment-page__filter'>
            <label>Hasta</label>
            <input
              type='date'
              value={filters.dateTo || ''}
              onChange={e => setFilters({ dateTo: e.target.value })}
            />
          </div>
          <div className='appointment-page__filter'>
            <label>Empleado</label>
            <select
              value={filters.employeeId || ''}
              onChange={e => setFilters({ employeeId: e.target.value })}
            >
              <option value=''>Todos</option>
              {employees.map(e => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
          <div className='appointment-page__filter'>
            <label>Cliente</label>
            <select
              value={filters.clientId || ''}
              onChange={e => setFilters({ clientId: e.target.value })}
            >
              <option value=''>Todos</option>
              {clients.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='appointment-page__board'>
          {columns.map(col => (
            <div
              key={col.status}
              className={`appointment-page__column ${
                hovered === col.status ? 'appointment-page__column--hover' : ''
              }`}
              onDragOver={e => e.preventDefault()}
              onDragEnter={() => onDragEnterColumn(col.status)}
              onDragLeave={() => onDragLeaveColumn(col.status)}
              onDrop={() => onDropTo(col.status)}
            >
              <div className='appointment-page__column-header'>
                <h2>{col.title}</h2>
                <span className='appointment-page__column-count'>
                  {col.items.length}
                </span>
              </div>
              <div className='appointment-page__column-body'>
                {col.items.map(item => (
                  <div
                    key={item.id}
                    className={`appointment-card ${
                      dragging?.id === item.id
                        ? 'appointment-card--dragging'
                        : ''
                    }`}
                    draggable
                    onDragStart={() => onDragStart(item.id, col.status)}
                    onDragEnd={onDragEnd}
                    onDoubleClick={() => openEdit(item.id)}
                  >
                    <div className='appointment-card__time'>
                      {item.timeLabel}
                    </div>
                    <div className='appointment-card__client'>
                      {item.clientName}
                    </div>
                    <div className='appointment-card__employee'>
                      {item.employeeName}
                    </div>
                    {item.serviceName && (
                      <div className='appointment-card__service'>
                        {item.serviceName}
                      </div>
                    )}
                    <div className='appointment-card__actions'>
                      {item.actions.map(action => (
                        <button
                          key={action.key}
                          className={`appointment-card__btn appointment-card__btn--${action.variant}`}
                          onClick={() => action.onClick(item.id)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
