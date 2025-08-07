// ============================================================================
// TRACK ACTIVITY INDEXEDDB REPOSITORY TESTS - Pruebas TDD para repositorio IndexedDB
// ============================================================================

import {
  ActivityState,
  EventType,
  InteractionType,
  TimeValueObject,
} from '../../application/track-activity.model'

import { ActivityRecordIndexedDBRepository } from '../../application/track-activity.repository.indexeddb'

import {
  clearIndexedDBMocks,
  setupIndexedDBMock,
  setupMockActiveRecord,
  setupMockCursor,
  setupMockData,
  setupMockRecord,
  setupMockRecordsByState,
  simulateError,
  simulateSuccess,
} from '../setup/indexeddb.mock'

// ============================================================================
// ACTIVITY RECORD INDEXEDDB REPOSITORY TESTS
// ============================================================================

describe('ActivityRecordIndexedDBRepository', () => {
  let repository: ActivityRecordIndexedDBRepository
  let mocks: any

  beforeEach(async () => {
    mocks = setupIndexedDBMock()
    repository = new ActivityRecordIndexedDBRepository()

    // Simular inicialización exitosa
    simulateSuccess(mocks.mockOpenRequest, mocks.mockDB)
    await repository.initialize()
  })

  afterEach(async () => {
    clearIndexedDBMocks()
  })

  describe('initialize', () => {
    it('should initialize IndexedDB successfully', async () => {
      const newRepository = new ActivityRecordIndexedDBRepository()
      simulateSuccess(mocks.mockOpenRequest, mocks.mockDB)
      await expect(newRepository.initialize()).resolves.not.toThrow()
    })

    it('should handle initialization errors gracefully', async () => {
      const newRepository = new ActivityRecordIndexedDBRepository()
      simulateError(mocks.mockOpenRequest, new Error('IndexedDB error'))
      await expect(newRepository.initialize()).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('should create a new record in IndexedDB', async () => {
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

      // Simular creación exitosa
      simulateSuccess(mocks.mockAddRequest, 'test-id')

      const record = await repository.create(recordData)

      expect(record.id).toBeDefined()
      expect(record.id).toMatch(/^activity_\d+_[a-z0-9]+$/)
      expect(record.createdAt).toBeInstanceOf(Date)
      expect(record.updatedAt).toBeInstanceOf(Date)
      expect(record.state).toBe(ActivityState.ACTIVE)
      expect(record.startEventType).toBe(EventType.USER_INTERACTION)

      // Verificar que se llamó al método add
      expect(mocks.mockObjectStore.add).toHaveBeenCalledWith(
        expect.objectContaining({
          ...recordData,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      )
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

      simulateSuccess(mocks.mockAddRequest, 'test-id')

      const record = await repository.create(recordData)
      const activeRecord = await repository.findActive()

      expect(activeRecord).toEqual(record)
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

      simulateSuccess(mocks.mockAddRequest, 'test-id')

      await repository.create(recordData)
      const activeRecord = await repository.findActive()

      expect(activeRecord).toBeNull()
    })

    it('should handle IndexedDB errors during creation', async () => {
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

      simulateError(mocks.mockAddRequest, new Error('IndexedDB error'))

      await expect(repository.create(recordData)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update an existing record in IndexedDB', async () => {
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

      // Simular registro existente
      setupMockRecord(mocks.mockObjectStore, createdRecord)
      simulateSuccess(mocks.mockPutRequest, 'test-id')

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

      // Simular registro no encontrado
      setupMockRecord(mocks.mockObjectStore, null)

      await expect(
        repository.update('non-existent-id', updateData)
      ).rejects.toThrow('Record with id non-existent-id not found')
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
      expect(await repository.findActive()).toEqual(createdRecord)

      // Simular actualización
      setupMockRecord(mocks.mockObjectStore, createdRecord)
      simulateSuccess(mocks.mockPutRequest, 'test-id')

      await repository.update(createdRecord.id, {
        state: ActivityState.FINISHED,
      })
      expect(await repository.findActive()).toBeNull()
    })
  })

  describe('findById', () => {
    it('should find record by id from IndexedDB', async () => {
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
      setupMockRecord(mocks.mockObjectStore, createdRecord)

      const foundRecord = await repository.findById(createdRecord.id)

      expect(foundRecord).toEqual(createdRecord)
    })

    it('should return null for non-existent record', async () => {
      setupMockRecord(mocks.mockObjectStore, null)

      const foundRecord = await repository.findById('non-existent-id')
      expect(foundRecord).toBeNull()
    })
  })

  describe('findActive', () => {
    it('should return active record from IndexedDB', async () => {
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
      setupMockActiveRecord(mocks.mockIndex, createdRecord)

      const activeRecord = await repository.findActive()

      expect(activeRecord).toEqual(createdRecord)
    })

    it('should return null when no active record exists', async () => {
      setupMockActiveRecord(mocks.mockIndex, null)

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
      setupMockRecord(mocks.mockObjectStore, createdRecord)
      simulateSuccess(mocks.mockPutRequest, 'test-id')

      await repository.update(createdRecord.id, {
        state: ActivityState.FINISHED,
      })

      setupMockActiveRecord(mocks.mockIndex, null)
      const activeRecord = await repository.findActive()
      expect(activeRecord).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return all records from IndexedDB', async () => {
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

      setupMockData(mocks.mockObjectStore, [record1, record2])

      const allRecords = await repository.findAll()

      expect(allRecords).toHaveLength(2)
      expect(allRecords).toContainEqual(record1)
      expect(allRecords).toContainEqual(record2)
    })

    it('should return empty array when no records exist', async () => {
      setupMockData(mocks.mockObjectStore, [])

      const allRecords = await repository.findAll()
      expect(allRecords).toEqual([])
    })
  })

  describe('delete', () => {
    it('should delete record by id from IndexedDB', async () => {
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
      simulateSuccess(mocks.mockDeleteRequest)

      const deleted = await repository.delete(createdRecord.id)

      expect(deleted).toBe(true)
      expect(mocks.mockObjectStore.delete).toHaveBeenCalledWith(
        createdRecord.id
      )
    })

    it('should return false for non-existent record', async () => {
      simulateError(mocks.mockDeleteRequest, new Error('Record not found'))

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
      expect(await repository.findActive()).toEqual(createdRecord)

      simulateSuccess(mocks.mockDeleteRequest)
      await repository.delete(createdRecord.id)

      setupMockActiveRecord(mocks.mockIndex, null)
      expect(await repository.findActive()).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear all records from IndexedDB', async () => {
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

      setupMockData(mocks.mockObjectStore, [])
      simulateSuccess(mocks.mockClearRequest)

      await repository.clear()

      expect(mocks.mockObjectStore.clear).toHaveBeenCalled()
    })
  })

  describe('recoverPendingRecords', () => {
    it('should recover pending records from IndexedDB', async () => {
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
        state: ActivityState.SUSPENDED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.PAGE_LOAD,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData3 = {
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
      const record3 = await repository.create(recordData3)

      setupMockData(mocks.mockObjectStore, [record1, record2, record3])

      const pendingRecords = await repository.recoverPendingRecords()

      expect(pendingRecords).toHaveLength(2)
      expect(pendingRecords).toContainEqual(record1)
      expect(pendingRecords).toContainEqual(record2)
    })

    it('should return empty array when no pending records exist', async () => {
      setupMockData(mocks.mockObjectStore, [])

      const pendingRecords = await repository.recoverPendingRecords()
      expect(pendingRecords).toEqual([])
    })
  })

  describe('cleanupInvalidRecords', () => {
    it('should cleanup invalid records from IndexedDB', async () => {
      const recordData1 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(3), // Below minimum
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(3),
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
        activeTime: TimeValueObject.fromSeconds(10), // Above minimum
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(10),
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

      setupMockData(mocks.mockObjectStore, [record1, record2])
      simulateSuccess(mocks.mockDeleteRequest)

      await repository.cleanupInvalidRecords(5)

      expect(mocks.mockObjectStore.delete).toHaveBeenCalledWith(record1.id)
    })

    it('should not cleanup any records when all are valid', async () => {
      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(10),
        idleTime: TimeValueObject.zero(),
        totalTime: TimeValueObject.fromSeconds(10),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: null,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const record = await repository.create(recordData)
      setupMockData(mocks.mockObjectStore, [record])

      await repository.cleanupInvalidRecords(5)

      expect(mocks.mockObjectStore.delete).not.toHaveBeenCalled()
    })
  })

  describe('findByState', () => {
    it('should find records by state from IndexedDB', async () => {
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

      setupMockRecordsByState(mocks.mockIndex, [record1])
      setupMockRecordsByState(mocks.mockIndex, [record2])

      const activeRecords = await repository.findByState(ActivityState.ACTIVE)
      const finishedRecords = await repository.findByState(
        ActivityState.FINISHED
      )

      expect(activeRecords).toHaveLength(1)
      expect(activeRecords).toContainEqual(record1)
      expect(finishedRecords).toHaveLength(1)
      expect(finishedRecords).toContainEqual(record2)
    })
  })

  describe('findByDateRange', () => {
    it('should find records within date range from IndexedDB', async () => {
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

      setupMockData(mocks.mockObjectStore, [record1, record2])

      const recordsInRange = await repository.findByDateRange(past, future)

      expect(recordsInRange).toHaveLength(2)
      expect(recordsInRange).toContainEqual(record1)
      expect(recordsInRange).toContainEqual(record2)
    })
  })

  describe('getStats', () => {
    it('should return correct statistics from IndexedDB', async () => {
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

      const record1 = await repository.create(recordData1)
      const record2 = await repository.create(recordData2)
      const record3 = await repository.create(recordData3)

      setupMockData(mocks.mockObjectStore, [record1, record2, record3])

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
      setupMockData(mocks.mockObjectStore, [])

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

  describe('getActiveRecordId', () => {
    it('should return active record id', async () => {
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
      setupMockActiveRecord(mocks.mockIndex, record)

      const activeRecordId = await repository.getActiveRecordId()

      expect(activeRecordId).toBe(record.id)
    })

    it('should return null when no active record exists', async () => {
      setupMockActiveRecord(mocks.mockIndex, null)

      const activeRecordId = await repository.getActiveRecordId()
      expect(activeRecordId).toBeNull()
    })
  })

  describe('getOldestRecord', () => {
    it('should return oldest record from IndexedDB', async () => {
      const past = new Date(Date.now() - 1000)
      const now = new Date()

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
        startTime: now,
        isVisible: true,
        isFocused: true,
      }

      const record1 = await repository.create(recordData1)
      const record2 = await repository.create(recordData2)

      setupMockCursor(mocks.mockObjectStore, [record1, record2])

      const oldestRecord = await repository.getOldestRecord()

      expect(oldestRecord).toEqual(record1)
    })

    it('should return null when no records exist', async () => {
      setupMockCursor(mocks.mockObjectStore, [])

      const oldestRecord = await repository.getOldestRecord()
      expect(oldestRecord).toBeNull()
    })
  })

  describe('getNewestRecord', () => {
    it('should return newest record from IndexedDB', async () => {
      const past = new Date(Date.now() - 1000)
      const now = new Date()

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
        startTime: now,
        isVisible: true,
        isFocused: true,
      }

      const record1 = await repository.create(recordData1)
      const record2 = await repository.create(recordData2)

      setupMockCursor(mocks.mockObjectStore, [record2, record1])

      const newestRecord = await repository.getNewestRecord()

      expect(newestRecord).toEqual(record2)
    })

    it('should return null when no records exist', async () => {
      setupMockCursor(mocks.mockObjectStore, [])

      const newestRecord = await repository.getNewestRecord()
      expect(newestRecord).toBeNull()
    })
  })

  describe('countByState', () => {
    it('should count records by state', async () => {
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

      setupMockRecordsByState(mocks.mockIndex, [record1])
      setupMockRecordsByState(mocks.mockIndex, [record2])

      const activeCount = await repository.countByState(ActivityState.ACTIVE)
      const finishedCount = await repository.countByState(
        ActivityState.FINISHED
      )

      expect(activeCount).toBe(1)
      expect(finishedCount).toBe(1)
    })
  })

  describe('getTotalRecords', () => {
    it('should return total number of records', async () => {
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

      const record1 = await repository.create(recordData)
      const record2 = await repository.create(recordData)

      setupMockData(mocks.mockObjectStore, [record1, record2])

      const totalRecords = await repository.getTotalRecords()

      expect(totalRecords).toBe(2)
    })

    it('should return 0 when no records exist', async () => {
      setupMockData(mocks.mockObjectStore, [])

      const totalRecords = await repository.getTotalRecords()
      expect(totalRecords).toBe(0)
    })
  })
})
