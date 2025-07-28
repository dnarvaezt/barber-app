import { useEffect } from 'react'
import { Icon } from '../../components/icons'
import './dashboard.scss'

export const DashboardPage = () => {
  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  return (
    <div className='dashboard-page'>
      <div className='dashboard-page__content'>
        {/* Sección de bienvenida */}
        <div className='dashboard-page__welcome'>
          <h1 className='dashboard-page__title'>¡Bienvenido a Barber App!</h1>
          <p className='dashboard-page__subtitle'>
            Sistema de gestión moderno para tu barbería
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className='dashboard-page__stats'>
          <div className='dashboard-page__stat-card'>
            <h3>Clientes</h3>
            <p className='dashboard-page__stat-number'>0</p>
            <p className='dashboard-page__stat-label'>Total registrados</p>
          </div>

          <div className='dashboard-page__stat-card'>
            <h3>Empleados</h3>
            <p className='dashboard-page__stat-number'>0</p>
            <p className='dashboard-page__stat-label'>En el equipo</p>
          </div>

          <div className='dashboard-page__stat-card'>
            <h3>Citas</h3>
            <p className='dashboard-page__stat-number'>0</p>
            <p className='dashboard-page__stat-label'>Programadas hoy</p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className='dashboard-page__quick-actions'>
          <h2>Acciones Rápidas</h2>
          <div className='dashboard-page__actions-grid'>
            <button className='dashboard-page__action-button'>
              <Icon name='user-plus' className='mr-2' />
              Nuevo Cliente
            </button>
            <button className='dashboard-page__action-button'>
              <Icon name='users' className='mr-2' />
              Nuevo Empleado
            </button>
            <button className='dashboard-page__action-button'>
              <Icon name='calendar' className='mr-2' />
              Nueva Cita
            </button>
            <button className='dashboard-page__action-button'>
              <Icon name='chart-bar' className='mr-2' />
              Ver Reportes
            </button>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className='dashboard-page__recent-activity'>
          <h2>Actividad Reciente</h2>
          <div className='dashboard-page__activity-list'>
            <div className='dashboard-page__activity-item'>
              <div className='dashboard-page__activity-icon'>
                <Icon name='user-plus' />
              </div>
              <div className='dashboard-page__activity-content'>
                <div className='dashboard-page__activity-title'>
                  Nuevo cliente registrado
                </div>
                <div className='dashboard-page__activity-time'>
                  Hace 2 horas
                </div>
              </div>
            </div>

            <div className='dashboard-page__activity-item'>
              <div className='dashboard-page__activity-icon'>
                <Icon name='calendar-check' />
              </div>
              <div className='dashboard-page__activity-content'>
                <div className='dashboard-page__activity-title'>
                  Cita confirmada
                </div>
                <div className='dashboard-page__activity-time'>
                  Hace 4 horas
                </div>
              </div>
            </div>

            <div className='dashboard-page__activity-item'>
              <div className='dashboard-page__activity-icon'>
                <Icon name='users' />
              </div>
              <div className='dashboard-page__activity-content'>
                <div className='dashboard-page__activity-title'>
                  Empleado agregado
                </div>
                <div className='dashboard-page__activity-time'>Ayer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Estado vacío cuando no hay actividad - comentado por ahora */}
        {/* 
        <div className='dashboard-page__empty-state'>
          <div className='dashboard-page__empty-icon'>
            <Icon name='inbox' />
          </div>
          <div className='dashboard-page__empty-text'>
            No hay actividad reciente
          </div>
          <div className='dashboard-page__empty-description'>
            Comienza agregando clientes y programando citas
          </div>
        </div>
        */}
      </div>
    </div>
  )
}
