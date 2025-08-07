import { useCallback } from 'react'

export const useUtils = () => {
  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  const formatPhone = useCallback((phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 12 && cleaned.startsWith('57')) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
    }
    return phone
  }, [])

  const getAge = useCallback((birthDate: Date) => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--
    }

    return age
  }, [])

  const getBirthMonth = useCallback((birthDate: Date) => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    return months[birthDate.getMonth()]
  }, [])

  const getMonthName = useCallback((month: number) => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ]
    return months[month - 1]
  }, [])

  const getBirthMonthNumber = useCallback((date: Date) => {
    return date.getMonth() + 1
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  return {
    formatDate,
    formatPhone,
    getAge,
    getBirthMonth,
    getMonthName,
    getBirthMonthNumber,
    formatCurrency,
  }
}
