import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CLIENT_CONFIG } from '../../../../application/core/config/entity.config'
import { clientService } from '../../../../application/domain/client/client.provider'
import { EntityList } from '../../../../infrastructure/components/entity/entity-list'
import { useEntity } from '../../../../infrastructure/hooks/use-entity.hook'
import { RouteIds } from '../../../../infrastructure/routes'

// ============================================================================
// CLIENT PAGE REFACTORED - Página refactorizada usando la nueva arquitectura
// ============================================================================

export const ClientPageRefactored = () => {
  const navigate = useNavigate()

  // ============================================================================
  // ENTITY HOOK CONFIGURATION - Configuración del hook de entidad
  // ============================================================================

  const entityState = useEntity({
    loadEntities: async (pagination, _filters, search) => {
      if (search) {
        return await clientService.findClients(search, pagination)
      }
      return await clientService.getAllClients(pagination)
    },
    urlConfig: {
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: CLIENT_CONFIG.defaultPageSize },
        sortBy: { defaultValue: CLIENT_CONFIG.defaultSortBy },
        sortOrder: { defaultValue: CLIENT_CONFIG.defaultSortOrder },
      },
      search: {
        key: 'search',
        defaultValue: '',
      },
    },
    entityConfig: {
      entityType: CLIENT_CONFIG.entityType,
      displayName: CLIENT_CONFIG.displayName,
      searchableFields: CLIENT_CONFIG.searchableFields,
      defaultSortBy: CLIENT_CONFIG.defaultSortBy,
      defaultSortOrder: CLIENT_CONFIG.defaultSortOrder,
    },
  })

  // ============================================================================
  // HANDLERS - Manejadores de eventos
  // ============================================================================

  const handleCreateClient = useCallback(() => {
    navigate(RouteIds.CLIENT_FORM_NEW)
  }, [navigate])

  const handleEditClient = useCallback(
    (client: any) => {
      navigate(`${RouteIds.CLIENT_FORM_EDIT}/${client.id}`)
    },
    [navigate]
  )

  const handleViewClient = useCallback(
    (client: any) => {
      navigate(`${RouteIds.CLIENT_DETAIL}/${client.id}`)
    },
    [navigate]
  )

  const handleDeleteClient = useCallback(
    async (client: any) => {
      if (confirm(`¿Estás seguro de que quieres eliminar a ${client.name}?`)) {
        try {
          await entityState.deleteEntity(client.id)
        } catch (error) {
          console.error('Error deleting client:', error)
        }
      }
    },
    [entityState]
  )

  // ============================================================================
  // RENDER FUNCTIONS - Funciones de renderizado
  // ============================================================================

  const renderClient = useCallback(
    (client: any) => (
      <div key={client.id} className='bg-white p-4 rounded-lg shadow-md border'>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {client.name}
            </h3>
            <p className='text-gray-600'>{client.phoneNumber}</p>
            {client.email && <p className='text-gray-500'>{client.email}</p>}
            <p className='text-sm text-gray-400'>
              Nacimiento: {new Date(client.birthDate).toLocaleDateString()}
            </p>
          </div>
          <div className='flex gap-2'>
            {CLIENT_CONFIG.permissions.read && (
              <button
                onClick={() => handleViewClient(client)}
                className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                Ver
              </button>
            )}
            {CLIENT_CONFIG.permissions.update && (
              <button
                onClick={() => handleEditClient(client)}
                className='px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600'
              >
                Editar
              </button>
            )}
            {CLIENT_CONFIG.permissions.delete && (
              <button
                onClick={() => handleDeleteClient(client)}
                className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    ),
    [handleViewClient, handleEditClient, handleDeleteClient]
  )

  const renderEmpty = useCallback(
    () => (
      <div className='text-center py-8'>
        <div className='text-gray-400 text-6xl mb-4'>👥</div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          No hay clientes registrados
        </h3>
        <p className='text-gray-500 mb-4'>
          Comienza agregando tu primer cliente para gestionar tu barbería
        </p>
        {CLIENT_CONFIG.permissions.create && (
          <button
            onClick={handleCreateClient}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Crear Primer Cliente
          </button>
        )}
      </div>
    ),
    [handleCreateClient]
  )

  const renderLoading = useCallback(
    () => (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-2 text-gray-600'>Cargando clientes...</span>
      </div>
    ),
    []
  )

  const renderError = useCallback(
    (error: string) => (
      <div className='text-center py-8'>
        <div className='text-red-400 text-6xl mb-4'>⚠️</div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          Error al cargar clientes
        </h3>
        <p className='text-red-600 mb-4'>{error}</p>
        <button
          onClick={() => entityState.refresh()}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          Reintentar
        </button>
      </div>
    ),
    [entityState]
  )

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className='client-page'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          {CLIENT_CONFIG.displayNamePlural}
        </h1>
        <p className='text-gray-600'>Gestiona los clientes de tu barbería</p>
      </div>

      <EntityList
        entityState={entityState}
        entityConfig={{
          entityType: CLIENT_CONFIG.entityType,
          displayName: CLIENT_CONFIG.displayName,
          displayNamePlural: CLIENT_CONFIG.displayNamePlural,
          searchableFields: CLIENT_CONFIG.searchableFields,
          sortableFields: CLIENT_CONFIG.sortableFields,
        }}
        renderEntity={renderClient}
        renderEmpty={renderEmpty}
        renderLoading={renderLoading}
        renderError={renderError}
        onEntityCreate={
          CLIENT_CONFIG.permissions.create ? handleCreateClient : undefined
        }
        showSearch={true}
        showSort={true}
        showPagination={true}
        showActions={true}
        className='space-y-4'
        listClassName='space-y-4'
        itemClassName=''
      />
    </div>
  )
}
