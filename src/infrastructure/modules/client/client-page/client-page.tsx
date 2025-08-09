import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Input, List, Space, Typography } from 'antd'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination, SortControls } from '../../../components'
import { PageContent } from '../../../components/layout/components'
import { RouteIds, useRoutes } from '../../../routes'
import { useClientPage } from './client-page.hook'
import './client-page.scss'

export const ClientPage = () => {
  const navigate = useNavigate()
  const { buildRoutePathWithParams } = useRoutes()
  const {
    clients,
    meta,
    searchTerm,
    sortBy,
    sortOrder,
    handleSearch,
    clearFilters,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    formatPhone,
  } = useClientPage()

  const birthDayMonth = useMemo(
    () => (date: Date | string) =>
      new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
      }),
    []
  )

  return (
    <PageContent>
      <div className='client-page'>
        <div className='client-page__content'>
          <div className='client-page__header'>
            <div className='client-page__header-content'>
              <Typography.Title level={2} className='client-page__title'>
                Gestión de Clientes
              </Typography.Title>
              <div className='client-page__header-actions'>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={() => {
                    const newClientPath = buildRoutePathWithParams(
                      RouteIds.CLIENT_FORM_NEW,
                      {}
                    )
                    if (newClientPath) {
                      navigate(newClientPath)
                    }
                  }}
                >
                  Nuevo Cliente
                </Button>
              </div>
            </div>
          </div>

          <Card className='client-page__filters'>
            <Space direction='vertical' style={{ width: '100%' }} size='middle'>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  size='middle'
                  placeholder='Buscar clientes...'
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  allowClear
                  prefix={<SearchOutlined />}
                />
                {searchTerm && (
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      clearFilters()
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </Space.Compact>

              <div className='client-page__sort-section'>
                <SortControls
                  currentSortBy={sortBy}
                  currentSortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  className='client-page__sort-controls'
                />
              </div>
            </Space>
          </Card>

          <Card className='client-page__content'>
            <div className='client-page__list-container'>
              <List
                itemLayout='horizontal'
                dataSource={clients}
                rowKey='id'
                renderItem={client => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Link
                          to={buildRoutePathWithParams(RouteIds.CLIENT_DETAIL, {
                            clientId: client.id,
                          })}
                        >
                          {client.name}
                        </Link>
                      }
                      description={
                        <span className='client-page__list-subtitle'>
                          <span className='client-page__list-phone'>
                            {formatPhone(client.phoneNumber)}
                          </span>
                          <span className='client-page__list-separator'>
                            {' '}
                            ·{' '}
                          </span>
                          <span className='client-page__list-birthdate'>
                            {birthDayMonth(client.birthDate)}
                          </span>
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>

          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            showLimitSelector={true}
          />
        </div>
      </div>
    </PageContent>
  )
}
