import {
  Alert,
  Pagination as AntPagination,
  Button,
  Card,
  DatePicker,
  Empty,
  Grid,
  Input,
  List,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { PaginationParams } from '../../../../application/domain/common'
import type {
  EmployeeServiceHistoryFilters,
  EmployeeServiceHistoryRecord,
} from '../../../../application/domain/invoice/invoice.model'
import { invoiceService } from '../../../../application/domain/invoice/invoice.provider'
import { PageContent } from '../../../components/layout/components/page-content'
import { usePaginatedList } from '../../../hooks/use-paginated-list.hook'
import { useUtils } from '../../../hooks/use-utils.hook'
import { RouteIds, useRoutes } from '../../../routes'
import './employee-service-history.scss'

type Filters = {
  dateFrom: string
  dateTo: string
  activityId: string | null
}

export const EmployeeServiceHistoryPage = () => {
  const params = useParams<{ employeeId: string }>()
  const employeeId = params.employeeId as string
  const { formatDateTime, formatCurrency } = useUtils()
  const { buildRoutePathWithParams } = useRoutes()
  const screens = Grid.useBreakpoint()

  const load = useCallback(
    async (pagination: PaginationParams, filters: Partial<Filters>) => {
      // Validar fechas obligatorias
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

      const domainFilters: EmployeeServiceHistoryFilters = {
        dateFrom: new Date(filters.dateFrom),
        dateTo: new Date(filters.dateTo),
        activityId: filters.activityId ?? undefined,
      }

      return invoiceService.getEmployeeServiceHistory(
        employeeId,
        domainFilters,
        {
          ...pagination,
          sortBy: 'timestamp',
          sortOrder: 'desc',
        }
      )
    },
    [employeeId]
  )

  const list = usePaginatedList<EmployeeServiceHistoryRecord, Filters>({
    loadEntities: load,
    urlConfig: {
      filters: {
        dateFrom: { type: 'string', defaultValue: '' },
        dateTo: { type: 'string', defaultValue: '' },
        activityId: { type: 'string', defaultValue: null },
      },
      pagination: {
        page: { defaultValue: 1 },
        limit: { defaultValue: 10 },
        sortBy: { defaultValue: 'timestamp' },
        sortOrder: { defaultValue: 'desc' },
      },
    },
  })

  // Prefijar rango por defecto (últimos 30 días)
  useEffect(() => {
    const toISO = (d: Date) => d.toISOString().slice(0, 10)
    if (!list.filters.dateFrom || !list.filters.dateTo) {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - 29)
      list.updateFilters({ dateFrom: toISO(start), dateTo: toISO(end) })
    }
  }, [list.filters.dateFrom, list.filters.dateTo, list])

  const totalCountText = useMemo(() => {
    return `${list.meta.total} servicios en el período`
  }, [list.meta.total])

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
            Historial de Servicios
          </Typography.Title>
          <Link
            to={buildRoutePathWithParams(RouteIds.EMPLOYEE_DETAIL, {
              employeeId,
            })}
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
              style={{ width: screens.md ? 240 : '100%' }}
            >
              <Typography.Text type='secondary'>
                Actividad (opcional)
              </Typography.Text>
              <Input
                placeholder='activityId'
                value={list.filters.activityId || ''}
                onChange={e =>
                  list.updateFilters({
                    activityId: e.target.value || null,
                  })
                }
              />
            </Space>
            <Space wrap>
              <Button onClick={handleClearFilters}>Limpiar filtros</Button>
            </Space>
          </Space>
        </Card>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Text>{totalCountText}</Typography.Text>
        </Space>

        {list.loading && (
          <Card>
            <div style={{ width: '100%' }}>
              <Typography.Text>Cargando...</Typography.Text>
            </div>
          </Card>
        )}

        {list.error && <Alert type='error' message={list.error} showIcon />}

        {!list.loading && !list.error && list.data.length === 0 && (
          <Card>
            <Empty description='No hay servicios para el período seleccionado.' />
          </Card>
        )}

        {!list.loading && !list.error && list.data.length > 0 && (
          <Card>
            <List
              itemLayout={screens.md ? 'horizontal' : 'vertical'}
              dataSource={list.data}
              renderItem={item => (
                <List.Item
                  key={`${item.invoiceId}-${item.service.activityId}-${item.timestamp.toString()}`}
                  actions={[
                    <Link
                      key='invoice'
                      to={buildRoutePathWithParams(RouteIds.INVOICE_DETAIL, {
                        invoiceId: item.invoiceId,
                      })}
                    >
                      <Button type='link'>Ver factura</Button>
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space size={8} wrap>
                        <Typography.Text strong>
                          {formatDateTime(item.timestamp)}
                        </Typography.Text>
                        <Typography.Text type='secondary'>•</Typography.Text>
                        <Typography.Text>
                          {item.service.activityName || item.service.activityId}
                        </Typography.Text>
                      </Space>
                    }
                    description={
                      <Space direction='vertical' size={4}>
                        <Typography.Text>
                          <strong>Cliente:</strong>{' '}
                          <Link
                            to={buildRoutePathWithParams(
                              RouteIds.CLIENT_DETAIL,
                              {
                                clientId: item.clientId,
                              }
                            )}
                          >
                            {item.clientId}
                          </Link>
                        </Typography.Text>
                        <Typography.Text>
                          <strong>Precio:</strong>{' '}
                          {formatCurrency(item.service.price)}
                        </Typography.Text>
                        <Typography.Text type='secondary'>
                          Factura: {item.invoiceId}
                        </Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Paginación */}
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
