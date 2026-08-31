import { supabase } from '../lib/supabaseClient'

async function getAuthenticatedUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  if (!user) {
    throw new Error('You must be logged in to perform this action.')
  }

  return user
}

export async function createQuotation(quotation, items) {
  const user = await getAuthenticatedUser()

  const quotationPayload = {
    quotation_number: quotation.quotation_number,
    customer_name: quotation.customer_name,
    company_name: quotation.company_name,
    email: quotation.email,
    phone: quotation.phone,
    quotation_date: quotation.quotation_date,
    valid_until: quotation.valid_until,
    subtotal: quotation.subtotal,
    gst: quotation.gst,
    total: quotation.total,
    user_id: user.id,
  }

  const { data: quotationData, error: quotationError } = await supabase
    .from('quotations')
    .insert(quotationPayload)
    .select()
    .single()

  if (quotationError) {
    throw new Error(quotationError.message)
  }

  const quotationItems = items.map((item) => ({
    quotation_id: quotationData.id,
    product_name: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    discount: item.discount,
    amount: item.amount,
  }))

  const { error: itemsError } = await supabase
    .from('quotation_items')
    .insert(quotationItems)

  if (itemsError) {
    // Remove the quotation if its items could not be saved.
    await supabase
      .from('quotations')
      .delete()
      .eq('id', quotationData.id)

    throw new Error(itemsError.message)
  }

  return quotationData
}

export async function getQuotations(userId) {
  if (!userId) {
    throw new Error('A user ID is required to load quotations.')
  }

  const { data, error } = await supabase
    .from('quotations')
    .select('id, quotation_number, customer_name, total, quotation_date')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getQuotationById(id) {
  const { data, error } = await supabase
    .from('quotations')
    .select(`
      *,
      quotation_items (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteQuotation(id) {
  const { error } = await supabase
    .from('quotations')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}
