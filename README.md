# ⚡ Triple S Production — Quotation Management System

A professional quotation and estimate management application for creating, managing, calculating, and exporting customer quotations. Built with React, Supabase Authentication, PostgreSQL, Row Level Security (RLS), Tailwind CSS, and jsPDF.

## 🔗 Project

- **GitHub Repository:** https://github.com/dhruviprajapati/triple-s-quotation-system
- **Live Demo:** Not provided

## 🔐 Demo Accounts

Use either test account to explore the application:

| Email | Password |
|---|---|
| `triple-s-demo@yourdomain.com` | `TripleS@Demo2026!` |
| `aditi@gmail.com` | `Ad@123` |

> These credentials are for testing the application only. Do not use them for real customer data.

---

## 📌 Overview

Triple S Production manages the quotation workflow from data entry through calculation, review, editing, deletion, printing, and PDF export.

### Core capabilities

- Secure email/password authentication
- Protected application routes
- User-level quotation data isolation
- Create, read, update, and delete quotations
- Multiple line items per quotation
- Automatic discount and GST calculations
- Search, filtering, sorting, and pagination
- Dashboard quotation metrics
- Detailed quotation view
- Browser printing
- Branded PDF export
- PostgreSQL constraints and Row Level Security policies

---

# ✨ Features

## 1. Authentication & Session Management

Authentication is handled by **Supabase Auth**.

- Email and password login
- Password visibility toggle
- Form validation
- Authentication error feedback
- Protected workspace routes
- Persistent authentication session
- Authenticated user information in the navigation area
- Secure sign-out

Unauthenticated users cannot access protected application areas.

---

## 2. Quotation Management

The application supports the complete quotation CRUD lifecycle.

### Create Quotation

A quotation can contain:

- Quotation number
- Customer name
- Company name
- Email
- Phone number
- Quotation date
- Valid-until date
- Multiple quotation items
- Product/service name
- Quantity
- Unit price
- Discount percentage
- GST rate

### View Quotations

The quotation table provides:

- Quotation reference numbers
- Customer and company information
- Quotation amounts
- Date information
- Search
- Sorting
- Date filtering
- Pagination
- View, edit, and delete actions

### Edit Quotation

Existing quotations can be updated without recreating the record. Items can be added or removed and financial values are recalculated automatically.

### Delete Quotation

Deletion is protected by a confirmation modal to reduce accidental destructive actions.

Quotation items reference their parent quotation with `ON DELETE CASCADE`.

---

# 💰 Financial Calculation Logic

Financial calculations are implemented in `src/utils/quotationCalculations.js`.

For each line item:

```text
Gross Amount = Quantity × Unit Price

Discount Amount = Gross Amount × (Discount % / 100)

Net Amount = Gross Amount − Discount Amount
```

For the quotation:

```text
Subtotal = Sum of all Net Amounts

GST Amount = Subtotal × (GST Rate / 100)

Grand Total = Subtotal + GST Amount
```

Supported GST rates:

```text
0%
5%
18%
40%
```

Keeping financial logic outside React components makes the calculation rules reusable and easier to maintain.

---

# 🔎 Search, Filtering & Analytics

## Search

Search quotations by:

- Quotation number
- Customer name
- Company name

## Date Filters

- All Time
- Today
- This Week
- This Month

## Sorting & Pagination

Quotation records can be sorted and displayed through paginated table results.

## Dashboard Metrics

The dashboard summarizes the quotation portfolio with:

- Total Quotations
- Gross Portfolio Valuation
- Average Quotation Value

---

# 📄 PDF Export & Printing

Quotation documents can be generated directly from application data.

## PDF Export

PDF generation uses **jsPDF** and includes:

- Company branding
- Quotation number
- Customer information
- Company information
- Quotation date
- Valid-until date
- Itemized products/services
- Quantity
- Unit price
- Discount
- Subtotal
- GST
- Grand total

## Browser Printing

Dedicated print styles are included for cleaner browser print output.

---

# 🔐 Security & Data Isolation

The application uses **Supabase PostgreSQL with Row Level Security (RLS)** to enforce quotation ownership at the database layer.

Each quotation stores the authenticated user's ID:

```sql
user_id uuid not null references auth.users(id) on delete cascade
```

RLS policies use `auth.uid()` to ensure users can access only their own quotation records.

### Security flow

```text
Authenticated User
       ↓
 Supabase Auth
       ↓
   auth.uid()
       ↓
 PostgreSQL RLS
       ↓
 User-owned Quotations
       ↓
 Quotation Items
```

Quotation item policies verify ownership through the parent quotation before allowing access.

> The current model provides **user-level data isolation**. It is not organization-level multi-tenancy because quotations are linked directly to individual users rather than an organization/tenant entity.

---

# 🗄️ Database Schema

The application uses two main relational tables.

## `quotations`

```text
quotations
├── id
├── user_id
├── quotation_number
├── customer_name
├── company_name
├── email
├── phone
├── quotation_date
├── valid_until
├── subtotal
├── gst_rate
├── gst
├── total
└── created_at
```

## `quotation_items`

```text
quotation_items
├── id
├── quotation_id
├── product_name
├── quantity
├── unit_price
├── discount
└── amount
```

### Relationship

```text
auth.users
    │
    │ 1
    ▼
quotations
    │
    │ 1 : N
    ▼
quotation_items
```

Quotation items reference their parent quotation through a foreign key with cascading deletion.

---

# 🧠 Engineering Highlights

### Database-level authorization

PostgreSQL RLS policies enforce ownership directly in the database rather than relying only on frontend filtering.

### Modular business logic

Financial calculations, filtering, sorting, and PDF generation are separated into reusable utility modules.

### Relational data modelling

Quotation headers and quotation items are stored as related PostgreSQL tables with foreign-key constraints.

### Service layer

Authentication and quotation database operations are separated into dedicated service modules.

### Reusable React components

Major application areas are separated into focused components for the dashboard, quotation form, quotation table, filters, details, login, and delete confirmation.

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Authentication | Supabase Auth |
| Database | PostgreSQL |
| Database Security | PostgreSQL Row Level Security (RLS) |
| Backend Platform | Supabase |
| PDF Generation | jsPDF |
| Deployment | Vercel |
| Version Control | Git & GitHub |

---

# 📁 Project Structure

```text
triple-s-quotation-system/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── DeleteQuotationModal.jsx
│   │   ├── Login.jsx
│   │   ├── QuotationDetails.jsx
│   │   ├── QuotationFilters.jsx
│   │   ├── QuotationForm.jsx
│   │   └── QuotationTable.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── useAuth.js
│   │
│   ├── lib/
│   │   └── supabaseClient.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   └── quotationService.js
│   │
│   ├── utils/
│   │   ├── generateQuotationPdf.js
│   │   ├── quotationCalculations.js
│   │   └── quotationUtils.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/dhruviprajapati/triple-s-quotation-system.git
cd triple-s-quotation-system
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Do not commit `.env.local` or private credentials to GitHub.

## 4. Configure Supabase

Create a Supabase project, configure authentication, and create the database tables and RLS policies described below.

## 5. Run the development server

```bash
npm run dev
```

Vite will normally start the application at:

```text
http://localhost:5173
```

---

# 🗃️ Supabase Database Setup

Open the **SQL Editor** in your Supabase project.

## Create tables

```sql
create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quotation_number text not null,
  customer_name text not null,
  company_name text not null,
  email text not null,
  phone text not null,
  quotation_date date not null,
  valid_until date not null,
  subtotal numeric(12, 2) not null default 0,
  gst_rate numeric(5, 2) not null default 18
    check (gst_rate in (0, 5, 18, 40)),
  gst numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null
    references public.quotations(id)
    on delete cascade,
  product_name text not null,
  quantity numeric(12, 2) not null
    check (quantity > 0),
  unit_price numeric(12, 2) not null
    check (unit_price >= 0),
  discount numeric(5, 2) not null default 0
    check (discount >= 0 and discount <= 100),
  amount numeric(12, 2) not null default 0
);
```

## Enable Row Level Security

```sql
alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;
```

## Grants

```sql
grant usage on schema public to authenticated;

grant select, insert, update, delete
on table public.quotations
to authenticated;

grant select, insert, update, delete
on table public.quotation_items
to authenticated;
```

## Quotation RLS policies

```sql
create policy "Users can view their own quotations"
on public.quotations
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own quotations"
on public.quotations
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own quotations"
on public.quotations
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own quotations"
on public.quotations
for delete
to authenticated
using ((select auth.uid()) = user_id);
```

## Quotation item RLS policies

```sql
create policy "Users can view items from their quotations"
on public.quotation_items
for select
to authenticated
using (
  exists (
    select 1
    from public.quotations
    where quotations.id = quotation_items.quotation_id
      and quotations.user_id = (select auth.uid())
  )
);

create policy "Users can create items for their quotations"
on public.quotation_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.quotations
    where quotations.id = quotation_items.quotation_id
      and quotations.user_id = (select auth.uid())
  )
);

create policy "Users can update items from their quotations"
on public.quotation_items
for update
to authenticated
using (
  exists (
    select 1
    from public.quotations
    where quotations.id = quotation_items.quotation_id
      and quotations.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.quotations
    where quotations.id = quotation_items.quotation_id
      and quotations.user_id = (select auth.uid())
  )
);

create policy "Users can delete items from their quotations"
on public.quotation_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.quotations
    where quotations.id = quotation_items.quotation_id
      and quotations.user_id = (select auth.uid())
  )
);
```

---

# 🏗️ Application Architecture

```text
React Application
       │
       ├── Components
       │     ├── Dashboard
       │     ├── Login
       │     ├── Quotation Form
       │     ├── Quotation Table
       │     ├── Quotation Filters
       │     └── Quotation Details
       │
       ├── Context
       │     └── Authentication State
       │
       ├── Services
       │     ├── Authentication
       │     └── Quotation CRUD
       │
       └── Utilities
             ├── Financial Calculations
             ├── Search / Filter / Sort
             └── PDF Generation
                    │
                    ▼
                Supabase
                    │
              ┌─────┴─────┐
              ▼           ▼
        Supabase Auth  PostgreSQL
                           │
                           ▼
                          RLS
```

---

# 🔒 Security Notes

The project uses:

- Supabase Auth for authentication
- PostgreSQL RLS for user-level authorization
- Foreign-key constraints for relational integrity
- Cascading deletes for dependent quotation items
- Protected frontend routes
- Environment variables for Supabase configuration
- Database-level ownership checks rather than frontend filtering alone

> Never expose a Supabase service-role key in the frontend. The browser application should use only the public client configuration intended for RLS-protected access.

---

# 🚧 Future Improvements

Potential extensions include:

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
- Advanced reporting and analytics

---

# 👩‍💻 Author

**Dhruvi Prajapati**

Computer Science Engineering | Full Stack Developer

Focused on building practical web applications with React, JavaScript, backend services, databases, authentication, APIs, and modular application architecture.
