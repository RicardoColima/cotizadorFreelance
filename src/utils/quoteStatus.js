export const QUOTE_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}

export const QUOTE_STATUS_LABELS = {
  [QUOTE_STATUSES.DRAFT]: 'Borrador',
  [QUOTE_STATUSES.SENT]: 'Enviada',
  [QUOTE_STATUSES.VIEWED]: 'Vista',
  [QUOTE_STATUSES.ACCEPTED]: 'Aceptada',
  [QUOTE_STATUSES.REJECTED]: 'Rechazada'
}

export const QUOTE_STATUS_VARIANTS = {
  [QUOTE_STATUSES.DRAFT]: 'gray',
  [QUOTE_STATUSES.SENT]: 'blue',
  [QUOTE_STATUSES.VIEWED]: 'purple',
  [QUOTE_STATUSES.ACCEPTED]: 'green',
  [QUOTE_STATUSES.REJECTED]: 'red'
}

export const getStatusLabel = (status) => QUOTE_STATUS_LABELS[status] || 'Desconocido'
export const getStatusVariant = (status) => QUOTE_STATUS_VARIANTS[status] || 'gray'
