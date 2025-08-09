import { useCallback, useEffect, useRef } from 'react'
import type { Activity } from '../../../../application/domain/activity'
import { activityService } from '../../../../application/domain/activity/activity.provider'
import { useEntityForm } from '../../../hooks/use-entity-form.hook'
import { useValidation } from '../../../hooks/use-validation.hook'
import { RouteIds } from '../../../routes'

export const useActivityForm = () => {
  const { validateActivityForm } = useValidation()

  // Función para cargar una actividad usando el servicio
  const loadActivity = useCallback(
    async (id: string): Promise<Activity | null> => {
      try {
        const response = await activityService.getActivityById(id, {
          page: 1,
          limit: 1,
        })
        return response.data[0] || null
      } catch (error) {
        console.error('Error loading activity:', error)
        return null
      }
    },
    []
  )

  const config = {
    entityName: 'actividad',
    entityIdParam: 'activityId',
    editRouteId: RouteIds.ACTIVITY_FORM_EDIT,
    detailRouteId: RouteIds.ACTIVITY_DETAIL,
    listRouteId: RouteIds.ACTIVITIES,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadActivity,
    validateForm: validateActivityForm,
    errorMessages: {
      notFound: 'Actividad no encontrada',
      loadError: 'Error al cargar la actividad',
      saveError: 'Error al guardar la actividad',
    },
  }

  const entityForm = useEntityForm<Activity>(config)
  const entityFormRef = useRef(entityForm)
  entityFormRef.current = entityForm

  // Configurar formData inicial para actividades
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (!currentEntityForm.isEditing && !currentEntityForm.formData.name) {
      currentEntityForm.setFormData({
        name: '',
        price: '',
        categoryId: '',
      })
    }
  }, [entityForm.isEditing, entityForm.setFormData])

  // Configurar formData cuando se carga una actividad para editar
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (currentEntityForm.entity && currentEntityForm.isEditing) {
      currentEntityForm.setFormData({
        name: currentEntityForm.entity.name,
        price: currentEntityForm.entity.price.toString(),
        categoryId: currentEntityForm.entity.categoryId,
      })
    }
  }, [entityForm.entity, entityForm.isEditing, entityForm.setFormData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      const saveActivity = async (): Promise<string> => {
        try {
          if (entityForm.isEditing) {
            // Actualizar actividad existente
            const updatedActivity = await activityService.updateActivity({
              id: entityForm.entity!.id,
              name: entityForm.formData.name.trim(),
              price: Number(entityForm.formData.price),
              categoryId: entityForm.formData.categoryId,
              updatedBy: 'admin_001',
            })
            return updatedActivity.id
          } else {
            // Crear nueva actividad
            const newActivity = await activityService.createActivity({
              name: entityForm.formData.name.trim(),
              price: Number(entityForm.formData.price),
              categoryId: entityForm.formData.categoryId,
              createdBy: 'admin_001',
            })
            return newActivity.id
          }
        } catch (error) {
          console.error('Error saving activity:', error)
          throw error
        }
      }

      await entityForm.handleSubmit(e, saveActivity)
    },
    [entityForm]
  )

  return {
    ...entityForm,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidActivity: entityForm.isValidEntity,
    activity: entityForm.entity,
    handleSubmit,
    handleDelete: useCallback(async () => {
      try {
        if (!entityForm.isEditing || !entityForm.entity) return
        const deleted = await activityService.deleteActivity(
          (entityForm.entity as Activity).id
        )
        if (deleted) {
          entityForm.handleCancel()
        }
      } catch (error) {
        console.error('Error deleting activity:', error)
        throw error
      }
    }, [entityForm]),
  }
}
