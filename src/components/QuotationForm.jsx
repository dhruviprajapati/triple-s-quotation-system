import { useMemo, useState } from 'react'
import {
  calculateItemAmount,
  calculateQuotationTotals,
  GST_OPTIONS,
  DEFAULT_GST_RATE,
} from '../utils/quotationCalculations'

const createEmptyItem = () => ({
  product_name: '',
  quantity: 1,
  unit_price: 0,
  discount: 0,
})

const initialForm = {
  quotation_number: '',
  customer_name: '',
  company_name: '',
  email: '',
  phone: '',
  quotation_date: '',
  valid_until: '',
  gst_rate: DEFAULT_GST_RATE,
}

function getInitialForm(quotation) {
  if (!quotation) {
    return {
      ...initialForm,
      gst_rate: DEFAULT_GST_RATE,
    }
  }

  return {
    quotation_number: quotation.quotation_number ?? '',
    customer_name: quotation.customer_name ?? '',
    company_name: quotation.company_name ?? '',
    email: quotation.email ?? '',
    phone: quotation.phone ?? '',
    quotation_date: quotation.quotation_date?.slice(0, 10) ?? '',
    valid_until: quotation.valid_until?.slice(0, 10) ?? '',
    gst_rate:
      quotation.gst_rate !== null && quotation.gst_rate !== undefined
        ? Number(quotation.gst_rate)
        : DEFAULT_GST_RATE,
  }
}

function getInitialItems(quotation) {
  if (!quotation?.quotation_items?.length) {
    return [createEmptyItem()]
  }

  return quotation.quotation_items.map((item) => ({
    product_name: item.product_name ?? '',
    quantity: item.quantity ?? 1,
    unit_price: item.unit_price ?? 0,
    discount: item.discount ?? 0,
  }))
}

export default function QuotationForm({
  initialQuotation,
  onSave,
  onCancel,
  submitLabel = 'Save Quotation',
}) {
  const [form, setForm] = useState(() => getInitialForm(initialQuotation))
  const [items, setItems] = useState(() => getInitialItems(initialQuotation))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const selectedGstRate = Number(form.gst_rate)

  const totals = useMemo(
    () => calculateQuotationTotals(items, selectedGstRate),
    [items, selectedGstRate]
  )

  function handleFormChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  function handleItemChange(index, field, value) {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) => {
        if (itemIndex !== index) return item
        return {
          ...item,
          [field]: value,
        }
      })
    )

    setErrors((currentErrors) => ({
      ...currentErrors,
      items: '',
      [`item_${index}_${field}`]: '',
    }))
  }

  function addItem() {
    setItems((currentItems) => [...currentItems, createEmptyItem()])
  }

  function removeItem(index) {
    if (items.length === 1) return
    setItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index)
    )
  }

  function validateForm() {
    const validationErrors = {}

    if (!form.customer_name.trim()) {
      validationErrors.customer_name = 'Customer name is required.'
    }

    if (!form.company_name.trim()) {
      validationErrors.company_name = 'Company name is required.'
    }

    if (!form.email.trim()) {
      validationErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = 'Please enter a valid email address.'
    }

    if (!form.phone.trim()) {
      validationErrors.phone = 'Phone number is required.'
    }

    if (!form.quotation_number.trim()) {
      validationErrors.quotation_number = 'Quotation number is required.'
    }

    if (!form.quotation_date) {
      validationErrors.quotation_date = 'Quotation date is required.'
    }

    if (!form.valid_until) {
      validationErrors.valid_until = 'Valid until date is required.'
    }

    if (
      form.quotation_date &&
      form.valid_until &&
      form.valid_until < form.quotation_date
    ) {
      validationErrors.valid_until = 'Valid until date cannot be before quotation date.'
    }

    if (!GST_OPTIONS.includes(selectedGstRate)) {
      validationErrors.gst_rate = 'Please select a valid GST rate.'
    }

    if (items.length === 0) {
      validationErrors.items = 'At least one product is required.'
    }

    items.forEach((item, index) => {
      if (!item.product_name.trim()) {
        validationErrors[`item_${index}_product_name`] = 'Product description is required.'
      }

      if (Number(item.quantity) <= 0) {
        validationErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0.'
      }

      if (Number(item.unit_price) < 0) {
        validationErrors[`item_${index}_unit_price`] = 'Price cannot be negative.'
      }

      if (Number(item.discount) < 0 || Number(item.discount) > 100) {
        validationErrors[`item_${index}_discount`] = 'Discount must be between 0 and 100%.'
      }
    })

    return validationErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const preparedItems = items.map((item) => ({
      product_name: item.product_name.trim(),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      discount: Number(item.discount),
      amount: calculateItemAmount(
        item.quantity,
        item.unit_price,
        item.discount
      ),
    }))

    const quotation = {
      ...form,
      customer_name: form.customer_name.trim(),
      company_name: form.company_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      quotation_number: form.quotation_number.trim(),
      gst_rate: selectedGstRate,
      subtotal: totals.subtotal,
      gst: totals.gst,
      total: totals.total,
    }

    setSaving(true)
    setErrors({})

    try {
      await onSave(quotation, preparedItems)
    } catch (error) {
      setErrors({
        submit: error.message || 'Failed to save quotation.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
     
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/40 backdrop-blur-md sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 font-mono text-xs font-bold text-violet-300">
            01
          </span>
          <div>
            <h2 className="text-base font-bold text-white">Client & Company Details</h2>
            <p className="text-xs text-slate-400">Contact information and customer recipient data</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
         
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer Name <span className="text-rose-400">*</span>
            </label>
            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleFormChange}
              placeholder="e.g. John Doe"
              className={`w-full rounded-xl border bg-slate-950/70 px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 transition-all focus:bg-slate-950 focus:outline-none focus:ring-2 ${
                errors.customer_name
                  ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
              }`}
            />
            {errors.customer_name && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.customer_name}</p>
            )}
          </div>

          
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Company Name <span className="text-rose-400">*</span>
            </label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleFormChange}
              placeholder="e.g. Acme Corporation Pvt Ltd"
              className={`w-full rounded-xl border bg-slate-950/70 px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 transition-all focus:bg-slate-950 focus:outline-none focus:ring-2 ${
                errors.company_name
                  ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
              }`}
            />
            {errors.company_name && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.company_name}</p>
            )}
          </div>

       
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="john@example.com"
              className={`w-full rounded-xl border bg-slate-950/70 px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 transition-all focus:bg-slate-950 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.email}</p>
            )}
          </div>

          
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Phone Number <span className="text-rose-400">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="+91 98765 43210"
              className={`w-full rounded-xl border bg-slate-950/70 px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-slate-600 transition-all focus:bg-slate-950 focus:outline-none focus:ring-2 ${
                errors.phone
                  ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
              }`}
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.phone}</p>
            )}
          </div>
        </div>
      </section>

    
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/40 backdrop-blur-md sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 font-mono text-xs font-bold text-violet-300">
            02
          </span>
          <div>
            <h2 className="text-base font-bold text-white">Quotation Terms & Schedule</h2>
            <p className="text-xs text-slate-400">Document reference, validity timeline, and applicable tax</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Quotation Number */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quotation Number <span className="text-rose-400">*</span>
            </label>
            <input
              name="quotation_number"
              value={form.quotation_number}
              onChange={handleFormChange}
              placeholder="QT-001"
              className={`w-full rounded-xl border bg-slate-950/70 px-3.5 py-2.5 font-mono text-sm font-semibold text-white placeholder:text-slate-600 transition-all focus:bg-slate-950 focus:outline-none focus:ring-2 ${
                errors.quotation_number
                  ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
              }`}
            />
            {errors.quotation_number && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.quotation_number}</p>
            )}
          </div>

          
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quotation Date <span className="text-rose-400">*</span>
            </label>
            <input
              name="quotation_date"
              type="date"
              value={form.quotation_date}
              onChange={handleFormChange}
              className={`w-full rounded-xl border bg-slate-950/70 px-3.5 py-2.5 text-sm font-medium text-white transition-all focus:bg-slate-950 focus:outline-none focus:ring-2 ${
                errors.quotation_date
                  ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
              }`}
            />
            {errors.quotation_date && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.quotation_date}</p>
            )}
          </div>

         
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Valid Until <span className="text-rose-400">*</span>
            </label>
            <input
              name="valid_until"
              type="date"
              value={form.valid_until}
              onChange={handleFormChange}
              className={`w-full rounded-xl border bg-slate-950/70 px-3.5 py-2.5 text-sm font-medium text-white transition-all focus:bg-slate-950 focus:outline-none focus:ring-2 ${
                errors.valid_until
                  ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
              }`}
            />
            {errors.valid_until && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.valid_until}</p>
            )}
          </div>

         
          <div>
            <label htmlFor="gst_rate" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              GST Rate <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                id="gst_rate"
                name="gst_rate"
                value={form.gst_rate}
                onChange={handleFormChange}
                className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm font-semibold text-white transition-all focus:border-violet-500 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {GST_OPTIONS.map((rate) => (
                  <option key={rate} value={rate} className="bg-slate-900 text-white">
                    {rate}% GST
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.gst_rate && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.gst_rate}</p>
            )}
          </div>
        </div>
      </section>

    
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-black/40 backdrop-blur-md sm:p-7">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-800/80 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 font-mono text-xs font-bold text-violet-300">
              03
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Products & Services</h2>
              <p className="text-xs text-slate-400">Add deliverables, unit pricing, and item discounts</p>
            </div>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-violet-500/30 bg-violet-500/15 px-3.5 py-2 text-xs font-semibold text-violet-300 shadow-sm transition hover:border-violet-500/50 hover:bg-violet-600 hover:text-white active:scale-95 sm:self-auto"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        {errors.items && (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
            {errors.items}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {items.map((item, index) => {
            const amount = calculateItemAmount(
              item.quantity,
              item.unit_price,
              item.discount
            )

            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-800/90 bg-slate-950/60 p-4 transition-all hover:border-violet-500/30 sm:p-5"
              >
                <div className="grid gap-4 sm:grid-cols-12 sm:items-start">
                 
                  <div className="sm:col-span-5">
                    <label className="mb-1 block text-xs font-semibold text-slate-400">
                      Product Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      value={item.product_name}
                      onChange={(event) =>
                        handleItemChange(index, 'product_name', event.target.value)
                      }
                      placeholder="e.g. Accounting Software"
                      className={`w-full rounded-xl border bg-slate-900/90 px-3 py-2 text-sm font-medium text-white placeholder:text-slate-600 transition-all focus:outline-none focus:ring-2 ${
                        errors[`item_${index}_product_name`]
                          ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
                      }`}
                    />
                    {errors[`item_${index}_product_name`] && (
                      <p className="mt-1 text-xs font-medium text-rose-400">
                        {errors[`item_${index}_product_name`]}
                      </p>
                    )}
                  </div>

                
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-400">
                      Quantity <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(event) =>
                        handleItemChange(index, 'quantity', event.target.value)
                      }
                      className={`w-full rounded-xl border bg-slate-900/90 px-3 py-2 text-center font-mono text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 ${
                        errors[`item_${index}_quantity`]
                          ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
                      }`}
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="mt-1 text-xs font-medium text-rose-400">
                        {errors[`item_${index}_quantity`]}
                      </p>
                    )}
                  </div>

                  
                  <div className="sm:col-span-3">
                    <label className="mb-1 block text-xs font-semibold text-slate-400">
                      Unit Price (₹) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-xs text-slate-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(event) =>
                          handleItemChange(index, 'unit_price', event.target.value)
                        }
                        className={`w-full rounded-xl border bg-slate-900/90 py-2 pl-7 pr-3 font-mono text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 ${
                          errors[`item_${index}_unit_price`]
                            ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
                        }`}
                      />
                    </div>
                    {errors[`item_${index}_unit_price`] && (
                      <p className="mt-1 text-xs font-medium text-rose-400">
                        {errors[`item_${index}_unit_price`]}
                      </p>
                    )}
                  </div>

                 
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-400">
                      Discount (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discount}
                        onChange={(event) =>
                          handleItemChange(index, 'discount', event.target.value)
                        }
                        className={`w-full rounded-xl border bg-slate-900/90 py-2 pl-3 pr-7 text-center font-mono text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 ${
                          errors[`item_${index}_discount`]
                            ? 'border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-800 focus:border-violet-500 focus:ring-violet-500/20'
                        }`}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 font-mono text-xs text-slate-500">
                        %
                      </span>
                    </div>
                    {errors[`item_${index}_discount`] && (
                      <p className="mt-1 text-xs font-medium text-rose-400">
                        {errors[`item_${index}_discount`]}
                      </p>
                    )}
                  </div>
                </div>

                
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">Amount:</span>
                    <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400 shadow-sm">
                      ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300 active:scale-95 disabled:cursor-not-allowed disabled:text-slate-600"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="ml-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Summary
        </h3>

        <div className="mt-4 space-y-3 font-medium text-slate-400">
          <div className="flex items-center justify-between text-sm">
            <span>GST Rate</span>
            <span className="font-mono font-semibold text-white">{selectedGstRate}%</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-mono font-semibold text-white">
              ₹{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>GST ({selectedGstRate}%)</span>
            <span className="font-mono font-semibold text-white">
              ₹{totals.gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-white">Grand Total</span>
              <span className="font-mono text-2xl font-extrabold tracking-tight text-emerald-400">
                ₹{totals.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </section>

      
      {errors.submit && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300">
          <svg className="h-4 w-4 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{errors.submit}</span>
        </div>
      )}

      
      <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  )
}