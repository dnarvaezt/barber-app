import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useEffect } from 'react'
import { PageContent } from '../../../components/layout/components'
import { useCategoryForm } from './category-form.hook'
import './category-form.scss'

export const CategoryForm = () => {
  const {
    loading,
    isValidating,
    isValidCategory,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
    handleDelete,
  } = useCategoryForm()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el categoryId
  if (isValidating) {
    return (
      <PageContent>
        <Card style={{ width: '100%' }}>
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 24 }}
          >
            <Spin tip='Validando categoría...' />
          </div>
        </Card>
      </PageContent>
    )
  }

  // Si el categoryId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidCategory && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <PageContent>
        <Card style={{ width: '100%' }}>
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 24 }}
          >
            <Spin tip='Cargando categoría...' />
          </div>
        </Card>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <Card
        style={{ width: '100%' }}
        title={isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <Typography.Paragraph type='secondary' style={{ marginTop: -8 }}>
          {isEditing
            ? 'Actualiza la información de la categoría'
            : 'Completa la información para crear una nueva categoría'}
        </Typography.Paragraph>

        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {showSuccessMessage && (
            <Alert
              showIcon
              type='success'
              message={
                isEditing
                  ? '¡Categoría actualizada exitosamente!'
                  : '¡Categoría creada exitosamente!'
              }
            />
          )}

          {errors.general && (
            <Alert showIcon type='error' message={errors.general} />
          )}

          <form onSubmit={handleSubmit}>
            <Form layout='vertical' component={false}>
              <Form.Item
                label='Nombre de la categoría'
                required
                htmlFor='name'
                extra='El nombre debe tener entre 2 y 50 caracteres'
              >
                <Input
                  id='name'
                  size='large'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ingresa el nombre de la categoría'
                  allowClear
                  required
                  minLength={2}
                  maxLength={50}
                />
              </Form.Item>

              <Space style={{ width: '100%' }} wrap>
                <Button onClick={handleCancel}>Cancelar</Button>
                {isEditing && (
                  <Popconfirm
                    title='Eliminar categoría'
                    description='¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.'
                    okText='Eliminar'
                    okButtonProps={{ danger: true }}
                    cancelText='Cancelar'
                    onConfirm={handleDelete}
                  >
                    <Button danger>Eliminar</Button>
                  </Popconfirm>
                )}
                <Button htmlType='submit' type='primary' loading={loading}>
                  {isEditing ? 'Actualizar' : 'Crear'} Categoría
                </Button>
              </Space>
            </Form>
          </form>
        </Space>
      </Card>
    </PageContent>
  )
}
