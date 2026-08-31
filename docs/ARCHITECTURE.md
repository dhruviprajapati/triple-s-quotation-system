# Software Quotation Management System — Architecture

## 1. Architecture Goal

Build a simple, reliable, maintainable quotation management application
that satisfies the Triple S Production technical assignment within the
available development time.

The architecture should prioritize:

- Correctness
- Simplicity
- Maintainability
- Security
- Clear separation of responsibilities
- Easy testing
- Fast development

Avoid unnecessary libraries, abstractions, or architecture that do not
directly support the assignment requirements.

---

# 2. Technology Stack

## Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS

## Backend / Database

- Supabase
- PostgreSQL

## Authentication

- Supabase Authentication

## Deployment

- Vercel

## Version Control

- Git
- GitHub

---

# 3. High-Level Architecture

The application will use a frontend-first architecture with Supabase
providing authentication and database services.

```text
┌─────────────────────────────┐
│          React App          │
│                             │
│  Pages / UI Components      │
│  Forms                      │
│  Validation                 │
│  Calculation Logic          │
│  Application State          │
└──────────────┬──────────────┘
               │
               │ Supabase Client
               │
               ▼
┌─────────────────────────────┐
│          Supabase           │
│                             │
│  Authentication             │
│  PostgreSQL Database        │
│  Row Level Security         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       PostgreSQL            │
│                             │
│  quotations                 │
│  quotation_items            │
└─────────────────────────────┘
```

There will not be a separate Node.js/Express backend unless a specific
requirement later makes one necessary.

The assignment requires Supabase for the backend and database, so the
initial implementation will use Supabase directly from the React
application.

---

# 4. Application Flow

The primary application flow is:

```text
User
 │
 ▼
Login Page
 │
 │ Supabase Authentication
 ▼
Authenticated Session
 │
 ▼
Quotation Management
 │
 ├── View Quotations
 │
 └── Create Quotation
        │
        ├── Customer Information
        ├── Quotation Information
        ├── Product Items
        └── Automatic Calculation
                 │
                 ▼
            Save Quotation
                 │
                 ▼
             Supabase
                 │
                 ▼
        Quotation List / View
                 │
                 ▼
              Delete
```

---

# 5. Authentication Architecture

Supabase Authentication will manage user authentication.

The application will:

- Display a login form.
- Accept email and password.
- Send credentials to Supabase Authentication.
- Handle successful authentication.
- Maintain the authenticated session.
- Allow the authenticated user to access quotation functionality.
- Provide logout functionality.
- Prevent unauthenticated users from accessing protected application
  functionality.

The application will not implement its own password hashing or custom
authentication system.

---

# 6. Database Architecture

The initial database design will use two primary tables:

```text
quotations
     │
     │ 1 : many
     ▼
quotation_items
```

A quotation can contain multiple quotation items.

---

# 7. quotations Table

The quotation table will contain quotation-level information.

Planned fields:

- id
- quotation_number
- customer_name
- company_name
- email
- phone
- quotation_date
- valid_until
- subtotal
- gst
- total
- created_at

Purpose:

- Store customer information
- Store quotation information
- Store calculated quotation totals
- Identify the quotation

---

# 8. quotation_items Table

The quotation items table will contain product/service-level
information.

Planned fields:

- id
- quotation_id
- product_name
- quantity
- unit_price
- discount
- amount

Purpose:

- Store each product/service belonging to a quotation
- Store quantity
- Store unit price
- Store discount
- Store calculated item amount
- Associate the item with its parent quotation

---

# 9. Database Relationship

The relationship will be:

```text
quotations.id
     │
     │
     └───────────────< quotation_items.quotation_id
```

Meaning:

- One quotation can have many quotation items.
- Every quotation item belongs to one quotation.

The quotation_id field will reference the related quotation.

---

# 10. Row Level Security

Supabase Row Level Security will be considered part of the database
security design.

The application must not rely only on frontend checks to protect
quotation data.

Database access rules must be reviewed before production deployment.

The final RLS policies must ensure that authenticated users can perform
only the operations intended by the application.

Exact policies will be defined during Supabase setup after the
authentication and database structure are established.

---

# 11. Quotation Creation Flow

When creating a quotation:

```text
User enters customer information
             ↓
User enters quotation information
             ↓
User adds product/service
             ↓
User enters quantity
             ↓
User enters unit price
             ↓
User enters discount
             ↓
Application calculates item amount
             ↓
Application calculates subtotal
             ↓
Application calculates GST
             ↓
Application calculates grand total
             ↓
User clicks Save Quotation
             ↓
Quotation data saved
             ↓
Quotation items saved
```

---

# 12. Calculation Architecture

Quotation calculations should be implemented as deterministic business
logic rather than being tightly coupled to UI markup.

The calculation flow is:

```text
Product Input
     ↓
Gross Amount
     ↓
Discount Amount
     ↓
Net Amount
     ↓
Subtotal
     ↓
GST
     ↓
Grand Total
```

Formulas:

```text
Gross Amount = Quantity × Unit Price

Discount Amount = Gross Amount × Discount / 100

Net Amount = Gross Amount − Discount Amount

Subtotal = Sum of all Net Amounts

GST = Subtotal × GST / 100

Grand Total = Subtotal + GST
```

The calculation logic must be testable independently from the visual
components where practical.

---

# 13. Frontend Responsibility

React will be responsible for:

- Rendering the user interface
- Managing form state
- Managing product rows
- Handling user input
- Performing client-side validation
- Displaying calculation results
- Displaying loading states
- Displaying errors
- Calling Supabase
- Displaying quotations
- Handling navigation between application views

---

# 14. Supabase Responsibility

Supabase will be responsible for:

- User authentication
- User session management
- PostgreSQL database
- Database queries
- Database persistence
- Row Level Security

---

# 15. Suggested Frontend Structure

The exact structure may be adjusted during implementation, but the
application should follow a clear separation between pages, components,
services, and business logic.

Initial direction:

```text
src/
│
├── components/
│   ├── Navbar
│   ├── ProductRow
│   ├── QuotationForm
│   ├── QuotationTable
│   └── Loading
│
├── pages/
│   ├── Login
│   ├── Quotations
│   ├── CreateQuotation
│   └── ViewQuotation
│
├── lib/
│   └── supabase
│
├── services/
│   └── quotationService
│
├── utils/
│   └── quotationCalculations
│
├── App
└── main
```

The structure can be simplified if a smaller implementation is more
appropriate.

Do not create files or abstractions solely to make the project appear
more complex.

---

# 16. Data Flow

The expected data flow is:

```text
UI
 ↓
React State
 ↓
Validation
 ↓
Business Logic
 ↓
Supabase Client
 ↓
Supabase
 ↓
PostgreSQL
```

For reading data:

```text
PostgreSQL
 ↓
Supabase
 ↓
Supabase Client
 ↓
React
 ↓
UI
```

---

# 17. Save Strategy

Saving a quotation involves two related pieces of data:

```text
Quotation
+
Quotation Items
```

The implementation must ensure that quotation items are associated
with the correct quotation.

The save operation must be tested with:

- One product
- Multiple products
- Correct calculated totals
- Valid customer information
- Valid quotation information

If the chosen implementation requires a transaction or database
function to maintain atomicity, that decision will be documented before
implementation.

---

# 18. Delete Strategy

Deleting a quotation must also account for its related quotation items.

The implementation must ensure that deleting a quotation does not
leave unintended orphaned quotation items.

The exact database deletion behavior will be determined during database
setup and documented in the project decisions.

---

# 19. Validation Strategy

Validation will happen before attempting to save a quotation.

Required validation includes:

```text
Customer Name
    → Required

Email
    → Valid email format

Quantity
    → Greater than 0

Unit Price
    → Cannot be negative

Products
    → At least one product

Quotation Date
    → Required
```

User-friendly validation messages must be displayed.

---

# 20. Error Handling Strategy

The application should handle common failure scenarios gracefully.

Examples:

- Invalid login
- Authentication failure
- Database query failure
- Failed quotation save
- Failed quotation retrieval
- Failed quotation deletion
- Invalid form input
- Missing required data

The user should receive a clear message rather than a raw technical
error.

Technical details may be logged during development where useful, but
sensitive information must never be exposed to users.

---

# 21. Loading State Strategy

Loading states should be displayed when an operation takes time.

Examples:

- Login
- Loading quotation list
- Saving quotation
- Loading individual quotation
- Deleting quotation

Buttons should provide appropriate feedback when an operation is in
progress to reduce accidental duplicate actions.

---

# 22. Security Principles

The application must follow these principles:

- Never expose Supabase service-role credentials in frontend code.
- Never commit secrets to GitHub.
- Use environment variables for application credentials.
- Use Supabase Authentication for authentication.
- Use Row Level Security for database protection.
- Validate user input.
- Do not trust frontend-only authorization checks.
- Do not store passwords manually.

---

# 23. Deployment Architecture

The production architecture will be:

```text
User
 │
 ▼
Vercel
 │
 ▼
React Application
 │
 ▼
Supabase
 ├── Authentication
 └── PostgreSQL
```

Environment variables required by the frontend will be configured in
Vercel.

The production deployment must be tested independently from local
development.

---

# 24. Development Principles

## Principle 1 — Core Requirements First

Mandatory assignment requirements must be completed before bonus
features.

## Principle 2 — Small Changes

Implement one feature at a time.

## Principle 3 — Test Before Moving Forward

A feature is not considered complete simply because its code exists.

## Principle 4 — Preserve Working Features

Changes to one feature should not unnecessarily break another feature.

## Principle 5 — Avoid Overengineering

The project has a limited development window.

Simple and reliable is preferred over complex and impressive-looking.

## Principle 6 — Understand AI-Generated Code

AI tools may assist with implementation, debugging, testing, and review,
but generated code must be understood and reviewed before acceptance.

## Principle 7 — Assignment Compliance

The assignment requirements are more important than adding unnecessary
technical features.

---

# 25. Architecture Status

This document describes the initial architecture direction.

Some implementation details will be finalized during development,
especially:

- Exact Supabase RLS policies
- Exact database constraints
- Exact frontend folder structure
- Navigation implementation
- Save/delete implementation details

When these decisions are finalized, they must be reflected in the
project documentation rather than being silently changed.