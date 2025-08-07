import type { PaginatedResponse, PaginationParams } from '../common'
import { PaginationHelper } from '../common'
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from './activity.model'
import type { ActivityRepository } from './activity.repository.interface'

export class ActivityRepositoryMemory implements ActivityRepository {
  private activities: Activity[] = []

  constructor() {
    // Datos de ejemplo para testing
    this.activities = [
      {
        id: 'act_001',
        name: 'Corte Clásico',
        price: 25000,
        categoryId: 'cat_001',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'act_002',
        name: 'Corte Moderno',
        price: 30000,
        categoryId: 'cat_001',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'act_003',
        name: 'Arreglo de Barba',
        price: 15000,
        categoryId: 'cat_002',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'act_004',
        name: 'Tratamiento Capilar',
        price: 45000,
        categoryId: 'cat_003',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'act_005',
        name: 'Coloración',
        price: 60000,
        categoryId: 'cat_004',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
      {
        id: 'act_006',
        name: 'Peinado para Eventos',
        price: 35000,
        categoryId: 'cat_005',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin_001',
        updatedBy: 'admin_001',
      },
    ]
  }

  async findAll(
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validatedPagination

    // Ordenar actividades
    const sortedActivities = [...this.activities].sort((a, b) => {
      const aValue = a[sortBy as keyof Activity] as string | number
      const bValue = b[sortBy as keyof Activity] as string | number

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }
      return 0
    })

    // Calcular paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedActivities = sortedActivities.slice(startIndex, endIndex)

    return {
      data: paginatedActivities,
      meta: {
        page,
        limit,
        total: this.activities.length,
        totalPages: Math.ceil(this.activities.length / limit),
        hasNextPage: endIndex < this.activities.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const activity = this.activities.find(act => act.id === id)

    return {
      data: activity ? [activity] : [],
      meta: {
        page: validatedPagination.page,
        limit: validatedPagination.limit,
        total: activity ? 1 : 0,
        totalPages: activity ? 1 : 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  async find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validatedPagination

    // Filtrar actividades que coincidan con el término de búsqueda
    const filteredActivities = this.activities.filter(activity =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Ordenar actividades filtradas
    const sortedActivities = filteredActivities.sort((a, b) => {
      const aValue = a[sortBy as keyof Activity] as string | number
      const bValue = b[sortBy as keyof Activity] as string | number

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }
      return 0
    })

    // Calcular paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedActivities = sortedActivities.slice(startIndex, endIndex)

    return {
      data: paginatedActivities,
      meta: {
        page,
        limit,
        total: filteredActivities.length,
        totalPages: Math.ceil(filteredActivities.length / limit),
        hasNextPage: endIndex < filteredActivities.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async findByCategory(
    categoryId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>> {
    const validatedPagination = PaginationHelper.validateParams(pagination)
    const { page, limit, sortBy, sortOrder } = validatedPagination

    // Filtrar actividades por categoría
    const filteredActivities = this.activities.filter(
      activity => activity.categoryId === categoryId
    )

    // Ordenar actividades filtradas
    const sortedActivities = filteredActivities.sort((a, b) => {
      const aValue = a[sortBy as keyof Activity] as string | number
      const bValue = b[sortBy as keyof Activity] as string | number

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }
      return 0
    })

    // Calcular paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedActivities = sortedActivities.slice(startIndex, endIndex)

    return {
      data: paginatedActivities,
      meta: {
        page,
        limit,
        total: filteredActivities.length,
        totalPages: Math.ceil(filteredActivities.length / limit),
        hasNextPage: endIndex < filteredActivities.length,
        hasPrevPage: page > 1,
      },
    }
  }

  async create(data: CreateActivityRequest): Promise<Activity> {
    const newActivity: Activity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name.trim(),
      price: data.price,
      categoryId: data.categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
      updatedBy: data.createdBy,
    }

    this.activities.push(newActivity)
    return newActivity
  }

  async update(data: UpdateActivityRequest): Promise<Activity> {
    const activityIndex = this.activities.findIndex(act => act.id === data.id)
    if (activityIndex === -1) {
      throw new Error('Activity not found')
    }

    const updatedActivity: Activity = {
      ...this.activities[activityIndex],
      ...(data.name && { name: data.name.trim() }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      updatedAt: new Date(),
      updatedBy: data.updatedBy,
    }

    this.activities[activityIndex] = updatedActivity
    return updatedActivity
  }

  async delete(id: string): Promise<boolean> {
    const activityIndex = this.activities.findIndex(act => act.id === id)
    if (activityIndex === -1) {
      return false
    }

    this.activities.splice(activityIndex, 1)
    return true
  }

  async exists(id: string): Promise<boolean> {
    return this.activities.some(act => act.id === id)
  }
}
