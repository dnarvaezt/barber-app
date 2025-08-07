// ============================================================================
// TRACK ACTIVITY INDEXEDDB BROWSER TESTS - Tests en entorno browser real
// ============================================================================

import {
  ActivityState,
  EventType,
  InteractionType,
  TimeValueObject,
} from '../../application/track-activity.model'

import { ActivityRecordIndexedDBRepository } from '../../application/track-activity.repository.indexeddb'

// ============================================================================
// BROWSER TESTS - Tests en entorno browser real
// ============================================================================

describe('ActivityRecordIndexedDBRepository Browser', () => {
  let repository: ActivityRecordIndexedDBRepository

  beforeAll(() => {
    // Verificar que estamos en un entorno browser
    if (typeof window === 'undefined') {
      console.warn('⚠️ Estos tests requieren un entorno browser con IndexedDB')
      return
    }
  })

  beforeEach(async () => {
    // Solo ejecutar si estamos en browser
    if (typeof window === 'undefined') {
      return
    }

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
    if (typeof window === 'undefined' || !repository) {
      return
    }

    // Limpiar después de cada test
    await repository.clear()
  })

  describe('Real Browser IndexedDB Operations', () => {
    it('should actually save and retrieve data from IndexedDB in browser', async () => {
      // Skip si no estamos en browser
      if (typeof window === 'undefined') {
        console.warn('⏭️ Skipping browser test - not in browser environment')
        return
      }

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

      console.log('✅ Data successfully saved and retrieved from IndexedDB')
    })

    it('should persist data across page reloads', async () => {
      // Skip si no estamos en browser
      if (typeof window === 'undefined') {
        console.warn('⏭️ Skipping browser test - not in browser environment')
        return
      }

      const recordData = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(30),
        idleTime: TimeValueObject.fromSeconds(10),
        totalTime: TimeValueObject.fromSeconds(45),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: InteractionType.CLICK,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      // Crear registro
      const createdRecord = await repository.create(recordData)

      // Verificar que se guardó
      expect(await repository.findById(createdRecord.id)).toEqual(createdRecord)

      // Simular recarga de página (crear nuevo repositorio)
      const newRepository = new ActivityRecordIndexedDBRepository()
      await newRepository.initialize()

      // Verificar que el registro persiste
      const persistedRecord = await newRepository.findById(createdRecord.id)
      expect(persistedRecord).toEqual(createdRecord)

      console.log('✅ Data persisted across page reloads')
    })

    it('should handle multiple records with proper indexing', async () => {
      // Skip si no estamos en browser
      if (typeof window === 'undefined') {
        console.warn('⏭️ Skipping browser test - not in browser environment')
        return
      }

      const recordData1 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(20),
        idleTime: TimeValueObject.fromSeconds(5),
        totalTime: TimeValueObject.fromSeconds(30),
        state: ActivityState.ACTIVE,
        lastInteractionTime: new Date(),
        lastInteractionType: InteractionType.CLICK,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData2 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(45),
        idleTime: TimeValueObject.fromSeconds(15),
        totalTime: TimeValueObject.fromSeconds(65),
        state: ActivityState.FINISHED,
        lastInteractionTime: new Date(),
        lastInteractionType: InteractionType.SCROLL,
        startEventType: EventType.PAGE_LOAD,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      const recordData3 = {
        minimumTime: TimeValueObject.fromSeconds(5),
        activeTime: TimeValueObject.fromSeconds(10),
        idleTime: TimeValueObject.fromSeconds(2),
        totalTime: TimeValueObject.fromSeconds(17),
        state: ActivityState.SUSPENDED,
        lastInteractionTime: new Date(),
        lastInteractionType: InteractionType.KEY_PRESS,
        startEventType: EventType.USER_INTERACTION,
        startTime: new Date(),
        isVisible: true,
        isFocused: true,
      }

      // Crear múltiples registros
      const record1 = await repository.create(recordData1)
      const record2 = await repository.create(recordData2)
      const record3 = await repository.create(recordData3)

      // Verificar que todos se guardaron
      const allRecords = await repository.findAll()
      expect(allRecords).toHaveLength(3)

      // Verificar búsquedas por estado
      const activeRecords = await repository.findByState(ActivityState.ACTIVE)
      expect(activeRecords).toHaveLength(1)
      expect(activeRecords[0]).toEqual(record1)

      const finishedRecords = await repository.findByState(
        ActivityState.FINISHED
      )
      expect(finishedRecords).toHaveLength(1)
      expect(finishedRecords[0]).toEqual(record2)

      const suspendedRecords = await repository.findByState(
        ActivityState.SUSPENDED
      )
      expect(suspendedRecords).toHaveLength(1)
      expect(suspendedRecords[0]).toEqual(record3)

      // Verificar estadísticas
      const stats = await repository.getStats()
      expect(stats.total).toBe(3)
      expect(stats.active).toBe(1)
      expect(stats.finished).toBe(1)
      expect(stats.suspended).toBe(1)

      console.log('✅ Multiple records with indexing working correctly')
    })

    it('should handle large datasets efficiently', async () => {
      // Skip si no estamos en browser
      if (typeof window === 'undefined') {
        console.warn('⏭️ Skipping browser test - not in browser environment')
        return
      }

      const startTime = Date.now()

      // Crear 100 registros
      const records = []
      for (let i = 0; i < 100; i++) {
        const recordData = {
          minimumTime: TimeValueObject.fromSeconds(5),
          activeTime: TimeValueObject.fromSeconds(
            Math.floor(Math.random() * 60) + 10
          ),
          idleTime: TimeValueObject.fromSeconds(Math.floor(Math.random() * 30)),
          totalTime: TimeValueObject.fromSeconds(
            Math.floor(Math.random() * 90) + 10
          ),
          state:
            i % 3 === 0
              ? ActivityState.ACTIVE
              : i % 3 === 1
                ? ActivityState.FINISHED
                : ActivityState.SUSPENDED,
          lastInteractionTime: new Date(),
          lastInteractionType: InteractionType.CLICK,
          startEventType: EventType.USER_INTERACTION,
          startTime: new Date(),
          isVisible: true,
          isFocused: true,
        }

        const record = await repository.create(recordData)
        records.push(record)
      }

      const createTime = Date.now() - startTime

      // Verificar que todos se guardaron
      const allRecords = await repository.findAll()
      expect(allRecords).toHaveLength(100)

      // Verificar búsquedas eficientes
      const activeRecords = await repository.findByState(ActivityState.ACTIVE)
      const finishedRecords = await repository.findByState(
        ActivityState.FINISHED
      )
      const suspendedRecords = await repository.findByState(
        ActivityState.SUSPENDED
      )

      expect(
        activeRecords.length + finishedRecords.length + suspendedRecords.length
      ).toBe(100)

      const queryTime = Date.now() - startTime - createTime

      console.log(`✅ Large dataset test completed:`)
      console.log(`   - Created 100 records in ${createTime}ms`)
      console.log(`   - Queried data in ${queryTime}ms`)
      console.log(
        `   - Active: ${activeRecords.length}, Finished: ${finishedRecords.length}, Suspended: ${suspendedRecords.length}`
      )
    })
  })
})
