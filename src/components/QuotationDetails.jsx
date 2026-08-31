import { useEffect, useState } from 'react'
import { getQuotationById } from '../services/quotationService'

function formatCurrency(amount) {
  return Number(amount).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  })
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN')
}

function QuotationDetails({ quotationId, onBack }) {
  const [quotation, setQuotation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadQuotation() {
      setLoading(true)
      setError('')

      try {
        const savedQuotation = await getQuotationById(quotationId)

        if (!cancelled) {
          setQuotation(savedQuotation)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadQuotation()

    return () => {
      cancelled = true
    }
  }, [quotationId])

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Quotations
        </button>

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">Loading quotation...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-white p-8 shadow-sm">
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              Unable to load quotation: {error}
            </p>
          </div>
        )}

        {quotation && !loading && !error && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <section className="p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Quotation {quotation.quotation_number}
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {quotation.customer_name}
                  </h1>

                  {quotation.company_name && (
                    <p className="mt-1 text-sm text-gray-500">
                      {quotation.company_name}
                    </p>
                  )}
                </div>

                <div className="text-left text-sm text-gray-500 sm:text-right">
                  <p>
                    Date:{' '}
                    <span className="font-medium text-gray-700">
                      {formatDate(quotation.quotation_date)}
                    </span>
                  </p>
                  <p className="mt-1">
                    Valid until:{' '}
                    <span className="font-medium text-gray-700">
                      {formatDate(quotation.valid_until)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-6 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Customer Details
                  </p>

                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    {quotation.company_name && <p>{quotation.company_name}</p>}
                    {quotation.email && <p>{quotation.email}</p>}
                    {quotation.phone && <p>{quotation.phone}</p>}
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Quotation Total
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                    {formatCurrency(quotation.total)}
                  </p>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Products */}
            <section className="p-6 sm:p-8">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Products
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Quantity</th>
                      <th className="pb-3 font-medium">Unit Price</th>
                      <th className="pb-3 font-medium">Discount</th>
                      <th className="pb-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {quotation.quotation_items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 font-medium text-gray-900">
                          {item.product_name}
                        </td>
                        <td className="py-4 text-gray-600">{item.quantity}</td>
                        <td className="py-4 text-gray-600">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="py-4 text-gray-600">
                          {item.discount}%
                        </td>
                        <td className="py-4 text-right font-medium text-gray-900">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-8 ml-auto w-full max-w-sm border-t border-gray-200 pt-5">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(quotation.subtotal)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <span>GST</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(quotation.gst)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-base font-semibold text-gray-900">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(quotation.total)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}

export default QuotationDetails

