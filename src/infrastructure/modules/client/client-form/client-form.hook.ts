import { useCallback, useEffect, useRef } from 'react'
import type { Client } from '../../../../application/domain/client'
import { useEntityForm, useMockData, useValidation } from '../../../hooks'
import { RouteIds } from '../../../routes'

export const useClientForm = () => {
  const { loadMockClient } = useMockData()
  const { validateClientForm } = useValidation()

  const config = {
    entityName: 'cliente',
    entityIdParam: 'clientId',
    editRouteId: RouteIds.CLIENT_FORM_EDIT,
    detailRouteId: RouteIds.CLIENT_DETAIL,
    listRouteId: 'client',
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadMockClient,
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
        let savedClientId: string
        if (entityForm.isEditing) {
          savedClientId = entityForm.entity!.id
        } else {
          savedClientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }

        return savedClientId
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
