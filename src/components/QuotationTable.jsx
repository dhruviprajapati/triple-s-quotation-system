import { useState, useMemo } from 'react'

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

export default function QuotationTable({
  quotations = [],
  sortBy,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onDownloadPdf,
  generatingPdfId,
  itemsPerPage = 4, // Shows exactly 4 rows per page
}) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(quotations.length / itemsPerPage))

  const paginatedQuotations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return quotations.slice(start, start + itemsPerPage)
  }, [quotations, currentPage, itemsPerPage])

  const startIndex = quotations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endIndex = Math.min(currentPage * itemsPerPage, quotations.length)

  return (
    <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse text-left text-sm">
          {/* Defined High-Contrast Header */}
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              
              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort('quotation_number')}
                  className="group inline-flex items-center gap-1 font-bold text-slate-400 transition hover:text-white"
                >
                  <span>Quote Ref</span>
                  {sortBy === 'quotation_number' && (
                    <span className="text-violet-400 font-extrabold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>

              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort('customer_name')}
                  className="group inline-flex items-center gap-1 font-bold text-slate-400 transition hover:text-white"
                >
                  <span>Client & Entity</span>
                  {sortBy === 'customer_name' && (
                    <span className="text-violet-400 font-extrabold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>

              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort('date')}
                  className="group inline-flex items-center gap-1 font-bold text-slate-400 transition hover:text-white"
                >
                  <span>Issued Date</span>
                  {sortBy === 'date' && (
                    <span className="text-violet-400 font-extrabold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>

              <th className="px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onSort('total')}
                  className="group ml-auto inline-flex items-center gap-1 font-bold text-slate-400 transition hover:text-white"
                >
                  <span>Valuation</span>
                  {sortBy === 'total' && (
                    <span className="text-violet-400 font-extrabold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>

              <th className="px-6 py-4 text-right font-bold text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
            {paginatedQuotations.map((quotation) => {
              const isGenerating = generatingPdfId === quotation.id

              return (
                <tr
                  key={quotation.id}
                  className="group transition-colors duration-150 hover:bg-slate-800/50"
                >
                
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 font-mono text-xs font-bold text-violet-300">
                      {quotation.quotation_number || 'N/A'}
                    </span>
                  </td>

                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white capitalize">
                        {quotation.customer_name || 'Unnamed Client'}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        {quotation.company_name && (
                          <span className="capitalize font-medium text-slate-300">
                            {quotation.company_name}
                          </span>
                        )}
                        {quotation.company_name && quotation.email && <span>•</span>}
                        {quotation.email && <span>{quotation.email}</span>}
                      </div>
                    </div>
                  </td>

                 
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-400">
                    {formatDate(quotation.quotation_date)}
                  </td>

                  
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <span className="font-mono text-sm font-bold tracking-tight text-emerald-400">
                      {formatCurrency(quotation.total)}
                    </span>
                  </td>

              
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      
                     
                      <button
                        type="button"
                        onClick={() => onView(quotation.id)}
                        className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
                      >
                        View
                      </button>

                    
                      <button
                        type="button"
                        onClick={() => onEdit(quotation.id)}
                        className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
                      >
                        Edit
                      </button>

                      
                      <button
                        type="button"
                        disabled={isGenerating}
                        onClick={() => onDownloadPdf(quotation.id)}
                        className="rounded-lg border border-violet-500/30 bg-violet-600/20 px-2.5 py-1.5 text-xs font-semibold text-violet-300 shadow-sm transition hover:border-violet-500/50 hover:bg-violet-600 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isGenerating ? 'PDF...' : 'PDF'}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDelete(quotation.id)}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 shadow-sm transition hover:border-rose-500/40 hover:bg-rose-600 hover:text-white active:scale-95"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/60 px-6 py-4 text-xs text-slate-400 sm:flex-row">
        <span>
          Showing <strong className="font-semibold text-slate-200">{startIndex}–{endIndex}</strong> of{' '}
          <strong className="font-semibold text-slate-200">{quotations.length}</strong> quotations
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Previous
          </button>

          <span className="font-medium text-slate-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}