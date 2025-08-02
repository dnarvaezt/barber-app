// ============================================================================
// TRACK ACTIVITY RECOVERY SERVICE - Servicio de recuperación de registros
// ============================================================================

import { ActivityState } from './track-activity.model'

import type {
  IActivityRecord,
  IActivityRecordRepository,
  IActivityValidator,
} from './track-activity.model'

// ============================================================================
// INTERFACES
// ============================================================================

export interface RecoveryResult {
  recoveredRecords: IActivityRecord[]
  cleanedRecords: number
  errors: string[]
}

export interface RecoveryOptions {
  cleanupInvalidRecords?: boolean
  minimumTime?: number
  validateRecords?: boolean
}

// ============================================================================
// CLASE PRINCIPAL - Servicio de Recuperación
// ============================================================================

export class ActivityRecoveryService {
  constructor(
    private readonly repository: IActivityRecordRepository,
    private readonly validator: IActivityValidator,
    private readonly options: RecoveryOptions = {}
  ) {}

  // ============================================================================
  // MÉTODO PRINCIPAL - Recuperar registros pendientes
  // ============================================================================

  async recoverPendingRecords(): Promise<RecoveryResult> {
    const result: RecoveryResult = {
      recoveredRecords: [],
      cleanedRecords: 0,
      errors: [],
    }

    try {
      console.log('🔄 Starting recovery process...')

      // 1. Recuperar registros pendientes del repositorio
      const pendingRecords = await this.getPendingRecords()

      // 2. Validar y limpiar registros si es necesario
      if (this.options.cleanupInvalidRecords) {
        const cleanupResult = await this.cleanupInvalidRecords(
          pendingRecords,
          this.options.minimumTime || 5
        )
        result.cleanedRecords = cleanupResult.cleanedCount
        result.errors.push(...cleanupResult.errors)
      }

      // 3. Validar registros recuperados
      const validRecords = await this.validateRecoveredRecords(pendingRecords)
      result.recoveredRecords = validRecords

      // 4. Log del resultado
      console.log(
        `✅ Recovery completed: ${validRecords.length} valid records recovered`
      )
      if (result.cleanedRecords > 0) {
        console.log(`🧹 Cleaned up ${result.cleanedRecords} invalid records`)
      }

      return result
    } catch (error) {
      const errorMessage = `Recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error('❌', errorMessage)
      result.errors.push(errorMessage)
      return result
    }
  }

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  private async getPendingRecords(): Promise<IActivityRecord[]> {
    // Si el repositorio tiene método específico de recuperación, usarlo
    if ('recoverPendingRecords' in this.repository) {
      return await (this.repository as any).recoverPendingRecords()
    }

    // Si no, obtener todos y filtrar
    const allRecords = await this.repository.findAll()
    return allRecords.filter(
      record =>
        record.state === ActivityState.ACTIVE ||
        record.state === ActivityState.SUSPENDED
    )
  }

  private async validateRecoveredRecords(
    records: IActivityRecord[]
  ): Promise<IActivityRecord[]> {
    const validRecords: IActivityRecord[] = []

    for (const record of records) {
      try {
        // Validar estructura del registro
        const validation = this.validator.validateRecord(record)

        if (validation.isValid) {
          // Verificar que el registro no esté corrupto
          if (this.isRecordIntegrityValid(record)) {
            validRecords.push(record)
          } else {
            console.warn(`⚠️ Record ${record.id} failed integrity check`)
          }
        } else {
          console.warn(
            `⚠️ Record ${record.id} validation failed:`,
            validation.errors
          )
        }
      } catch (error) {
        console.error(`❌ Error validating record ${record.id}:`, error)
      }
    }

    return validRecords
  }

  private async cleanupInvalidRecords(
    records: IActivityRecord[],
    minimumTime: number
  ): Promise<{ cleanedCount: number; errors: string[] }> {
    const errors: string[] = []
    let cleanedCount = 0

    for (const record of records) {
      try {
        // Eliminar registros que no cumplen con el tiempo mínimo
        if (record.totalTime.seconds < minimumTime) {
          await this.repository.delete(record.id)
          cleanedCount++
          console.log(`🧹 Cleaned up invalid record: ${record.id}`)
        }
      } catch (error) {
        const errorMessage = `Failed to clean record ${record.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMessage)
        console.error('❌', errorMessage)
      }
    }

    return { cleanedCount, errors }
  }

  private isRecordIntegrityValid(record: IActivityRecord): boolean {
    try {
      // Verificar que los campos requeridos existan
      if (!record.id || !record.startTime || !record.createdAt) {
        return false
      }

      // Verificar que los tiempos sean válidos
      if (
        !record.minimumTime ||
        !record.activeTime ||
        !record.idleTime ||
        !record.totalTime
      ) {
        return false
      }

      // Verificar que las fechas sean válidas
      if (
        isNaN(record.startTime.getTime()) ||
        isNaN(record.createdAt.getTime()) ||
        isNaN(record.updatedAt.getTime())
      ) {
        return false
      }

      // Verificar que el estado sea válido
      if (!Object.values(ActivityState).includes(record.state)) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  // ============================================================================
  // MÉTODOS DE UTILIDAD
  // ============================================================================

  async getRecoveryStats(): Promise<{
    totalPending: number
    validRecords: number
    invalidRecords: number
    averageSessionTime: number
  }> {
    const pendingRecords = await this.getPendingRecords()
    const validRecords = await this.validateRecoveredRecords(pendingRecords)
    const invalidRecords = pendingRecords.length - validRecords.length

    const sessionTimes = validRecords.map(r => r.totalTime.seconds)
    const averageSessionTime =
      sessionTimes.length > 0
        ? sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length
        : 0

    return {
      totalPending: pendingRecords.length,
      validRecords: validRecords.length,
      invalidRecords,
      averageSessionTime,
    }
  }

  async forceCleanup(): Promise<{ cleanedCount: number; errors: string[] }> {
    console.log('🧹 Starting forced cleanup...')

    const allRecords = await this.repository.findAll()
    const errors: string[] = []
    let cleanedCount = 0

    for (const record of allRecords) {
      try {
        // Eliminar registros que no cumplen con el tiempo mínimo (5 segundos por defecto)
        if (record.totalTime.seconds < 5) {
          await this.repository.delete(record.id)
          cleanedCount++
        }
      } catch (error) {
        const errorMessage = `Failed to clean record ${record.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMessage)
      }
    }

    console.log(`🧹 Forced cleanup completed: ${cleanedCount} records cleaned`)
    return { cleanedCount, errors }
  }
}
