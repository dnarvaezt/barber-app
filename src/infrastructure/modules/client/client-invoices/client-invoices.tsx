import {
  Alert,
  Pagination as AntPagination,
  Button,
  Card,
  DatePicker,
  Empty,
  Grid,
  List,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { PaginationParams } from '../../../../application/domain/common'
import type {
  ClientInvoiceFilters,
  Invoice,
} from '../../../../application/domain/invoice/invoice.model'
import { invoiceService } from '../../../../application/domain/invoice/invoice.provider'
import { PageContent } from '../../../components/layout/components/page-content'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useUtils } from '../../../hooks/use-utils.hook'
import { RouteIds, useRoutes } from '../../../routes'
import './client-invoices.scss'

type Filters = {
  dateFrom: string
  dateTo: string
  status: 'PENDING' | 'FINALIZED' | 'CANCELED' | 'ALL'
}

export const ClientInvoicesPage = () => {
  const params = useParams<{ clientId: string }>()
  const clientId = params.clientId as string
  const { formatDateTime, formatCurrency } = useUtils()
  const { buildRoutePathWithParams } = useRoutes()
  const screens = Grid.useBreakpoint()

  const load = useCallback(
    async (pagination: PaginationParams, filters: Partial<Filters>) => {
      if (!filters.dateFrom || !filters.dateTo) {
        return {
          data: [],
          meta: {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }
      }

      const domainFilters: ClientInvoiceFilters = {
        dateFrom: new Date(filters.dateFrom),
        dateTo: new Date(filters.dateTo),
        status: (filters.status as Filters['status']) ?? 'ALL',
      }

      return invoiceService.getByClient(clientId, domainFilters, {
        ...pagination,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
    },
    [clientId]
  )

  const list = usePaginatedList<Invoice, Filters>({
    loadEntities: load,
    urlConfig: {
      filters: {
        dateFrom: { type: 'string', defaultValue: '' },
        dateTo: { type: 'string', defaultValue: '' },
        status: { type: 'string', defaultValue: 'ALL' },
      },
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: 10 },
        sortBy: { defaultValue: 'createdAt' },
        sortOrder: { defaultValue: 'desc' },
      },
    },
  })

  // Prefijar rango por defecto (últimos 30 días) si no hay filtros en URL
  useEffect(() => {
    const toISO = (d: Date) => d.toISOString().slice(0, 10)
    if (!list.filters.dateFrom || !list.filters.dateTo) {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 29)
      list.updateFilters({ dateFrom: toISO(start), dateTo: toISO(end) })
    }
  }, [list.filters.dateFrom, list.filters.dateTo, list])

  const totals = useMemo(() => {
    const totalAmount = list.data.reduce(
      (sum, inv) => sum + (inv.totals?.grandTotal || 0),
      0
    )
    return {
      totalAmount,
      count: list.meta.total,
    }
  }, [list.data, list.meta.total])

  const handleClearFilters = () => {
    list.clearFilters()
  }

  return (
    <PageContent>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Space
          align='center'
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            Facturas del Cliente
          </Typography.Title>
          <Link
            to={buildRoutePathWithParams(RouteIds.CLIENT_DETAIL, { clientId })}
          >
            <Button type='default'>← Volver al detalle</Button>
          </Link>
        </Space>

        <Card>
          <Space
            direction={screens.md ? 'horizontal' : 'vertical'}
            style={{ width: '100%' }}
          >
            <Space
              direction='vertical'
              style={{ width: screens.md ? 240 : '100%' }}
            >
              <Typography.Text type='secondary'>Desde</Typography.Text>
              <DatePicker
                style={{ width: '100%' }}
                value={
                  list.filters.dateFrom
                    ? dayjs(list.filters.dateFrom)
                    : undefined
                }
                onChange={value => {
                  const toISO = (d: Date) => d.toISOString().slice(0, 10)
                  list.updateFilters({
                    dateFrom: value ? toISO(value.toDate()) : '',
                  })
                }}
              />
            </Space>
            <Space
              direction='vertical'
              style={{ width: screens.md ? 240 : '100%' }}
            >
              <Typography.Text type='secondary'>Hasta</Typography.Text>
              <DatePicker
                style={{ width: '100%' }}
                value={
                  list.filters.dateTo ? dayjs(list.filters.dateTo) : undefined
                }
                onChange={value => {
                  const toISO = (d: Date) => d.toISOString().slice(0, 10)
                  list.updateFilters({
                    dateTo: value ? toISO(value.toDate()) : '',
                  })
                }}
              />
            </Space>
            <Space
              direction='vertical'
              style={{ width: screens.md ? 200 : '100%' }}
            >
              <Typography.Text type='secondary'>Estado</Typography.Text>
              <Select
                value={(list.filters.status as Filters['status']) || 'ALL'}
                onChange={value =>
                  list.updateFilters({ status: value as Filters['status'] })
                }
                options={[
                  { value: 'ALL', label: 'Todos' },
                  { value: 'PENDING', label: 'Pendiente' },
                  { value: 'FINALIZED', label: 'Finalizada' },
                  { value: 'CANCELED', label: 'Cancelada' },
                ]}
              />
            </Space>
            <Space wrap>
              <Button
                onClick={() => {
                  const toISO = (d: Date) => d.toISOString().slice(0, 10)
                  const today = toISO(new Date())
                  list.updateFilters({ dateFrom: today, dateTo: today })
                }}
              >
                Hoy
              </Button>
              <Button
                onClick={() => {
                  const toISO = (d: Date) => d.toISOString().slice(0, 10)
                  const end = new Date()
                  const start = new Date()
                  start.setDate(end.getDate() - 6)
                  list.updateFilters({
                    dateFrom: toISO(start),
                    dateTo: toISO(end),
                  })
                }}
              >
                Últimos 7 días
              </Button>
              <Button onClick={handleClearFilters}>Limpiar filtros</Button>
            </Space>
          </Space>
        </Card>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Text>Facturas: {totals.count}</Typography.Text>
          <Typography.Text>
            Total facturado: {formatCurrency(totals.totalAmount)}
          </Typography.Text>
        </Space>

        {list.loading && (
          <Card>
            <Spin tip='Cargando...'>
              <div style={{ minHeight: 80 }} />
            </Spin>
          </Card>
        )}

        {list.error && <Alert type='error' message={list.error} showIcon />}

        {!list.loading && !list.error && list.data.length === 0 && (
          <Card>
            <Empty description='No hay facturas para el período seleccionado.' />
          </Card>
        )}

        {!list.loading && !list.error && list.data.length > 0 && (
          <Card>
            <List
              itemLayout={screens.md ? 'horizontal' : 'vertical'}
              dataSource={list.data}
              renderItem={inv => (
                <List.Item
                  key={inv.id}
                  actions={[
                    <Link
                      key='detail'
                      to={buildRoutePathWithParams(RouteIds.INVOICE_DETAIL, {
                        invoiceId: inv.id,
                      })}
                    >
                      <Button type='link'>Ver detalle</Button>
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space wrap>
                        <Typography.Text strong>ID:</Typography.Text>
                        <Typography.Text code>{inv.id}</Typography.Text>
                        <Tag
                          color={
                            inv.status === 'FINALIZED'
                              ? 'green'
                              : inv.status === 'PENDING'
                                ? 'blue'
                                : 'red'
                          }
                        >
                          {inv.status}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction='vertical' size={4}>
                        <Typography.Text>
                          <strong>Fecha:</strong>{' '}
                          {formatDateTime(inv.createdAt)}
                        </Typography.Text>
                        <Typography.Text>
                          <strong>Método de pago:</strong> {inv.payment.method}
                        </Typography.Text>
                      </Space>
                    }
                  />
                  <Space direction='vertical' style={{ minWidth: 200 }}>
                    <Typography.Text>
                      Servicios: {formatCurrency(inv.totals.servicesTotal)}
                    </Typography.Text>
                    <Typography.Text>
                      Productos: {formatCurrency(inv.totals.productsTotal)}
                    </Typography.Text>
                    <Typography.Text strong>
                      Total: {formatCurrency(inv.totals.grandTotal)}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        )}

        <AntPagination
          current={list.meta.page}
          pageSize={list.meta.limit}
          total={list.meta.total}
          showSizeChanger
          responsive
          onChange={(page, pageSize) =>
            list.updatePagination({ page, limit: pageSize })
          }
        />
      </Space>
    </PageContent>
  )
}
