import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { categoryService } from '../../../../application/domain/category/category.provider'
import { PageContent } from '../../../components/layout/components'
import { useProductForm } from './product-form.hook'
import './product-form.scss'

export const ProductForm = () => {
  const {
    loading,
    isValidating,
    isValidProduct,
    isEditing,
    formData,
    showSuccessMessage,
    errors,
    handleSubmit,
    handleCancel,
    handleInputChange,
    handleDelete,
  } = useProductForm()

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

  // Mostrar loading mientras valida el productId
  if (isValidating) {
    return (
      <PageContent>
        <Card style={{ width: '100%' }}>
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 24 }}
          >
            <Spin tip='Validando producto...'>
              <div style={{ width: 1, height: 24 }} />
            </Spin>
          </div>
        </Card>
      </PageContent>
    )
  }

  // Si el productId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidProduct && isEditing) {
    return null
  }

  if (loading && isEditing) {
    return (
      <PageContent>
        <Card style={{ width: '100%' }}>
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: 24 }}
          >
            <Spin tip='Cargando producto...'>
              <div style={{ width: 1, height: 24 }} />
            </Spin>
          </div>
        </Card>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <Card
        style={{ width: '100%' }}
        title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <Typography.Paragraph type='secondary' style={{ marginTop: -8 }}>
          {isEditing
            ? 'Actualiza la información del producto'
            : 'Completa la información para crear un nuevo producto'}
        </Typography.Paragraph>

        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {showSuccessMessage && (
            <Alert
              showIcon
              type='success'
              message={
                isEditing
                  ? '¡Producto actualizado exitosamente!'
                  : '¡Producto creado exitosamente!'
              }
            />
          )}

          {errors.general && (
            <Alert showIcon type='error' message={errors.general} />
          )}

          <form onSubmit={handleSubmit}>
            <Form layout='vertical' component={false}>
              <Form.Item label='Nombre del producto' required htmlFor='name'>
                <Input
                  id='name'
                  size='large'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ingresa el nombre del producto'
                  allowClear
                  required
                  minLength={2}
                  maxLength={100}
                />
              </Form.Item>

              <Form.Item
                label='Descripción del producto'
                required
                htmlFor='description'
              >
                <Input.TextArea
                  id='description'
                  size='large'
                  value={formData.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Describe el producto detalladamente'
                  required
                  minLength={10}
                  maxLength={500}
                  rows={4}
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label='Categoría del producto'
                required
                htmlFor='category'
              >
                <Input
                  id='category'
                  size='large'
                  value={formData.category}
                  onChange={e => handleInputChange('category', e.target.value)}
                  placeholder='Ej: Cuidado Personal, Accesorios, etc.'
                  allowClear
                  required
                  minLength={2}
                  maxLength={50}
                />
              </Form.Item>

              <Form.Item label='Precio de Costo' required htmlFor='costPrice'>
                <Input
                  id='costPrice'
                  size='large'
                  type='number'
                  value={formData.costPrice}
                  onChange={e => handleInputChange('costPrice', e.target.value)}
                  placeholder='Ej: 15000'
                  min={0}
                  step='0.01'
                  required
                />
              </Form.Item>

              <Form.Item label='Precio de Venta' required htmlFor='salePrice'>
                <Input
                  id='salePrice'
                  size='large'
                  type='number'
                  value={formData.salePrice}
                  onChange={e => handleInputChange('salePrice', e.target.value)}
                  placeholder='Ej: 25000'
                  min={0}
                  step='0.01'
                  required
                />
              </Form.Item>

              <Form.Item label='Categoría' required htmlFor='categoryId'>
                <Select
                  id='categoryId'
                  size='large'
                  value={formData.categoryId || ''}
                  onChange={value => handleInputChange('categoryId', value)}
                  placeholder='Selecciona una categoría'
                  options={[
                    { label: 'Selecciona una categoría', value: '' },
                    ...categories.map((c: any) => ({
                      label: c.name,
                      value: c.id,
                    })),
                  ]}
                  loading={loadingCategories}
                  disabled={loadingCategories}
                  showSearch
                  optionFilterProp='label'
                  allowClear
                />
              </Form.Item>

              <Space style={{ width: '100%' }} wrap>
                <Button onClick={handleCancel}>Cancelar</Button>
                {isEditing && (
                  <Popconfirm
                    title='Eliminar producto'
                    description='¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.'
                    okText='Eliminar'
                    okButtonProps={{ danger: true }}
                    cancelText='Cancelar'
                    onConfirm={handleDelete}
                  >
                    <Button danger>Eliminar</Button>
                  </Popconfirm>
                )}
                <Button htmlType='submit' type='primary' loading={loading}>
                  {isEditing ? 'Actualizar' : 'Crear'} Producto
                </Button>
              </Space>
            </Form>
          </form>
        </Space>
      </Card>
    </PageContent>
  )
}
