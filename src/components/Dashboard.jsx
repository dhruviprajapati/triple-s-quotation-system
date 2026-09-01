import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/useAuth'
import {
  createQuotation,
  deleteQuotation,
  getQuotationById,
  getQuotations,
  updateQuotation,
} from '../services/quotationService'
import { downloadQuotationPdf } from '../utils/generateQuotationPdf'
import { getFilteredAndSortedQuotations } from '../utils/quotationUtils'

import QuotationForm from './QuotationForm'
import QuotationDetails from './QuotationDetails'
import QuotationFilters from './QuotationFilters'
import QuotationTable from './QuotationTable'
import DeleteQuotationModal from './DeleteQuotationModal'

function formatCurrency(amount) {
  return Number(amount ?? 0).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  })
}

export default function Dashboard() {
  const { user, signOut } = useAuth()

  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')

  // Navigation Screens
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [viewQuotationId, setViewQuotationId] = useState(null)

  // Edit State
  const [editingQuotationId, setEditingQuotationId] = useState(null)
  const [editingQuotation, setEditingQuotation] = useState(null)
  const [editLoading, setEditLoading] = useState(false)

  // Delete State
  const [quotationToDelete, setQuotationToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // PDF State
  const [generatingPdfId, setGeneratingPdfId] = useState(null)

  // Feedback Notifications
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadQuotations() {
      if (!user?.id) {
        setQuotations([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const data = await getQuotations(user.id)
        if (!cancelled) {
          setQuotations(Array.isArray(data) ? data : [])
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Unable to load quotations.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadQuotations()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  useEffect(() => {
    let cancelled = false

    async function loadQuotationForEdit() {
      if (!editingQuotationId) {
        setEditingQuotation(null)
        return
      }

      setEditLoading(true)
      setError('')

      try {
        const data = await getQuotationById(editingQuotationId)
        if (!cancelled) {
          setEditingQuotation(data)
        }
      } catch (editError) {
        if (!cancelled) {
          setError(editError.message || 'Unable to load quotation for editing.')
        }
      } finally {
        if (!cancelled) {
          setEditLoading(false)
        }
      }
    }

    loadQuotationForEdit()
    return () => {
      cancelled = true
    }
  }, [editingQuotationId])

  const filteredQuotations = useMemo(() => {
    return getFilteredAndSortedQuotations({
      quotations,
      searchTerm,
      dateFilter,
      sortBy,
      sortDirection,
    })
  }, [quotations, searchTerm, dateFilter, sortBy, sortDirection])

  async function refreshQuotations() {
    if (!user?.id) return
    try {
      const data = await getQuotations(user.id)
      setQuotations(Array.isArray(data) ? data : [])
    } catch (refreshError) {
      setError(refreshError.message || 'Unable to refresh quotations.')
    }
  }

  async function handleCreateQuotation(quotation, items) {
    setError('')
    setMessage('')
    try {
      await createQuotation(quotation, items)
      await refreshQuotations()
      setShowCreateForm(false)
      setMessage('Quotation created successfully.')
    } catch (createError) {
      setError(createError.message || 'Unable to create quotation.')
      throw createError
    }
  }

  async function handleUpdateQuotation(quotation, items) {
    if (!editingQuotationId) return
    setError('')
    setMessage('')
    try {
      await updateQuotation(editingQuotationId, quotation, items)
      await refreshQuotations()
      setEditingQuotationId(null)
      setEditingQuotation(null)
      setMessage('Quotation updated successfully.')
    } catch (updateError) {
      setError(updateError.message || 'Unable to update quotation.')
      throw updateError
    }
  }

  async function handleConfirmDelete() {
    if (!quotationToDelete) return
    setDeleting(true)
    setError('')
    setMessage('')
    try {
      await deleteQuotation(quotationToDelete.id)
      setQuotations((current) =>
        current.filter((item) => item.id !== quotationToDelete.id)
      )
      setMessage(`Quotation ${quotationToDelete.quotation_number} deleted successfully.`)
      setQuotationToDelete(null)
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete quotation.')
    } finally {
      setDeleting(false)
    }
  }

  async function handleDownloadPdf(quotationId) {
    setGeneratingPdfId(quotationId)
    setError('')
    setMessage('')
    try {
      const quotation = await getQuotationById(quotationId)
      if (!quotation) throw new Error('Quotation could not be found.')
      downloadQuotationPdf(quotation)
      setMessage('Quotation PDF generated successfully.')
    } catch (pdfError) {
      setError(pdfError.message || 'Unable to generate quotation PDF.')
    } finally {
      setGeneratingPdfId(null)
    }
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortBy(field)
    if (field === 'customer_name' || field === 'company_name') {
      setSortDirection('asc')
    } else {
      setSortDirection('desc')
    }
  }

  function handleClearFilters() {
    setSearchTerm('')
    setDateFilter('all')
    setSortBy('date')
    setSortDirection('desc')
  }

  if (showCreateForm || editingQuotationId) {
    const isEdit = Boolean(editingQuotationId)
    return (
      <main className="relative min-h-screen bg-slate-950 py-8 text-slate-100 antialiased selection:bg-violet-600 selection:text-white overflow-hidden">
        {/* Ambient Grid & Glow */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-112.5 w-175 rounded-full bg-violet-600/10 blur-[130px]" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false)
                setEditingQuotationId(null)
                setEditingQuotation(null)
                setError('')
              }}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
              {isEdit ? 'Editing Mode' : 'New Estimate'}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/50 backdrop-blur-md">
            <div className="border-b border-slate-800 bg-slate-950 px-6 py-7 text-white sm:px-8">
              <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-violet-300">
                <span>Triple S Production</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {isEdit ? 'Edit Quotation' : 'Create Quotation'}
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                {isEdit ? 'Update item details and recalculate totals.' : 'Generate a structured commercial estimate.'}
              </p>
            </div>

            {error && (
              <div className="mx-6 mt-6 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300 sm:mx-8">
                <svg className="h-4 w-4 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="p-6 sm:p-8">
              {isEdit && editLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
                  <p className="mt-3 text-sm font-medium text-slate-400">Retrieving quotation record...</p>
                </div>
              ) : isEdit && !editingQuotation ? (
                <div className="py-16 text-center text-sm font-semibold text-rose-400">
                  Unable to load quotation details.
                </div>
              ) : (
                <QuotationForm
                  initialQuotation={isEdit ? editingQuotation : undefined}
                  onSave={isEdit ? handleUpdateQuotation : handleCreateQuotation}
                  onCancel={() => {
                    setShowCreateForm(false)
                    setEditingQuotationId(null)
                    setEditingQuotation(null)
                    setError('')
                  }}
                  submitLabel={isEdit ? 'Save & Update Quotation' : 'Save Quotation'}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (viewQuotationId) {
    return (
      <QuotationDetails
        quotationId={viewQuotationId}
        onBack={() => setViewQuotationId(null)}
      />
    )
  }

  const totalQuotationValue = quotations.reduce(
    (total, item) => total + Number(item.total || 0),
    0
  )
  const averageQuotationValue = quotations.length > 0 ? totalQuotationValue / quotations.length : 0

  return (
    <main className="relative min-h-screen bg-slate-950 pb-16 text-slate-100 antialiased selection:bg-violet-600 selection:text-white overflow-hidden">
      
      
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      
      <div className="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 h-125 w-200 rounded-full bg-violet-600/15 blur-[140px]" />

      {/* Global Topbar */}
      <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-violet-400 border border-slate-800 shadow-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm font-bold tracking-tight text-white">Triple S Production</span>
              <span className="hidden text-xs font-medium text-slate-400 sm:inline"> / Quotation System</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.email && (
              <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-300 md:flex">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 font-mono text-[10px] font-bold text-white uppercase shadow-sm">
                  {user.email.charAt(0)}
                </div>
                <span>{user.email}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </div>
            )}
            <button
              type="button"
              onClick={signOut}
              className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 active:scale-95"
            >
              <span>Sign Out</span>
              <svg className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Quotation Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Create, analyze, download, and track professional customer estimates.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError('')
              setMessage('')
              setShowCreateForm(true)
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Quotation
          </button>
        </div>

        {/* Global Notifications */}
        {message && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-300 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{message}</span>
            </div>
            <button type="button" onClick={() => setMessage('')} className="text-emerald-400 hover:text-emerald-200">✕</button>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-300 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button type="button" onClick={() => setError('')} className="text-rose-400 hover:text-rose-200">✕</button>
          </div>
        )}

        {/* 3 Metric Cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Quotations */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Quotations</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-white">{quotations.length}</p>
            <p className="mt-1 text-xs text-slate-500">Recorded in database</p>
          </div>

          {/* Total Valuation */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Valuation</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 font-bold text-violet-400 border border-violet-500/20">
                <span className="font-sans text-sm">₹</span>
              </div>
            </div>
            <p className="mt-3 font-mono text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {formatCurrency(totalQuotationValue)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Sum of all generated estimates</p>
          </div>

          {/* Average Quote Value */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Quote Value</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="mt-3 font-mono text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {formatCurrency(averageQuotationValue)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Per client estimate</p>
          </div>
        </section>

        {/* Main Quotations Table Section */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="border-b border-slate-800 bg-slate-900/60 p-4 sm:p-6">
            <QuotationFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
            />
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Fetching Quotations...</p>
            </div>
          )}

          {!loading && !error && quotations.length === 0 && (
            <div className="py-24 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-white">No quotations found</h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
                Get started by creating your first client commercial estimate.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/30 transition hover:bg-violet-500"
              >
                + Create Quotation
              </button>
            </div>
          )}

          {!loading && !error && quotations.length > 0 && filteredQuotations.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">No matching results</h3>
              <p className="mt-1 text-xs text-slate-400">No quotations match the active search and filter options.</p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-3 text-xs font-semibold text-violet-400 hover:text-violet-300"
              >
                Reset all filters
              </button>
            </div>
          )}

          {!loading && !error && filteredQuotations.length > 0 && (
            <QuotationTable
              quotations={filteredQuotations}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
              onView={setViewQuotationId}
              onEdit={(quotationId) => {
                setError('')
                setEditingQuotationId(quotationId)
              }}
              onDelete={(quotationId) => {
                const item = quotations.find((q) => q.id === quotationId)
                if (item) setQuotationToDelete(item)
              }}
              onDownloadPdf={handleDownloadPdf}
              generatingPdfId={generatingPdfId}
            />
          )}
        </section>
      </div>

      <DeleteQuotationModal
        quotation={quotationToDelete}
        deleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) setQuotationToDelete(null)
        }}
      />
    </main>
  )
}