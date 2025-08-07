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

  return {
    validateRequired,
    validatePhone,
    validateBirthDate,
    validatePercentage,
    validateCategoryName,
    validateClientForm,
    validateEmployeeForm,
    validateCategoryForm,
  }
}
