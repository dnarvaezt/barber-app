// ============================================================================
// TRACK ACTIVITY INFRASTRUCTURE LAYER - Capa de infraestructura (sin dependencias)
// ============================================================================

// ============================================================================
// MONITOR - Monitor principal de actividad
// ============================================================================

export { ActivityMonitor } from './track-activity.monitor'

// ============================================================================
// UTILIDADES
// ============================================================================

export const formatActivityTime = (seconds: number): string => {
  // Manejar casos edge
  if (isNaN(seconds) || !isFinite(seconds)) {
    return '00:00'
  }

  // Usar valor absoluto para números negativos
  const absSeconds = Math.abs(seconds)
  const minutes = Math.floor(absSeconds / 60)
  const remainingSeconds = Math.floor(absSeconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatActivityDate = (date: Date | null): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return 'N/A'
  try {
    return date.toLocaleTimeString()
  } catch {
    return 'N/A'
  }
}

export const getActivityStateColor = (state: string): string => {
  // Manejar casos edge donde state no es un string
  if (!state || typeof state !== 'string') {
    return '#6b7280'
  }

  const normalizedState = state.toLowerCase()
  switch (normalizedState) {
    case 'active':
      return '#10b981'
    case 'suspended':
      return '#f59e0b'
    case 'finished':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

export const getActivityStateIcon = (state: string): string => {
  // Manejar casos edge donde state no es un string
  if (!state || typeof state !== 'string') {
    return '⚪'
  }

  const normalizedState = state.toLowerCase()
  switch (normalizedState) {
    case 'active':
      return '🟢'
    case 'suspended':
      return '⏸️'
    case 'finished':
      return '🔴'
    default:
      return '⚪'
  }
}
