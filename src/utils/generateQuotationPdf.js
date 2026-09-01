import { jsPDF } from 'jspdf'

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 18
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const TABLE_COLUMNS = [76, 18, 28, 20, 32]

function formatCurrency(amount) {
  const value = Number(amount ?? 0)

  return `INR ${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(date) {
  if (!date) {
    return '-'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '-'
  }

  return parsedDate.toLocaleDateString('en-IN')
}

function drawLine(doc, y) {
  doc.setDrawColor(220, 224, 230)
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
}

function drawTableHeader(doc, y) {
  const headers = [
    'Product / Service',
    'Qty',
    'Unit Price',
    'Discount',
    'Amount',
  ]

  let x = MARGIN

  doc.setFillColor(31, 41, 55)
  doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)

  headers.forEach((header, index) => {
    const width = TABLE_COLUMNS[index]
    const isAmount = index === headers.length - 1

    doc.text(
      header,
      isAmount ? x + width - 2 : x + 2,
      y + 5.2,
      {
        align: isAmount ? 'right' : 'left',
      },
    )

    x += width
  })

  return y + 8
}

function drawTableRow(doc, item, y) {
  const productName = String(item.product_name || '-')

  const productLines = doc.splitTextToSize(
    productName,
    TABLE_COLUMNS[0] - 4,
  )

  const rowHeight = Math.max(
    9,
    productLines.length * 4.2 + 4,
  )

  let x = MARGIN

  doc.setDrawColor(229, 231, 235)
  doc.rect(
    MARGIN,
    y,
    CONTENT_WIDTH,
    rowHeight,
  )

  doc.setFontSize(8.5)
  doc.setTextColor(55, 65, 81)

  doc.setFont('helvetica', 'bold')
  doc.text(productLines, x + 2, y + 5)

  x += TABLE_COLUMNS[0]

  doc.setFont('helvetica', 'normal')
  doc.text(
    String(item.quantity ?? '-'),
    x + 2,
    y + 5,
  )

  x += TABLE_COLUMNS[1]
  
  doc.text(
    formatCurrency(item.unit_price),
    x + 2,
    y + 5,
  )

  x += TABLE_COLUMNS[2]

  doc.text(
    `${Number(item.discount ?? 0)}%`,
    x + 2,
    y + 5,
  )

  x += TABLE_COLUMNS[3]

  // Amount
  doc.setFont('helvetica', 'bold')
  doc.text(
    formatCurrency(item.amount),
    x + TABLE_COLUMNS[4] - 2,
    y + 5,
    {
      align: 'right',
    },
  )

  return y + rowHeight
}

function drawSummary(doc, quotation, y) {
  const summaryWidth = 70
  const summaryX =
    PAGE_WIDTH - MARGIN - summaryWidth

  doc.setFillColor(249, 250, 251)

  doc.roundedRect(
    summaryX,
    y,
    summaryWidth,
    34,
    2,
    2,
    'F',
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)

  doc.text(
    'Subtotal',
    summaryX + 4,
    y + 7,
  )

  doc.text(
    'GST',
    summaryX + 4,
    y + 14,
  )

  doc.text(
    'Grand Total',
    summaryX + 4,
    y + 25,
  )

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 41, 55)

  doc.text(
    formatCurrency(quotation.subtotal),
    summaryX + summaryWidth - 4,
    y + 7,
    {
      align: 'right',
    },
  )

  doc.text(
    formatCurrency(quotation.gst),
    summaryX + summaryWidth - 4,
    y + 14,
    {
      align: 'right',
    },
  )

  doc.setFontSize(11)

  doc.text(
    formatCurrency(quotation.total),
    summaryX + summaryWidth - 4,
    y + 25,
    {
      align: 'right',
    },
  )
}

function drawFooter(doc, quotationNumber) {
  const pageCount = doc.getNumberOfPages()

  for (
    let pageNumber = 1;
    pageNumber <= pageCount;
    pageNumber += 1
  ) {
    doc.setPage(pageNumber)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(107, 114, 128)

    doc.text(
      `Quotation ${quotationNumber}`,
      MARGIN,
      PAGE_HEIGHT - 10,
    )

    doc.text(
      `Page ${pageNumber} of ${pageCount}`,
      PAGE_WIDTH - MARGIN,
      PAGE_HEIGHT - 10,
      {
        align: 'right',
      },
    )
  }
}

export function downloadQuotationPdf(quotation) {
  if (!quotation) {
    throw new Error('Quotation data is missing.')
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const quotationNumber =
    String(
      quotation.quotation_number ||
        'quotation',
    ).trim()

  const items = Array.isArray(
    quotation.quotation_items,
  )
    ? quotation.quotation_items
    : []

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(31, 41, 55)

  doc.text(
    'Triple S Production',
    MARGIN,
    24,
  )

  doc.setFontSize(16)
  doc.setTextColor(37, 99, 235)

  doc.text(
    'QUOTATION',
    PAGE_WIDTH - MARGIN,
    24,
    {
      align: 'right',
    },
  )

  drawLine(doc, 30)

  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(31, 41, 55)

  doc.text(
    `Quotation No: ${quotationNumber}`,
    MARGIN,
    40,
  )

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)

  doc.text(
    `Quotation Date: ${formatDate(
      quotation.quotation_date,
    )}`,
    MARGIN,
    47,
  )

  doc.text(
    `Valid Until: ${formatDate(
      quotation.valid_until,
    )}`,
    MARGIN,
    54,
  )


  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(31, 41, 55)

  doc.text(
    'CUSTOMER INFORMATION',
    MARGIN,
    68,
  )

  drawLine(doc, 72)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)

  doc.text(
    'Customer Name',
    MARGIN,
    81,
  )

  doc.text(
    'Company Name',
    108,
    81,
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(31, 41, 55)

  doc.text(
    String(
      quotation.customer_name || '-',
    ),
    MARGIN,
    87,
  )

  doc.text(
    String(
      quotation.company_name || '-',
    ),
    108,
    87,
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99)

  doc.text('Email', MARGIN, 99)
  doc.text('Phone', 108, 99)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(31, 41, 55)

  doc.text(
    String(quotation.email || '-'),
    MARGIN,
    105,
  )

  doc.text(
    String(quotation.phone || '-'),
    108,
    105,
  )



  let y = 121

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(31, 41, 55)

  doc.text('ITEMS', MARGIN, y)

  y = drawTableHeader(doc, y + 5)

  items.forEach((item) => {
    const productLines =
      doc.splitTextToSize(
        String(
          item.product_name || '-',
        ),
        TABLE_COLUMNS[0] - 4,
      )

    const rowHeight = Math.max(
      9,
      productLines.length * 4.2 + 4,
    )

    if (
      y + rowHeight >
      PAGE_HEIGHT - MARGIN - 20
    ) {
      doc.addPage()

      doc.setFont(
        'helvetica',
        'normal',
      )
      doc.setFontSize(8)
      doc.setTextColor(
        107,
        114,
        128,
      )

      doc.text(
        `Quotation ${quotationNumber} - Items continued`,
        MARGIN,
        18,
      )

      y = drawTableHeader(
        doc,
        24,
      )
    }

    y = drawTableRow(
      doc,
      item,
      y,
    )
  })


  if (
    y + 42 >
    PAGE_HEIGHT - MARGIN - 20
  ) {
    doc.addPage()
    y = MARGIN
  }

  drawSummary(
    doc,
    quotation,
    y + 8,
  )


  drawFooter(
    doc,
    quotationNumber,
  )


  const safeQuotationNumber =
    quotationNumber
      .replace(
        /[^a-zA-Z0-9_-]/g,
        '-',
      )
      .replace(
        /-+/g,
        '-',
      )
      .replace(
        /^-|-$/g,
        '',
      ) || 'quotation'

  const fileName =
    `Quotation-${safeQuotationNumber}.pdf`

  doc.save(fileName)
}