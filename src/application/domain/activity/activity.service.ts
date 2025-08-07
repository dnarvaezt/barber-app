import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from './activity.model'
import type { ActivityRepository } from './activity.repository.interface'

export class ActivityService {
  private readonly activityRepository: ActivityRepository

  constructor(activityRepository: ActivityRepository) {
    this.activityRepository = activityRepository
  }

  // Método para obtener todas las actividades
  async getAllActivities(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)

    // Aplicar ordenamiento por nombre por defecto si no se especifica
    const paginationWithSort = {
      ...validatedPagination,
      sortBy: validatedPagination.sortBy || 'name',
      sortOrder: validatedPagination.sortOrder || 'asc',
    }

    return this.activityRepository.findAll(paginationWithSort)
  }

  // Método para buscar actividades
  async findActivities(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.activityRepository.find(searchTerm, validatedPagination)
  }

  // Método para obtener actividad por ID
  async getActivityById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    if (!id) {
      throw new Error('Activity ID is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.activityRepository.findById(id, validatedPagination)
  }

  // Método para obtener actividades por categoría
  async getActivitiesByCategory(
    categoryId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    if (!categoryId) {
      throw new Error('Category ID is required')
    }

    const validatedPagination = PaginationHelper.validateParams(pagination)
    return this.activityRepository.findByCategory(
      categoryId,
      validatedPagination
    )
  }

  // Método para crear actividad
  async createActivity(activityData: CreateActivityRequest): Promise<Activity> {
    this.validateActivityData(activityData)

    const defaultPagination: PaginationParams = { page: 1, limit: 100 }
    const existingActivities = await this.activityRepository.find(
      activityData.name,
      defaultPagination
    )
    const existingActivity = existingActivities.data.find(
      activity =>
        activity.name.toLowerCase() === activityData.name.toLowerCase()
    )
    if (existingActivity) {
      throw new Error('Activity with this name already exists')
    }

    return this.activityRepository.create(activityData)
  }

  // Método para actualizar actividad
  async updateActivity(activityData: UpdateActivityRequest): Promise<Activity> {
    if (!activityData.id) {
      throw new Error('Activity ID is required for update')
    }

    const defaultPagination: PaginationParams = { page: 1, limit: 1 }
    const existingActivityResponse = await this.activityRepository.findById(
      activityData.id,
      defaultPagination
    )
    const existingActivity = existingActivityResponse.data[0]
    if (!existingActivity) {
      throw new Error('Activity not found')
    }

    if (
      activityData.name &&
      activityData.name.toLowerCase() !== existingActivity.name.toLowerCase()
    ) {
      const activitiesWithName = await this.activityRepository.find(
        activityData.name,
        defaultPagination
      )
      const activityWithName = activitiesWithName.data.find(
        activity =>
          activity.name.toLowerCase() === activityData.name?.toLowerCase()
      )
      if (activityWithName) {
        throw new Error('Activity name is already in use')
      }
    }

    return this.activityRepository.update(activityData)
  }

  // Método para eliminar actividad
  async deleteActivity(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Activity ID is required')
    }

    const activityExists = await this.activityRepository.exists(id)

    if (!activityExists) {
      throw new Error('Activity not found')
    }

    const result = await this.activityRepository.delete(id)
    return result
  }

  private validateActivityData(activityData: CreateActivityRequest): void {
    if (!activityData.name || activityData.name.trim().length === 0) {
      throw new Error('Activity name is required')
    }

    if (activityData.name.trim().length < 2) {
      throw new Error('Activity name must be at least 2 characters long')
    }

    if (activityData.name.trim().length > 100) {
      throw new Error('Activity name must be less than 100 characters')
    }

    if (activityData.price < 0) {
      throw new Error('Price cannot be negative')
    }

    if (activityData.price > 999999.99) {
      throw new Error('Price cannot exceed 999,999.99')
    }

    if (
      !activityData.categoryId ||
      activityData.categoryId.trim().length === 0
    ) {
      throw new Error('Category ID is required')
    }

    if (!activityData.createdBy) {
      throw new Error('Created by user ID is required')
    }
  }
}
