# Triple S Production — Test Checklist

## 1. Purpose

This document contains the test checklist for the Software Quotation
Management System.

The purpose is to verify that all mandatory assignment requirements work
correctly before the project is submitted.

A test should be marked as completed only after the behavior has actually
been verified.

---

# 2. Testing Rules

For each feature:

1. Test the normal/expected behavior.
2. Test important invalid inputs.
3. Test relevant edge cases.
4. Verify that the UI gives appropriate feedback.
5. Verify that the database contains the expected data where applicable.
6. Verify that the feature does not break previously completed features.

Testing must be performed locally first and then again on the deployed
Vercel application before final submission.

---

# 3. Authentication Tests

## 3.1 Login Page

- [ ] Login page loads correctly
- [ ] Email field is visible
- [ ] Password field is visible
- [ ] Login button is visible
- [ ] Form labels are clear
- [ ] Login page is responsive

## 3.2 Successful Login

Test:

- Valid registered email
- Correct password

Expected:

- Login succeeds
- User is authenticated
- User reaches the quotation management area

- [ ] Passed

## 3.3 Invalid Login

Test:

- Registered email
- Incorrect password

Expected:

- Login does not succeed
- User receives a clear error message
- Application does not crash

- [ ] Passed

## 3.4 Empty Login Fields

Test:

- Empty email
- Empty password
- Empty form

Expected:

- Appropriate validation/error feedback
- Authentication request should not be unnecessarily sent

- [ ] Passed

## 3.5 Logout

Test:

1. Login
2. Click Logout

Expected:

- User is logged out
- User returns to the login page or appropriate unauthenticated state
- Protected quotation functionality is no longer accessible

- [ ] Passed

## 3.6 Session Handling

Test:

1. Login
2. Refresh the browser
3. Navigate through the application

Expected:

- Authenticated session behaves correctly
- User does not unexpectedly lose authentication

- [ ] Passed

---

# 4. Quotation Form Tests

## 4.1 Form Loading

- [ ] Create quotation page loads
- [ ] Customer fields are visible
- [ ] Quotation fields are visible
- [ ] At least one product row is available
- [ ] Calculation summary is visible
- [ ] Save button is visible

---

# 5. Customer Information Tests

## 5.1 Customer Name

Test:

- Valid customer name

Expected:

- Value is accepted

- [ ] Passed

Test:

- Empty customer name

Expected:

- Validation error is displayed
- Quotation cannot be saved

- [ ] Passed

## 5.2 Company Name

Test:

- Valid company name

Expected:

- Value is accepted

- [ ] Passed

## 5.3 Email

Test:

- Valid email address

Expected:

- Value is accepted

- [ ] Passed

Test:

- Invalid email address

Expected:

- Validation error is displayed
- Quotation cannot be saved

- [ ] Passed

## 5.4 Phone

Test:

- Valid phone number

Expected:

- Value is accepted

- [ ] Passed

---

# 6. Quotation Information Tests

## 6.1 Quotation Number

- [ ] Field is available
- [ ] Valid quotation number can be entered
- [ ] Value is saved correctly

## 6.2 Quotation Date

Test:

- Valid quotation date

Expected:

- Value is accepted

- [ ] Passed

Test:

- Missing quotation date

Expected:

- Validation error is displayed
- Quotation cannot be saved

- [ ] Passed

## 6.3 Valid Until

- [ ] Field is available
- [ ] Valid date can be entered
- [ ] Value is saved correctly

---

# 7. Product / Service Tests

## 7.1 Product Name

- [ ] Product name can be entered
- [ ] Product name is displayed correctly
- [ ] Product name is saved correctly

## 7.2 Quantity

Test:

- Quantity = 1

Expected:

- Accepted

- [ ] Passed

Test:

- Quantity > 1

Expected:

- Accepted
- Calculation updates correctly

- [ ] Passed

Test:

- Quantity = 0

Expected:

- Validation error
- Quotation cannot be saved

- [ ] Passed

Test:

- Negative quantity

Expected:

- Validation error
- Quotation cannot be saved

- [ ] Passed

## 7.3 Unit Price

Test:

- Price = 0

Expected:

- Behavior is handled consistently with the application's validation

- [ ] Passed

Test:

- Positive price

Expected:

- Accepted
- Calculation updates correctly

- [ ] Passed

Test:

- Negative price

Expected:

- Validation error
- Quotation cannot be saved

- [ ] Passed

## 7.4 Discount

Test:

- Discount = 0%

Expected:

- No discount is applied

- [ ] Passed

Test:

- Positive discount

Expected:

- Discount amount is calculated correctly

- [ ] Passed

---

# 8. Add Product Tests

## 8.1 Add One Product

- [ ] One product row can be entered
- [ ] Calculation appears correctly

## 8.2 Add Multiple Products

Test:

1. Add first product
2. Click Add Product
3. Add second product
4. Enter different values

Expected:

- Multiple product rows are displayed
- Each row has independent values
- Subtotal includes all products

- [ ] Passed

## 8.3 Remove Product

Test:

1. Add multiple products
2. Remove one product

Expected:

- Selected product row is removed
- Remaining rows remain unchanged
- Calculations update correctly

- [ ] Passed

## 8.4 Remove Products Until One Remains

Expected:

- Application does not produce an invalid empty product state unless
  intentionally handled
- At least one product remains required for saving

- [ ] Passed

---

# 9. Calculation Tests

## 9.1 Gross Amount

Formula:

```text
Gross Amount = Quantity × Unit Price
```

Test:

```text
Quantity = 2
Unit Price = ₹25,000

Expected:
Gross Amount = ₹50,000
```

- [ ] Passed

---

# 10. Discount Calculation

Formula:

```text
Discount Amount = Gross Amount × Discount %
```

Test:

```text
Gross Amount = ₹50,000
Discount = 5%

Expected:
Discount Amount = ₹2,500
```

- [ ] Passed

---

# 11. Net Amount

Formula:

```text
Net Amount = Gross Amount − Discount Amount
```

Test:

```text
Gross Amount = ₹50,000
Discount Amount = ₹2,500

Expected:
Net Amount = ₹47,500
```

- [ ] Passed

---

# 12. Subtotal

Formula:

```text
Subtotal = Sum of all Net Amounts
```

Test with one product:

```text
Net Amount = ₹47,500

Expected:
Subtotal = ₹47,500
```

- [ ] Passed

Test with multiple products:

```text
Product 1 Net Amount = ₹47,500
Product 2 Net Amount = ₹10,000

Expected:
Subtotal = ₹57,500
```

- [ ] Passed

---

# 13. GST Calculation

Formula:

```text
GST = Subtotal × GST %
```

Test:

```text
Subtotal = ₹47,500
GST = 18%

Expected:
GST = ₹8,550
```

- [ ] Passed

---

# 14. Grand Total

Formula:

```text
Grand Total = Subtotal + GST
```

Test:

```text
Subtotal = ₹47,500
GST = ₹8,550

Expected:
Grand Total = ₹56,050
```

- [ ] Passed

---

# 15. Required Assignment Calculation Test

The assignment provides this complete example.

Input:

```text
Product: Accounting Software
Quantity: 2
Unit Price: ₹25,000
Discount: 5%
GST: 18%
```

Expected:

```text
Gross Amount = ₹50,000
Discount Amount = ₹2,500
Subtotal = ₹47,500
GST = ₹8,550
Grand Total = ₹56,050
```

Verification:

- [ ] Gross Amount = ₹50,000
- [ ] Discount Amount = ₹2,500
- [ ] Subtotal = ₹47,500
- [ ] GST = ₹8,550
- [ ] Grand Total = ₹56,050

---

# 16. Dynamic Calculation Tests

## Quantity Change

Test:

1. Enter a product
2. Enter quantity
3. Change quantity

Expected:

- Gross amount updates
- Discount amount updates
- Net amount updates
- Subtotal updates
- GST updates
- Grand total updates

- [ ] Passed

## Unit Price Change

Test:

1. Enter a product
2. Enter unit price
3. Change unit price

Expected:

- All dependent calculations update correctly

- [ ] Passed

## Discount Change

Test:

1. Enter a product
2. Enter discount
3. Change discount

Expected:

- Discount amount updates
- Net amount updates
- Subtotal updates
- GST updates
- Grand total updates

- [ ] Passed

## Product Removal

Test:

1. Add multiple products
2. Remove one

Expected:

- Subtotal and total recalculate correctly

- [ ] Passed

---

# 17. Save Quotation Tests

## 17.1 Valid Quotation

Test:

1. Login
2. Open Create Quotation
3. Enter valid customer information
4. Enter valid quotation information
5. Add at least one valid product
6. Verify calculations
7. Click Save Quotation

Expected:

- Save operation succeeds
- User receives appropriate success feedback
- Quotation is stored in Supabase
- Quotation items are stored correctly
- Correct quotation/item relationship exists

- [ ] Passed

## 17.2 Save Loading State

Expected:

- Save button provides appropriate loading feedback
- Duplicate submissions are prevented or safely handled

- [ ] Passed

## 17.3 Save Error

Test a database/save failure where practical.

Expected:

- User receives a clear error message
- Application remains usable
- Data is not silently reported as saved

- [ ] Passed

---

# 18. Quotation List Tests

## 18.1 Display Quotations

After creating quotations:

Expected table contains at least:

- [ ] Quotation Number
- [ ] Customer
- [ ] Amount
- [ ] Date
- [ ] View
- [ ] Delete

## 18.2 Empty State

Test when no quotations exist.

Expected:

- Clear empty state
- Application does not appear broken

- [ ] Passed

## 18.3 Loading State

Expected:

- Appropriate loading indicator while quotations are being fetched

- [ ] Passed

## 18.4 Refresh

Test:

1. Create quotation
2. Refresh page

Expected:

- Saved quotation still appears

- [ ] Passed

---

# 19. Individual Quotation Tests

Open a quotation using View.

Expected information:

- [ ] Customer details
- [ ] Quotation details
- [ ] Product name
- [ ] Quantity
- [ ] Unit price
- [ ] Discount
- [ ] Subtotal
- [ ] GST
- [ ] Grand Total

The displayed values must match the values stored during creation.

- [ ] Passed

---

# 20. Delete Quotation Tests

## 20.1 Delete

Test:

1. Open quotation list
2. Select Delete
3. Confirm deletion if confirmation is implemented

Expected:

- Quotation is deleted
- Related quotation items are handled correctly
- Quotation disappears from the list
- No unintended quotations are deleted

- [ ] Passed

## 20.2 Delete Error

Test a delete failure where practical.

Expected:

- User receives a clear error message
- Application remains usable

- [ ] Passed

---

# 21. Data Persistence Tests

## Save → Refresh

Test:

1. Create quotation
2. Save
3. Refresh browser

Expected:

- Quotation remains available

- [ ] Passed

## Save → Logout → Login

Test:

1. Create quotation
2. Save
3. Logout
4. Login again

Expected:

- Previously saved quotation behaves according to the application's
  authentication and database access rules

- [ ] Passed

---

# 22. UI / UX Tests

## Desktop

- [ ] Login page looks correct
- [ ] Quotation form looks correct
- [ ] Product table is readable
- [ ] Quotation list is readable
- [ ] Individual quotation is readable
- [ ] Buttons are clearly visible
- [ ] Labels are clear

## Responsive

Test smaller screen sizes.

- [ ] Login page responsive
- [ ] Quotation form responsive
- [ ] Product section usable
- [ ] Quotation list usable
- [ ] Individual quotation usable
- [ ] No major horizontal overflow
- [ ] Buttons remain usable

---

# 23. Error and Edge Case Tests

- [ ] Empty required fields
- [ ] Invalid email
- [ ] Quantity = 0
- [ ] Negative quantity
- [ ] Negative price
- [ ] No product
- [ ] Multiple products
- [ ] Zero discount
- [ ] Large quantity
- [ ] Large unit price
- [ ] Long customer name
- [ ] Long company name
- [ ] Long product name
- [ ] Database/network failure
- [ ] Invalid login
- [ ] Expired/invalid authentication state where practical

---

# 24. Security Tests

- [ ] .env is not committed
- [ ] .env.example exists
- [ ] Supabase service-role key is not in frontend code
- [ ] Supabase service-role key is not in GitHub
- [ ] No passwords are committed
- [ ] No private keys are committed
- [ ] Authentication is required for protected quotation functionality
- [ ] Supabase RLS is enabled where required
- [ ] RLS policies behave as intended
- [ ] Production environment variables are configured correctly

---

# 25. Browser Console Check

Before submission:

- [ ] No unexpected console errors
- [ ] No obvious React warnings
- [ ] No failed network requests for normal workflows
- [ ] No exposed secrets in browser console/network responses

---

# 26. Production / Vercel Tests

The final application must be tested using the deployed Vercel URL.

## Production Authentication

- [ ] Login works
- [ ] Invalid login is handled
- [ ] Logout works
- [ ] Session behavior works

## Production Quotation Workflow

- [ ] Create quotation page loads
- [ ] Customer information works
- [ ] Quotation information works
- [ ] Product rows work
- [ ] Calculations work
- [ ] Save works
- [ ] Quotation list works
- [ ] View works
- [ ] Delete works

## Production UI

- [ ] Desktop layout checked
- [ ] Responsive layout checked
- [ ] No broken assets
- [ ] No obvious console errors

---

# 27. Required Final Calculation Verification

Before submission, perform the assignment's provided calculation
example one final time.

```text
Product: Accounting Software
Quantity: 2
Unit Price: ₹25,000
Discount: 5%
GST: 18%
```

Expected:

```text
Gross Amount = ₹50,000
Discount Amount = ₹2,500
Subtotal = ₹47,500
GST = ₹8,550
Grand Total = ₹56,050
```

- [ ] Final verification passed

---

# 28. Final Repository Check

Before submission:

- [ ] Source code is pushed to GitHub
- [ ] README.md exists
- [ ] .env.example exists
- [ ] .gitignore exists
- [ ] No .env file is committed
- [ ] No secrets are committed
- [ ] Repository contains only necessary project files
- [ ] Project can be installed from the README instructions
- [ ] Production build succeeds

---

# 29. Final Submission Checklist

- [ ] GitHub Repository URL
- [ ] Live Vercel URL
- [ ] Test Login Credentials
- [ ] README.md
- [ ] .env.example
- [ ] Final production test completed
- [ ] Final repository review completed
- [ ] Submission message/email prepared

---

# 30. Final Core Workflow Test

Perform the complete workflow without skipping steps:

```text
Login
↓
Create Quotation
↓
Enter Customer Information
↓
Enter Quotation Information
↓
Add Product
↓
Enter Quantity
↓
Enter Unit Price
↓
Enter Discount
↓
Verify Automatic Calculation
↓
Save Quotation
↓
Verify Success
↓
Open Quotation List
↓
View Quotation
↓
Verify All Details
↓
Delete Quotation
↓
Verify Deletion
```

- [ ] Complete end-to-end workflow passed

---

# 31. Test Result

## Local Testing

Status:

- [ ] Not started
- [ ] In progress
- [ ] Passed
- [ ] Failed

## Production Testing

Status:

- [ ] Not started
- [ ] In progress
- [ ] Passed
- [ ] Failed

## Known Issues

None currently recorded.