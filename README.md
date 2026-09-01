# ⚡ Triple S Production — Quotation Management System

A professional quotation and estimate management application for creating, managing, calculating, and exporting customer quotations. Built with **React, Supabase Auth, PostgreSQL, Row Level Security (RLS), Tailwind CSS, and jsPDF**.

## 🔗 Project

- **GitHub Repository:** https://github.com/dhruviprajapati/triple-s-quotation-system
- **Live Application:** https://triple-s-quotation-system.vercel.app

## 🔐 Demo Accounts

| Email | Password |
|---|---|
| `triple-s-demo@yourdomain.com` | `TripleS@Demo2026!` |
| `aditi@gmail.com` | `Ad@123` |

> These credentials are provided for testing the application only.

---

## 📌 Overview

Triple S Production manages the quotation workflow from data entry to calculation, storage, editing, deletion, printing, and PDF export.

### Core Features

- Secure email/password authentication
- Protected application routes
- User-level quotation data isolation
- Complete quotation CRUD
- Multiple line items per quotation
- Automatic discount and GST calculations
- Search, filtering, sorting, and pagination
- Dashboard metrics
- Detailed quotation view
- Browser printing
- Branded PDF export

---

## 🔄 How It Works

```text
Login
  ↓
Dashboard
  ↓
Create Quotation
  ↓
Add Items + Quantity + Price + Discount
  ↓
Calculate Subtotal + GST
  ↓
Save Quotation
  ↓
View / Edit / Delete
  ↓
Export PDF / Print
```

The application keeps quotation calculations in reusable utility functions and persists quotation data in PostgreSQL.

---

# ✨ Key Features

### Authentication

Authentication is handled by **Supabase Auth** with:

- Email/password login
- Password visibility toggle
- Validation and error feedback
- Protected routes
- Persistent sessions
- Secure sign-out

### Quotation Management

Users can create quotations containing customer details, quotation dates, GST rates, and multiple products/services.

The quotation workspace supports:

- Create
- View
- Edit
- Delete
- Search
- Sort
- Date filtering
- Pagination

### Dashboard & Analytics

Dashboard metrics include:

- Total Quotations
- Gross Portfolio Valuation
- Average Quotation Value

Search supports quotation number, customer name, and company name.

Date presets include **All Time, Today, This Week, and This Month**.

### PDF & Printing

Quotation details can be exported using **jsPDF** or printed through a dedicated print stylesheet.

Generated documents include customer details, quotation metadata, itemized charges, discounts, GST, subtotal, and grand total.

---

# 💰 Financial Calculation Logic

Implemented in `src/utils/quotationCalculations.js`.

```text
Gross Amount    = Quantity × Unit Price
Discount Amount = Gross Amount × (Discount % / 100)
Net Amount      = Gross Amount − Discount Amount

Subtotal        = Sum of Net Amounts
GST Amount      = Subtotal × (GST Rate / 100)
Grand Total     = Subtotal + GST Amount
```

Supported GST rates:

**0% · 5% · 18% · 40%**

Keeping this logic outside the UI components makes the financial rules reusable and easier to maintain.

---

# 🔐 Security & Data Isolation

The application uses **Supabase PostgreSQL Row Level Security (RLS)** to enforce quotation ownership at the database layer.

Each quotation is associated with the authenticated user through `user_id`.

```text
User
 ↓
Supabase Auth
 ↓
auth.uid()
 ↓
PostgreSQL RLS
 ↓
User's Quotations
 ↓
Quotation Items
```

RLS policies ensure users can only access, create, update, or delete quotations belonging to their authenticated account. Quotation item policies verify ownership through the parent quotation.

> The current implementation provides **user-level data isolation**, rather than organization-level multi-tenancy.

---

# 🗄️ Database Design

The application uses two related PostgreSQL tables:

### `quotations`

Stores customer information, quotation metadata, financial totals, GST rate, and ownership.

### `quotation_items`

Stores individual products/services, quantity, unit price, discount, and calculated amount.

### Relationship

```text
auth.users
    │
    │ 1 : N
    ▼
quotations
    │
    │ 1 : N
    ▼
quotation_items
```

`quotation_items.quotation_id` references `quotations.id` with **ON DELETE CASCADE**.

### RLS Setup

Enable RLS on both tables and create policies based on:

```sql
auth.uid() = quotations.user_id
```

For quotation items, ownership is checked through the related quotation.

> The complete SQL schema and RLS policies can be recreated from the application's database configuration.

---

# 🧠 Engineering Highlights

- **Database-level authorization:** PostgreSQL RLS enforces ownership instead of relying only on frontend filtering.
- **Modular business logic:** Financial calculations, filtering, sorting, and PDF generation are separated into utility modules.
- **Relational data modelling:** Quotations and line items use PostgreSQL foreign-key relationships.
- **Service layer:** Authentication and quotation database operations are isolated in dedicated service modules.
- **Component-based UI:** Dashboard, forms, filters, table, details, login, and confirmation modal are separated into focused React components.

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Authentication | Supabase Auth |
| Database | PostgreSQL |
| Security | PostgreSQL Row Level Security |
| Backend Platform | Supabase |
| PDF Generation | jsPDF |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

# 📁 Project Structure

```text
triple-s-quotation-system/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── DeleteQuotationModal.jsx
│   │   ├── Login.jsx
│   │   ├── QuotationDetails.jsx
│   │   ├── QuotationFilters.jsx
│   │   ├── QuotationForm.jsx
│   │   └── QuotationTable.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── useAuth.js
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── services/
│   │   ├── authService.js
│   │   └── quotationService.js
│   ├── utils/
│   │   ├── generateQuotationPdf.js
│   │   ├── quotationCalculations.js
│   │   └── quotationUtils.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# ⚙️ Local Setup

### 1. Clone

```bash
git clone https://github.com/dhruviprajapati/triple-s-quotation-system.git
cd triple-s-quotation-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Do not commit `.env.local` or private credentials.

### 4. Configure Supabase

Create a Supabase project, enable email/password authentication, create the `quotations` and `quotation_items` tables, and enable the RLS policies described above.

### 5. Start the application

```bash
npm run dev
```

The development server normally runs at:

```text
http://localhost:5173
```

---

# 🔒 Security Notes

- Supabase Auth handles authentication.
- PostgreSQL RLS handles user-level authorization.
- Foreign keys maintain relational integrity.
- `ON DELETE CASCADE` removes dependent quotation items when a quotation is deleted.
- Protected frontend routes prevent unauthenticated workspace access.
- Supabase configuration is supplied through environment variables.
- A Supabase service-role key must never be exposed in the frontend.

---

# 🚧 Future Improvements

- Organization-level multi-tenancy
- Role-based permissions
- Quotation status workflow
- Customer management
- Email quotation delivery
- Automated quotation numbering
- Audit logs
- Payment tracking
- Server-side PDF generation
- Quotation expiry notifications
- Automated testing
- Advanced reporting

---

# 👩‍💻 Author

**Dhruvi Prajapati**

Computer Science Engineering | Full Stack Developer
