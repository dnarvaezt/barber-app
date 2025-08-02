// ============================================================================
// TRACK ACTIVITY INDEXEDDB REPOSITORY - Persistencia temporal en IndexedDB
// ============================================================================

import type {
  IActivityRecord,
  IActivityRecordRepository,
} from './track-activity.model'

// ============================================================================
// INTERFACES PARA INDEXEDDB
// ============================================================================

interface IndexedDBConfig {
  databaseName: string
  storeName: string
  version: number
}

// ============================================================================
// CLASE PRINCIPAL - Repositorio IndexedDB
// ============================================================================

export class ActivityRecordIndexedDBRepository
  implements IActivityRecordRepository
{
  private readonly config: IndexedDBConfig = {
    databaseName: 'TrackActivityDB',
    storeName: 'activity_records',
    version: 1,
  }

  private db: IDBDatabase | null = null
  private activeRecordId: string | null = null

  // ============================================================================
  // INICIALIZACIÓN
  // ============================================================================

  async initialize(): Promise<void> {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        this.config.databaseName,
        this.config.version
      )

      request.onerror = () => {
        console.error('❌ Error opening IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('✅ IndexedDB initialized successfully')
        resolve()
      }

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result

        // Crear object store si no existe
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, {
            keyPath: 'id',
          })

          // Crear índices para búsquedas eficientes
          store.createIndex('state', 'state', { unique: false })
          store.createIndex('startTime', 'startTime', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })

          console.log('✅ IndexedDB store created')
        }
      }
    })
  }

  // ============================================================================
  // OPERACIONES CRUD
  // ============================================================================

  async create(
    record: Omit<IActivityRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IActivityRecord> {
    await this.initialize()

    const now = new Date()
    const newRecord: IActivityRecord = {
      ...record,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readwrite'
      )
      const store = transaction.objectStore(this.config.storeName)

      const request = store.add(newRecord)

      request.onsuccess = () => {
        // Actualizar registro activo si es el primer registro
        if (record.state === 'active') {
          this.activeRecordId = newRecord.id
        }
        resolve(newRecord)
      }

      request.onerror = () => {
        console.error('❌ Error creating record:', request.error)
        reject(request.error)
      }
    })
  }

  async update(
    id: string,
    record: Partial<IActivityRecord>
  ): Promise<IActivityRecord> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readwrite'
      )
      const store = transaction.objectStore(this.config.storeName)

      // Primero obtener el registro existente
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const existingRecord = getRequest.result
        if (!existingRecord) {
          reject(new Error(`Record with id ${id} not found`))
          return
        }

        // Actualizar el registro
        const updatedRecord: IActivityRecord = {
          ...existingRecord,
          ...record,
          updatedAt: new Date(),
        }

        const putRequest = store.put(updatedRecord)

        putRequest.onsuccess = () => {
          resolve(updatedRecord)
        }

        putRequest.onerror = () => {
          console.error('❌ Error updating record:', putRequest.error)
          reject(putRequest.error)
        }
      }

      getRequest.onerror = () => {
        console.error('❌ Error getting record for update:', getRequest.error)
        reject(getRequest.error)
      }
    })
  }

  async findById(id: string): Promise<IActivityRecord | null> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readonly'
      )
      const store = transaction.objectStore(this.config.storeName)

      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        console.error('❌ Error finding record by id:', request.error)
        reject(request.error)
      }
    })
  }

  async findActive(): Promise<IActivityRecord | null> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readonly'
      )
      const store = transaction.objectStore(this.config.storeName)
      const index = store.index('state')

      const request = index.get('active')

      request.onsuccess = () => {
        const record = request.result
        if (record) {
          this.activeRecordId = record.id
        }
        resolve(record || null)
      }

      request.onerror = () => {
        console.error('❌ Error finding active record:', request.error)
        reject(request.error)
      }
    })
  }

  async findAll(): Promise<IActivityRecord[]> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readonly'
      )
      const store = transaction.objectStore(this.config.storeName)

      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('❌ Error finding all records:', request.error)
        reject(request.error)
      }
    })
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readwrite'
      )
      const store = transaction.objectStore(this.config.storeName)

      const request = store.delete(id)

      request.onsuccess = () => {
        // Limpiar registro activo si se elimina
        if (this.activeRecordId === id) {
          this.activeRecordId = null
        }
        resolve(true)
      }

      request.onerror = () => {
        console.error('❌ Error deleting record:', request.error)
        reject(request.error)
      }
    })
  }

  async clear(): Promise<void> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readwrite'
      )
      const store = transaction.objectStore(this.config.storeName)

      const request = store.clear()

      request.onsuccess = () => {
        this.activeRecordId = null
        console.log('✅ All records cleared from IndexedDB')
        resolve()
      }

      request.onerror = () => {
        console.error('❌ Error clearing records:', request.error)
        reject(request.error)
      }
    })
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS PARA RECUPERACIÓN
  // ============================================================================

  async recoverPendingRecords(): Promise<IActivityRecord[]> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readonly'
      )
      const store = transaction.objectStore(this.config.storeName)

      const request = store.getAll()

      request.onsuccess = () => {
        const allRecords = request.result || []

        // Filtrar registros no finalizados (activos o suspendidos)
        const pendingRecords = allRecords.filter(
          record => record.state === 'active' || record.state === 'suspended'
        )

        console.log(
          `🔄 Recovered ${pendingRecords.length} pending records from IndexedDB`
        )
        resolve(pendingRecords)
      }

      request.onerror = () => {
        console.error('❌ Error recovering pending records:', request.error)
        reject(request.error)
      }
    })
  }

  async cleanupInvalidRecords(minimumTime: number): Promise<void> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readwrite'
      )
      const store = transaction.objectStore(this.config.storeName)

      const request = store.getAll()

      request.onsuccess = () => {
        const allRecords = request.result || []
        const recordsToDelete: string[] = []

        allRecords.forEach(record => {
          // Eliminar registros que no cumplen con el tiempo mínimo
          if (record.totalTime.seconds < minimumTime) {
            recordsToDelete.push(record.id)
          }
        })

        // Eliminar registros inválidos
        if (recordsToDelete.length > 0) {
          const deletePromises = recordsToDelete.map(id => this.delete(id))
          Promise.all(deletePromises)
            .then(() => {
              console.log(
                `🧹 Cleaned up ${recordsToDelete.length} invalid records`
              )
              resolve()
            })
            .catch(reject)
        } else {
          resolve()
        }
      }

      request.onerror = () => {
        console.error('❌ Error during cleanup:', request.error)
        reject(request.error)
      }
    })
  }

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  private generateId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async getActiveRecordId(): Promise<string | null> {
    const activeRecord = await this.findActive()
    return activeRecord?.id || null
  }

  async findByState(state: string): Promise<IActivityRecord[]> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readonly'
      )
      const store = transaction.objectStore(this.config.storeName)
      const index = store.index('state')

      const request = index.getAll(state)

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('❌ Error finding records by state:', request.error)
        reject(request.error)
      }
    })
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<IActivityRecord[]> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readonly'
      )
      const store = transaction.objectStore(this.config.storeName)
      const index = store.index('createdAt')

      const request = index.getAll(IDBKeyRange.bound(startDate, endDate))

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        console.error('❌ Error finding records by date range:', request.error)
        reject(request.error)
      }
    })
  }

  async countByState(state: string): Promise<number> {
    const records = await this.findByState(state)
    return records.length
  }

  async getTotalRecords(): Promise<number> {
    const allRecords = await this.findAll()
    return allRecords.length
  }

  async getOldestRecord(): Promise<IActivityRecord | null> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readonly'
      )
      const store = transaction.objectStore(this.config.storeName)
      const index = store.index('createdAt')

      const request = index.openCursor()

      request.onsuccess = () => {
        const cursor = request.result
        resolve(cursor?.value || null)
      }

      request.onerror = () => {
        console.error('❌ Error getting oldest record:', request.error)
        reject(request.error)
      }
    })
  }

  async getNewestRecord(): Promise<IActivityRecord | null> {
    await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.config.storeName],
        'readonly'
      )
      const store = transaction.objectStore(this.config.storeName)
      const index = store.index('createdAt')

      const request = index.openCursor(null, 'prev')

      request.onsuccess = () => {
        const cursor = request.result
        resolve(cursor?.value || null)
      }

      request.onerror = () => {
        console.error('❌ Error getting newest record:', request.error)
        reject(request.error)
      }
    })
  }

  async getStats(): Promise<{
    total: number
    active: number
    finished: number
    suspended: number
    averageSessionTime: number
    longestSession: number
    shortestSession: number
  }> {
    const allRecords = await this.findAll()
    const activeRecords = allRecords.filter(r => r.state === 'active')
    const finishedRecords = allRecords.filter(r => r.state === 'finished')
    const suspendedRecords = allRecords.filter(r => r.state === 'suspended')

    const sessionTimes = finishedRecords.map(r => r.totalTime.seconds)
    const averageSessionTime =
      sessionTimes.length > 0
        ? sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length
        : 0
    const longestSession =
      sessionTimes.length > 0 ? Math.max(...sessionTimes) : 0
    const shortestSession =
      sessionTimes.length > 0 ? Math.min(...sessionTimes) : 0

    return {
      total: allRecords.length,
      active: activeRecords.length,
      finished: finishedRecords.length,
      suspended: suspendedRecords.length,
      averageSessionTime,
      longestSession,
      shortestSession,
    }
  }
}
