import { useEffect, useState } from 'react'
import Login from './components/Login'
import QuotationDetails from './components/QuotationDetails'
import QuotationForm from './components/QuotationForm'
import { useAuth } from './context/useAuth'
import {
  createQuotation,
  getQuotations,
} from './services/quotationService'

function App() {
  const { session, user, loading, logout } = useAuth()
  const [showQuotationForm, setShowQuotationForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [quotations, setQuotations] = useState([])
  const [quotationsLoading, setQuotationsLoading] = useState(false)
  const [quotationsError, setQuotationsError] = useState('')
  const [quotationRefreshKey, setQuotationRefreshKey] = useState(0)
  const [selectedQuotationId, setSelectedQuotationId] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadQuotations() {
      if (!user?.id) {
        setQuotations([])
        return
      }

      setQuotationsLoading(true)
      setQuotationsError('')

      try {
        const savedQuotations = await getQuotations(user.id)

        if (!cancelled) {
          setQuotations(savedQuotations)
        }
      } catch (error) {
        if (!cancelled) {
          setQuotationsError(error.message)
        }
      } finally {
        if (!cancelled) {
          setQuotationsLoading(false)
        }
      }
    }

    loadQuotations()

    return () => {
      cancelled = true
    }
  }, [user?.id, quotationRefreshKey])

  async function handleSaveQuotation(quotation, items) {
    await createQuotation(quotation, items)

    setQuotationRefreshKey((currentKey) => currentKey + 1)
    setSuccessMessage('Quotation created successfully.')
    setShowQuotationForm(false)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </main>
    )
  }

  if (!session) {
    return <Login />
  }

  if (showQuotationForm) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowQuotationForm(false)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Create Quotation
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Add customer and product details to create a quotation.
              </p>
            </div>

            <QuotationForm
              onSave={handleSaveQuotation}
              onCancel={() => setShowQuotationForm(false)}
            />
          </div>
        </div>
      </main>
    )
  }

  if (selectedQuotationId) {
    return (
      <QuotationDetails
        quotationId={selectedQuotationId}
        onBack={() => setSelectedQuotationId(null)}
      />
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quotation Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome, {user?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Sign Out
          </button>
        </header>

        {successMessage && (
          <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Quotations
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create and manage your quotations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccessMessage('')
                setShowQuotationForm(true)
              }}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              + Create Quotation
            </button>
          </div>

          {quotationsLoading && (
            <p className="mt-6 text-sm text-gray-500">Loading quotations...</p>
          )}

          {quotationsError && (
            <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              Unable to load quotations: {quotationsError}
            </p>
          )}

          {!quotationsLoading && !quotationsError && quotations.length === 0 && (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No quotations yet. Create your first quotation to see it here.
            </p>
          )}

          {!quotationsLoading && !quotationsError && quotations.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Quotation Number</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {quotations.map((quotation) => (
                    <tr key={quotation.id}>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {quotation.quotation_number}
                      </td>
                      <td className="px-4 py-3">{quotation.customer_name}</td>
                      <td className="px-4 py-3">
                        {Number(quotation.total).toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(quotation.quotation_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedQuotationId(quotation.id)}
                          className="rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
