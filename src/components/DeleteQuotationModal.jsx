export default function DeleteQuotationModal({
  quotation,
  deleting,
  onConfirm,
  onCancel,
}) {
  if (!quotation) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-quotation-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-black/80 backdrop-blur-xl sm:p-7">
        
        {/* Top Warning Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-sm shadow-rose-500/10">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <div className="flex-1">
            <h2
              id="delete-quotation-title"
              className="text-lg font-bold tracking-tight text-white"
            >
              Delete Quotation
            </h2>
            <p className="mt-1 text-xs font-normal leading-relaxed text-slate-400">
              Are you sure you want to remove this record? This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Quotation Details Box */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Quotation Ref
            </span>
            <span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-violet-300">
              {quotation.quotation_number || 'N/A'}
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold capitalize text-white">
            {quotation.customer_name || 'Unnamed Client'}
          </p>

          {quotation.company_name && (
            <p className="mt-0.5 text-xs text-slate-400">
              {quotation.company_name}
            </p>
          )}

          {quotation.total && (
            <p className="mt-2.5 font-mono text-xs font-bold text-emerald-400">
              Valuation:{' '}
              {Number(quotation.total).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <>
                <svg
                  className="h-3.5 w-3.5 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Quotation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}