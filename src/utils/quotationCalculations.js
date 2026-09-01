export const GST_OPTIONS = [0, 5, 18, 40]

export const DEFAULT_GST_RATE = 18

export function calculateItemAmount(quantity, unitPrice, discountPercent) {
  const qty = toNonNegativeNumber(quantity)
  const price = toNonNegativeNumber(unitPrice)
  const discount = clamp(Number(discountPercent) || 0, 0, 100)

  const grossAmount = qty * price
  const discountAmount = grossAmount * (discount / 100)

  return roundCurrency(grossAmount - discountAmount)
}

export function calculateSubtotal(items = []) {
  return roundCurrency(
    items.reduce((total, item) => {
      return (
        total +
        calculateItemAmount(
          item.quantity,
          item.unit_price,
          item.discount,
        )
      )
    }, 0),
  )
}

export function calculateGST(subtotal, gstRate = DEFAULT_GST_RATE) {
  const safeSubtotal = toNonNegativeNumber(subtotal)
  const safeGstRate = getValidGstRate(gstRate)

  return roundCurrency(safeSubtotal * (safeGstRate / 100))
}

export function calculateTotal(subtotal, gst) {
  const safeSubtotal = toNonNegativeNumber(subtotal)
  const safeGST = toNonNegativeNumber(gst)

  return roundCurrency(safeSubtotal + safeGST)
}

export function calculateQuotationTotals(
  items = [],
  gstRate = DEFAULT_GST_RATE,
) {
  const subtotal = calculateSubtotal(items)
  const gst = calculateGST(subtotal, gstRate)
  const total = calculateTotal(subtotal, gst)

  return {
    subtotal,
    gst,
    total,
  }
}

function getValidGstRate(gstRate) {
  const rate = Number(gstRate)

  if (GST_OPTIONS.includes(rate)) {
    return rate
  }

  return DEFAULT_GST_RATE
}

function toNonNegativeNumber(value) {
  const number = Number(value)

  if (!Number.isFinite(number) || number < 0) {
    return 0
  }

  return number
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}