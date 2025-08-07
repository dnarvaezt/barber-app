import type { PaginatedResponse, PaginationParams } from '../common'
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from './activity.model'

export interface ActivityRepository {
  findAll(pagination: PaginationParams): Promise<PaginatedResponse<Activity>>
  findById(
    id: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>>
  find(
    searchTerm: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>>
  findByCategory(
    categoryId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<Activity>>
  create(data: CreateActivityRequest): Promise<Activity>
  update(data: UpdateActivityRequest): Promise<Activity>
  delete(id: string): Promise<boolean>
  exists(id: string): Promise<boolean>
}
