import { useCallback, useEffect, useRef } from 'react'
import type { Client } from '../../../../application/domain/client'
import { clientService } from '../../../../application/domain/client/client.provider'
import { useEntityForm } from '../../../hooks/use-entity-form.hook'
import { useValidation } from '../../../hooks/use-validation.hook'
import { RouteIds } from '../../../routes'

export const useClientForm = () => {
  const { validateClientForm } = useValidation()

  // Función para cargar un cliente usando el servicio
  const loadClient = useCallback(async (id: string): Promise<Client | null> => {
    try {
      const response = await clientService.getClientById(id, {
        page: 1,
        limit: 1,
      })
      return response.data[0] || null
    } catch (error) {
      console.error('Error loading client:', error)
      return null
    }
  }, [])

  const config = {
    entityName: 'cliente',
    entityIdParam: 'clientId',
    editRouteId: RouteIds.CLIENT_FORM_EDIT,
    detailRouteId: RouteIds.CLIENT_DETAIL,
    listRouteId: RouteIds.CLIENT,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadClient,
    validateForm: validateClientForm,
    errorMessages: {
      notFound: 'Cliente no encontrado',
      loadError: 'Error al cargar el cliente',
      saveError: 'Error al guardar el cliente',
    },
  }

  const entityForm = useEntityForm<Client>(config)
  const entityFormRef = useRef(entityForm)
  entityFormRef.current = entityForm

  // Configurar formData inicial para clientes
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (!currentEntityForm.isEditing && !currentEntityForm.formData.name) {
      currentEntityForm.setFormData({
        name: '',
        phoneNumber: '',
        birthDate: '',
      })
    }
  }, [entityForm.isEditing, entityForm.setFormData])

  // Configurar formData cuando se carga un cliente para editar
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (currentEntityForm.entity && currentEntityForm.isEditing) {
      currentEntityForm.setFormData({
        name: currentEntityForm.entity.name,
        phoneNumber: currentEntityForm.entity.phoneNumber,
        birthDate: currentEntityForm.entity.birthDate
          .toISOString()
          .split('T')[0],
      })
    }
  }, [entityForm.entity, entityForm.isEditing, entityForm.setFormData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      const saveClient = async (): Promise<string> => {
        try {
          if (entityForm.isEditing) {
            // Actualizar cliente existente
            const updatedClient = await clientService.updateClient({
              id: entityForm.entity!.id,
              name: entityForm.formData.name,
              phoneNumber: entityForm.formData.phoneNumber,
              birthDate: new Date(entityForm.formData.birthDate),
              updatedBy: 'admin_001',
            })
            return updatedClient.id
          } else {
            // Crear nuevo cliente
            const newClient = await clientService.createClient({
              name: entityForm.formData.name,
              phoneNumber: entityForm.formData.phoneNumber,
              birthDate: new Date(entityForm.formData.birthDate),
              createdBy: 'admin_001',
            })
            return newClient.id
          }
        } catch (error) {
          console.error('Error saving client:', error)
          throw error
        }
      }

      await entityForm.handleSubmit(e, saveClient)
    },
    [entityForm]
  )

  return {
    ...entityForm,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidClient: entityForm.isValidEntity,
    client: entityForm.entity,
    handleSubmit,
  }
}
