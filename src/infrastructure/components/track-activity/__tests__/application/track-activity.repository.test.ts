// ============================================================================
// TRACK ACTIVITY REPOSITORY TESTS - Pruebas TDD para repositorio en memoria
// ============================================================================

import {
  ActivityState,
  EventType,
  InteractionType,
  TimeValueObject,
} from '../../application/track-activity.model'

import {
  ActivityRecordMemoryRepository,
  ActivityRecordNotFoundException,
} from '../../application/track-activity.repository.memory'

// ============================================================================
// ACTIVITY RECORD MEMORY REPOSITORY TESTS
// ============================================================================

describe('ActivityRecordMemoryRepository', () => {
  let repository: ActivityRecordMemoryRepository

  beforeEach(() => {
    repository = new ActivityRecordMemoryRepository()
  })

  describe('create', () => {
    it('should create a new record', async () => {
      const recordData = {
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

      const record = await repository.create(recordData)

      expect(record.id).toBeDefined()
      expect(record.id).toMatch(/^activity_\d+_[a-z0-9]+$/)
      expect(record.createdAt).toBeInstanceOf(Date)
      expect(record.updatedAt).toBeInstanceOf(Date)
      expect(record.state).toBe(ActivityState.ACTIVE)
      expect(record.startEventType).toBe(EventType.USER_INTERACTION)
    })

    it('should set active record when creating active record', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const record = await repository.create(recordData)
      const activeRecord = await repository.findActive()

      expect(activeRecord).toBe(record)
    })

    it('should not set active record when creating non-active record', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      await repository.create(recordData)
      const activeRecord = await repository.findActive()

      expect(activeRecord).toBeNull()
    })
  })

  describe('update', () => {
    it('should update an existing record', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const createdRecord = await repository.create(recordData)
      const updateData = {
        state: ActivityState.FINISHED,
        endTime: new Date(),
        activeTime: TimeValueObject.fromSeconds(30),
      }

      const updatedRecord = await repository.update(
        createdRecord.id,
        updateData
      )

      expect(updatedRecord.id).toBe(createdRecord.id)
      expect(updatedRecord.state).toBe(ActivityState.FINISHED)
      expect(updatedRecord.endTime).toBeDefined()
      expect(updatedRecord.activeTime.seconds).toBe(30)
      expect(updatedRecord.updatedAt.getTime()).toBeGreaterThanOrEqual(
        createdRecord.updatedAt.getTime()
      )
    })

    it('should throw error when updating non-existent record', async () => {
      const updateData = {
        state: ActivityState.FINISHED,
      }

      await expect(
        repository.update('non-existent-id', updateData)
      ).rejects.toThrow(ActivityRecordNotFoundException)
    })

    it('should update active record reference when state changes', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const createdRecord = await repository.create(recordData)
      expect(await repository.findActive()).toBe(createdRecord)

      await repository.update(createdRecord.id, {
        state: ActivityState.FINISHED,
      })
      expect(await repository.findActive()).toBeNull()
    })
  })

  describe('findById', () => {
    it('should find record by id', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const createdRecord = await repository.create(recordData)
      const foundRecord = await repository.findById(createdRecord.id)

      expect(foundRecord).toEqual(createdRecord)
    })

    it('should return null for non-existent record', async () => {
      const foundRecord = await repository.findById('non-existent-id')
      expect(foundRecord).toBeNull()
    })
  })

  describe('findActive', () => {
    it('should return active record', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const createdRecord = await repository.create(recordData)
      const activeRecord = await repository.findActive()

      expect(activeRecord).toBe(createdRecord)
    })

    it('should return null when no active record exists', async () => {
      const activeRecord = await repository.findActive()
      expect(activeRecord).toBeNull()
    })

    it('should return null when active record is no longer active', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const createdRecord = await repository.create(recordData)
      await repository.update(createdRecord.id, {
        state: ActivityState.FINISHED,
      })

      const activeRecord = await repository.findActive()
      expect(activeRecord).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return all records', async () => {
      const recordData1 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData2 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.PAGE_LOAD,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const record1 = await repository.create(recordData1)
      const record2 = await repository.create(recordData2)

      const allRecords = await repository.findAll()

      expect(allRecords).toHaveLength(2)
      expect(allRecords).toContain(record1)
      expect(allRecords).toContain(record2)
    })

    it('should return empty array when no records exist', async () => {
      const allRecords = await repository.findAll()
      expect(allRecords).toEqual([])
    })
  })

  describe('delete', () => {
    it('should delete record by id', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const createdRecord = await repository.create(recordData)
      const deleted = await repository.delete(createdRecord.id)

      expect(deleted).toBe(true)
      expect(await repository.findById(createdRecord.id)).toBeNull()
    })

    it('should return false for non-existent record', async () => {
      const deleted = await repository.delete('non-existent-id')
      expect(deleted).toBe(false)
    })

    it('should clear active record reference when deleting active record', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const createdRecord = await repository.create(recordData)
      expect(await repository.findActive()).toBe(createdRecord)

      await repository.delete(createdRecord.id)
      expect(await repository.findActive()).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear all records', async () => {
      const recordData1 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData2 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.PAGE_LOAD,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      await repository.create(recordData1)
      await repository.create(recordData2)

      expect(await repository.findAll()).toHaveLength(2)

      await repository.clear()

      expect(await repository.findAll()).toHaveLength(0)
      expect(await repository.findActive()).toBeNull()
    })
  })

  describe('findByState', () => {
    it('should find records by state', async () => {
      const recordData1 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData2 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.PAGE_LOAD,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const record1 = await repository.create(recordData1)
      const record2 = await repository.create(recordData2)

      const activeRecords = await repository.findByState(ActivityState.ACTIVE)
      const finishedRecords = await repository.findByState(
        ActivityState.FINISHED
      )

      expect(activeRecords).toHaveLength(1)
      expect(activeRecords).toContain(record1)
      expect(finishedRecords).toHaveLength(1)
      expect(finishedRecords).toContain(record2)
    })
  })

  describe('findByDateRange', () => {
    it('should find records within date range', async () => {
      const now = new Date()
      const past = new Date(now.getTime() - 1000)
      const future = new Date(now.getTime() + 1000)

      const recordData1 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: now,
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: past,
        isVisible: true,
        isFocused: true,
      }

      const recordData2 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.FINISHED,
        lastInteractionTime: now,
        lastInteractionType: null,
        startEventType: EventType.PAGE_LOAD,
        startTime: future,
        isVisible: true,
        isFocused: true,
      }

      const record1 = await repository.create(recordData1)
      const record2 = await repository.create(recordData2)

      const recordsInRange = await repository.findByDateRange(past, future)

      expect(recordsInRange).toHaveLength(2)
      expect(recordsInRange).toContain(record1)
      expect(recordsInRange).toContain(record2)
    })
  })

  describe('findByEventType', () => {
    it('should find records by event type', async () => {
      const recordData1 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData2 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.zero(),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(5),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.PAGE_LOAD,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const record1 = await repository.create(recordData1)
      const record2 = await repository.create(recordData2)

      const userInteractionRecords = await repository.findByEventType(
        EventType.USER_INTERACTION
      )
      const pageLoadRecords = await repository.findByEventType(
        EventType.PAGE_LOAD
      )

      expect(userInteractionRecords).toHaveLength(1)
      expect(userInteractionRecords).toContain(record1)
      expect(pageLoadRecords).toHaveLength(1)
      expect(pageLoadRecords).toContain(record2)
    })
  })

  describe('getStats', () => {
    it('should return correct statistics', async () => {
      const recordData1 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(30),
        idleTime: TimeValueObject.fromSeconds(10),
        totalTime: TimeValueObject.fromSeconds(45),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData2 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(60),
        idleTime: TimeValueObject.fromSeconds(20),
        totalTime: TimeValueObject.fromSeconds(85),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.PAGE_LOAD,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData3 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(15),
        idleTime: TimeValueObject.fromSeconds(5),
        totalTime: TimeValueObject.fromSeconds(25),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      await repository.create(recordData1)
      await repository.create(recordData2)
      await repository.create(recordData3)

      const stats = await repository.getStats()

      expect(stats.total).toBe(3)
      expect(stats.active).toBe(1)
      expect(stats.finished).toBe(2)
      expect(stats.suspended).toBe(0)
      expect(stats.averageSessionTime).toBe(65000) // (45000 + 85000) / 2 = 65000
      expect(stats.longestSession).toBe(85000)
      expect(stats.shortestSession).toBe(45000)
    })

    it('should handle empty repository', async () => {
      const stats = await repository.getStats()

      expect(stats.total).toBe(0)
      expect(stats.active).toBe(0)
      expect(stats.finished).toBe(0)
      expect(stats.suspended).toBe(0)
      expect(stats.averageSessionTime).toBe(0)
      expect(stats.longestSession).toBe(0)
      expect(stats.shortestSession).toBe(0)
    })
  })
})
