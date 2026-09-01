import { useEffect, useState } from 'react'
import { getQuotationById } from '../services/quotationService'
import { downloadQuotationPdf } from '../utils/generateQuotationPdf'

function formatCurrency(amount) {
  return Number(amount ?? 0).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  })
}

function formatDate(date) {
  if (!date) return '-'
  const value = String(date).slice(0, 10)
  const parts = value.split('-')
  if (parts.length !== 3) return '-'
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

export default function QuotationDetails({ quotationId, onBack }) {
  const [quotation, setQuotation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [pdfError, setPdfError] = useState('')

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
          setError(loadError.message || 'Unable to fetch quotation details.')
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

  async function handleDownloadPdf() {
    if (!quotation) return
    setGeneratingPdf(true)
    setPdfError('')

    try {
      downloadQuotationPdf(quotation)
    } catch (generationError) {
      setPdfError(generationError.message || 'Unable to generate the quotation PDF.')
    } finally {
      setGeneratingPdf(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-950 px-4 py-8 text-slate-100 antialiased selection:bg-violet-600 selection:text-white overflow-hidden sm:px-6 lg:px-8">
      
      {/* Ambient Grid & Glow */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-112.5 w-175 rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Navigation & Document Actions Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <svg className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          {quotation && !loading && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="hidden items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-95 sm:inline-flex"
              >
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={generatingPdf}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generatingPdf ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

       
        {pdfError && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{pdfError}</span>
            </div>
            <button type="button" onClick={() => setPdfError('')} className="text-rose-400 hover:text-rose-200">✕</button>
          </div>
        )}

        
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 py-24 shadow-2xl shadow-black/40 backdrop-blur-md">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
            <p className="mt-3 text-sm font-medium text-slate-400">Preparing quotation document...</p>
          </div>
        )}

        
        {error && !loading && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 shadow-sm">
            <div className="flex items-center gap-3 text-rose-300">
              <svg className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">{error}</span>
            </div>
          </div>
        )}

        
        {quotation && !loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/50 backdrop-blur-md">
            {/* Document Header Band */}
            <div className="border-b border-slate-800 bg-slate-950 p-6 text-white sm:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-violet-300">
                    <span>Triple S Production</span>
                  </div>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Commercial Quotation
                  </h1>
                  <p className="mt-1 text-xs text-slate-400">Official estimate document and service terms</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left sm:text-right">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Reference ID</span>
                  <p className="font-mono text-xl font-bold tracking-tight text-violet-300">
                    {quotation.quotation_number || 'N/A'}
                  </p>
                  <div className="mt-2 flex flex-col gap-0.5 text-xs text-slate-400">
                    <span>Date: <strong className="text-slate-200">{formatDate(quotation.quotation_date)}</strong></span>
                    <span>Valid until: <strong className="text-slate-200">{formatDate(quotation.valid_until)}</strong></span>
                  </div>
                </div>
              </div>
            </div>

           
            <div className="grid border-b border-slate-800/80 p-6 sm:grid-cols-2 sm:p-8 sm:gap-8">
              <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">Prepared For</span>
                <h2 className="mt-2 text-base font-bold text-white capitalize">{quotation.customer_name || 'Unnamed Client'}</h2>
                {quotation.company_name && (
                  <p className="font-medium text-slate-300 text-sm capitalize">{quotation.company_name}</p>
                )}
                <div className="mt-3 space-y-1 text-xs text-slate-400 font-medium">
                  {quotation.email && <p>Email: {quotation.email}</p>}
                  {quotation.phone && <p>Phone: {quotation.phone}</p>}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-800/90 bg-slate-950/60 p-5 sm:mt-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Issued By</span>
                <h2 className="mt-2 text-base font-bold text-white">Triple S Production</h2>
                <p className="text-xs text-slate-400 mt-1">Enterprise Software & Digital Services</p>
                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <p>Tax Structure: Standard GST ({quotation.gst_rate ?? 18}%)</p>
                  <p>Status: Approved Commercial Estimate</p>
                </div>
              </div>
            </div>

           
            <div className="p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Service Specifications & Pricing
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full min-w-162.5 border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-5 py-3.5">Product / Deliverable</th>
                      <th className="px-5 py-3.5 text-center">Qty</th>
                      <th className="px-5 py-3.5 text-right">Unit Rate</th>
                      <th className="px-5 py-3.5 text-center">Discount</th>
                      <th className="px-5 py-3.5 text-right">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {quotation.quotation_items?.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-semibold text-white">{item.product_name}</td>
                        <td className="px-5 py-4 text-center font-mono font-medium text-slate-300">{item.quantity}</td>
                        <td className="px-5 py-4 text-right font-mono text-slate-300">{formatCurrency(item.unit_price)}</td>
                        <td className="px-5 py-4 text-center font-mono text-slate-300">
                          {item.discount > 0 ? (
                            <span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-xs font-bold text-violet-300">
                              {item.discount}%
                            </span>
                          ) : (
                            <span className="text-slate-500">0%</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-emerald-400">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

           
              <div className="mt-8 ml-auto w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="space-y-3 text-xs font-medium text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {formatCurrency(quotation.subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>GST ({quotation.gst_rate ?? 18}%)</span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {formatCurrency(quotation.gst)}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold text-white">Grand Total</span>
                      <span className="font-mono text-2xl font-extrabold tracking-tight text-emerald-400">
                        {formatCurrency(quotation.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

         
            <div className="border-t border-slate-800 bg-slate-950/60 px-6 py-4 text-center text-xs text-slate-500 sm:px-8">
              This quotation is valid until {formatDate(quotation.valid_until)}. Generated by Triple S Production.
            </div>
          </div>
        )}
      </div>
    </main>
  )
}