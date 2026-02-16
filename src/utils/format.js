export const formatCurrency = (amount, currency = 'USD') => {
  return (amount || 0).toLocaleString('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatShortDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX')
}
