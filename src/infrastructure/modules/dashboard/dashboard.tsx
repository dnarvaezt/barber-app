import { useEffect } from 'react'
import { useLayout } from '../../components'
import './dashboard.scss'

export const DashboardPage = () => {
  const { headerCommands } = useLayout()

  useEffect(() => {
    headerCommands.setTitle('Dashboard - Barber App')
    headerCommands.setActions(undefined)
    return () => {
      headerCommands.setActions(undefined)
    }
  }, [headerCommands])

  return (
    <div className='dashboard-page'>
      <div className='dashboard-page__content'>
        <div className='dashboard-page__welcome'>
          <h1 className='dashboard-page__title'>¡Bienvenido a Barber App!</h1>
          <p className='dashboard-page__subtitle'>
            Sistema de gestión para tu barbería
          </p>
        </div>

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

        <div className='dashboard-page__quick-actions'>
          <h2>Acciones Rápidas</h2>
          <div className='dashboard-page__actions-grid'>
            <button className='dashboard-page__action-button'>
              ➕ Nuevo Cliente
            </button>
            <button className='dashboard-page__action-button'>
              👥 Nuevo Empleado
            </button>
            <button className='dashboard-page__action-button'>
              📅 Nueva Cita
            </button>
            <button className='dashboard-page__action-button'>
              📊 Ver Reportes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
