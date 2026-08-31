# Triple S Production — Software Quotation Management System

## 1. Assignment Overview

### Company
Triple S Production

### Position
Software Developer Intern

### Assignment
Software Quotation Management System

### Assignment Time Limit
48 hours from the time the assignment is shared.

### Current Project Constraint
The available implementation time for this project is limited. Therefore,
mandatory requirements must be completed, tested, and deployed before
optional bonus features are considered.

---

## 2. Project Objective

Build a functional web application for a software/finance software
company that allows an authenticated user to:

1. Log in
2. Create a quotation
3. Add one or more products/services
4. Automatically calculate quotation amounts
5. Save the quotation in Supabase
6. View previously created quotations
7. View an individual quotation
8. Delete a quotation
9. Deploy the application to Vercel

The expected core workflow is:

Login
→ Create Quotation
→ Add Products
→ Automatically Calculate Total
→ Save to Supabase
→ View Quotations
→ View Individual Quotation
→ Delete Quotation
→ Deploy on Vercel

---

## 3. Required Technology Stack

The assignment specifies the following technology:

### Frontend
- React.js or Next.js

### Backend and Database
- Supabase

### Authentication
- Supabase Authentication

### Deployment
- Vercel

### Programming Language
- JavaScript or TypeScript

### Version Control
- Git
- GitHub

### Styling
Any suitable UI library may be used, including:
- Tailwind CSS
- Bootstrap
- Material UI
- Another suitable UI library

---

## 4. Authentication Requirements

The application must provide a simple login page using
Supabase Authentication.

### Login fields
- Email
- Password

### Required functionality
- Login button
- Successful login
- Redirect to the quotation management page after successful login
- Logout functionality

---

## 5. Quotation Management Requirements

After authentication, the user must be able to:

- Create a new quotation
- View previously created quotations
- View an individual quotation
- Delete a quotation

---

## 6. Create Quotation Form

The quotation form must contain the following information.

### 6.1 Customer Information

Required fields:
- Customer Name
- Company Name
- Email
- Phone

### 6.2 Quotation Information

Required fields:
- Quotation Number
- Quotation Date
- Valid Until

### 6.3 Product / Service Information

The user must be able to add one or more products/services.

Each product/service row must contain:
- Product Name
- Quantity
- Unit Price
- Discount

The form must provide:
- Add Product functionality
- Ability to remove product rows

---

## 7. Automatic Calculation Requirements

Quotation amounts must be calculated automatically whenever:
- Quantity changes
- Unit Price changes
- Discount changes

The calculation formulas specified by the assignment are:

### Gross Amount
Gross Amount = Quantity × Unit Price

### Discount Amount
Discount Amount = Gross Amount × Discount %

### Net Amount
Net Amount = Gross Amount − Discount Amount

### Subtotal
Subtotal = Sum of all Net Amounts

### GST
GST = Subtotal × GST %

### Grand Total
Grand Total = Subtotal + GST

---

## 8. Required Calculation Example

The assignment provides the following example:

Product:
Accounting Software

Quantity:
2

Unit Price:
₹25,000

Discount:
5%

GST:
18%

Expected calculation:

Gross Amount = ₹50,000
Discount Amount = ₹2,500
Subtotal = ₹47,500
GST = ₹8,550
Grand Total = ₹56,050

This example must be used as one of the validation/test cases for the
calculation implementation.

---

## 9. Supabase Database Requirements

When the user clicks Save Quotation, the quotation and its items must
be stored in Supabase.

The assignment suggests two database tables.

### 9.1 quotations

Suggested fields:

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

### 9.2 quotation_items

Suggested fields:

- id
- quotation_id
- product_name
- quantity
- unit_price
- discount
- amount

The assignment allows a different database structure if the design can
be explained.

---

## 10. Quotation List Requirements

Previously created quotations must be displayed in a table.

The table must include at least:
- Quotation Number
- Customer
- Amount
- Date
- View
- Delete

---

## 11. Individual Quotation Requirements

When the user selects View, the application must display the quotation
in a clean and professional format.

The individual quotation view must contain:
- Customer details
- Quotation details
- Products
- Quantity
- Price
- Discount
- Subtotal
- GST
- Grand Total

---

## 12. Validation Requirements

The application must implement basic validation.

### Customer Name
- Required

### Email
- Must be a valid email

### Quantity
- Must be greater than 0

### Price
- Cannot be negative

### Products
- At least one product is required

### Quotation Date
- Required

Validation errors should be presented to the user clearly.

---

## 13. UI / UX Requirements

The application should provide:
- Clean and professional interface
- Responsive layout
- Clear buttons
- Clear form labels
- Readable quotation table
- Loading states where appropriate
- User-friendly error messages

---

## 14. GitHub Requirements

The GitHub repository must contain:
- Source code
- README.md
- .env.example

The repository must not contain:
- Actual passwords
- Private keys
- Supabase service-role keys
- Other sensitive credentials

Git must be used during development.

---

## 15. Deployment Requirements

The completed application must be deployed to Vercel.

The submitted application must be accessible through the live
deployment URL.

---

## 16. README Requirements

The README.md must contain:
- Project overview
- Features
- Technology stack
- Installation instructions
- Required environment variables
- Supabase setup
- Deployment information

---

## 17. Optional Bonus Features

These features are optional and should only be considered after all
mandatory requirements are complete and working:

- Edit quotation
- Search quotations
- Filter quotations
- PDF generation
- Print quotation
- GST selection
- Basic dashboard

---

## 18. Final Submission Requirements

The final submission must include:
- GitHub Repository URL
- Live Vercel URL
- Test Login Credentials
- README.md

---

## 19. Mandatory Acceptance Criteria

The project is considered functionally complete only when the following
core flow works:

Login
↓
Create Quotation
↓
Enter Customer Information
↓
Enter Quotation Information
↓
Add Product(s)
↓
Automatic Calculation
↓
Save Quotation to Supabase
↓
View Quotation List
↓
View Individual Quotation
↓
Delete Quotation
↓
Verify Application on Vercel

---

## 20. Development Priority

### Priority 1 — Mandatory functionality

The following must be completed first:

1. React/Next.js application
2. Supabase setup
3. Supabase Authentication
4. Login
5. Logout
6. Quotation creation form
7. Dynamic product rows
8. Automatic calculations
9. Validation
10. Save quotation
11. Quotation list
12. Individual quotation view
13. Delete quotation
14. Responsive/professional UI
15. Loading states
16. Error handling
17. GitHub repository
18. Vercel deployment
19. README
20. Test login credentials

### Priority 2 — Optional functionality

Only after all Priority 1 requirements are working and tested:

- Edit
- Search
- Filter
- PDF
- Print
- GST selection
- Dashboard

---

## 21. Source of Truth

This document represents the requirements extracted from the
Triple S Production Software Developer Intern Technical Assignment.

The implementation should satisfy this document.

When making technical decisions, the assignment requirements take
priority over unnecessary features or complexity.

If a requirement is not specified by the assignment, the implementation
should choose a simple, maintainable solution that does not conflict
with the mandatory requirements.