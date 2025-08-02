// ============================================================================
// TRACK ACTIVITY FACTORY TESTS - Pruebas TDD para factories
// ============================================================================

import {
  ActivityState,
  DEFAULT_ACTIVITY_CONFIGURATION,
  EventType,
  InteractionType,
  TimeValueObject,
} from '../../application/track-activity.model'

import {
  ActivityConfigurationFactory,
  ActivityConfigurationInvalidException,
  ActivityEventFactory,
  ActivityRecordFactory,
  TimeValueFactory,
} from '../../application/track-activity.factory'

// ============================================================================
// ACTIVITY RECORD FACTORY TESTS
// ============================================================================

describe('ActivityRecordFactory', () => {
  let factory: ActivityRecordFactory

  beforeEach(() => {
    factory = new ActivityRecordFactory()
  })

  describe('createRecord', () => {
    it('should create a record with correct default values', () => {
      const record = factory.createRecord(EventType.USER_INTERACTION)

      expect(record.id).toBeDefined()
      expect(record.id).toMatch(/^activity_\d+_[a-z0-9]+$/)
      expect(record.state).toBe(ActivityState.ACTIVE)
      expect(record.startEventType).toBe(EventType.USER_INTERACTION)
      expect(record.lastInteractionType).toBeNull()
      expect(record.activeTime.seconds).toBe(0)
      expect(record.idleTime.seconds).toBe(0)
      expect(record.totalTime.seconds).toBe(5) // minimumTime
      expect(record.isVisible).toBe(true)
      expect(record.isFocused).toBe(true)
      expect(record.createdAt).toBeInstanceOf(Date)
      expect(record.updatedAt).toBeInstanceOf(Date)
    })

    it('should create a record with interaction type', () => {
      const record = factory.createRecord(
        EventType.USER_INTERACTION,
        InteractionType.CLICK
      )

      expect(record.lastInteractionType).toBe(InteractionType.CLICK)
      expect(record.startEventType).toBe(EventType.USER_INTERACTION)
    })

    it('should create a record with custom configuration', () => {
      const customConfig = {
        ...DEFAULT_ACTIVITY_CONFIGURATION,
        minimumTime: TimeValueObject.fromSeconds(10),
      }

      const record = factory.createRecord(
        EventType.PAGE_LOAD,
        undefined,
        customConfig
      )

      expect(record.minimumTime.seconds).toBe(10)
      expect(record.totalTime.seconds).toBe(10)
    })

    it('should generate unique IDs for each record', () => {
      const record1 = factory.createRecord(EventType.USER_INTERACTION)
      const record2 = factory.createRecord(EventType.USER_INTERACTION)

      expect(record1.id).not.toBe(record2.id)
    })
  })

  describe('createFromData', () => {
    it('should create record from partial data', () => {
      const now = new Date()
      const data = {
        id: 'test-id',
        state: ActivityState.FINISHED,
        startEventType: EventType.PAGE_LOAD,
        lastInteractionType: InteractionType.SCROLL,
        isVisible: false,
        isFocused: false,
        createdAt: now,
      }

      const record = factory.createFromData(data)

      expect(record.id).toBe('test-id')
      expect(record.state).toBe(ActivityState.FINISHED)
      expect(record.startEventType).toBe(EventType.PAGE_LOAD)
      expect(record.lastInteractionType).toBe(InteractionType.SCROLL)
      expect(record.isVisible).toBe(false)
      expect(record.isFocused).toBe(false)
      expect(record.createdAt).toBe(now)
    })

    it('should use default values for missing data', () => {
      const record = factory.createFromData({})

      expect(record.id).toBeDefined()
      expect(record.state).toBe(ActivityState.INACTIVE)
      expect(record.activeTime.seconds).toBe(0)
      expect(record.idleTime.seconds).toBe(0)
      expect(record.totalTime.seconds).toBe(0)
      expect(record.isVisible).toBe(true)
      expect(record.isFocused).toBe(true)
      expect(record.createdAt).toBeInstanceOf(Date)
      expect(record.updatedAt).toBeInstanceOf(Date)
    })

    it('should preserve provided data', () => {
      const customTime = TimeValueObject.fromSeconds(30)
      const data = {
        activeTime: customTime,
        idleTime: customTime,
        totalTime: customTime,
      }

      const record = factory.createFromData(data)

      expect(record.activeTime).toBe(customTime)
      expect(record.idleTime).toBe(customTime)
      expect(record.totalTime).toBe(customTime)
    })
  })
})

// ============================================================================
// ACTIVITY EVENT FACTORY TESTS
// ============================================================================

describe('ActivityEventFactory', () => {
  let factory: ActivityEventFactory

  beforeEach(() => {
    factory = new ActivityEventFactory()
  })

  describe('createEvent', () => {
    it('should create event with all properties', () => {
      const event = factory.createEvent(
        EventType.USER_INTERACTION,
        InteractionType.CLICK,
        { test: 'data' }
      )

      expect(event.type).toBe(EventType.USER_INTERACTION)
      expect(event.interactionType).toBe(InteractionType.CLICK)
      expect(event.timestamp).toBeInstanceOf(Date)
      expect(event.payload).toEqual({ test: 'data' })
    })

    it('should create event without interaction type', () => {
      const event = factory.createEvent(EventType.PAGE_LOAD)

      expect(event.type).toBe(EventType.PAGE_LOAD)
      expect(event.interactionType).toBeUndefined()
      expect(event.timestamp).toBeInstanceOf(Date)
    })

    it('should create event without payload', () => {
      const event = factory.createEvent(
        EventType.USER_INTERACTION,
        InteractionType.CLICK
      )

      expect(event.type).toBe(EventType.USER_INTERACTION)
      expect(event.interactionType).toBe(InteractionType.CLICK)
      expect(event.timestamp).toBeInstanceOf(Date)
      expect(event.payload).toBeUndefined()
    })
  })

  describe('createFromDOMEvent', () => {
    it('should create event from click DOM event', () => {
      const domEvent = new MouseEvent('click', {
        clientX: 100,
        clientY: 200,
        button: 0,
      })

      const event = factory.createFromDOMEvent(domEvent)

      expect(event).not.toBeNull()
      expect(event!.type).toBe(EventType.USER_INTERACTION)
      expect(event!.interactionType).toBe(InteractionType.CLICK)
      expect(event!.timestamp).toBeInstanceOf(Date)
      expect(event!.payload).toBeDefined()
      expect(event!.payload!.eventType).toBe('click')
      expect(event!.payload!.clientX).toBe(100)
      expect(event!.payload!.clientY).toBe(200)
    })

    it('should create event from keydown DOM event', () => {
      const domEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        ctrlKey: true,
      })

      const event = factory.createFromDOMEvent(domEvent)

      expect(event).not.toBeNull()
      expect(event!.type).toBe(EventType.USER_INTERACTION)
      expect(event!.interactionType).toBe(InteractionType.KEY_PRESS)
      expect(event!.payload!.key).toBe('Enter')
      expect(event!.payload!.ctrlKey).toBe(true)
    })

    it('should create event from input DOM event', () => {
      const domEvent = new Event('input')

      const event = factory.createFromDOMEvent(domEvent)

      expect(event).not.toBeNull()
      expect(event!.type).toBe(EventType.USER_INTERACTION)
      expect(event!.interactionType).toBe(InteractionType.FORM_INPUT)
    })

    it('should create event from scroll DOM event', () => {
      const domEvent = new Event('scroll')

      const event = factory.createFromDOMEvent(domEvent)

      expect(event).not.toBeNull()
      expect(event!.type).toBe(EventType.USER_INTERACTION)
      expect(event!.interactionType).toBe(InteractionType.SCROLL)
    })

    it('should return null for unsupported DOM events', () => {
      const domEvent = new Event('unsupported')

      const event = factory.createFromDOMEvent(domEvent)

      expect(event).toBeNull()
    })

    it('should extract touch event data', () => {
      const domEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 200 }] as any,
      })

      const event = factory.createFromDOMEvent(domEvent)

      expect(event).not.toBeNull()
      expect(event!.interactionType).toBe(InteractionType.TOUCH)
      expect(event!.payload!.touches).toBe(1)
    })

    it('should extract focus event data', () => {
      const target = document.createElement('input')
      const domEvent = new FocusEvent('focus', {
        relatedTarget: target,
      })

      const event = factory.createFromDOMEvent(domEvent)

      expect(event).not.toBeNull()
      expect(event!.interactionType).toBe(InteractionType.FOCUS)
      expect(event!.payload!.relatedTarget).toBe(target)
    })
  })
})

// ============================================================================
// ACTIVITY CONFIGURATION FACTORY TESTS
// ============================================================================

describe('ActivityConfigurationFactory', () => {
  describe('createDefault', () => {
    it('should create default configuration', () => {
      const config = ActivityConfigurationFactory.createDefault()

      expect(config.minimumTime.seconds).toBe(5)
      expect(config.maxIdleTime.minutes).toBe(30)
      expect(config.updateInterval.seconds).toBe(1)
      expect(config.enabledEvents).toEqual(
        DEFAULT_ACTIVITY_CONFIGURATION.enabledEvents
      )
      expect(config.enabledInteractions).toEqual(
        DEFAULT_ACTIVITY_CONFIGURATION.enabledInteractions
      )
    })
  })

  describe('createFromPartial', () => {
    it('should create configuration from partial data', () => {
      const partial = {
        minimumTime: TimeValueObject.fromSeconds(10),
        maxIdleTime: TimeValueObject.fromMinutes(60),
      }

      const config = ActivityConfigurationFactory.createFromPartial(partial)

      expect(config.minimumTime.seconds).toBe(10)
      expect(config.maxIdleTime.minutes).toBe(60)
      expect(config.updateInterval.seconds).toBe(1) // default
    })

    it('should throw error for invalid configuration', () => {
      const invalidPartial = {
        maxIdleTime: TimeValueObject.fromSeconds(1), // Less than minimumTime
        minimumTime: TimeValueObject.fromSeconds(10),
      }

      expect(() => {
        ActivityConfigurationFactory.createFromPartial(invalidPartial)
      }).toThrow(ActivityConfigurationInvalidException)
    })

    it('should throw error for invalid update interval', () => {
      const invalidPartial = {
        updateInterval: TimeValueObject.fromSeconds(0.05), // Less than 100ms
      }

      expect(() => {
        ActivityConfigurationFactory.createFromPartial(invalidPartial)
      }).toThrow()
    })
  })

  describe('createForDevelopment', () => {
    it('should create development configuration', () => {
      const config = ActivityConfigurationFactory.createForDevelopment()

      expect(config.minimumTime.seconds).toBe(2)
      expect(config.maxIdleTime.minutes).toBe(5)
      expect(config.updateInterval.seconds).toBe(1)
    })
  })

  describe('createForProduction', () => {
    it('should create production configuration', () => {
      const config = ActivityConfigurationFactory.createForProduction()

      expect(config.minimumTime.seconds).toBe(10)
      expect(config.maxIdleTime.minutes).toBe(60)
      expect(config.updateInterval.seconds).toBe(5)
    })
  })

  describe('createForTesting', () => {
    it('should create testing configuration', () => {
      const config = ActivityConfigurationFactory.createForTesting()

      expect(config.minimumTime.seconds).toBe(1)
      expect(config.maxIdleTime.minutes).toBe(1)
      expect(config.updateInterval.seconds).toBe(0) // 0.5 seconds = 0 in integer division
    })
  })
})

// ============================================================================
// TIME VALUE FACTORY TESTS
// ============================================================================

describe('TimeValueFactory', () => {
  describe('fromMilliseconds', () => {
    it('should create from milliseconds', () => {
      const time = TimeValueFactory.fromMilliseconds(5000)
      expect(time.milliseconds).toBe(5000)
    })

    it('should throw error for negative milliseconds', () => {
      expect(() => {
        TimeValueFactory.fromMilliseconds(-1000)
      }).toThrow('Time value cannot be negative')
    })
  })

  describe('fromSeconds', () => {
    it('should create from seconds', () => {
      const time = TimeValueFactory.fromSeconds(30)
      expect(time.seconds).toBe(30)
      expect(time.milliseconds).toBe(30000)
    })
  })

  describe('fromMinutes', () => {
    it('should create from minutes', () => {
      const time = TimeValueFactory.fromMinutes(5)
      expect(time.minutes).toBe(5)
      expect(time.seconds).toBe(300)
    })
  })

  describe('fromHours', () => {
    it('should create from hours', () => {
      const time = TimeValueFactory.fromHours(2)
      expect(time.minutes).toBe(120)
      expect(time.seconds).toBe(7200)
    })
  })

  describe('zero', () => {
    it('should create zero time', () => {
      const time = TimeValueFactory.zero()
      expect(time.milliseconds).toBe(0)
      expect(time.seconds).toBe(0)
      expect(time.minutes).toBe(0)
    })
  })

  describe('parse', () => {
    it('should parse milliseconds', () => {
      const time = TimeValueFactory.parse('500ms')
      expect(time.milliseconds).toBe(500)
    })

    it('should parse seconds', () => {
      const time = TimeValueFactory.parse('30s')
      expect(time.seconds).toBe(30)
    })

    it('should parse minutes', () => {
      const time = TimeValueFactory.parse('5m')
      expect(time.minutes).toBe(5)
    })

    it('should parse hours', () => {
      const time = TimeValueFactory.parse('2h')
      expect(time.minutes).toBe(120)
    })

    it('should throw error for invalid format', () => {
      expect(() => {
        TimeValueFactory.parse('invalid')
      }).toThrow('Invalid time format: invalid')
    })

    it('should throw error for unknown unit', () => {
      expect(() => {
        TimeValueFactory.parse('10x')
      }).toThrow('Invalid time format: 10x')
    })
  })
})
