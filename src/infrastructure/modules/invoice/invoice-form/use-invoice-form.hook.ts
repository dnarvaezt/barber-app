import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  Invoice,
  InvoicePayment,
  InvoiceProductItem,
  InvoiceServiceItem,
  PaymentMethod,
} from '../../../../application/domain'
import { activityService } from '../../../../application/domain/activity'
import { clientService } from '../../../../application/domain/client'
import { employeeService } from '../../../../application/domain/employee'
import { invoiceService } from '../../../../application/domain/invoice'
import { productService } from '../../../../application/domain/product'

type SelectOption = { value: string; label: string }

export const useInvoiceForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Datos maestros
  const [activities, setActivities] = useState<SelectOption[]>([])
  const [employees, setEmployees] = useState<SelectOption[]>([])
  const [products, setProducts] = useState<
    Array<SelectOption & { price: number }>
  >([])
  const [clients, setClients] = useState<SelectOption[]>([])

  // Estado de factura
  const [clientId, setClientId] = useState<string>('')
  const [services, setServices] = useState<InvoiceServiceItem[]>([])
  const [productItems, setProductItems] = useState<InvoiceProductItem[]>([])
  const [courtesyProductId, setCourtesyProductId] = useState<
    string | undefined
  >(undefined)
  const [comment, setComment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER')
  const [amountReceived, setAmountReceived] = useState<number | ''>('')

  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Cargas iniciales
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [act, emp, prod, cli] = await Promise.all([
          activityService.getAllActivities({ page: 1, limit: 100 }),
          employeeService.getAllEmployees({ page: 1, limit: 100 }),
          productService.getAllProducts({ page: 1, limit: 100 }),
          clientService.getAllClients({ page: 1, limit: 100 }),
        ])
        setActivities(
          act.data.map((a: any) => ({
            value: a.id,
            label: `${a.name} ($${a.price})`,
          }))
        )
        setEmployees(emp.data.map((e: any) => ({ value: e.id, label: e.name })))
        setProducts(
          prod.data.map((p: any) => ({
            value: p.id,
            label: `${p.name} ($${p.salePrice})`,
            price: p.salePrice,
          }))
        )
        setClients(cli.data.map((c: any) => ({ value: c.id, label: c.name })))
      } catch (e: any) {
        setError('Error cargando datos base')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Totales
  const totals = useMemo(() => {
    const servicesTotal = services.reduce((acc, s) => acc + (s.price || 0), 0)
    const productsTotal = productItems.reduce(
      (acc, p) => acc + p.unitPrice * p.quantity,
      0
    )
    const grandTotal = servicesTotal + productsTotal
    return { servicesTotal, productsTotal, grandTotal }
  }, [services, productItems])

  const change = useMemo(() => {
    if (paymentMethod !== 'CASH') return 0
    const received = typeof amountReceived === 'number' ? amountReceived : 0
    return Math.max(0, received - totals.grandTotal)
  }, [paymentMethod, amountReceived, totals.grandTotal])

  // Helpers selección
  const findActivityById = (id: string) => activities.find(a => a.value === id)
  const findEmployeeById = (id: string) => employees.find(e => e.value === id)
  const findProductById = (id: string) => products.find(p => p.value === id)

  // Mutadores de items
  const addService = (activityId: string, employeeId: string) => {
    const activity = findActivityById(activityId)
    if (!activity) return
    const priceMatch = /\((\$\d+(?:,\d{3})*)\)/.exec(activity.label)
    const price = priceMatch ? Number(priceMatch[1].replace(/[$,]/g, '')) : 0
    setServices(prev => [
      ...prev,
      {
        activityId,
        activityName: activity.label,
        employeeId,
        price,
      },
    ])
  }

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index))
  }

  const addProductItem = (productId: string, quantity: number) => {
    const product = findProductById(productId)
    if (!product) return
    setProductItems(prev => [
      ...prev,
      {
        productId,
        name: product.label,
        unitPrice: product.price,
        quantity,
      },
    ])
  }

  const removeProductItem = (index: number) => {
    setProductItems(prev => prev.filter((_, i) => i !== index))
  }

  // Validaciones
  const validate = (): string | null => {
    if (courtesyProductId && services.length === 0) {
      return 'No se puede agregar cortesía sin al menos un servicio'
    }
    for (const s of services) {
      if (!s.employeeId) return 'Cada servicio debe tener un empleado asignado'
    }
    for (const p of productItems) {
      if (p.quantity <= 0) return 'Cantidad de producto debe ser > 0'
    }
    if (paymentMethod === 'CASH') {
      const received = typeof amountReceived === 'number' ? amountReceived : -1
      if (received < 0) return 'Monto recibido inválido'
      if (received < totals.grandTotal)
        return 'Monto recibido insuficiente para cubrir el total'
    }
    return null
  }

  // Acciones
  const buildPayment = (): InvoicePayment => ({
    method: paymentMethod,
    amountReceived:
      paymentMethod === 'CASH' && typeof amountReceived === 'number'
        ? amountReceived
        : undefined,
    change: paymentMethod === 'CASH' ? change : undefined,
  })

  const savePending = useCallback(async () => {
    const msg = !clientId ? 'Debes seleccionar un cliente' : validate()
    if (msg) {
      setError(msg)
      return
    }
    setError(null)
    setLoading(true)
    try {
      if (!createdInvoice) {
        const created = await invoiceService.create({
          clientId,
          services,
          products: productItems,
          courtesyProductId,
          comment: comment || undefined,
          payment: buildPayment(),
          createdBy: 'admin_001',
        })
        setCreatedInvoice(created)
        setSuccessMessage('Factura guardada en estado pendiente')
      } else {
        const updated = await invoiceService.update({
          id: createdInvoice.id,
          clientId,
          services,
          products: productItems,
          courtesyProductId: courtesyProductId ?? null,
          comment: comment || null,
          payment: buildPayment(),
          updatedBy: 'admin_001',
        })
        setCreatedInvoice(updated)
        setSuccessMessage('Factura actualizada')
      }
    } catch (e: any) {
      setError(e?.message || 'Error al guardar factura')
    } finally {
      setLoading(false)
    }
  }, [
    createdInvoice,
    clientId,
    services,
    productItems,
    courtesyProductId,
    comment,
    paymentMethod,
    amountReceived,
    change,
  ])

  const finalize = useCallback(async () => {
    const msg = !clientId ? 'Debes seleccionar un cliente' : validate()
    if (msg) {
      setError(msg)
      return
    }
    setError(null)
    setLoading(true)
    try {
      // Asegurar persistencia antes de finalizar
      let inv = createdInvoice
      if (!inv) {
        inv = await invoiceService.create({
          clientId,
          services,
          products: productItems,
          courtesyProductId,
          comment: comment || undefined,
          payment: buildPayment(),
          createdBy: 'admin_001',
        })
        setCreatedInvoice(inv)
      }
      const finalized = await invoiceService.finalize(inv!.id, 'admin_001')
      setCreatedInvoice(finalized)
      setSuccessMessage('Factura finalizada y stock descontado')
    } catch (e: any) {
      setError(e?.message || 'Error al finalizar factura')
    } finally {
      setLoading(false)
    }
  }, [
    createdInvoice,
    clientId,
    services,
    productItems,
    courtesyProductId,
    comment,
    paymentMethod,
    amountReceived,
    change,
  ])

  const cancel = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      let inv = createdInvoice
      if (!inv) {
        inv = await invoiceService.create({
          clientId,
          services,
          products: productItems,
          courtesyProductId,
          comment: comment || undefined,
          payment: buildPayment(),
          createdBy: 'admin_001',
        })
        setCreatedInvoice(inv)
      }
      const canceled = await invoiceService.cancel(inv!.id, 'admin_001')
      setCreatedInvoice(canceled)
      setSuccessMessage('Factura cancelada')
    } catch (e: any) {
      setError(e?.message || 'Error al cancelar factura')
    } finally {
      setLoading(false)
    }
  }, [
    createdInvoice,
    clientId,
    services,
    productItems,
    courtesyProductId,
    comment,
    paymentMethod,
    amountReceived,
    change,
  ])

  return {
    loading,
    error,
    successMessage,
    // catálogo
    activities,
    employees,
    products,
    clients,
    // estado
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
    // setters
    setClientId,
    setComment,
    setPaymentMethod,
    setAmountReceived,
    setCourtesyProductId,
    // acciones de items
    addService,
    removeService,
    addProductItem,
    removeProductItem,
    // acciones principales
    savePending,
    finalize,
    cancel,
  }
}
