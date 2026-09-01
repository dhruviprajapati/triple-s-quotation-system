import { useState } from 'react'

import Login from './components/Login'
import Dashboard from './components/Dashboard'
import QuotationForm from './components/QuotationForm'
import QuotationDetails from './components/QuotationDetails'

import { useAuth } from './context/useAuth'
import {
  createQuotation,
  updateQuotation,
} from './services/quotationService'

function App() {
  const { session, loading } = useAuth()

  const [page, setPage] = useState('dashboard')
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [saving, setSaving] = useState(false)


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </main>
    )
  }


  if (!session) {
    return <Login />
  }

  const user = session.user


  async function handleCreateQuotation(quotation, items) {
    setSaving(true)

    try {
      await createQuotation(
        user.id,
        quotation,
        items,
      )

      setPage('dashboard')
      setSelectedQuotation(null)
    } finally {
      setSaving(false)
    }
  }


  async function handleUpdateQuotation(quotation, items) {
    if (!selectedQuotation?.id) {
      return
    }

    setSaving(true)

    try {
      await updateQuotation(
        selectedQuotation.id,
        quotation,
        items,
      )

      setPage('dashboard')
      setSelectedQuotation(null)
    } finally {
      setSaving(false)
    }
  }

  
  function handleOpenCreate() {
    setSelectedQuotation(null)
    setPage('create')
  }


  function handleViewQuotation(id) {
    setSelectedQuotation({ id })
    setPage('view')
  }

 

  function handleEditQuotation(id) {
    setSelectedQuotation({ id })
    setPage('edit')
  }


  function handleBackToDashboard() {
    setPage('dashboard')
    setSelectedQuotation(null)
  }


  if (page === 'dashboard') {
    return (
      <Dashboard
        user={user}
        onCreateQuotation={handleOpenCreate}
        onViewQuotation={handleViewQuotation}
        onEditQuotation={handleEditQuotation}
      />
    )
  }


  if (page === 'create') {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Quotation
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new quotation for your customer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleBackToDashboard}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                ← Back
              </button>
            </div>

            <QuotationForm
              onSave={handleCreateQuotation}
              onCancel={handleBackToDashboard}
              submitLabel={
                saving
                  ? 'Saving...'
                  : 'Save Quotation'
              }
            />
          </div>
        </div>
      </main>
    )
  }


  if (page === 'edit') {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Quotation
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Update quotation information.
                </p>
              </div>

              <button
                type="button"
                onClick={handleBackToDashboard}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                ← Back
              </button>
            </div>

            <QuotationForm
              initialQuotation={selectedQuotation}
              onSave={handleUpdateQuotation}
              onCancel={handleBackToDashboard}
              submitLabel={
                saving
                  ? 'Updating...'
                  : 'Update Quotation'
              }
            />
          </div>
        </div>
      </main>
    )
  }


  if (page === 'view') {
    return (
      <QuotationDetails
        quotationId={selectedQuotation?.id}
        onBack={handleBackToDashboard}
        onEdit={() =>
          handleEditQuotation(selectedQuotation?.id)
        }
      />
    )
  }

  return null
}

export default App