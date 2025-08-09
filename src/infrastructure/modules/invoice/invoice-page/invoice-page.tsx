import {
  Alert,
  Button,
  Card,
  DatePicker,
  Empty,
  Flex,
  Grid,
  List,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { PageContent } from '../../../components/layout/components/page-content'
import { RouteIds, useRoutes } from '../../../routes'
import { useInvoicePage } from './invoice-page.hook'
import './invoice-page.scss'

export const InvoicePage = () => {
  const screens = Grid.useBreakpoint()
  const { buildRoutePathWithParams } = useRoutes()
  const {
    loading,
    error,
    invoices,
    filters,
    setFilters,
    todayQuick,
    clearDates,
    refresh,
    formatDateTime,
  } = useInvoicePage()

  const newInvoicePath =
    buildRoutePathWithParams(RouteIds.INVOICE_FORM_NEW, {}) ||
    '/invoices/form/new'

  const getActionPath = (invoice: any) => {
    if (invoice.status === 'PENDING') {
      return buildRoutePathWithParams(RouteIds.INVOICE_FORM_EDIT, {
        invoiceId: invoice.id,
      })
    }
    return buildRoutePathWithParams(RouteIds.INVOICE_DETAIL, {
      invoiceId: invoice.id,
    })
  }

  return (
    <PageContent>
      <div className='invoice-page'>
        {/* Header */}
        <Card
          className='invoice-page__header'
          variant='borderless'
          size={screens.md ? 'default' : 'small'}
        >
          <Flex
            align='center'
            justify='space-between'
            vertical={!screens.md}
            gap={8}
          >
            <div>
              <Typography.Title level={3} className='invoice-page__title'>
                Facturas
              </Typography.Title>
            </div>
            <div>
              <Link to={newInvoicePath}>
                <Button type='primary' size={screens.md ? 'middle' : 'small'}>
                  Nueva Factura
                </Button>
              </Link>
            </div>
          </Flex>
        </Card>

        {/* Filtros */}
        <Card
          className='invoice-page__filters'
          size={screens.md ? 'default' : 'small'}
        >
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <Flex wrap gap={8} vertical={!screens.md}>
              <Space
                direction='vertical'
                size={4}
                style={{ width: screens.md ? 220 : '100%' }}
              >
                <Typography.Text type='secondary'>Estado</Typography.Text>
                <Select
                  value={filters.status}
                  onChange={value =>
                    setFilters(prev => ({ ...prev, status: value as any }))
                  }
                  options={[
                    { value: 'ALL', label: 'Todos los estados' },
                    { value: 'PENDING', label: 'Pendientes' },
                    { value: 'FINALIZED', label: 'Finalizadas' },
                    { value: 'CANCELED', label: 'Canceladas' },
                  ]}
                />
              </Space>

              <Space
                direction='vertical'
                size={4}
                style={{ width: screens.md ? 220 : '100%' }}
              >
                <Typography.Text type='secondary'>Pago</Typography.Text>
                <Select
                  value={filters.payment}
                  onChange={value =>
                    setFilters(prev => ({ ...prev, payment: value as any }))
                  }
                  options={[
                    { value: 'ALL', label: 'Todos los pagos' },
                    { value: 'TRANSFER', label: 'Transferencia' },
                    { value: 'CASH', label: 'Efectivo' },
                  ]}
                />
              </Space>

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
                    setFilters(prev => ({
                      ...prev,
                      dateFrom: (dateString as string) || undefined,
                    }))
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
                    setFilters(prev => ({
                      ...prev,
                      dateTo: (dateString as string) || undefined,
                    }))
                  }
                />
              </Space>

              <Space size={8} wrap>
                <Button
                  onClick={todayQuick}
                  size={screens.md ? 'middle' : 'small'}
                >
                  Hoy
                </Button>
                <Button
                  onClick={clearDates}
                  size={screens.md ? 'middle' : 'small'}
                >
                  Limpiar fechas
                </Button>
                <Button
                  onClick={refresh}
                  size={screens.md ? 'middle' : 'small'}
                >
                  Refrescar
                </Button>
              </Space>
            </Flex>
          </Space>
        </Card>

        {/* Lista */}
        <div className='invoice-page__list'>
          {loading ? (
            <div className='invoice-page__loading'>
              <Spin tip='Cargando facturas...'>
                <div style={{ width: '100%', padding: 24, minHeight: 120 }} />
              </Spin>
            </div>
          ) : error ? (
            <div className='invoice-page__error'>
              <Alert
                message='Ocurrió un error al cargar las facturas'
                description={error}
                type='error'
                showIcon
              />
            </div>
          ) : invoices.length === 0 ? (
            <div className='invoice-page__empty'>
              <Empty
                description='No hay facturas con los filtros actuales'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <Card size={screens.md ? 'default' : 'small'}>
              <List
                dataSource={invoices}
                renderItem={inv => (
                  <List.Item
                    key={inv.id}
                    className={`invoice-page__item invoice-page__item--${inv.status.toLowerCase()}`}
                  >
                    <Flex
                      style={{ width: '100%' }}
                      align='center'
                      justify='space-between'
                      vertical={!screens.md}
                      gap={8}
                    >
                      <Space
                        direction='vertical'
                        size={4}
                        style={{ flex: 1, minWidth: 220 }}
                      >
                        <Space size={8} wrap>
                          <Typography.Text strong>ID:</Typography.Text>
                          <Typography.Text>{inv.id}</Typography.Text>
                          <Tag
                            color={
                              inv.status === 'PENDING'
                                ? 'blue'
                                : inv.status === 'FINALIZED'
                                  ? 'green'
                                  : 'red'
                            }
                          >
                            {inv.status}
                          </Tag>
                          <Tag>{inv.payment.method}</Tag>
                        </Space>
                        <Space
                          direction={screens.md ? 'horizontal' : 'vertical'}
                          size={screens.md ? 16 : 4}
                          wrap
                        >
                          <span>
                            <Typography.Text type='secondary'>
                              Cliente:
                            </Typography.Text>{' '}
                            {inv.clientId}
                          </span>
                          <span>
                            <Typography.Text type='secondary'>
                              Creada:
                            </Typography.Text>{' '}
                            {formatDateTime(inv.createdAt)} por {inv.createdBy}
                          </span>
                        </Space>
                      </Space>

                      <Space
                        direction='vertical'
                        size={4}
                        style={{ textAlign: screens.md ? 'right' : 'left' }}
                      >
                        <div>
                          <Typography.Text type='secondary'>
                            Servicios:
                          </Typography.Text>{' '}
                          ${inv.totals.servicesTotal.toLocaleString()}
                        </div>
                        <div>
                          <Typography.Text type='secondary'>
                            Productos:
                          </Typography.Text>{' '}
                          ${inv.totals.productsTotal.toLocaleString()}
                        </div>
                        <div>
                          <Typography.Text strong>
                            Total: ${inv.totals.grandTotal.toLocaleString()}
                          </Typography.Text>
                        </div>
                      </Space>

                      <div className='invoice-page__item-actions'>
                        <Link to={getActionPath(inv)}>
                          <Button size={screens.md ? 'middle' : 'small'}>
                            {inv.status === 'PENDING'
                              ? 'Editar'
                              : 'Ver detalle'}
                          </Button>
                        </Link>
                      </div>
                    </Flex>
                  </List.Item>
                )}
                size={screens.md ? 'default' : 'small'}
              />
            </Card>
          )}
        </div>
      </div>
    </PageContent>
  )
}
