// ============================================================================
// TRACK ACTIVITY APPLICATION LAYER - Capa de aplicación (sin dependencias)
// ============================================================================

// ============================================================================
// MODELOS Y INTERFACES
// ============================================================================

export {
  ActivityState,
  DEFAULT_ACTIVITY_CONFIGURATION,
  EventType,
  InteractionType,
  TimeValueObject,
} from './track-activity.model'

export type {
  IActivityConfiguration,
  IActivityConfigurationService,
  IActivityEvent,
  IActivityEventBus,
  IActivityEventFactory,
  IActivityEventService,
  IActivityRecord,
  IActivityRecordFactory,
  IActivityRecordRepository,
  IActivityRecordService,
  IActivityValidator,
  ValidationResult,
} from './track-activity.model'

// ============================================================================
// SERVICIOS
// ============================================================================

export {
  ActivityConfigurationService,
  ActivityEventService,
  ActivityRecordService,
} from './track-activity.service'

// ============================================================================
// REPOSITORIOS
// ============================================================================

export { ActivityRecordMemoryRepository } from './track-activity.repository.memory'

export { ActivityRecordIndexedDBRepository } from './track-activity.repository.indexeddb'

// ============================================================================
// FACTORIES
// ============================================================================

export {
  ActivityConfigurationFactory,
  ActivityEventFactory,
  ActivityRecordFactory,
  TimeValueFactory,
} from './track-activity.factory'

// ============================================================================
// VALIDATORS
// ============================================================================

export {
  ActivityValidator,
  ValidationHelpers,
} from './track-activity.validator'

// ============================================================================
// EVENT BUS
// ============================================================================

export {
  ActivityEventBus,
  ActivityEventFactory as ActivityEventFactoryStatic,
  ActivityEventHandler,
} from './track-activity.event.bus'

// ============================================================================
// EXCEPCIONES
// ============================================================================

export {
  ActivityConfigurationInvalidException,
  ActivityEventBusNotInitializedException,
  ActivityEventInvalidException,
  ActivityMonitoringAlreadyStartedException,
  ActivityMonitoringNotStartedException,
  ActivityRecordAlreadyExistsException,
  ActivityRecordInvalidStateException,
  ActivityRecordNotFoundException,
  ActivityTimeValueInvalidException,
} from './track-activity.exceptions'
