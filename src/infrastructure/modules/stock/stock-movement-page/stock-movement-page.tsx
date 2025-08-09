import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { PageContent } from '../../../components/layout/components'
import { RouteIds, useRoutes } from '../../../routes'
import { useStockMovementPage } from './stock-movement-page.hook'
import './stock-movement-page.scss'

export const StockMovementPage = () => {
  const {
    product,
    movements,
    stock,
    loading,
    error,
    registerEntry,
    registerExit,
    formatDate,
    filters,
    setFilters,
    entryQuantity,
    setEntryQuantity,
    entryDate,
    setEntryDate,
    exitQuantity,
    setExitQuantity,
    exitDate,
    setExitDate,
  } = useStockMovementPage()
  const { buildRoutePathWithParams } = useRoutes()

  const columns: ColumnsType<{
    id: string
    date: Date
    type: 'IN' | 'OUT'
    quantity: number
    note?: string | null
  }> = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (value: Date) => <span>{formatDate(value)}</span>,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (value: 'IN' | 'OUT') => (value === 'IN' ? 'Entrada' : 'Salida'),
      width: 110,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 110,
      align: 'right',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Nota',
      dataIndex: 'note',
      key: 'note',
      render: (value?: string | null) => value || '-',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ]

  return (
    <PageContent>
      <div className='stock-movement'>
        <Space
          direction='vertical'
          size='middle'
          className='stock-movement__stack'
        >
          <Card>
            <div className='stock-movement__header-row'>
              <div>
                <Typography.Title level={3} className='stock-movement__title'>
                  Stock de {product?.name ?? 'Producto'}
                </Typography.Title>
                <Statistic
                  title='Stock actual'
                  value={stock}
                  className='stock-movement__stat'
                />
              </div>
              {product?.id && (
                <Link
                  to={buildRoutePathWithParams(RouteIds.PRODUCT_DETAIL, {
                    productId: product.id,
                  })}
                >
                  <Button type='link'>Ir al detalle del producto →</Button>
                </Link>
              )}
            </div>
          </Card>

          <Card size='small' title='Filtros'>
            <Form layout='vertical' component={false}>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label='Desde'>
                    <DatePicker
                      className='stock-movement__control'
                      value={filters.dateFrom ? dayjs(filters.dateFrom) : null}
                      onChange={d =>
                        setFilters({
                          dateFrom: d ? d.format('YYYY-MM-DD') : '',
                        })
                      }
                      allowClear
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label='Hasta'>
                    <DatePicker
                      className='stock-movement__control'
                      value={filters.dateTo ? dayjs(filters.dateTo) : null}
                      onChange={d =>
                        setFilters({ dateTo: d ? d.format('YYYY-MM-DD') : '' })
                      }
                      allowClear
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label='Tipo'>
                    <Select
                      placeholder='Todos'
                      className='stock-movement__control'
                      value={filters.type || undefined}
                      onChange={value =>
                        setFilters({ type: (value ?? '') as any })
                      }
                      allowClear
                      options={[
                        { label: 'Entrada', value: 'IN' },
                        { label: 'Salida', value: 'OUT' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card size='small' title='Registrar movimiento'>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Space direction='vertical' className='stock-movement__full'>
                  <Typography.Text strong>Registrar entrada</Typography.Text>
                  <Form layout='vertical' component={false}>
                    <Form.Item label='Cantidad'>
                      <InputNumber
                        min={1}
                        placeholder='Cantidad'
                        className='stock-movement__control'
                        value={
                          entryQuantity !== ''
                            ? Number.isNaN(Number(entryQuantity))
                              ? undefined
                              : Number(entryQuantity)
                            : undefined
                        }
                        onChange={value =>
                          setEntryQuantity(
                            value !== null && value !== undefined
                              ? String(value)
                              : ''
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item label='Fecha'>
                      <DatePicker
                        className='stock-movement__control'
                        value={entryDate ? dayjs(entryDate) : null}
                        onChange={d =>
                          setEntryDate(d ? d.format('YYYY-MM-DD') : '')
                        }
                        allowClear
                        inputReadOnly
                      />
                    </Form.Item>
                    <Button type='primary' onClick={registerEntry} block>
                      Guardar entrada
                    </Button>
                  </Form>
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space direction='vertical' className='stock-movement__full'>
                  <Typography.Text strong>Registrar salida</Typography.Text>
                  <Form layout='vertical' component={false}>
                    <Form.Item label='Cantidad'>
                      <InputNumber
                        min={1}
                        placeholder='Cantidad'
                        className='stock-movement__control'
                        value={
                          exitQuantity !== ''
                            ? Number.isNaN(Number(exitQuantity))
                              ? undefined
                              : Number(exitQuantity)
                            : undefined
                        }
                        onChange={value =>
                          setExitQuantity(
                            value !== null && value !== undefined
                              ? String(value)
                              : ''
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item label='Fecha'>
                      <DatePicker
                        className='stock-movement__control'
                        value={exitDate ? dayjs(exitDate) : null}
                        onChange={d =>
                          setExitDate(d ? d.format('YYYY-MM-DD') : '')
                        }
                        allowClear
                        inputReadOnly
                      />
                    </Form.Item>
                    <Button onClick={registerExit} danger block>
                      Guardar salida
                    </Button>
                  </Form>
                </Space>
              </Col>
            </Row>
          </Card>

          {loading ? (
            <Card>
              <Spin tip='Cargando movimientos...' spinning>
                <div className='stock-movement__spinner' />
              </Spin>
            </Card>
          ) : error ? (
            <Alert type='error' showIcon message={error} />
          ) : (
            <Card size='small'>
              <Table
                size='small'
                dataSource={movements}
                columns={columns}
                rowKey='id'
                pagination={false}
                scroll={{ x: true }}
                locale={{ emptyText: <Empty description='Sin movimientos' /> }}
              />
            </Card>
          )}
        </Space>
      </div>
    </PageContent>
  )
}
