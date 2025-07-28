import { clientMockData } from './client.mock.data'
import { ClientRepositoryMemory } from './client.repository.memory'
import { ClientService } from './client.service'

export const clientService = new ClientService(
  new ClientRepositoryMemory(clientMockData)
)
