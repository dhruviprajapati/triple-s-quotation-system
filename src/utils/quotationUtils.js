function parseDateOnly(value) {
  if (!value) {
    return null
  }

  const stringValue = String(value).slice(
    0,
    10,
  )

  const [year, month, day] =
    stringValue.split('-').map(Number)

  if (
    !year ||
    !month ||
    !day
  ) {
    return null
  }

  const date = new Date(
    year,
    month - 1,
    day,
  )

  date.setHours(0, 0, 0, 0)

  return Number.isNaN(
    date.getTime(),
  )
    ? null
    : date
}

function startOfDay(date) {
  const result = new Date(date)

  result.setHours(0, 0, 0, 0)

  return result
}

function startOfWeek(date) {
  const result =
    startOfDay(date)

  const day = result.getDay()

  const daysFromMonday =
    day === 0 ? 6 : day - 1

  result.setDate(
    result.getDate() -
      daysFromMonday,
  )

  return result
}

function startOfMonth(date) {
  const result =
    startOfDay(date)

  result.setDate(1)

  return result
}

function isWithinDateFilter(
  dateValue,
  filter,
) {
  if (filter === 'all') {
    return true
  }

  const quotationDate =
    parseDateOnly(dateValue)

  if (!quotationDate) {
    return false
  }

  const today =
    startOfDay(new Date())

  if (filter === 'today') {
    return (
      quotationDate.getTime() ===
      today.getTime()
    )
  }

  if (filter === 'week') {
    const weekStart =
      startOfWeek(today)

    return (
      quotationDate >= weekStart &&
      quotationDate <= today
    )
  }

  if (filter === 'month') {
    const monthStart =
      startOfMonth(today)

    return (
      quotationDate >= monthStart &&
      quotationDate <= today
    )
  }

  return true
}

function normalizeSearchValue(
  value,
) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function matchesSearch(
  quotation,
  searchTerm,
) {
  const search =
    normalizeSearchValue(
      searchTerm,
    )

  if (!search) {
    return true
  }

  const searchableFields = [
    quotation.quotation_number,
    quotation.customer_name,
    quotation.company_name,
    quotation.email,
  ]

  return searchableFields.some(
    (field) =>
      normalizeSearchValue(
        field,
      ).includes(search),
  )
}

function compareValues(
  first,
  second,
) {
  if (
    typeof first === 'string' ||
    typeof second === 'string'
  ) {
    return String(first ?? '')
      .localeCompare(
        String(second ?? ''),
        undefined,
        {
          numeric: true,
          sensitivity: 'base',
        },
      )
  }

  return (
    Number(first ?? 0) -
    Number(second ?? 0)
  )
}

function getSortValue(
  quotation,
  sortBy,
) {
  switch (sortBy) {
    case 'quotation_number':
      return quotation.quotation_number

    case 'customer_name':
      return quotation.customer_name

    case 'company_name':
      return quotation.company_name

    case 'total':
      return Number(
        quotation.total ?? 0,
      )

    case 'date':
    default: {
      const date =
        parseDateOnly(
          quotation.quotation_date,
        )

      return date
        ? date.getTime()
        : 0
    }
  }
}

export function filterQuotations(
  quotations = [],
  searchTerm = '',
  dateFilter = 'all',
) {
  return quotations.filter(
    (quotation) => {
      return (
        matchesSearch(
          quotation,
          searchTerm,
        ) &&
        isWithinDateFilter(
          quotation.quotation_date,
          dateFilter,
        )
      )
    },
  )
}

export function sortQuotations(
  quotations = [],
  sortBy = 'date',
  sortDirection = 'desc',
) {
  const sorted = [...quotations]

  sorted.sort(
    (first, second) => {
      const firstValue =
        getSortValue(
          first,
          sortBy,
        )

      const secondValue =
        getSortValue(
          second,
          sortBy,
        )

      const comparison =
        compareValues(
          firstValue,
          secondValue,
        )

      return sortDirection ===
        'asc'
        ? comparison
        : -comparison
    },
  )

  return sorted
}

export function getFilteredAndSortedQuotations({
  quotations = [],
  searchTerm = '',
  dateFilter = 'all',
  sortBy = 'date',
  sortDirection = 'desc',
}) {
  const filtered =
    filterQuotations(
      quotations,
      searchTerm,
      dateFilter,
    )

  return sortQuotations(
    filtered,
    sortBy,
    sortDirection,
  )
}