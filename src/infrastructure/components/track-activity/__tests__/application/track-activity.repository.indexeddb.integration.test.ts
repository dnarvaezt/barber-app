// ============================================================================
// TRACK ACTIVITY INDEXEDDB INTEGRATION TESTS - Tests reales con IndexedDB
// ============================================================================

import {
  ActivityState,
  EventType,
  InteractionType,
  TimeValueObject,
} from '../../application/track-activity.model'

import { ActivityRecordIndexedDBRepository } from '../../application/track-activity.repository.indexeddb'

// ============================================================================
// INTEGRATION TESTS - Tests reales con IndexedDB
// ============================================================================

describe('ActivityRecordIndexedDBRepository Integration', () => {
  let repository: ActivityRecordIndexedDBRepository

  beforeEach(async () => {
    // Limpiar IndexedDB antes de cada test
    if (typeof indexedDB !== 'undefined') {
      const deleteRequest = indexedDB.deleteDatabase('TrackActivityDB')
      await new Promise<void>((resolve, reject) => {
        deleteRequest.onsuccess = () => resolve()
        deleteRequest.onerror = () => reject(deleteRequest.error)
      })
    }

    repository = new ActivityRecordIndexedDBRepository()
    await repository.initialize()
  })

  afterEach(async () => {
    // Limpiar después de cada test
    await repository.clear()
  })

  describe('Real IndexedDB Operations', () => {
    it('should actually save and retrieve data from IndexedDB', async () => {
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

      // Crear registro
      const createdRecord = await repository.create(recordData)

      expect(createdRecord.id).toBeDefined()
      expect(createdRecord.state).toBe(ActivityState.ACTIVE)

      // Verificar que realmente se guardó
      const retrievedRecord = await repository.findById(createdRecord.id)
      expect(retrievedRecord).toEqual(createdRecord)

      // Verificar que aparece en findAll
      const allRecords = await repository.findAll()
      expect(allRecords).toHaveLength(1)
      expect(allRecords[0]).toEqual(createdRecord)

      // Verificar que es el registro activo
      const activeRecord = await repository.findActive()
      expect(activeRecord).toEqual(createdRecord)
    })

    it('should update existing records in IndexedDB', async () => {
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

      // Actualizar el registro
      const updateData = {
        state: ActivityState.FINISHED,
        activeTime: TimeValueObject.fromSeconds(30),
        endTime: new Date(),
      }

      const updatedRecord = await repository.update(
        createdRecord.id,
        updateData
      )

      expect(updatedRecord.id).toBe(createdRecord.id)
      expect(updatedRecord.state).toBe(ActivityState.FINISHED)
      expect(updatedRecord.activeTime.seconds).toBe(30)
      expect(updatedRecord.endTime).toBeDefined()

      // Verificar que los cambios se guardaron
      const retrievedRecord = await repository.findById(createdRecord.id)
      expect(retrievedRecord).toEqual(updatedRecord)

      // Verificar que ya no es el registro activo
      const activeRecord = await repository.findActive()
      expect(activeRecord).toBeNull()
    })

    it('should delete records from IndexedDB', async () => {
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

      // Verificar que existe
      expect(await repository.findById(createdRecord.id)).toEqual(createdRecord)

      // Eliminar el registro
      const deleted = await repository.delete(createdRecord.id)
      expect(deleted).toBe(true)

      // Verificar que ya no existe
      expect(await repository.findById(createdRecord.id)).toBeNull()
      expect(await repository.findActive()).toBeNull()
      expect(await repository.findAll()).toHaveLength(0)
    })

    it('should handle multiple records correctly', async () => {
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

      // Verificar que ambos registros existen
      const allRecords = await repository.findAll()
      expect(allRecords).toHaveLength(2)
      expect(allRecords).toContainEqual(record1)
      expect(allRecords).toContainEqual(record2)

      // Verificar búsquedas por estado
      const activeRecords = await repository.findByState(ActivityState.ACTIVE)
      expect(activeRecords).toHaveLength(1)
      expect(activeRecords[0]).toEqual(record1)

      const finishedRecords = await repository.findByState(
        ActivityState.FINISHED
      )
      expect(finishedRecords).toHaveLength(1)
      expect(finishedRecords[0]).toEqual(record2)

      // Verificar que solo el activo es el registro activo
      const activeRecord = await repository.findActive()
      expect(activeRecord).toEqual(record1)
    })

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

      // Verificar que hay registros
      expect(await repository.findAll()).toHaveLength(2)

      // Limpiar todos los registros
      await repository.clear()

      // Verificar que no hay registros
      expect(await repository.findAll()).toHaveLength(0)
      expect(await repository.findActive()).toBeNull()
    })

    it('should recover pending records correctly', async () => {
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
      await repository.create(recordData3)

      // Recuperar registros pendientes (activos y suspendidos)
      const pendingRecords = await repository.recoverPendingRecords()

      expect(pendingRecords).toHaveLength(2)
      expect(pendingRecords).toContainEqual(record1)
      expect(pendingRecords).toContainEqual(record2)
    })

    it('should cleanup invalid records correctly', async () => {
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

      // Verificar que ambos registros existen
      expect(await repository.findAll()).toHaveLength(2)

      // Limpiar registros inválidos
      await repository.cleanupInvalidRecords(5)

      // Verificar que solo quedó el registro válido
      const remainingRecords = await repository.findAll()
      expect(remainingRecords).toHaveLength(1)
      expect(remainingRecords[0]).toEqual(record2)
    })

    it('should provide correct statistics', async () => {
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
  })
})
