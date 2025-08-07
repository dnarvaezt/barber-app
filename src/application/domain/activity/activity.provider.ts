import { ActivityRepositoryMemory } from './activity.repository.memory'
import { ActivityService } from './activity.service'

// Crear instancia del repositorio
const activityRepository = new ActivityRepositoryMemory()

// Crear instancia del servicio
export const activityService = new ActivityService(activityRepository)
