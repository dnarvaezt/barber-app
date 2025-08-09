import { PlusOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
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
import { Pagination, SortControls } from '../../../components'
import { PageContent } from '../../../components/layout/components/page-content'
import { RouteIds, useRoutes } from '../../../routes'
import { useCategoryPage } from './category-page.hook'
import './category-page.scss'

export const CategoryPage = () => {
  const navigate = useNavigate()
  const { buildRoutePathWithParams } = useRoutes()
  const screens = Grid.useBreakpoint()
  const {
    categories,
    loading,
    error,
    meta,
    searchTerm,
    sortBy,
    sortOrder,
    handleSearch,
    clearFilters,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    formatDate,
  } = useCategoryPage()

  useEffect(() => {
    // El componente es autónomo, no necesita configurar el header
    // El header maneja su propio estado internamente
  }, [])

  // Sin acciones de eliminación en esta vista

  if (loading) {
    return (
      <PageContent>
        <div className='category-page'>
          <div className='category-page__content'>
            <Flex
              align='center'
              justify='center'
              style={{ width: '100%', padding: 24 }}
            >
              <Spin tip='Cargando categorías...' />
            </Flex>
          </div>
        </div>
      </PageContent>
    )
  }

  if (error) {
    return (
      <PageContent>
        <div className='category-page'>
          <div className='category-page__content'>
            <Space
              direction='vertical'
              align='center'
              style={{ width: '100%' }}
            >
              <Alert
                message='Ocurrió un error al cargar categorías'
                description={error}
                type='error'
                showIcon
              />
              <Button type='primary' onClick={() => window.location.reload()}>
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
      <div className='category-page'>
        <div className='category-page__content'>
          {/* Header de la página */}
          <Flex
            className='category-page__header'
            align='center'
            justify='space-between'
            vertical={!screens.md}
            gap={8}
          >
            <Typography.Title level={3} className='category-page__title'>
              Gestión de Categorías
            </Typography.Title>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                const newCategoryPath = buildRoutePathWithParams(
                  RouteIds.CATEGORY_FORM_NEW,
                  {}
                )
                if (newCategoryPath) {
                  navigate(newCategoryPath)
                }
              }}
            >
              Nueva Categoría
            </Button>
          </Flex>

          {/* Filtros y búsqueda */}
          <Space
            direction='vertical'
            size='middle'
            className='category-page__filters'
            style={{ width: '100%' }}
          >
            <Flex
              align='center'
              gap={8}
              wrap
              vertical={!screens.md}
              className='category-page__search-section'
            >
              <Input.Search
                placeholder='Buscar categorías...'
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                onSearch={value => handleSearch(value)}
                allowClear
                enterButton
              />
              {searchTerm && (
                <Button onClick={() => clearFilters()}>Limpiar</Button>
              )}
            </Flex>

            <div className='category-page__sort-section'>
              <SortControls
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSortChange={handleSortChange}
                className='category-page__sort-controls'
              />
            </div>
          </Space>

          {/* Lista de categorías (Ant Design) */}
          <div className='category-page__content'>
            {categories.length === 0 ? (
              <Typography.Text>No se encontraron categorías.</Typography.Text>
            ) : (
              <List
                itemLayout='horizontal'
                dataSource={categories}
                renderItem={(item: any) => {
                  const detailPath = buildRoutePathWithParams(
                    RouteIds.CATEGORY_DETAIL,
                    {
                      categoryId: item.id,
                    }
                  )
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={<Link to={detailPath}>{item.name}</Link>}
                      />
                    </List.Item>
                  )
                }}
              />
            )}
          </div>

          {/* Componente de paginación */}
          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            showLimitSelector={true}
            size={screens.md ? 'default' : 'small'}
            className='category-page__pagination'
          />
        </div>
      </div>
    </PageContent>
  )
}
