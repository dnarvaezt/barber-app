import { useCallback } from 'react'

export const useValidation = () => {
  const validateRequired = useCallback((value: string, fieldName: string) => {
    if (!value.trim()) {
      return `${fieldName} es requerido`
    }
    return ''
  }, [])

  const validatePhone = useCallback((phone: string) => {
    if (!phone.trim()) {
      return 'El número de teléfono es requerido'
    }
    if (!/^\+57\d{10}$/.test(phone)) {
      return 'El formato debe ser +57 seguido de 10 dígitos'
    }
    return ''
  }, [])

  const validateBirthDate = useCallback((birthDate: string) => {
    if (!birthDate) {
      return 'La fecha de cumpleaños es requerida'
    }

    const date = new Date(birthDate)
    const today = new Date()

    if (date > today) {
      return 'La fecha de cumpleaños no puede ser en el futuro'
    }

    return ''
  }, [])

  const validatePercentage = useCallback((percentage: string) => {
    if (!percentage.trim()) {
      return 'El porcentaje es requerido'
    }

    const num = Number(percentage)
    if (isNaN(num)) {
      return 'El porcentaje debe ser un número'
    }

    if (num < 0 || num > 100) {
      return 'El porcentaje debe estar entre 0 y 100'
    }

    return ''
  }, [])

  const validateCategoryName = useCallback((name: string) => {
    if (!name.trim()) {
      return 'El nombre de la categoría es requerido'
    }
    if (name.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres'
    }
    if (name.trim().length > 50) {
      return 'El nombre debe tener máximo 50 caracteres'
    }
    return ''
  }, [])

  const validateActivityName = useCallback((name: string) => {
    if (!name.trim()) {
      return 'El nombre de la actividad es requerido'
    }
    if (name.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres'
    }
    if (name.trim().length > 100) {
      return 'El nombre debe tener máximo 100 caracteres'
    }
    return ''
  }, [])

  const validateActivityPrice = useCallback((price: string) => {
    if (!price.trim()) {
      return 'El precio es requerido'
    }
    const num = Number(price)
    if (isNaN(num)) {
      return 'El precio debe ser un número'
    }
    if (num < 0) {
      return 'El precio no puede ser negativo'
    }
    if (num > 999999.99) {
      return 'El precio no puede exceder 999,999.99'
    }
    return ''
  }, [])

  const validateActivityCategoryId = useCallback((categoryId: string) => {
    if (!categoryId.trim()) {
      return 'La categoría es requerida'
    }
    return ''
  }, [])

  const validateProductName = useCallback((name: string) => {
    if (!name.trim()) {
      return 'El nombre del producto es requerido'
    }
    if (name.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres'
    }
    if (name.trim().length > 100) {
      return 'El nombre debe tener máximo 100 caracteres'
    }
    return ''
  }, [])

  const validateProductDescription = useCallback((description: string) => {
    if (!description.trim()) {
      return 'La descripción del producto es requerida'
    }
    if (description.trim().length < 10) {
      return 'La descripción debe tener al menos 10 caracteres'
    }
    if (description.trim().length > 500) {
      return 'La descripción debe tener máximo 500 caracteres'
    }
    return ''
  }, [])

  const validateProductCategory = useCallback((category: string) => {
    if (!category.trim()) {
      return 'La categoría del producto es requerida'
    }
    if (category.trim().length < 2) {
      return 'La categoría debe tener al menos 2 caracteres'
    }
    if (category.trim().length > 50) {
      return 'La categoría debe tener máximo 50 caracteres'
    }
    return ''
  }, [])

  const validateProductCostPrice = useCallback((costPrice: string) => {
    if (!costPrice.trim()) {
      return 'El precio de costo es requerido'
    }
    const num = Number(costPrice)
    if (isNaN(num)) {
      return 'El precio de costo debe ser un número'
    }
    if (num < 0) {
      return 'El precio de costo no puede ser negativo'
    }
    if (num > 999999.99) {
      return 'El precio de costo no puede exceder 999,999.99'
    }
    return ''
  }, [])

  const validateProductSalePrice = useCallback((salePrice: string) => {
    if (!salePrice.trim()) {
      return 'El precio de venta es requerido'
    }
    const num = Number(salePrice)
    if (isNaN(num)) {
      return 'El precio de venta debe ser un número'
    }
    if (num < 0) {
      return 'El precio de venta no puede ser negativo'
    }
    if (num > 999999.99) {
      return 'El precio de venta no puede exceder 999,999.99'
    }
    return ''
  }, [])

  const validateProductCategoryId = useCallback((categoryId: string) => {
    if (!categoryId.trim()) {
      return 'La categoría es requerida'
    }
    return ''
  }, [])

  const validateClientForm = useCallback(
    (formData: { name: string; phoneNumber: string; birthDate: string }) => {
      const errors: Record<string, string> = {}

      const nameError = validateRequired(formData.name, 'El nombre')
      if (nameError) errors.name = nameError

      const phoneError = validatePhone(formData.phoneNumber)
      if (phoneError) errors.phoneNumber = phoneError

      const birthDateError = validateBirthDate(formData.birthDate)
      if (birthDateError) errors.birthDate = birthDateError

      return errors
    },
    [validateRequired, validatePhone, validateBirthDate]
  )

  const validateEmployeeForm = useCallback(
    (formData: {
      name: string
      phoneNumber: string
      birthDate: string
      percentage: string
    }) => {
      const errors: Record<string, string> = {}

      const nameError = validateRequired(formData.name, 'El nombre')
      if (nameError) errors.name = nameError

      const phoneError = validatePhone(formData.phoneNumber)
      if (phoneError) errors.phoneNumber = phoneError

      const birthDateError = validateBirthDate(formData.birthDate)
      if (birthDateError) errors.birthDate = birthDateError

      const percentageError = validatePercentage(formData.percentage)
      if (percentageError) errors.percentage = percentageError

      return errors
    },
    [validateRequired, validatePhone, validateBirthDate, validatePercentage]
  )

  const validateCategoryForm = useCallback(
    (formData: { name: string }) => {
      const errors: Record<string, string> = {}

      const nameError = validateCategoryName(formData.name)
      if (nameError) errors.name = nameError

      return errors
    },
    [validateCategoryName]
  )

  const validateActivityForm = useCallback(
    (formData: { name: string; price: string; categoryId: string }) => {
      const errors: Record<string, string> = {}

      const nameError = validateActivityName(formData.name)
      if (nameError) errors.name = nameError

      const priceError = validateActivityPrice(formData.price)
      if (priceError) errors.price = priceError

      const categoryIdError = validateActivityCategoryId(formData.categoryId)
      if (categoryIdError) errors.categoryId = categoryIdError

      return errors
    },
    [validateActivityName, validateActivityPrice, validateActivityCategoryId]
  )

  const validateProductForm = useCallback(
    (formData: {
      name: string
      description: string
      category: string
      costPrice: string
      salePrice: string
      categoryId: string
    }) => {
      const errors: Record<string, string> = {}

      const nameError = validateProductName(formData.name)
      if (nameError) errors.name = nameError

      const descriptionError = validateProductDescription(formData.description)
      if (descriptionError) errors.description = descriptionError

      const categoryError = validateProductCategory(formData.category)
      if (categoryError) errors.category = categoryError

      const costPriceError = validateProductCostPrice(formData.costPrice)
      if (costPriceError) errors.costPrice = costPriceError

      const salePriceError = validateProductSalePrice(formData.salePrice)
      if (salePriceError) errors.salePrice = salePriceError

      const categoryIdError = validateProductCategoryId(formData.categoryId)
      if (categoryIdError) errors.categoryId = categoryIdError

      // Validación adicional: precio de venta debe ser mayor o igual al de costo
      if (!costPriceError && !salePriceError) {
        const costPrice = Number(formData.costPrice)
        const salePrice = Number(formData.salePrice)
        if (salePrice < costPrice) {
          errors.salePrice =
            'El precio de venta no puede ser menor al precio de costo'
        }
      }

      return errors
    },
    [
      validateProductName,
      validateProductDescription,
      validateProductCategory,
      validateProductCostPrice,
      validateProductSalePrice,
      validateProductCategoryId,
    ]
  )

  return {
    validateRequired,
    validatePhone,
    validateBirthDate,
    validatePercentage,
    validateCategoryName,
    validateActivityName,
    validateActivityPrice,
    validateActivityCategoryId,
    validateProductName,
    validateProductDescription,
    validateProductCategory,
    validateProductCostPrice,
    validateProductSalePrice,
    validateProductCategoryId,
    validateClientForm,
    validateEmployeeForm,
    validateCategoryForm,
    validateActivityForm,
    validateProductForm,
  }
}
