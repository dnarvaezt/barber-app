import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContent } from '../../../components/layout/components'
import { RouteIds, useRoutes } from '../../../routes'
import './invoice-form.scss'
import { useInvoiceForm } from './use-invoice-form.hook'

export const InvoiceForm = () => {
  const { buildRoutePath } = useRoutes()
  const {
    loading,
    error,
    successMessage,
    clients,
    activities,
    employees,
    products,
    clientId,
    services,
    productItems,
    courtesyProductId,
    comment,
    paymentMethod,
    amountReceived,
    totals,
    change,
    createdInvoice,
    setClientId,
    setComment,
    setPaymentMethod,
    setAmountReceived,
    setCourtesyProductId,
    addService,
    removeService,
    addProductItem,
    removeProductItem,
    savePending,
    finalize,
    cancel,
  } = useInvoiceForm()

  // Estado local de UI para selección de items (no afecta la lógica del hook)
  const [selectedActivityId, setSelectedActivityId] = useState<string>('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [productQty, setProductQty] = useState<number>(1)

  const onAddService = () => {
    if (selectedActivityId && selectedEmployeeId) {
      addService(selectedActivityId, selectedEmployeeId)
      setSelectedActivityId('')
      setSelectedEmployeeId('')
    }
  }

  const onAddProduct = () => {
    if (selectedProductId && productQty > 0) {
      addProductItem(selectedProductId, productQty)
      setSelectedProductId('')
      setProductQty(1)
    }
  }

  return (
    <PageContent>
      <div className='invoice-form'>
        <div className='invoice-form__header'>
          <Typography.Title level={3} className='invoice-form__title'>
            Nueva Factura
          </Typography.Title>
          <Link to={buildRoutePath(RouteIds.INVOICES) || '/invoices'}>
            <Button>Volver</Button>
          </Link>
        </div>

        <Card style={{ width: '100%' }}>
          <Space direction='vertical' size='large' style={{ width: '100%' }}>
            {error && <Alert showIcon type='error' message={error} />}
            {successMessage && (
              <Alert showIcon type='success' message={successMessage} />
            )}

            {/* Cliente */}
            <Form layout='vertical' component={false} disabled={loading}>
              <Form.Item label='Cliente' required>
                <Select
                  size='large'
                  placeholder='Selecciona un cliente'
                  value={clientId || ''}
                  onChange={value => setClientId(value)}
                  options={[
                    { label: 'Selecciona un cliente', value: '' },
                    ...clients.map(c => ({ label: c.label, value: c.value })),
                  ]}
                  showSearch
                  optionFilterProp='label'
                />
              </Form.Item>

              {/* Servicios */}
              <Divider plain>Servicios</Divider>
              <Space style={{ width: '100%' }} wrap>
                <Select
                  size='large'
                  placeholder='Selecciona un servicio'
                  value={selectedActivityId || ''}
                  onChange={value => setSelectedActivityId(value)}
                  options={[
                    { label: 'Selecciona un servicio', value: '' },
                    ...activities.map(a => ({
                      label: a.label,
                      value: a.value,
                    })),
                  ]}
                  style={{ minWidth: 220 }}
                  showSearch
                  optionFilterProp='label'
                />
                <Select
                  size='large'
                  placeholder='Selecciona empleado'
                  value={selectedEmployeeId || ''}
                  onChange={value => setSelectedEmployeeId(value)}
                  options={[
                    { label: 'Selecciona empleado', value: '' },
                    ...employees.map(e => ({ label: e.label, value: e.value })),
                  ]}
                  style={{ minWidth: 220 }}
                  showSearch
                  optionFilterProp='label'
                />
                <Button
                  type='default'
                  onClick={onAddService}
                  disabled={loading}
                >
                  Agregar Servicio
                </Button>
              </Space>
              {services.length > 0 && (
                <List
                  style={{ marginTop: 12 }}
                  bordered
                  dataSource={services}
                  renderItem={(s, idx) => (
                    <List.Item
                      actions={[
                        <Button
                          key='remove'
                          danger
                          size='small'
                          onClick={() => removeService(idx)}
                        >
                          Quitar
                        </Button>,
                      ]}
                    >
                      <Space direction='vertical' size={2}>
                        <Typography.Text>{s.activityName}</Typography.Text>
                        <Space size='small'>
                          <Tag color='blue'>Empleado: {s.employeeId}</Tag>
                          <Tag color='green'>${s.price.toLocaleString()}</Tag>
                        </Space>
                      </Space>
                    </List.Item>
                  )}
                />
              )}

              {/* Productos */}
              <Divider plain>Productos</Divider>
              <Space style={{ width: '100%' }} wrap>
                <Select
                  size='large'
                  placeholder='Selecciona un producto'
                  value={selectedProductId || ''}
                  onChange={value => setSelectedProductId(value)}
                  options={[
                    { label: 'Selecciona un producto', value: '' },
                    ...products.map(p => ({ label: p.label, value: p.value })),
                  ]}
                  style={{ minWidth: 240 }}
                  showSearch
                  optionFilterProp='label'
                />
                <InputNumber
                  size='large'
                  min={1}
                  value={productQty}
                  onChange={v => setProductQty(typeof v === 'number' ? v : 1)}
                />
                <Button
                  type='default'
                  onClick={onAddProduct}
                  disabled={loading}
                >
                  Agregar Producto
                </Button>
              </Space>
              {productItems.length > 0 && (
                <List
                  style={{ marginTop: 12 }}
                  bordered
                  dataSource={productItems}
                  renderItem={(p, idx) => (
                    <List.Item
                      actions={[
                        <Button
                          key='remove'
                          danger
                          size='small'
                          onClick={() => removeProductItem(idx)}
                        >
                          Quitar
                        </Button>,
                      ]}
                    >
                      <Space direction='vertical' size={2}>
                        <Typography.Text>{p.name}</Typography.Text>
                        <Typography.Text type='secondary'>
                          {p.quantity} x ${p.unitPrice.toLocaleString()} = $
                          {(p.unitPrice * p.quantity).toLocaleString()}
                        </Typography.Text>
                      </Space>
                    </List.Item>
                  )}
                />
              )}

              {/* Cortesía */}
              <Divider plain>Producto de Cortesía (1 máx)</Divider>
              <Form.Item>
                <Select
                  size='large'
                  placeholder='Sin cortesía'
                  value={courtesyProductId || ''}
                  onChange={value =>
                    setCourtesyProductId((value as string) || undefined)
                  }
                  options={[
                    { label: 'Sin cortesía', value: '' },
                    ...products.map(p => ({ label: p.label, value: p.value })),
                  ]}
                  showSearch
                  optionFilterProp='label'
                />
              </Form.Item>

              {/* Pago */}
              <Divider plain>Pago</Divider>
              <Space
                style={{ width: '100%' }}
                direction='vertical'
                size='middle'
              >
                <Select
                  size='large'
                  value={paymentMethod}
                  onChange={value => setPaymentMethod(value as any)}
                  options={[
                    { label: 'Transferencia', value: 'TRANSFER' },
                    { label: 'Efectivo', value: 'CASH' },
                  ]}
                />
                {paymentMethod === 'CASH' && (
                  <Space align='center' wrap>
                    <InputNumber
                      size='large'
                      min={0}
                      placeholder='Monto recibido'
                      value={
                        typeof amountReceived === 'number'
                          ? amountReceived
                          : undefined
                      }
                      onChange={v =>
                        setAmountReceived(typeof v === 'number' ? v : '')
                      }
                    />
                    <Typography.Text>
                      Devuelta:{' '}
                      <Tag color='gold'>${change.toLocaleString()}</Tag>
                    </Typography.Text>
                  </Space>
                )}
              </Space>

              {/* Comentario */}
              <Divider plain>Comentario</Divider>
              <Form.Item>
                <Input.TextArea
                  rows={3}
                  placeholder='Agrega un comentario opcional'
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </Form.Item>

              {/* Totales */}
              <Divider plain>Totales</Divider>
              <Space direction='vertical' size={4} style={{ width: '100%' }}>
                <Typography.Text>
                  Servicios: ${totals.servicesTotal.toLocaleString()}
                </Typography.Text>
                <Typography.Text>
                  Productos: ${totals.productsTotal.toLocaleString()}
                </Typography.Text>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  Total: ${totals.grandTotal.toLocaleString()}
                </Typography.Title>
              </Space>

              {/* Acciones */}
              <Divider />
              <Space style={{ width: '100%' }} wrap>
                <Button onClick={savePending} disabled={loading}>
                  Guardar (Pendiente)
                </Button>
                <Button type='primary' onClick={finalize} disabled={loading}>
                  Finalizar
                </Button>
                <Button danger onClick={cancel} disabled={loading}>
                  Cancelar
                </Button>
              </Space>

              {createdInvoice && (
                <Typography.Paragraph
                  type='secondary'
                  style={{ marginTop: 12 }}
                >
                  ID Factura: {createdInvoice.id} — Estado:{' '}
                  {createdInvoice.status}
                </Typography.Paragraph>
              )}
            </Form>
          </Space>
        </Card>
      </div>
    </PageContent>
  )
}
