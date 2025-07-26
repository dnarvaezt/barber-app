import { useState } from 'react'
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from '../../../../application/domain/client'

interface ClientFormProps {
  client?: Client
  onSubmit: (data: CreateClientRequest | UpdateClientRequest) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export const ClientForm = ({
  client,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ClientFormProps) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    phoneNumber: client?.phoneNumber || '',
    birthDate: client?.birthDate
      ? client.birthDate.toISOString().split('T')[0]
      : '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!client

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El número de teléfono es requerido'
    } else if (!/^\+57\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'El formato debe ser +57 seguido de 10 dígitos'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de cumpleaños es requerida'
    } else {
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      if (birthDate > today) {
        newErrors.birthDate = 'La fecha de cumpleaños no puede ser en el futuro'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = {
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      birthDate: new Date(formData.birthDate),
      ...(isEditing
        ? { id: client.id, updatedBy: 'current-user' }
        : { createdBy: 'current-user' }),
    }

    await onSubmit(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h3>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Nombre */}
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Nombre Completo *
            </label>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white`}
              placeholder='Ej: Juan Pérez'
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.name}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label
              htmlFor='phoneNumber'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Número de Teléfono *
            </label>
            <input
              type='tel'
              id='phoneNumber'
              value={formData.phoneNumber}
              onChange={e => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phoneNumber
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white`}
              placeholder='Ej: +573001234567'
            />
            {errors.phoneNumber && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.phoneNumber}
              </p>
            )}
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              Formato: +57 seguido de 10 dígitos
            </p>
          </div>

          {/* Fecha de Cumpleaños */}
          <div>
            <label
              htmlFor='birthDate'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Fecha de Cumpleaños *
            </label>
            <input
              type='date'
              id='birthDate'
              value={formData.birthDate}
              onChange={e => handleInputChange('birthDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.birthDate
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white`}
            />
            {errors.birthDate && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.birthDate}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className='flex justify-end gap-3 pt-4'>
            <button
              type='button'
              onClick={onCancel}
              disabled={isSubmitting}
              className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
            >
              {isSubmitting && (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              )}
              {isEditing ? 'Actualizar' : 'Crear'} Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
