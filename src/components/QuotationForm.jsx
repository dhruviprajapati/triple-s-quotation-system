import { useMemo, useState } from 'react'
import {
  calculateItemAmount,
  calculateQuotationTotals,
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
}

function QuotationForm({ onSave, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([createEmptyItem()])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const totals = useMemo(
    () => calculateQuotationTotals(items),
    [items],
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
        if (itemIndex !== index) {
          return item
        }

        return {
          ...item,
          [field]: value,
        }
      }),
    )

    setErrors((currentErrors) => ({
      ...currentErrors,
      items: '',
    }))
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      createEmptyItem(),
    ])
  }

  function removeItem(index) {
    if (items.length === 1) {
      return
    }

    setItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index),
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
      validationErrors.phone = 'Phone is required.'
    }

    if (!form.quotation_number.trim()) {
      validationErrors.quotation_number =
        'Quotation number is required.'
    }

    if (!form.quotation_date) {
      validationErrors.quotation_date =
        'Quotation date is required.'
    }

    if (!form.valid_until) {
      validationErrors.valid_until =
        'Valid until date is required.'
    }

    if (
      form.quotation_date &&
      form.valid_until &&
      form.valid_until < form.quotation_date
    ) {
      validationErrors.valid_until =
        'Valid until date cannot be before quotation date.'
    }

    if (items.length === 0) {
      validationErrors.items = 'At least one product is required.'
    }

    items.forEach((item, index) => {
      if (!item.product_name.trim()) {
        validationErrors[`item_${index}_product_name`] =
          'Product name is required.'
      }

      if (Number(item.quantity) <= 0) {
        validationErrors[`item_${index}_quantity`] =
          'Quantity must be greater than 0.'
      }

      if (Number(item.unit_price) < 0) {
        validationErrors[`item_${index}_unit_price`] =
          'Price cannot be negative.'
      }

      if (
        Number(item.discount) < 0 ||
        Number(item.discount) > 100
      ) {
        validationErrors[`item_${index}_discount`] =
          'Discount must be between 0 and 100%.'
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
        item.discount,
      ),
    }))

    const quotation = {
      ...form,
      customer_name: form.customer_name.trim(),
      company_name: form.company_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      quotation_number: form.quotation_number.trim(),
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
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Customer Information
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Enter customer name"
            />
            {errors.customer_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customer_name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Enter company name"
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.company_name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="customer@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Quotation Information
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Quotation Number
            </label>
            <input
              name="quotation_number"
              value={form.quotation_number}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="QT-001"
            />
            {errors.quotation_number && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quotation_number}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Quotation Date
            </label>
            <input
              name="quotation_date"
              type="date"
              value={form.quotation_date}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.quotation_date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quotation_date}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Valid Until
            </label>
            <input
              name="valid_until"
              type="date"
              value={form.valid_until}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
            {errors.valid_until && (
              <p className="mt-1 text-sm text-red-600">
                {errors.valid_until}
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Products / Services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add one or more products or services.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            + Add Product
          </button>
        </div>

        {errors.items && (
          <p className="mt-3 text-sm text-red-600">
            {errors.items}
          </p>
        )}

        <div className="mt-4 space-y-4">
          {items.map((item, index) => {
            const amount = calculateItemAmount(
              item.quantity,
              item.unit_price,
              item.discount,
            )

            return (
              <div
                key={index}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      value={item.product_name}
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          'product_name',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder="Accounting Software"
                    />

                    {errors[`item_${index}_product_name`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`item_${index}_product_name`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.quantity}
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          'quantity',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    {errors[`item_${index}_quantity`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`item_${index}_quantity`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          'unit_price',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    {errors[`item_${index}_unit_price`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`item_${index}_unit_price`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.discount}
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          'discount',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    {errors[`item_${index}_discount`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`item_${index}_discount`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500">
                    Amount:{' '}
                    <span className="font-semibold text-gray-900">
                      ₹{amount.toFixed(2)}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="ml-auto max-w-md rounded-xl bg-gray-50 p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Summary
        </h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              ₹{totals.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">GST (18%)</span>
            <span className="font-medium">
              ₹{totals.gst.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
            <span className="font-semibold">Grand Total</span>
            <span className="font-bold">
              ₹{totals.total.toFixed(2)}
            </span>
          </div>
        </div>
      </section>

      {errors.submit && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Quotation'}
        </button>
      </div>
    </form>
  )
}

export default QuotationForm