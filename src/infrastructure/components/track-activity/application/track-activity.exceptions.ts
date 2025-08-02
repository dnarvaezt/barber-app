// ============================================================================
// TRACK ACTIVITY EXCEPTIONS - Excepciones específicas del dominio
// ============================================================================

export class ActivityRecordNotFoundException extends Error {
  constructor(recordId: string) {
    super(`Activity record with id ${recordId} not found`)
    this.name = 'ActivityRecordNotFoundException'
  }
}

export class ActivityRecordAlreadyExistsException extends Error {
  constructor(recordId: string) {
    super(`Activity record with id ${recordId} already exists`)
    this.name = 'ActivityRecordAlreadyExistsException'
  }
}

export class ActivityRecordInvalidStateException extends Error {
  constructor(recordId: string, currentState: string, expectedState: string) {
    super(
      `Activity record ${recordId} is in invalid state: ${currentState}, expected: ${expectedState}`
    )
    this.name = 'ActivityRecordInvalidStateException'
  }
}

export class ActivityConfigurationInvalidException extends Error {
  constructor(message: string) {
    super(`Invalid activity configuration: ${message}`)
    this.name = 'ActivityConfigurationInvalidException'
  }
}

export class ActivityEventInvalidException extends Error {
  constructor(eventType: string, reason: string) {
    super(`Invalid activity event ${eventType}: ${reason}`)
    this.name = 'ActivityEventInvalidException'
  }
}

export class ActivityMonitoringNotStartedException extends Error {
  constructor() {
    super('Activity monitoring has not been started')
    this.name = 'ActivityMonitoringNotStartedException'
  }
}

export class ActivityMonitoringAlreadyStartedException extends Error {
  constructor() {
    super('Activity monitoring is already started')
    this.name = 'ActivityMonitoringAlreadyStartedException'
  }
}

export class ActivityTimeValueInvalidException extends Error {
  constructor(value: number, unit: string) {
    super(`Invalid time value: ${value} ${unit}`)
    this.name = 'ActivityTimeValueInvalidException'
  }
}

export class ActivityEventBusNotInitializedException extends Error {
  constructor() {
    super('Activity event bus has not been initialized')
    this.name = 'ActivityEventBusNotInitializedException'
  }
}
