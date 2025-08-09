import { EditOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Descriptions,
  Flex,
  Grid,
  Result,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useEffect } from 'react'
import { PageContent } from '../../../components/layout/components/page-content'
import { useActivityDetail } from './activity-detail.hook'
import './activity-detail.scss'

export const ActivityDetail = () => {
  const screens = Grid.useBreakpoint()
  const {
    loading,
    isValidating,
    isValidActivity,
    activity,
    error,
    handleEdit,
    handleBack,
    formatDate,
    formatCurrency,
  } = useActivityDetail()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Mostrar loading mientras valida el activityId
  if (isValidating) {
    return (
      <PageContent>
        <div className='activity-detail-page'>
          <div className='activity-detail-page__content'>
            <Spin tip='Validando actividad...'>
              <div style={{ width: '100%', padding: 24, minHeight: 120 }} />
            </Spin>
          </div>
        </div>
      </PageContent>
    )
  }

  // Si el activityId no es válido, no mostrar nada (ya se redirigió)
  if (!isValidActivity) {
    return null
  }

  if (loading) {
    return (
      <PageContent>
        <div className='activity-detail-page'>
          <div className='activity-detail-page__content'>
            <Spin tip='Cargando actividad...'>
              <div style={{ width: '100%', padding: 24, minHeight: 120 }} />
            </Spin>
          </div>
        </div>
      </PageContent>
    )
  }

  if (error || !activity) {
    return (
      <PageContent>
        <div className='activity-detail-page'>
          <div className='activity-detail-page__content'>
            <Result
              status='error'
              title='Error'
              subTitle={error || 'Actividad no encontrada'}
              extra={
                <Button type='primary' onClick={handleBack}>
                  Volver a la lista
                </Button>
              }
            />
          </div>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <div className='activity-detail-page'>
        <div className='activity-detail-page__content'>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Typography.Title level={screens.md ? 3 : 4}>
                Información de la Actividad
              </Typography.Title>
              <Card variant='outlined'>
                <Descriptions
                  column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
                  size={screens.md ? 'default' : 'small'}
                >
                  <Descriptions.Item label='Nombre'>
                    {activity.name}
                  </Descriptions.Item>
                  <Descriptions.Item label='Precio'>
                    {formatCurrency(activity.price)}
                  </Descriptions.Item>
                  <Descriptions.Item label='ID de Categoría'>
                    <Typography.Text code>
                      {activity.categoryId}
                    </Typography.Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>

            <div>
              <Typography.Title level={screens.md ? 3 : 4}>
                Información del Sistema
              </Typography.Title>
              <Card variant='outlined'>
                <Descriptions
                  column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
                  size={screens.md ? 'default' : 'small'}
                >
                  <Descriptions.Item label='ID de la Actividad'>
                    <Typography.Text code>{activity.id}</Typography.Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Fecha de Creación'>
                    {formatDate(activity.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label='Última Actualización'>
                    {formatDate(activity.updatedAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label='Creado por'>
                    {activity.createdBy}
                  </Descriptions.Item>
                  <Descriptions.Item label='Actualizado por'>
                    {activity.updatedBy}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>

            <Flex align='center' justify='flex-end' gap={8} wrap>
              <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Editar Actividad
              </Button>
            </Flex>
          </Space>
        </div>
      </div>
    </PageContent>
  )
}
