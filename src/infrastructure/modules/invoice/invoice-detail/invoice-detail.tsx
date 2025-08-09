import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  List,
  Result,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { invoiceService } from '../../../../application/domain/invoice'
import { PageContent } from '../../../components/layout/components/page-content'
import { RouteIds, useRoutes } from '../../../routes'

export const InvoiceDetail = () => {
  const { invoiceId } = useParams()
  const { buildRoutePath, buildRoutePathWithParams } = useRoutes()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invoice, setInvoice] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      if (!invoiceId) return
      setLoading(true)
      setError(null)
      try {
        const res = await invoiceService.getById(invoiceId, {
          page: 1,
          limit: 1,
        })
        setInvoice(res.data[0] || null)
      } catch (e: any) {
        setError(e?.message || 'Error cargando factura')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [invoiceId])

  const back = buildRoutePath(RouteIds.INVOICES) || '/invoices'

  if (loading)
    return (
      <PageContent>
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </PageContent>
    )

  if (error)
    return (
      <PageContent>
        <Alert type='error' message={error} showIcon />
      </PageContent>
    )

  if (!invoice)
    return (
      <PageContent>
        <Result
          status='404'
          title='Factura no encontrada'
          extra={
            <Link to={back}>
              <Button icon={<ArrowLeftOutlined />}>Volver</Button>
            </Link>
          }
        />
      </PageContent>
    )

  return (
    <PageContent>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Row justify='space-between' align='middle' gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Factura {invoice.id}
            </Typography.Title>
          </Col>
          <Col xs={24} sm={'auto'}>
            <Link to={back}>
              <Button icon={<ArrowLeftOutlined />}>Volver</Button>
            </Link>
          </Col>
        </Row>

        <Card>
          <Descriptions
            size='small'
            column={{ xs: 1, sm: 1, md: 2 }}
            items={[
              {
                key: 'status',
                label: 'Estado',
                children: (
                  <Tag
                    color={
                      invoice.status === 'FINALIZED'
                        ? 'green'
                        : invoice.status === 'CANCELED'
                          ? 'red'
                          : 'gold'
                    }
                  >
                    {invoice.status}
                  </Tag>
                ),
              },
              {
                key: 'payment',
                label: 'Pago',
                children: <Tag>{invoice.payment.method}</Tag>,
              },
              {
                key: 'client',
                label: 'Cliente',
                children: (
                  <Link
                    to={buildRoutePathWithParams(RouteIds.CLIENT_DETAIL, {
                      clientId: invoice.clientId,
                    })}
                  >
                    {invoice.clientId}
                  </Link>
                ),
              },
              {
                key: 'created',
                label: 'Creada',
                children: `${new Date(
                  invoice.createdAt
                ).toLocaleString()} por ${invoice.createdBy}`,
              },
              ...(invoice.finalizedAt
                ? [
                    {
                      key: 'finalized',
                      label: 'Finalizada',
                      children: `${new Date(
                        invoice.finalizedAt
                      ).toLocaleString()} por ${invoice.finalizedBy}`,
                    } as const,
                  ]
                : []),
              ...(invoice.canceledAt
                ? [
                    {
                      key: 'canceled',
                      label: 'Cancelada',
                      children: `${new Date(
                        invoice.canceledAt
                      ).toLocaleString()} por ${invoice.canceledBy}`,
                    } as const,
                  ]
                : []),
              ...(invoice.comment
                ? [
                    {
                      key: 'comment',
                      label: 'Comentario',
                      children: invoice.comment,
                    } as const,
                  ]
                : []),
            ]}
          />
        </Card>

        <Card title='Servicios'>
          {invoice.services.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description='Sin servicios'
            />
          ) : (
            <List
              dataSource={invoice.services}
              renderItem={(s: any, idx: number) => (
                <List.Item key={idx}>
                  <Space wrap>
                    <Typography.Text strong>
                      {s.activityName || s.activityId}
                    </Typography.Text>
                    <Typography.Text type='secondary'>
                      — Empleado:
                    </Typography.Text>
                    <Link
                      to={buildRoutePathWithParams(RouteIds.EMPLOYEE_DETAIL, {
                        employeeId: s.employeeId,
                      })}
                    >
                      {s.employeeId}
                    </Link>
                    <Divider type='vertical' />
                    <Typography.Text>
                      ${s.price.toLocaleString()}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card title='Productos'>
          {invoice.products.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description='Sin productos'
            />
          ) : (
            <List
              dataSource={invoice.products}
              renderItem={(p: any, idx: number) => (
                <List.Item key={idx}>
                  <Space wrap>
                    <Typography.Text strong>
                      {p.name || p.productId}
                    </Typography.Text>
                    <Typography.Text type='secondary'>—</Typography.Text>
                    <Typography.Text>{p.quantity} x</Typography.Text>
                    <Typography.Text>
                      ${p.unitPrice.toLocaleString()} = $
                      {(p.unitPrice * p.quantity).toLocaleString()}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card title='Totales'>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Statistic
                title='Servicios'
                prefix='$'
                value={invoice.totals.servicesTotal}
                valueStyle={{ fontSize: 18 }}
                groupSeparator=','
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title='Productos'
                prefix='$'
                value={invoice.totals.productsTotal}
                valueStyle={{ fontSize: 18 }}
                groupSeparator=','
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title='Total'
                prefix='$'
                value={invoice.totals.grandTotal}
                valueStyle={{ color: '#096dd9' }}
                groupSeparator=','
              />
            </Col>
          </Row>
          {invoice.courtesyProductId && (
            <Alert
              style={{ marginTop: 12 }}
              type='info'
              message={
                <span>
                  <strong>Cortesía:</strong> {invoice.courtesyProductId}
                </span>
              }
              showIcon
            />
          )}
        </Card>
      </Space>
    </PageContent>
  )
}
