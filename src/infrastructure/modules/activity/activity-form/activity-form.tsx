import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd'
import { PageContent } from 'infrastructure/components/layout/components'
import { useEffect, useState } from 'react'
import { categoryService } from '../../../../application/domain/category/category.provider'
import { useActivityForm } from './activity-form.hook'
import './activity-form.scss'

export const ActivityForm = () => {
  const {
    loading,
    isValidating,
    isValidActivity,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
    handleDelete,
  } = useActivityForm()

  const [categories, setCategories] = useState<any[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Cargar categorías para el select
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true)
      try {
        const response = await categoryService.getAllCategories({
          page: 1,
          limit: 100,
        })
        setCategories(response.data)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Mostrar loading mientras valida el activityId
  if (isValidating) {
    return (
      <div className='activity-form'>
        <div className='activity-form__container'>
          <Flex
            align='center'
            justify='center'
            vertical
            className='activity-form__loading'
          >
            <Spin size='large' />
            <Typography.Paragraph className='activity-form__loading-text'>
              Validando actividad...
            </Typography.Paragraph>
          </Flex>
        </div>
      </div>
    )
  }

  // Si el activityId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidActivity && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <div className='activity-form'>
        <div className='activity-form__container'>
          <Flex
            align='center'
            justify='center'
            vertical
            className='activity-form__loading'
          >
            <Spin size='large' />
            <Typography.Paragraph className='activity-form__loading-text'>
              Cargando actividad...
            </Typography.Paragraph>
          </Flex>
        </div>
      </div>
    )
  }

  return (
    <PageContent>
      <div className='activity-form'>
        <div className='activity-form__container'>
          <div className='activity-form__header'>
            <Typography.Title level={3} className='activity-form__title'>
              {isEditing ? 'Editar Actividad' : 'Nueva Actividad'}
            </Typography.Title>
            <Typography.Paragraph
              type='secondary'
              className='activity-form__subtitle'
            >
              {isEditing
                ? 'Actualiza la información de la actividad'
                : 'Completa la información para crear una nueva actividad'}
            </Typography.Paragraph>
          </div>

          <Card className='activity-form__form' variant='outlined'>
            {/* Mensaje de éxito */}
            {showSuccessMessage && (
              <Alert
                className='activity-form__success-message'
                message={
                  isEditing
                    ? '¡Actividad actualizada exitosamente!'
                    : '¡Actividad creada exitosamente!'
                }
                type='success'
                showIcon
              />
            )}

            {/* Mensaje de error general */}
            {errors.general && (
              <Alert
                className='activity-form__error-message'
                message={errors.general}
                type='error'
                showIcon
              />
            )}

            <Form
              layout='vertical'
              className='activity-form__form-content'
              onSubmitCapture={handleSubmit}
            >
              {/* Campo Nombre */}
              <Form.Item
                label='Nombre de la actividad'
                required
                htmlFor='name'
                help='El nombre debe tener entre 2 y 100 caracteres'
              >
                <Input
                  id='name'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ingresa el nombre de la actividad'
                  minLength={2}
                  maxLength={100}
                  aria-required
                />
              </Form.Item>

              {/* Campo Precio */}
              <Form.Item
                label='Precio'
                required
                htmlFor='price'
                help='Ingresa el precio en pesos colombianos (0 - 999,999.99)'
              >
                <Input
                  id='price'
                  type='number'
                  value={formData.price}
                  onChange={e => handleInputChange('price', e.target.value)}
                  placeholder='Ej: 25000'
                  min={0}
                  max={999999.99}
                  step={0.01}
                  inputMode='decimal'
                  aria-required
                />
              </Form.Item>

              {/* Campo Categoría */}
              <Form.Item
                label='Categoría'
                required
                htmlFor='categoryId'
                help='Selecciona la categoría a la que pertenece esta actividad'
              >
                <Select
                  id='categoryId'
                  value={formData.categoryId || undefined}
                  onChange={value => handleInputChange('categoryId', value)}
                  placeholder='Selecciona una categoría'
                  loading={loadingCategories}
                  disabled={loadingCategories}
                  options={[
                    {
                      label: 'Selecciona una categoría',
                      value: '',
                      disabled: true,
                    },
                    ...categories.map(category => ({
                      label: category.name,
                      value: category.id,
                    })),
                  ]}
                  showSearch
                  optionFilterProp='label'
                  aria-required
                />
              </Form.Item>

              {/* Botones de acción */}
              <Space wrap className='activity-form__actions'>
                <Button onClick={handleCancel}>Cancelar</Button>
                {isEditing && (
                  <Popconfirm
                    title='Eliminar actividad'
                    description='¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.'
                    okText='Eliminar'
                    okButtonProps={{ danger: true }}
                    cancelText='Cancelar'
                    onConfirm={handleDelete}
                  >
                    <Button danger>Eliminar</Button>
                  </Popconfirm>
                )}
                <Button htmlType='submit' type='primary' loading={loading}>
                  {isEditing ? 'Actualizar' : 'Crear'} Actividad
                </Button>
              </Space>
            </Form>
          </Card>
        </div>
      </div>
    </PageContent>
  )
}
