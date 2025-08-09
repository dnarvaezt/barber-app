import { EditOutlined, InboxOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Descriptions,
  Grid,
  Result,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContent } from '../../../components/layout/components/page-content'
import { useProductDetail } from './product-detail.hook'
import './product-detail.scss'

export const ProductDetail = () => {
  const {
    loading,
    isValidating,
    isValidProduct,
    product,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatCurrency,
  } = useProductDetail()
  const screens = Grid.useBreakpoint()
  const { Title, Text } = Typography

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el productId
  if (isValidating) {
    return (
      <PageContent>
        <div style={{ width: '100%' }}>
          <Spin tip='Validando producto...' size='large'>
            <div style={{ minHeight: 120 }} />
          </Spin>
        </div>
      </PageContent>
    )
  }

  // Si el productId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidProduct) {
    return null
  }

  if (loading) {
    return (
      <PageContent>
        <div style={{ width: '100%' }}>
          <Spin tip='Cargando producto...' size='large'>
            <div style={{ minHeight: 120 }} />
          </Spin>
        </div>
      </PageContent>
    )
  }

  if (error || !product) {
    return (
      <PageContent>
        <Result
          status='error'
          title='Error'
          subTitle={error || 'Producto no encontrado'}
          extra={
            <Button
              type='primary'
              onClick={handleBack}
              icon={<InboxOutlined />}
            >
              Volver a la lista
            </Button>
          }
        />
      </PageContent>
    )
  }

  return (
    <PageContent>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Información del Producto
            </Title>
          }
        >
          <Descriptions size='small' column={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
            <Descriptions.Item label='Nombre'>
              <Text>{product.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Categoría'>
              <Text>{product.category}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Precio de Costo'>
              <Text>{formatCurrency(product.costPrice)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Precio de Venta'>
              <Text strong>{formatCurrency(product.salePrice)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='ID de Categoría'>
              <Text code>{product.categoryId}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Descripción del Producto
            </Title>
          }
        >
          <Descriptions size='small' column={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
            <Descriptions.Item label='Descripción'>
              <Text>{product.description}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Información del Sistema
            </Title>
          }
        >
          <Descriptions size='small' column={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
            <Descriptions.Item label='ID del Producto'>
              <Text code>{product.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Fecha de Creación'>
              <Text>{formatDate(product.createdAt)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Última Actualización'>
              <Text>{formatDate(product.updatedAt)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Creado por'>
              <Text>{product.createdBy}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Actualizado por'>
              <Text>{product.updatedBy}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              Acciones
            </Title>
          }
        >
          <Space
            direction={screens.md ? 'horizontal' : 'vertical'}
            style={{ width: '100%' }}
          >
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={handleEdit}
              block={!screens.md}
            >
              Editar Producto
            </Button>

            <Link to={`/stock/${product.id}`}>
              <Button icon={<InboxOutlined />} block={!screens.md}>
                Ver inventario
              </Button>
            </Link>
          </Space>
        </Card>
      </Space>
    </PageContent>
  )
}
