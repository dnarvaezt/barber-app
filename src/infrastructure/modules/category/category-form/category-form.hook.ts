import { useCallback, useEffect, useRef } from 'react'
import type { Category } from '../../../../application/domain/category'
import { categoryService } from '../../../../application/domain/category/category.provider'
import { useEntityForm } from '../../../hooks/use-entity-form.hook'
import { useValidation } from '../../../hooks/use-validation.hook'
import { RouteIds } from '../../../routes'

export const useCategoryForm = () => {
  const { validateCategoryForm } = useValidation()

  // Función para cargar una categoría usando el servicio
  const loadCategory = useCallback(
    async (id: string): Promise<Category | null> => {
      try {
        const response = await categoryService.getCategoryById(id, {
          page: 1,
          limit: 1,
        })
        return response.data[0] || null
      } catch (error) {
        console.error('Error loading category:', error)
        return null
      }
    },
    []
  )

  const config = {
    entityName: 'categoría',
    entityIdParam: 'categoryId',
    editRouteId: RouteIds.CATEGORY_FORM_EDIT,
    detailRouteId: RouteIds.CATEGORY_DETAIL,
    listRouteId: RouteIds.CATEGORIES,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadCategory,
    validateForm: validateCategoryForm,
    errorMessages: {
      notFound: 'Categoría no encontrada',
      loadError: 'Error al cargar la categoría',
      saveError: 'Error al guardar la categoría',
    },
  }

  const entityForm = useEntityForm<Category>(config)
  const entityFormRef = useRef(entityForm)
  entityFormRef.current = entityForm

  // Configurar formData inicial para categorías
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (!currentEntityForm.isEditing && !currentEntityForm.formData.name) {
      currentEntityForm.setFormData({
        name: '',
      })
    }
  }, [entityForm.isEditing, entityForm.setFormData])

  // Configurar formData cuando se carga una categoría para editar
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (currentEntityForm.entity && currentEntityForm.isEditing) {
      currentEntityForm.setFormData({
        name: currentEntityForm.entity.name,
      })
    }
  }, [entityForm.entity, entityForm.isEditing, entityForm.setFormData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      const saveCategory = async (): Promise<string> => {
        try {
          if (entityForm.isEditing) {
            // Actualizar categoría existente
            const updatedCategory = await categoryService.updateCategory({
              id: entityForm.entity!.id,
              name: entityForm.formData.name.trim(),
              updatedBy: 'admin_001',
            })
            return updatedCategory.id
          } else {
            // Crear nueva categoría
            const newCategory = await categoryService.createCategory({
              name: entityForm.formData.name.trim(),
              createdBy: 'admin_001',
            })
            return newCategory.id
          }
        } catch (error) {
          console.error('Error saving category:', error)
          throw error
        }
      }

      await entityForm.handleSubmit(e, saveCategory)
    },
    [entityForm]
  )

  return {
    ...entityForm,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidCategory: entityForm.isValidEntity,
    category: entityForm.entity,
    handleSubmit,
    handleDelete: useCallback(async () => {
      try {
        if (!entityForm.isEditing || !entityForm.entity) return
        const deleted = await categoryService.deleteCategory(
          (entityForm.entity as Category).id
        )
        if (deleted) {
          entityForm.handleCancel()
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        throw error
      }
    }, [entityForm]),
  }
}
