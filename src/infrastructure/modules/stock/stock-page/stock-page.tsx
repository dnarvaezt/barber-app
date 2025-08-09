import { SearchOutlined } from '@ant-design/icons'
import {
  Alert,
  Card,
  DatePicker,
  Empty,
  Flex,
  Grid,
  Input,
  List,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import type { StockMovement } from '../../../../application/domain/stock'
import { PageContent } from '../../../components/layout/components/page-content'
import { Pagination } from '../../../components/pagination'
import { RouteIds, useRoutes } from '../../../routes'
import { useStockPage } from './stock-page.hook'
import './stock-page.scss'

export const StockPage = () => {
  const screens = Grid.useBreakpoint()
  const { buildRoutePathWithParams } = useRoutes()
  const {
    movements,
    loading,
    error,
    pagination,
    total,
    totalPages,
    filters,
    setFilters,
    productsMap,
    productIdToName,
    formatDate,
  } = useStockPage()

  const renderItem = (item: StockMovement) => (
    <List.Item key={item.id} className='stock-page__list-item'>
      <List.Item.Meta
        title={
          <Link
            to={buildRoutePathWithParams(RouteIds.STOCK_MOVEMENTS, {
              productId: item.productId,
            })}
          >
            <Space size={8} wrap>
              <Typography.Text strong>
                {productIdToName[item.productId]?.name ||
                  productsMap[item.productId]?.name ||
                  item.productId}
              </Typography.Text>
              <Tag color={item.type === 'IN' ? 'green' : 'red'}>
                {item.type === 'IN' ? 'Entrada' : 'Salida'}
              </Tag>
            </Space>
          </Link>
        }
        description={
          <Space
            direction={screens.md ? 'horizontal' : 'vertical'}
            size={screens.md ? 24 : 4}
            wrap
          >
            <span>
              <Typography.Text type='secondary'>Fecha:</Typography.Text>{' '}
              {formatDate(item.date)}
            </span>
            <span>
              <Typography.Text type='secondary'>Cantidad:</Typography.Text>{' '}
              {item.quantity}
            </span>
            <span>
              <Typography.Text type='secondary'>Usuario:</Typography.Text>{' '}
              {item.userId || '—'}
            </span>
            {item.note ? (
              <span>
                <Typography.Text type='secondary'>Obs.:</Typography.Text>{' '}
                {item.note}
              </span>
            ) : null}
          </Space>
        }
      />
    </List.Item>
  )

  return (
    <PageContent>
      <div className='stock-page'>
        <div className='stock-page__container'>
          {/* Header */}
          <Card
            className='stock-page__header'
            variant='borderless'
            size={screens.md ? 'default' : 'small'}
          >
            <Flex
              align='center'
              justify='space-between'
              vertical={!screens.md}
              gap={8}
            >
              <div className='stock-page__title-section'>
                <Typography.Title level={3} className='stock-page__title'>
                  Movimientos de Stock
                </Typography.Title>
                <Typography.Text
                  type='secondary'
                  className='stock-page__subtitle'
                >
                  Visión general diaria
                </Typography.Text>
              </div>
            </Flex>
          </Card>

          {/* Filtros */}
          <Card
            className='stock-page__filters-card'
            size={screens.md ? 'default' : 'small'}
          >
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              <Flex
                wrap
                gap={8}
                vertical={!screens.md}
                className='stock-page__filters'
              >
                <Space
                  direction='vertical'
                  size={4}
                  style={{ width: screens.md ? 220 : '100%' }}
                >
                  <Typography.Text type='secondary'>Desde</Typography.Text>
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder='Selecciona fecha'
                    value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                    onChange={(_value, dateString) =>
                      setFilters({ dateFrom: (dateString as string) || '' })
                    }
                  />
                </Space>
                <Space
                  direction='vertical'
                  size={4}
                  style={{ width: screens.md ? 220 : '100%' }}
                >
                  <Typography.Text type='secondary'>Hasta</Typography.Text>
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder='Selecciona fecha'
                    value={filters.dateTo ? dayjs(filters.dateTo) : null}
                    onChange={(_value, dateString) =>
                      setFilters({ dateTo: (dateString as string) || '' })
                    }
                  />
                </Space>
                <Space
                  direction='vertical'
                  size={4}
                  style={{ width: screens.md ? 220 : '100%' }}
                >
                  <Typography.Text type='secondary'>Tipo</Typography.Text>
                  <Select
                    value={filters.type || ''}
                    onChange={value =>
                      setFilters({ type: (value || '') as 'IN' | 'OUT' | '' })
                    }
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'IN', label: 'Entrada' },
                      { value: 'OUT', label: 'Salida' },
                    ]}
                  />
                </Space>
                <Space
                  direction='vertical'
                  size={4}
                  style={{ flex: 1, minWidth: screens.md ? 240 : '100%' }}
                >
                  <Typography.Text type='secondary'>Producto</Typography.Text>
                  <Input
                    placeholder='Nombre o código'
                    value={filters.search ?? ''}
                    allowClear
                    prefix={<SearchOutlined />}
                    onChange={e => setFilters({ search: e.target.value })}
                  />
                </Space>
              </Flex>
            </Space>
          </Card>

          {/* Contenido */}
          <div className='stock-page__content'>
            {loading ? (
              <div className='stock-page__loading'>
                <Spin tip='Cargando movimientos...'>
                  <div style={{ width: '100%', padding: 24, minHeight: 120 }} />
                </Spin>
              </div>
            ) : error ? (
              <div className='stock-page__error'>
                <Alert
                  message='Ocurrió un error al cargar los movimientos'
                  description={error}
                  type='error'
                  showIcon
                />
              </div>
            ) : movements.length === 0 ? (
              <div className='stock-page__empty'>
                <Empty
                  description='Sin movimientos'
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : (
              <Card
                className='stock-page__list-card'
                size={screens.md ? 'default' : 'small'}
              >
                <List
                  className='stock-page__list'
                  dataSource={movements}
                  renderItem={renderItem}
                  size={screens.md ? 'default' : 'small'}
                />
              </Card>
            )}

            {totalPages > 1 && (
              <div className='stock-page__pagination'>
                <div className='stock-page__pagination-info'>
                  Mostrando {(pagination.page - 1) * pagination.limit + 1}-
                  {Math.min(pagination.page * pagination.limit, total)} de{' '}
                  {total}
                </div>
                <div className='stock-page__pagination-controls'>
                  <Pagination
                    meta={pagination}
                    onPageChange={() => {
                      // La paginación la maneja el hook; no se requiere acción aquí
                    }}
                    size={screens.md ? 'default' : 'small'}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContent>
  )
}
