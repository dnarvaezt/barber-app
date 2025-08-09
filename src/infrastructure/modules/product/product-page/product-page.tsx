import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  List,
  Space,
  Spin,
  Typography,
} from 'antd'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContent } from '../../../components/layout/components/page-content'
import { Pagination } from '../../../components/pagination'
import { SortControls } from '../../../components/sort-controls'
import { RouteIds, useRoutes } from '../../../routes'
import { useProductPage } from './product-page.hook'
import './product-page.scss'

export const ProductPage = () => {
  const navigate = useNavigate()
  const { buildRoutePathWithParams } = useRoutes()
  const screens = Grid.useBreakpoint()
  const {
    products,
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
    formatDate,
    formatCurrency,
  } = useProductPage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  return (
    <PageContent>
      <div className='product-page'>
        <div className='product-page__content'>
          {/* Header */}
          <Flex
            align='center'
            justify='space-between'
            vertical={!screens.md}
            gap={8}
          >
            <div>
              <Typography.Title level={3} className='product-page__title'>
                Productos
              </Typography.Title>
              <Typography.Text type='secondary'>
                Gestiona los productos del barber shop
              </Typography.Text>
            </div>
            <Link
              to={
                buildRoutePathWithParams(RouteIds.PRODUCT_FORM_NEW, {}) ||
                '/products/form/new'
              }
            >
              <Button type='primary' icon={<PlusOutlined />}>
                Nuevo Producto
              </Button>
            </Link>
          </Flex>

          {/* Toolbar */}
          <Card style={{ marginTop: 12 }}>
            <Space direction='vertical' style={{ width: '100%' }} size='middle'>
              <Input
                placeholder='Buscar productos...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                allowClear
                prefix={<SearchOutlined />}
              />
              <SortControls
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSortChange={(nextSortBy, nextSortOrder) => {
                  setSortBy(nextSortBy)
                  setSortOrder(nextSortOrder)
                }}
              />
            </Space>
          </Card>

          {/* List Section */}
          <div className='product-page__list-section'>
            {loading ? (
              <Flex
                align='center'
                justify='center'
                style={{ width: '100%', padding: 24 }}
              >
                <Spin tip='Cargando productos...'>
                  <div style={{ width: 1, height: 24 }} />
                </Spin>
              </Flex>
            ) : error ? (
              <Space direction='vertical' style={{ width: '100%' }}>
                <Alert
                  message='Ocurrió un error al cargar productos'
                  description={error}
                  type='error'
                  showIcon
                />
                <Button type='primary' onClick={refresh}>
                  Reintentar
                </Button>
              </Space>
            ) : products.length === 0 ? (
              <Card>
                <Space
                  direction='vertical'
                  align='center'
                  style={{ width: '100%' }}
                >
                  <Typography.Title level={5}>
                    No hay productos
                  </Typography.Title>
                  <Typography.Text type='secondary'>
                    {searchTerm
                      ? 'No se encontraron productos con ese término de búsqueda'
                      : 'Aún no se han creado productos. Crea el primer producto para comenzar.'}
                  </Typography.Text>
                  {!searchTerm && (
                    <Link
                      to={
                        buildRoutePathWithParams(
                          RouteIds.PRODUCT_FORM_NEW,
                          {}
                        ) || '/products/form/new'
                      }
                    >
                      <Button type='primary' icon={<PlusOutlined />}>
                        Crear Primer Producto
                      </Button>
                    </Link>
                  )}
                </Space>
              </Card>
            ) : (
              <Card>
                <List
                  itemLayout='horizontal'
                  dataSource={products}
                  rowKey='id'
                  renderItem={(prod: any) => {
                    const detailPath =
                      buildRoutePathWithParams(RouteIds.PRODUCT_DETAIL, {
                        productId: prod.id,
                      }) || `/products/${prod.id}`
                    return (
                      <List.Item
                        onClick={() => navigate(detailPath)}
                        role='link'
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            navigate(detailPath)
                          }
                        }}
                        className='product-page__list-item'
                      >
                        <List.Item.Meta
                          title={<Link to={detailPath}>{prod.name}</Link>}
                          description={
                            <Space size='small'>
                              <Typography.Text type='secondary'>
                                {prod.category}
                              </Typography.Text>
                              <Typography.Text strong>
                                {formatCurrency(prod.salePrice)}
                              </Typography.Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )
                  }}
                />
              </Card>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='product-page__pagination'>
              <div className='product-page__pagination-controls'>
                <Pagination
                  meta={pagination}
                  onPageChange={() => {
                    // La paginación se maneja automáticamente por el hook via URL state
                  }}
                  size={screens.md ? 'default' : 'small'}
                  showLimitSelector
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContent>
  )
}
