import { useState, useRef, useEffect, useMemo } from 'react'

export default function QuotationFilters({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
}) {
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const dateRef = useRef(null)
  const sortRef = useRef(null)

  const sortOptions = useMemo(
    () => [
      { value: 'date', label: 'Quotation Date' },
      { value: 'quotation_number', label: 'Quotation Number' },
      { value: 'customer_name', label: 'Customer Name' },
      { value: 'company_name', label: 'Company Name' },
      { value: 'total', label: 'Total Valuation' },
    ],
    []
  )

  const dateLabels = {
    all: 'All Time',
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
  }

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDateDropdownOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasActiveFilters = searchTerm.trim() !== '' || dateFilter !== 'all'

  return (
    <div className="space-y-3">
      {/* SaaS Toolbar Row */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by quote #, client, or company..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-9 pr-9 text-xs font-medium text-slate-100 placeholder:text-slate-500 transition-all focus:border-violet-500 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-semibold text-slate-500 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls Group */}
        <div className="flex items-center gap-2">
          
          {/* Date Filter Dropdown */}
          <div className="relative" ref={dateRef}>
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95 ${
                dateFilter !== 'all'
                  ? 'border-violet-500/30 bg-violet-600/15 text-violet-300'
                  : 'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{dateLabels[dateFilter] || 'Date Range'}</span>
              <svg className="h-3 w-3 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {dateDropdownOpen && (
              <div className="absolute right-0 z-30 mt-1.5 w-44 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
                {Object.entries(dateLabels).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onDateFilterChange(key)
                      setDateDropdownOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                      dateFilter === key
                        ? 'bg-violet-600/20 font-bold text-violet-300'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{label}</span>
                    {dateFilter === key && <span className="text-violet-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-slate-300 shadow-sm transition-all hover:border-slate-700 hover:text-white active:scale-95"
            >
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span>Sort</span>
              <svg className="h-3 w-3 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 z-30 mt-1.5 w-52 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Sort Column
                </div>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortByChange(opt.value)
                      if (opt.value === 'total') onSortDirectionChange('desc')
                      else if (opt.value === 'customer_name' || opt.value === 'company_name') onSortDirectionChange('asc')
                      else onSortDirectionChange('desc')
                      setSortDropdownOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                      sortBy === opt.value
                        ? 'bg-violet-600/20 font-bold text-violet-300'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <span className="text-violet-400">✓</span>}
                  </button>
                ))}

                <div className="my-1 border-t border-slate-800" />

                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Direction
                </div>
                <div className="grid grid-cols-2 gap-1 p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSortDirectionChange('asc')
                      setSortDropdownOpen(false)
                    }}
                    className={`rounded-md py-1 text-center text-xs font-semibold transition ${
                      sortDirection === 'asc'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Asc (A-Z)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSortDirectionChange('desc')
                      setSortDropdownOpen(false)
                    }}
                    className={`rounded-md py-1 text-center text-xs font-semibold transition ${
                      sortDirection === 'desc'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Desc (Z-A)
                  </button>
                </div>
              </div>
            )}
          </div>

         
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('')
                onDateFilterChange('all')
              }}
              className="rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Active:
          </span>

          {searchTerm.trim() && (
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/90 px-2 py-0.5 text-xs font-medium text-slate-300">
              Query: <strong className="font-semibold text-white">"{searchTerm.trim()}"</strong>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            </span>
          )}

          {dateFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/30 bg-violet-600/15 px-2 py-0.5 text-xs font-medium text-violet-300">
              Period: <strong className="font-semibold text-white">{dateLabels[dateFilter]}</strong>
              <button
                type="button"
                onClick={() => onDateFilterChange('all')}
                className="text-violet-400 hover:text-violet-200"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}