import { EditOutlined, FileTextOutlined } from '@ant-design/icons'
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
import { PageContent } from '../../../components/layout/components/page-content'
import { useCategoryDetail } from './category-detail.hook'
import './category-detail.scss'

export const CategoryDetail = () => {
  const {
    loading,
    isValidating,
    isValidCategory,
    category,
    error,
    handleEdit,
    handleBack,
    formatDate,
  } = useCategoryDetail()
  const screens = Grid.useBreakpoint()
  const { Title, Text } = Typography

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el categoryId
  if (isValidating) {
    return (
      <PageContent>
        <div style={{ width: '100%' }}>
          <Spin tip='Validando categoría...' size='large'>
            <div style={{ minHeight: 120 }} />
          </Spin>
        </div>
      </PageContent>
    )
  }

  // Si el categoryId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidCategory) {
    return null
  }

  if (loading) {
    return (
      <PageContent>
        <div style={{ width: '100%' }}>
          <Spin tip='Cargando categoría...' size='large'>
            <div style={{ minHeight: 120 }} />
          </Spin>
        </div>
      </PageContent>
    )
  }

  if (error || !category) {
    return (
      <PageContent>
        <Result
          status='error'
          title='Error'
          subTitle={error || 'Categoría no encontrada'}
          extra={
            <Button
              type='primary'
              onClick={handleBack}
              icon={<FileTextOutlined />}
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
              Información de la Categoría
            </Title>
          }
        >
          <Descriptions size='small' column={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
            <Descriptions.Item label='Nombre'>
              <Text>{category.name}</Text>
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
            <Descriptions.Item label='ID de la Categoría'>
              <Text code>{category.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Fecha de Creación'>
              <Text>{formatDate(category.createdAt)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Última Actualización'>
              <Text>{formatDate(category.updatedAt)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Creado por'>
              <Text>{category.createdBy}</Text>
            </Descriptions.Item>
            <Descriptions.Item label='Actualizado por'>
              <Text>{category.updatedBy}</Text>
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
              Editar Categoría
            </Button>
          </Space>
        </Card>
      </Space>
    </PageContent>
  )
}
