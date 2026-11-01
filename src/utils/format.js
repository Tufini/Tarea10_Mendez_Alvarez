const clp = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
})

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export const formatMoney = (amount) => clp.format(amount)

// '2026-09-05' -> '05-sep-2026'
export const formatDate = (iso) => {
  const [year, month, day] = iso.split('-')
  return `${day}-${MONTHS[Number(month) - 1]}-${year}`
}

export const sum = (items, getter) => items.reduce((total, item) => total + getter(item), 0)
