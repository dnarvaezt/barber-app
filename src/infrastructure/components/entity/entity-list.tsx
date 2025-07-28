import React from 'react'
import { Link } from 'react-router-dom'
import { RouteIds, useRoutes } from '../../routes'
import './entity-list.scss'

// ============================================================================
// MOBILE CARD COMPONENT - Componente reutilizable para tarjetas móviles
// ============================================================================

interface MobileCardProps {
  entity: any
  entityType: 'client' | 'employee'
  onDeleteClick: (id: string) => void
  formatPhone: (phone: string) => string
  formatDate: (date: Date) => string
  getAge: (date: Date) => number
  getMonthName: (month: number) => string
  className?: string
}

export const MobileCard: React.FC<MobileCardProps> = ({
  entity,
  entityType,
  onDeleteClick,
  formatPhone,
  formatDate,
  getAge,
  getMonthName,
  className = '',
}) => {
  const { buildRoutePathWithParams } = useRoutes()

  const getDetailRoute = () => {
    return entityType === 'client'
      ? RouteIds.CLIENT_DETAIL
      : RouteIds.EMPLOYEE_DETAIL
  }

  const getEditRoute = () => {
    return entityType === 'client'
      ? RouteIds.CLIENT_FORM_EDIT
      : RouteIds.EMPLOYEE_FORM_EDIT
  }

  const getRouteParams = (): Record<string, string> => {
    return entityType === 'client'
      ? { clientId: entity.id }
      : { employeeId: entity.id }
  }

  return (
    <div className={`entity-list__mobile-card ${className}`}>
      <div className='entity-list__mobile-header'>
        <h3 className='entity-list__mobile-title'>{entity.name}</h3>
        <div className='entity-list__mobile-actions'>
          <Link
            to={buildRoutePathWithParams(getDetailRoute(), getRouteParams())}
            className='entity-list__mobile-action-button entity-list__mobile-action-button--view'
          >
            👁️
          </Link>
          <Link
            to={buildRoutePathWithParams(getEditRoute(), getRouteParams())}
            className='entity-list__mobile-action-button entity-list__mobile-action-button--edit'
          >
            ✏️
          </Link>
          <button
            onClick={() => onDeleteClick(entity.id)}
            className='entity-list__mobile-action-button entity-list__mobile-action-button--delete'
          >
            🗑️
          </button>
        </div>
      </div>
      <div className='entity-list__mobile-content'>
        <div className='entity-list__mobile-item'>
          <span className='entity-list__mobile-label'>Teléfono:</span>
          <span className='entity-list__mobile-value'>
            {formatPhone(entity.phoneNumber)}
          </span>
        </div>
        <div className='entity-list__mobile-item'>
          <span className='entity-list__mobile-label'>
            Fecha de Nacimiento:
          </span>
          <span className='entity-list__mobile-value'>
            {formatDate(entity.birthDate)}
          </span>
        </div>
        <div className='entity-list__mobile-item'>
          <span className='entity-list__mobile-label'>Edad:</span>
          <span className='entity-list__mobile-value'>
            {getAge(entity.birthDate)} años
          </span>
        </div>
        <div className='entity-list__mobile-item'>
          <span className='entity-list__mobile-label'>Mes de Nacimiento:</span>
          <span className='entity-list__mobile-value'>
            {getMonthName(new Date(entity.birthDate).getMonth())}
          </span>
        </div>
        {entityType === 'employee' && (
          <div className='entity-list__mobile-item'>
            <span className='entity-list__mobile-label'>Porcentaje:</span>
            <span className='entity-list__mobile-value'>
              {entity.percentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// ENTITY LIST COMPONENT - Componente principal de lista de entidades
// ============================================================================

interface EntityListProps {
  entities: any[]
  entityType: 'client' | 'employee'
  loading?: boolean
  error?: string | null
  onDeleteClick: (id: string) => void
  formatPhone: (phone: string) => string
  formatDate: (date: Date) => string
  getAge: (date: Date) => number
  getMonthName: (month: number) => string
  className?: string
}

export const EntityList: React.FC<EntityListProps> = ({
  entities,
  entityType,
  loading = false,
  error = null,
  onDeleteClick,
  formatPhone,
  formatDate,
  getAge,
  getMonthName,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`entity-list__loading ${className}`}>
        <div className='entity-list__loading-spinner'></div>
        <p className='entity-list__loading-text'>
          Cargando {entityType === 'client' ? 'clientes' : 'empleados'}...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`entity-list__error ${className}`}>
        <div className='entity-list__error-icon'>⚠️</div>
        <p className='entity-list__error-text'>Error: {error}</p>
      </div>
    )
  }

  if (entities.length === 0) {
    return (
      <div className={`entity-list__empty ${className}`}>
        <div className='entity-list__empty-icon'>📭</div>
        <p className='entity-list__empty-text'>
          No se encontraron {entityType === 'client' ? 'clientes' : 'empleados'}
          .
        </p>
      </div>
    )
  }

  return (
    <div className={`entity-list__container ${className}`}>
      {entities.map(entity => (
        <MobileCard
          key={entity.id}
          entity={entity}
          entityType={entityType}
          onDeleteClick={onDeleteClick}
          formatPhone={formatPhone}
          formatDate={formatDate}
          getAge={getAge}
          getMonthName={getMonthName}
        />
      ))}
    </div>
  )
}
