import { useCallback, useEffect, useRef } from 'react'
import type { Product } from '../../../../application/domain/product'
import { productService } from '../../../../application/domain/product/product.provider'
import { useEntityForm } from '../../../hooks/use-entity-form.hook'
import { useValidation } from '../../../hooks/use-validation.hook'
import { RouteIds } from '../../../routes'

export const useProductForm = () => {
  const { validateProductForm } = useValidation()

  // Función para cargar un producto usando el servicio
  const loadProduct = useCallback(
    async (id: string): Promise<Product | null> => {
      try {
        const response = await productService.getProductById(id, {
          page: 1,
          limit: 1,
        })
        return response.data[0] || null
      } catch (error) {
        console.error('Error loading product:', error)
        return null
      }
    },
    []
  )

  const config = {
    entityName: 'producto',
    entityIdParam: 'productId',
    editRouteId: RouteIds.PRODUCT_FORM_EDIT,
    detailRouteId: RouteIds.PRODUCT_DETAIL,
    listRouteId: RouteIds.PRODUCTS,
    notFoundRouteId: RouteIds.NOT_FOUND,
    loadEntity: loadProduct,
    validateForm: validateProductForm,
    errorMessages: {
      notFound: 'Producto no encontrado',
      loadError: 'Error al cargar el producto',
      saveError: 'Error al guardar el producto',
    },
  }

  const entityForm = useEntityForm<Product>(config)
  const entityFormRef = useRef(entityForm)
  entityFormRef.current = entityForm

  // Configurar formData inicial para productos
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (!currentEntityForm.isEditing && !currentEntityForm.formData.name) {
      currentEntityForm.setFormData({
        name: '',
        description: '',
        category: '',
        costPrice: '',
        salePrice: '',
        categoryId: '',
      })
    }
  }, [entityForm.isEditing, entityForm.setFormData])

  // Configurar formData cuando se carga un producto para editar
  useEffect(() => {
    const currentEntityForm = entityFormRef.current
    if (currentEntityForm.entity && currentEntityForm.isEditing) {
      currentEntityForm.setFormData({
        name: currentEntityForm.entity.name,
        description: currentEntityForm.entity.description,
        category: currentEntityForm.entity.category,
        costPrice: currentEntityForm.entity.costPrice.toString(),
        salePrice: currentEntityForm.entity.salePrice.toString(),
        categoryId: currentEntityForm.entity.categoryId,
      })
    }
  }, [entityForm.entity, entityForm.isEditing, entityForm.setFormData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      const saveProduct = async (): Promise<string> => {
        try {
          if (entityForm.isEditing) {
            // Actualizar producto existente
            const updatedProduct = await productService.updateProduct({
              id: entityForm.entity!.id,
              name: entityForm.formData.name.trim(),
              description: entityForm.formData.description.trim(),
              category: entityForm.formData.category.trim(),
              costPrice: Number(entityForm.formData.costPrice),
              salePrice: Number(entityForm.formData.salePrice),
              categoryId: entityForm.formData.categoryId,
              updatedBy: 'admin_001',
            })
            return updatedProduct.id
          } else {
            // Crear nuevo producto
            const newProduct = await productService.createProduct({
              name: entityForm.formData.name.trim(),
              description: entityForm.formData.description.trim(),
              category: entityForm.formData.category.trim(),
              costPrice: Number(entityForm.formData.costPrice),
              salePrice: Number(entityForm.formData.salePrice),
              categoryId: entityForm.formData.categoryId,
              createdBy: 'admin_001',
            })
            return newProduct.id
          }
        } catch (error) {
          console.error('Error saving product:', error)
          throw error
        }
      }

      await entityForm.handleSubmit(e, saveProduct)
    },
    [entityForm]
  )

  return {
    ...entityForm,
    // Mapear propiedades específicas para mantener compatibilidad
    isValidProduct: entityForm.isValidEntity,
    product: entityForm.entity,
    handleSubmit,
    handleDelete: useCallback(async () => {
      try {
        if (!entityForm.isEditing || !entityForm.entity) return
        const deleted = await productService.deleteProduct(
          (entityForm.entity as Product).id
        )
        if (deleted) {
          entityForm.handleCancel()
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        throw error
      }
    }, [entityForm]),
  }
}
