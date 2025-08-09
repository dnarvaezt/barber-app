// ============================================================================
// TRACK ACTIVITY IMPLEMENTATION LAYER - Implementación React
// ============================================================================

// ============================================================================
// COMPONENTES PRINCIPALES
// ============================================================================

export * from './track-activity.component'
export * from './track-activity.provider'

// ============================================================================
// HOOKS
// ============================================================================

export * from './track-activity.hook'

export * from './track-activity.hooks'

export * from './track-activity.context'
export * from './track-activity.provider'

// ============================================================================
// EJEMPLOS
// ============================================================================

export * from './track-activity.example'

// ============================================================================
// TIPOS Y UTILIDADES
// ============================================================================

export * from './track-activity.component'

// ============================================================================
// CONSTANTES
// ============================================================================

export const TRACK_ACTIVITY_DEFAULTS = {
  showDebugInfo: false,
  showControls: true,
  showStats: true,
  showConfiguration: false,
  autoStart: false,
} as const

// ============================================================================
// CONFIGURACIONES PREDEFINIDAS
// ============================================================================

export const TRACK_ACTIVITY_CONFIGURATIONS = {
  development: {
    minimumTime: 2, // segundos
    maxIdleTime: 5, // minutos
    updateInterval: 1, // segundo
  },
  production: {
    minimumTime: 10, // segundos
    maxIdleTime: 60, // minutos
    updateInterval: 5, // segundos
  },
  testing: {
    minimumTime: 1, // segundo
    maxIdleTime: 1, // minuto
    updateInterval: 0.5, // segundos
  },
} as const

// ============================================================================
// EVENTOS DISPONIBLES
// ============================================================================

export const TRACK_ACTIVITY_EVENTS = {
  ACTIVITY_STARTED: 'activity.started',
  ACTIVITY_UPDATED: 'activity.updated',
  ACTIVITY_FINISHED: 'activity.finished',
  ACTIVITY_SUSPENDED: 'activity.suspended',
  ACTIVITY_RESUMED: 'activity.resumed',
  USER_INTERACTION_DETECTED: 'user.interaction.detected',
  IDLE_TIMEOUT_REACHED: 'idle.timeout.reached',
  TAB_VISIBILITY_CHANGED: 'tab.visibility.changed',
  TAB_FOCUS_CHANGED: 'tab.focus.changed',
  CONFIGURATION_UPDATED: 'activity.configuration.updated',
  MONITORING_STARTED: 'activity.monitoring.started',
  MONITORING_STOPPED: 'activity.monitoring.stopped',
  ACTIVITY_ERROR: 'activity.error',
  VALIDATION_FAILED: 'activity.validation.failed',
} as const

// ============================================================================
// TIPOS DE INTERACCIÓN
// ============================================================================

export const TRACK_ACTIVITY_INTERACTIONS = {
  CLICK: 'click',
  SCROLL: 'scroll',
  KEY_PRESS: 'key_press',
  MOUSE_MOVE: 'mouse_move',
  TOUCH: 'touch',
  FORM_INPUT: 'form_input',
  FOCUS: 'focus',
  BLUR: 'blur',
} as const

// ============================================================================
// ESTADOS DE ACTIVIDAD
// ============================================================================

export const TRACK_ACTIVITY_STATES = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  FINISHED: 'finished',
} as const
