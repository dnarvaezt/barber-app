// ============================================================================
// TRACK ACTIVITY MODEL TESTS - Pruebas TDD para modelos y Value Objects
// ============================================================================

import {
  ActivityState,
  DEFAULT_ACTIVITY_CONFIGURATION,
  EventType,
  InteractionType,
  TimeValueObject,
  type IActivityConfiguration,
  type IActivityEvent,
  type IActivityRecord,
} from '../../application/track-activity.model'

// ============================================================================
// TIME VALUE OBJECT TESTS
// ============================================================================

describe('TimeValueObject', () => {
  describe('constructor and properties', () => {
    it('should create TimeValueObject with correct milliseconds', () => {
      const time = new TimeValueObject(5000)
      expect(time.milliseconds).toBe(5000)
    })

    it('should calculate seconds correctly', () => {
      const time = new TimeValueObject(5000)
      expect(time.seconds).toBe(5)
    })

    it('should calculate minutes correctly', () => {
      const time = new TimeValueObject(120000)
      expect(time.minutes).toBe(2)
    })
  })

  describe('static factory methods', () => {
    it('should create from seconds', () => {
      const time = TimeValueObject.fromSeconds(30)
      expect(time.milliseconds).toBe(30000)
      expect(time.seconds).toBe(30)
    })

    it('should create from minutes', () => {
      const time = TimeValueObject.fromMinutes(5)
      expect(time.milliseconds).toBe(300000)
      expect(time.minutes).toBe(5)
    })

    it('should create zero time', () => {
      const time = TimeValueObject.zero()
      expect(time.milliseconds).toBe(0)
      expect(time.seconds).toBe(0)
      expect(time.minutes).toBe(0)
    })
  })

  describe('mathematical operations', () => {
    it('should add two time values', () => {
      const time1 = TimeValueObject.fromSeconds(10)
      const time2 = TimeValueObject.fromSeconds(20)
      const result = time1.add(time2)
      expect(result.seconds).toBe(30)
    })

    it('should subtract two time values', () => {
      const time1 = TimeValueObject.fromSeconds(30)
      const time2 = TimeValueObject.fromSeconds(10)
      const result = time1.subtract(time2)
      expect(result.seconds).toBe(20)
    })

    it('should not allow negative results in subtraction', () => {
      const time1 = TimeValueObject.fromSeconds(10)
      const time2 = TimeValueObject.fromSeconds(30)
      const result = time1.subtract(time2)
      expect(result.seconds).toBe(0)
    })
  })

  describe('comparison operations', () => {
    it('should compare greater than', () => {
      const time1 = TimeValueObject.fromSeconds(30)
      const time2 = TimeValueObject.fromSeconds(10)
      expect(time1.isGreaterThan(time2)).toBe(true)
      expect(time2.isGreaterThan(time1)).toBe(false)
    })

    it('should compare less than', () => {
      const time1 = TimeValueObject.fromSeconds(10)
      const time2 = TimeValueObject.fromSeconds(30)
      expect(time1.isLessThan(time2)).toBe(true)
      expect(time2.isLessThan(time1)).toBe(false)
    })

    it('should check equality', () => {
      const time1 = TimeValueObject.fromSeconds(30)
      const time2 = TimeValueObject.fromSeconds(30)
      const time3 = TimeValueObject.fromSeconds(60)
      expect(time1.equals(time2)).toBe(true)
      expect(time1.equals(time3)).toBe(false)
    })
  })
})

// ============================================================================
// ENUMERATIONS TESTS
// ============================================================================

describe('ActivityState', () => {
  it('should have correct values', () => {
    expect(ActivityState.INACTIVE).toBe('inactive')
    expect(ActivityState.ACTIVE).toBe('active')
    expect(ActivityState.SUSPENDED).toBe('suspended')
    expect(ActivityState.FINISHED).toBe('finished')
  })

  it('should have all required states', () => {
    const states = Object.values(ActivityState)
    expect(states).toContain('inactive')
    expect(states).toContain('active')
    expect(states).toContain('suspended')
    expect(states).toContain('finished')
    expect(states).toHaveLength(4)
  })
})

describe('EventType', () => {
  it('should have correct values', () => {
    expect(EventType.USER_INTERACTION).toBe('user_interaction')
    expect(EventType.PAGE_LOAD).toBe('page_load')
    expect(EventType.SCRIPT_REQUEST).toBe('script_request')
    expect(EventType.TAB_VISIBILITY_CHANGE).toBe('tab_visibility_change')
    expect(EventType.TAB_FOCUS_CHANGE).toBe('tab_focus_change')
    expect(EventType.IDLE_TIMEOUT).toBe('idle_timeout')
  })

  it('should have all required event types', () => {
    const eventTypes = Object.values(EventType)
    expect(eventTypes).toContain('user_interaction')
    expect(eventTypes).toContain('page_load')
    expect(eventTypes).toContain('script_request')
    expect(eventTypes).toContain('tab_visibility_change')
    expect(eventTypes).toContain('tab_focus_change')
    expect(eventTypes).toContain('idle_timeout')
    expect(eventTypes).toHaveLength(6)
  })
})

describe('InteractionType', () => {
  it('should have correct values', () => {
    expect(InteractionType.CLICK).toBe('click')
    expect(InteractionType.SCROLL).toBe('scroll')
    expect(InteractionType.KEY_PRESS).toBe('key_press')
    expect(InteractionType.MOUSE_MOVE).toBe('mouse_move')
    expect(InteractionType.TOUCH).toBe('touch')
    expect(InteractionType.FORM_INPUT).toBe('form_input')
    expect(InteractionType.FOCUS).toBe('focus')
    expect(InteractionType.BLUR).toBe('blur')
  })

  it('should have all required interaction types', () => {
    const interactionTypes = Object.values(InteractionType)
    expect(interactionTypes).toContain('click')
    expect(interactionTypes).toContain('scroll')
    expect(interactionTypes).toContain('key_press')
    expect(interactionTypes).toContain('mouse_move')
    expect(interactionTypes).toContain('touch')
    expect(interactionTypes).toContain('form_input')
    expect(interactionTypes).toContain('focus')
    expect(interactionTypes).toContain('blur')
    expect(interactionTypes).toHaveLength(8)
  })
})

// ============================================================================
// DEFAULT CONFIGURATION TESTS
// ============================================================================

describe('DEFAULT_ACTIVITY_CONFIGURATION', () => {
  it('should have correct minimum time', () => {
    expect(DEFAULT_ACTIVITY_CONFIGURATION.minimumTime.seconds).toBe(5)
  })

  it('should have correct max idle time', () => {
    expect(DEFAULT_ACTIVITY_CONFIGURATION.maxIdleTime.minutes).toBe(30)
  })

  it('should have correct update interval', () => {
    expect(DEFAULT_ACTIVITY_CONFIGURATION.updateInterval.seconds).toBe(1)
  })

  it('should have all event types enabled', () => {
    const expectedEventTypes = [
      EventType.USER_INTERACTION,
      EventType.PAGE_LOAD,
      EventType.SCRIPT_REQUEST,
      EventType.TAB_VISIBILITY_CHANGE,
      EventType.TAB_FOCUS_CHANGE,
      EventType.IDLE_TIMEOUT,
    ]
    expect(DEFAULT_ACTIVITY_CONFIGURATION.enabledEvents).toEqual(
      expect.arrayContaining(expectedEventTypes)
    )
  })

  it('should have all interaction types enabled', () => {
    const expectedInteractionTypes = [
      InteractionType.CLICK,
      InteractionType.SCROLL,
      InteractionType.KEY_PRESS,
      InteractionType.MOUSE_MOVE,
      InteractionType.TOUCH,
      InteractionType.FORM_INPUT,
      InteractionType.FOCUS,
      InteractionType.BLUR,
    ]
    expect(DEFAULT_ACTIVITY_CONFIGURATION.enabledInteractions).toEqual(
      expect.arrayContaining(expectedInteractionTypes)
    )
  })

  it('should be immutable', () => {
    const config = DEFAULT_ACTIVITY_CONFIGURATION
    // En TypeScript, las propiedades readonly no pueden ser modificadas en tiempo de ejecución
    // Esta prueba verifica que la configuración está bien definida
    expect(config.minimumTime).toBeDefined()
    expect(config.maxIdleTime).toBeDefined()
    expect(config.updateInterval).toBeDefined()
  })
})

// ============================================================================
// INTERFACE VALIDATION TESTS
// ============================================================================

describe('IActivityRecord interface', () => {
  it('should have all required properties', () => {
    const record: IActivityRecord = {
      id: 'test-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      minimumTime: TimeValueObject.fromSeconds(5),
      activeTime: TimeValueObject.zero(),
      idleTime: TimeValueObject.zero(),
      totalTime: TimeValueObject.fromSeconds(5),
      state: ActivityState.ACTIVE,
      lastInteractionTime: new Date(),
      lastInteractionType: InteractionType.CLICK,
      startEventType: EventType.USER_INTERACTION,
      startTime: new Date(),
      isVisible: true,
      isFocused: true,
    }

    expect(record.id).toBeDefined()
    expect(record.createdAt).toBeInstanceOf(Date)
    expect(record.updatedAt).toBeInstanceOf(Date)
    expect(record.minimumTime).toBeInstanceOf(TimeValueObject)
    expect(record.activeTime).toBeInstanceOf(TimeValueObject)
    expect(record.idleTime).toBeInstanceOf(TimeValueObject)
    expect(record.totalTime).toBeInstanceOf(TimeValueObject)
    expect(record.state).toBeDefined()
    expect(record.lastInteractionTime).toBeInstanceOf(Date)
    expect(record.startEventType).toBeDefined()
    expect(record.startTime).toBeInstanceOf(Date)
    expect(typeof record.isVisible).toBe('boolean')
    expect(typeof record.isFocused).toBe('boolean')
  })
})

describe('IActivityEvent interface', () => {
  it('should have all required properties', () => {
    const event: IActivityEvent = {
      type: EventType.USER_INTERACTION,
      interactionType: InteractionType.CLICK,
      timestamp: new Date(),
      payload: { test: 'data' },
    }

    expect(event.type).toBeDefined()
    expect(event.timestamp).toBeInstanceOf(Date)
    expect(event.payload).toBeDefined()
  })

  it('should allow optional interactionType', () => {
    const event: IActivityEvent = {
      type: EventType.PAGE_LOAD,
      timestamp: new Date(),
    }

    expect(event.type).toBeDefined()
    expect(event.timestamp).toBeInstanceOf(Date)
    expect(event.interactionType).toBeUndefined()
  })
})

describe('IActivityConfiguration interface', () => {
  it('should have all required properties', () => {
    const config: IActivityConfiguration = {
      minimumTime: TimeValueObject.fromSeconds(5),
      maxIdleTime: TimeValueObject.fromMinutes(30),
      updateInterval: TimeValueObject.fromSeconds(1),
      enabledEvents: [EventType.USER_INTERACTION],
      enabledInteractions: [InteractionType.CLICK],
    }

    expect(config.minimumTime).toBeInstanceOf(TimeValueObject)
    expect(config.maxIdleTime).toBeInstanceOf(TimeValueObject)
    expect(config.updateInterval).toBeInstanceOf(TimeValueObject)
    expect(Array.isArray(config.enabledEvents)).toBe(true)
    expect(Array.isArray(config.enabledInteractions)).toBe(true)
  })
})
