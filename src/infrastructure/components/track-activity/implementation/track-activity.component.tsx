// ============================================================================
// TRACK ACTIVITY COMPONENT - Componente principal de React
// ============================================================================

import React, { useState } from 'react'
import { ActivityState, TimeValueObject } from '../application'

import {
  useTrackActivityConfiguration,
  useTrackActivityContext,
  useTrackActivityEvents,
  useTrackActivityMonitoring,
  useTrackActivityStats,
} from './track-activity.hooks'

import './track-activity.scss'

// ============================================================================
// INTERFACES DEL COMPONENTE
// ============================================================================

export interface TrackActivityComponentProps {
  showDebugInfo?: boolean
  showControls?: boolean
  showStats?: boolean
  showConfiguration?: boolean
  className?: string
  style?: React.CSSProperties
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function TrackActivityComponent({
  showDebugInfo = false,
  showControls = true,
  showStats = true,
  showConfiguration = false,
  className = '',
  style = {},
}: TrackActivityComponentProps) {
  const { state, actions } = useTrackActivityContext()
  const { isMonitoring, startMonitoring, stopMonitoring } =
    useTrackActivityMonitoring()
  const { activeRecord, lastInteractionTime, isTabVisible, isTabFocused } =
    useTrackActivityEvents()
  const { stats } = useTrackActivityStats()
  const { configuration } = useTrackActivityConfiguration()

  const [showDetails, setShowDetails] = useState(false)

  // ============================================================================
  // FUNCIONES AUXILIARES
  // ============================================================================

  const formatTime = (timeValue: TimeValueObject): string => {
    const minutes = Math.floor(timeValue.seconds / 60)
    const seconds = timeValue.seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A'
    return date.toLocaleTimeString()
  }

  const getStateColor = (state: ActivityState): string => {
    switch (state) {
      case ActivityState.ACTIVE:
        return 'var(--activity-state-active)'
      case ActivityState.SUSPENDED:
        return 'var(--activity-state-suspended)'
      case ActivityState.FINISHED:
        return 'var(--activity-state-finished)'
      default:
        return 'var(--activity-state-inactive)'
    }
  }

  const getStateIcon = (state: ActivityState): string => {
    switch (state) {
      case ActivityState.ACTIVE:
        return '🟢'
      case ActivityState.SUSPENDED:
        return '⏸️'
      case ActivityState.FINISHED:
        return '🔴'
      default:
        return '⚪'
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`track-activity ${className}`} style={style}>
      {/* ============================================================================
          HEADER
      ============================================================================ */}

      <div className='track-activity__header'>
        <h3 className='track-activity__title'>
          📊 Sistema de Registro de Actividad
        </h3>

        <div className='track-activity__status'>
          <span
            className='track-activity__status-indicator'
            style={{
              backgroundColor: isMonitoring
                ? 'var(--activity-monitoring-active)'
                : 'var(--activity-monitoring-inactive)',
            }}
          />
          <span className='track-activity__status-text'>
            {isMonitoring ? 'Monitoreando' : 'Detenido'}
          </span>
        </div>
      </div>

      {/* ============================================================================
          CONTROLES
      ============================================================================ */}

      {showControls && (
        <div className='track-activity__controls'>
          <button
            className={`track-activity__button track-activity__button--${isMonitoring ? 'stop' : 'start'}`}
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            disabled={false}
          >
            {isMonitoring ? '⏹️ Detener' : '▶️ Iniciar'}
          </button>

          <button
            className='track-activity__button track-activity__button--clear'
            onClick={actions.clearRecords}
            disabled={!isMonitoring}
          >
            🗑️ Limpiar Registros
          </button>

          <button
            className='track-activity__button track-activity__button--details'
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '📋 Ocultar Detalles' : '📋 Mostrar Detalles'}
          </button>
        </div>
      )}

      {/* ============================================================================
          ESTADO ACTUAL
      ============================================================================ */}

      <div className='track-activity__current-state'>
        <div className='track-activity__record-info'>
          <h4 className='track-activity__section-title'>Registro Activo</h4>

          {activeRecord ? (
            <div className='track-activity__record'>
              <div className='track-activity__record-header'>
                <span className='track-activity__record-id'>
                  ID: {activeRecord.id}
                </span>
                <span
                  className='track-activity__record-state'
                  style={{ color: getStateColor(activeRecord.state) }}
                >
                  {getStateIcon(activeRecord.state)} {activeRecord.state}
                </span>
              </div>

              <div className='track-activity__record-times'>
                <div className='track-activity__time-item'>
                  <span className='track-activity__time-label'>
                    Tiempo Activo:
                  </span>
                  <span className='track-activity__time-value'>
                    {formatTime(activeRecord.activeTime)}
                  </span>
                </div>

                <div className='track-activity__time-item'>
                  <span className='track-activity__time-label'>
                    Tiempo Inactivo:
                  </span>
                  <span className='track-activity__time-value'>
                    {formatTime(activeRecord.idleTime)}
                  </span>
                </div>

                <div className='track-activity__time-item'>
                  <span className='track-activity__time-label'>
                    Tiempo Total:
                  </span>
                  <span className='track-activity__time-value'>
                    {formatTime(activeRecord.totalTime)}
                  </span>
                </div>
              </div>

              <div className='track-activity__record-details'>
                <div className='track-activity__detail-item'>
                  <span className='track-activity__detail-label'>Inicio:</span>
                  <span className='track-activity__detail-value'>
                    {formatDate(activeRecord.startTime)}
                  </span>
                </div>

                <div className='track-activity__detail-item'>
                  <span className='track-activity__detail-label'>
                    Última Interacción:
                  </span>
                  <span className='track-activity__detail-value'>
                    {formatDate(activeRecord.lastInteractionTime)}
                  </span>
                </div>

                <div className='track-activity__detail-item'>
                  <span className='track-activity__detail-label'>
                    Tipo de Interacción:
                  </span>
                  <span className='track-activity__detail-value'>
                    {activeRecord.lastInteractionType || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className='track-activity__no-record'>
              <span className='track-activity__no-record-text'>
                No hay registro activo
              </span>
            </div>
          )}
        </div>

        <div className='track-activity__tab-info'>
          <h4 className='track-activity__section-title'>
            Estado de la Pestaña
          </h4>

          <div className='track-activity__tab-status'>
            <div className='track-activity__tab-item'>
              <span className='track-activity__tab-label'>Visible:</span>
              <span
                className={`track-activity__tab-value track-activity__tab-value--${isTabVisible ? 'visible' : 'hidden'}`}
              >
                {isTabVisible ? '👁️ Sí' : '🙈 No'}
              </span>
            </div>

            <div className='track-activity__tab-item'>
              <span className='track-activity__tab-label'>Enfocada:</span>
              <span
                className={`track-activity__tab-value track-activity__tab-value--${isTabFocused ? 'focused' : 'unfocused'}`}
              >
                {isTabFocused ? '🎯 Sí' : '❌ No'}
              </span>
            </div>

            <div className='track-activity__tab-item'>
              <span className='track-activity__tab-label'>
                Última Interacción:
              </span>
              <span className='track-activity__tab-value'>
                {formatDate(lastInteractionTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================================
          ESTADÍSTICAS
      ============================================================================ */}

      {showStats && (
        <div className='track-activity__stats'>
          <h4 className='track-activity__section-title'>Estadísticas</h4>

          <div className='track-activity__stats-grid'>
            <div className='track-activity__stat-item'>
              <span className='track-activity__stat-label'>
                Total de Registros:
              </span>
              <span className='track-activity__stat-value'>
                {stats.totalRecords}
              </span>
            </div>

            <div className='track-activity__stat-item'>
              <span className='track-activity__stat-label'>
                Tiempo Promedio:
              </span>
              <span className='track-activity__stat-value'>
                {formatTime(stats.averageSessionTime)}
              </span>
            </div>

            <div className='track-activity__stat-item'>
              <span className='track-activity__stat-label'>
                Sesión Más Larga:
              </span>
              <span className='track-activity__stat-value'>
                {formatTime(stats.longestSession)}
              </span>
            </div>

            <div className='track-activity__stat-item'>
              <span className='track-activity__stat-label'>
                Sesión Más Corta:
              </span>
              <span className='track-activity__stat-value'>
                {formatTime(stats.shortestSession)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          CONFIGURACIÓN
      ============================================================================ */}

      {showConfiguration && (
        <div className='track-activity__configuration'>
          <h4 className='track-activity__section-title'>Configuración</h4>

          <div className='track-activity__config-grid'>
            <div className='track-activity__config-item'>
              <span className='track-activity__config-label'>
                Tiempo Mínimo:
              </span>
              <span className='track-activity__config-value'>
                {formatTime(configuration.minimumTime)}
              </span>
            </div>

            <div className='track-activity__config-item'>
              <span className='track-activity__config-label'>
                Tiempo Máximo de Inactividad:
              </span>
              <span className='track-activity__config-value'>
                {formatTime(configuration.maxIdleTime)}
              </span>
            </div>

            <div className='track-activity__config-item'>
              <span className='track-activity__config-label'>
                Intervalo de Actualización:
              </span>
              <span className='track-activity__config-value'>
                {formatTime(configuration.updateInterval)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          INFORMACIÓN DE DEBUG
      ============================================================================ */}

      {showDebugInfo && (
        <div className='track-activity__debug'>
          <h4 className='track-activity__section-title'>
            Información de Debug
          </h4>

          <pre className='track-activity__debug-info'>
            {JSON.stringify(
              {
                isMonitoring: state.isMonitoring,
                activeRecord: activeRecord
                  ? {
                      id: activeRecord.id,
                      state: activeRecord.state,
                      activeTime: activeRecord.activeTime.seconds,
                      idleTime: activeRecord.idleTime.seconds,
                      totalTime: activeRecord.totalTime.seconds,
                    }
                  : null,
                lastInteractionTime: lastInteractionTime?.toISOString(),
                isTabVisible,
                isTabFocused,
                stats: {
                  totalRecords: stats.totalRecords,
                  averageSessionTime: stats.averageSessionTime.seconds,
                  longestSession: stats.longestSession.seconds,
                  shortestSession: stats.shortestSession.seconds,
                },
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  )
}
