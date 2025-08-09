// ============================================================================
// TRACK ACTIVITY MEMORY REPOSITORY - Implementación en memoria
// ============================================================================

import type {
  IActivityRecord,
  IActivityRecordRepository,
} from './track-activity.model'

import { ActivityRecordNotFoundException } from './track-activity.exceptions'

// ============================================================================
// ACTIVITY RECORD MEMORY REPOSITORY - Repositorio en memoria
// ============================================================================

export class ActivityRecordMemoryRepository
  implements IActivityRecordRepository
{
  private records: Map<string, IActivityRecord> = new Map()
  private activeRecordId: string | null = null

  async create(
    record: Omit<IActivityRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IActivityRecord> {
    const now = new Date()
    const id = this.generateId()

    const newRecord: IActivityRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now,
    }

    this.records.set(id, newRecord)

    // Si es el primer registro activo, marcarlo como activo
    if (record.state === 'active' && !this.activeRecordId) {
      this.activeRecordId = id
    }

    return newRecord
  }

  async update(
    id: string,
    record: Partial<IActivityRecord>
  ): Promise<IActivityRecord> {
    const existingRecord = this.records.get(id)
    if (!existingRecord) {
      throw new ActivityRecordNotFoundException(id)
    }

    const updatedRecord: IActivityRecord = {
      ...existingRecord,
      ...record,
      id, // Asegurar que el ID no cambie
      updatedAt: new Date(),
    }

    this.records.set(id, updatedRecord)

    // Actualizar el registro activo si es necesario
    if (updatedRecord.state === 'active') {
      this.activeRecordId = id
    } else if (this.activeRecordId === id) {
      this.activeRecordId = null
    }

    return updatedRecord
  }

  async findById(id: string): Promise<IActivityRecord | null> {
    return this.records.get(id) || null
  }

  async findActive(): Promise<IActivityRecord | null> {
    if (!this.activeRecordId) {
      return null
    }

    const activeRecord = this.records.get(this.activeRecordId)
    if (!activeRecord || activeRecord.state !== 'active') {
      // Limpiar referencia si el registro ya no está activo
      this.activeRecordId = null
      return null
    }

    return activeRecord
  }

  async findAll(): Promise<IActivityRecord[]> {
    return Array.from(this.records.values())
  }

  async delete(id: string): Promise<boolean> {
    const record = this.records.get(id)
    if (!record) {
      return false
    }

    this.records.delete(id)

    // Limpiar referencia activa si es necesario
    if (this.activeRecordId === id) {
      this.activeRecordId = null
    }

    return true
  }

  async clear(): Promise<void> {
    this.records.clear()
    this.activeRecordId = null
  }

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  private generateId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // ============================================================================
  // MÉTODOS DE CONSULTA ESPECÍFICOS
  // ============================================================================

  async findByState(state: string): Promise<IActivityRecord[]> {
    return Array.from(this.records.values()).filter(
      record => record.state === state
    )
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<IActivityRecord[]> {
    return Array.from(this.records.values()).filter(record => {
      const recordDate = record.startTime
      return recordDate >= startDate && recordDate <= endDate
    })
  }

  async findByEventType(eventType: string): Promise<IActivityRecord[]> {
    return Array.from(this.records.values()).filter(
      record => record.startEventType === eventType
    )
  }

  async findFinishedRecords(): Promise<IActivityRecord[]> {
    return Array.from(this.records.values()).filter(
      record => record.state === 'finished'
    )
  }

  async findSuspendedRecords(): Promise<IActivityRecord[]> {
    return Array.from(this.records.values()).filter(
      record => record.state === 'suspended'
    )
  }

  async getActiveRecordId(): Promise<string | null> {
    return this.activeRecordId
  }

  async countByState(state: string): Promise<number> {
    return Array.from(this.records.values()).filter(
      record => record.state === state
    ).length
  }

  async getTotalRecords(): Promise<number> {
    return this.records.size
  }

  async getOldestRecord(): Promise<IActivityRecord | null> {
    const records = Array.from(this.records.values())
    if (records.length === 0) {
      return null
    }

    return records.reduce((oldest, current) =>
      current.createdAt < oldest.createdAt ? current : oldest
    )
  }

  async getNewestRecord(): Promise<IActivityRecord | null> {
    const records = Array.from(this.records.values())
    if (records.length === 0) {
      return null
    }

    return records.reduce((newest, current) =>
      current.createdAt > newest.createdAt ? current : newest
    )
  }

  // ============================================================================
  // MÉTODOS DE ESTADÍSTICAS
  // ============================================================================

  async getStats(): Promise<{
    total: number
    active: number
    finished: number
    suspended: number
    averageSessionTime: number
    longestSession: number
    shortestSession: number
  }> {
    const records = Array.from(this.records.values())
    const finishedRecords = records.filter(r => r.state === 'finished')

    const sessionTimes = finishedRecords.map(r => r.totalTime.milliseconds)
    const averageSessionTime =
      sessionTimes.length > 0
        ? sessionTimes.reduce((sum, time) => sum + time, 0) /
          sessionTimes.length
        : 0

    return {
      total: records.length,
      active: records.filter(r => r.state === 'active').length,
      finished: finishedRecords.length,
      suspended: records.filter(r => r.state === 'suspended').length,
      averageSessionTime,
      longestSession: sessionTimes.length > 0 ? Math.max(...sessionTimes) : 0,
      shortestSession: sessionTimes.length > 0 ? Math.min(...sessionTimes) : 0,
    }
  }
}
