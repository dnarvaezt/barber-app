import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { invoiceService } from '../../../../application/domain/invoice'
import { RouteIds, useRoutes } from '../../../routes'

const InvoiceDetail = () => {
  const { invoiceId } = useParams()
  const { buildRoutePath } = useRoutes()
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

  if (loading) return <div style={{ padding: '1rem' }}>Cargando...</div>
  if (error) return <div style={{ padding: '1rem' }}>❌ {error}</div>
  if (!invoice) return <div style={{ padding: '1rem' }}>No encontrada</div>

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Factura {invoice.id}</h1>
        <Link to={back}>Volver</Link>
      </div>

      <div>
        <p>
          <strong>Estado:</strong> {invoice.status}
        </p>
        <p>
          <strong>Pago:</strong> {invoice.payment.method}
        </p>
        <p>
          <strong>Cliente:</strong> {invoice.clientId}
        </p>
        <p>
          <strong>Creada:</strong>{' '}
          {new Date(invoice.createdAt).toLocaleString()} por {invoice.createdBy}
        </p>
        {invoice.finalizedAt && (
          <p>
            <strong>Finalizada:</strong>{' '}
            {new Date(invoice.finalizedAt).toLocaleString()} por{' '}
            {invoice.finalizedBy}
          </p>
        )}
        {invoice.canceledAt && (
          <p>
            <strong>Cancelada:</strong>{' '}
            {new Date(invoice.canceledAt).toLocaleString()} por{' '}
            {invoice.canceledBy}
          </p>
        )}
        {invoice.comment && (
          <p>
            <strong>Comentario:</strong> {invoice.comment}
          </p>
        )}
      </div>

      <h2>Servicios</h2>
      <ul>
        {invoice.services.map((s: any, idx: number) => (
          <li key={idx}>
            {s.activityName || s.activityId} — Empleado: {s.employeeId} — $
            {s.price.toLocaleString()}
          </li>
        ))}
      </ul>

      <h2>Productos</h2>
      <ul>
        {invoice.products.map((p: any, idx: number) => (
          <li key={idx}>
            {p.name || p.productId} — {p.quantity} x $
            {p.unitPrice.toLocaleString()} = $
            {(p.unitPrice * p.quantity).toLocaleString()}
          </li>
        ))}
      </ul>

      <h2>Totales</h2>
      <p>Servicios: ${invoice.totals.servicesTotal.toLocaleString()}</p>
      <p>Productos: ${invoice.totals.productsTotal.toLocaleString()}</p>
      <p>
        <strong>Total:</strong> ${invoice.totals.grandTotal.toLocaleString()}
      </p>

      {invoice.courtesyProductId && (
        <p>
          <strong>Cortesía:</strong> {invoice.courtesyProductId}
        </p>
      )}
    </div>
  )
}

export default InvoiceDetail
