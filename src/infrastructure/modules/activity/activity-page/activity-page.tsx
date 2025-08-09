import {
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Empty,
  Flex,
  Grid,
  Input,
  List,
  Modal,
  Space,
  Spin,
  Typography,
  message,
} from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageContent } from '../../../components/layout/components/page-content'
import { Pagination } from '../../../components/pagination'
import { SortControls } from '../../../components/sort-controls'
import { RouteIds, useRoutes } from '../../../routes'
import { useActivityPage } from './activity-page.hook'
import './activity-page.scss'

export const ActivityPage = () => {
  const screens = Grid.useBreakpoint()
  const { buildRoutePathWithParams } = useRoutes()
  const {
    activities,
    loading,
    error,
    refresh,
    pagination,
    totalPages,
    total,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    deleteActivity,
    formatDate,
  } = useActivityPage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Eliminar actividad',
      icon: <ExclamationCircleOutlined />,
      content: '¿Estás seguro de que quieres eliminar esta actividad?',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await deleteActivity(id)
          message.success('Actividad eliminada')
        } catch (err) {
          console.error('Error deleting activity:', err)
          message.error('Error al eliminar la actividad')
        }
      },
    })
  }

  const formatPhone = () => '' // No aplica para actividades
  const getAge = () => 0 // No aplica para actividades
  const getMonthName = () => '' // No aplica para actividades

  if (loading) {
    return (
      <PageContent>
        <div className='activity-page'>
          <div className='activity-page__content'>
            <Spin tip='Cargando actividades...'>
              <div style={{ width: '100%', padding: 24, minHeight: 120 }}>
                <Flex
                  align='center'
                  justify='center'
                  style={{ width: '100%' }}
                />
              </div>
            </Spin>
          </div>
        </div>
      </PageContent>
    )
  }

  if (error) {
    return (
      <PageContent>
        <div className='activity-page'>
          <div className='activity-page__content'>
            <Space
              direction='vertical'
              align='center'
              style={{ width: '100%' }}
            >
              <Alert
                message='Ocurrió un error al cargar actividades'
                description={error}
                type='error'
                showIcon
              />
              <Button
                type='primary'
                onClick={refresh}
                icon={<ReloadOutlined />}
              >
                Reintentar
              </Button>
            </Space>
          </div>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <div className='activity-page'>
        <div className='activity-page__content'>
          {/* Header */}
          <Flex
            className='activity-page__header'
            align='center'
            justify='space-between'
            vertical={!screens.md}
            gap={8}
          >
            <div className='activity-page__title-section'>
              <Typography.Title level={3} className='activity-page__title'>
                Actividades
              </Typography.Title>
              <Typography.Text
                type='secondary'
                className='activity-page__subtitle'
              >
                Gestiona las actividades del barber shop
              </Typography.Text>
            </div>
            <div className='activity-page__actions'>
              <Link to='/activities/form/new'>
                <Button type='primary' icon={<PlusOutlined />}>
                  Nueva Actividad
                </Button>
              </Link>
            </div>
          </Flex>

          {/* Toolbar */}
          <Space
            direction='vertical'
            size='middle'
            className='activity-page__filters'
            style={{ width: '100%' }}
          >
            <Flex
              align='center'
              gap={8}
              wrap
              vertical={!screens.md}
              className='activity-page__search-section'
            >
              <Input
                size='middle'
                placeholder='Buscar actividades...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                allowClear
                prefix={<SearchOutlined />}
              />
              {searchTerm && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => setSearchTerm('')}
                >
                  Limpiar
                </Button>
              )}
            </Flex>

            <div className='activity-page__sort-section'>
              <SortControls
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSortChange={(nextSortBy, nextSortOrder) => {
                  setSortBy(nextSortBy)
                  setSortOrder(nextSortOrder)
                }}
                className='activity-page__sort-controls'
              />
            </div>
          </Space>

          {/* List Section */}
          <div className='activity-page__list-section'>
            {activities.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    {searchTerm
                      ? 'No se encontraron actividades con ese término de búsqueda'
                      : 'Aún no se han creado actividades. Crea la primera actividad para comenzar.'}
                  </span>
                }
              >
                {!searchTerm && (
                  <Link to='/activities/form/new'>
                    <Button type='primary' icon={<PlusOutlined />}>
                      Crear Primera Actividad
                    </Button>
                  </Link>
                )}
              </Empty>
            ) : (
              <List
                itemLayout='vertical'
                dataSource={activities}
                rowKey='id'
                renderItem={(activity: any) => {
                  const detailPath = buildRoutePathWithParams(
                    RouteIds.ACTIVITY_DETAIL,
                    { activityId: activity.id }
                  )
                  const priceText =
                    activity.price != null
                      ? `$${Number(activity.price).toLocaleString()}`
                      : '—'
                  return (
                    <List.Item>
                      <Link
                        to={detailPath || '#'}
                        className='activity-page__item-link'
                      >
                        <Flex align='center' justify='space-between' gap={8}>
                          <Typography.Text strong>
                            {activity.name}
                          </Typography.Text>
                          <Typography.Text>{priceText}</Typography.Text>
                        </Flex>
                      </Link>
                    </List.Item>
                  )
                }}
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='activity-page__pagination'>
              <div className='activity-page__pagination-info'>
                Mostrando {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, total)} de {total}{' '}
                actividades
              </div>
              <div className='activity-page__pagination-controls'>
                <Pagination
                  meta={pagination}
                  onPageChange={() => {
                    // La paginación se maneja automáticamente por el hook
                  }}
                  size={screens.md ? 'default' : 'small'}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContent>
  )
}
