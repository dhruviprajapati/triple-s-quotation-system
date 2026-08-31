# Triple S Production — Architecture Decisions

## 1. Purpose

This document records important technical and product decisions made
during development.

The purpose is to prevent important decisions from being forgotten or
changed accidentally during a long development session or when using
different AI development tools.

Before changing an important decision, review this document and update
the decision with the reason for the change.

---

# 2. Decision Status

Each decision can have one of these statuses:

- Proposed
- Accepted
- Replaced

A decision marked as Accepted should not be changed casually.

If an Accepted decision needs to change, record the reason and update
its status appropriately.

---

# 3. D001 — Prioritize Mandatory Requirements

## Status

Accepted

## Decision

All mandatory requirements from the assignment will be implemented and
tested before optional bonus features.

## Reason

The assignment explicitly states that candidates should prioritize core
requirements within the available time.

The project should therefore optimize for a complete and reliable core
workflow rather than a large number of unfinished features.

---

# 4. D002 — Frontend Framework

## Status

Proposed

## Decision

Use React.js with Vite for the frontend unless a development requirement
provides a strong reason to choose another supported frontend option.

## Reason

The assignment allows React.js or Next.js.

React with Vite provides a straightforward setup and is appropriate for
the scope of this application.

## Note

This decision becomes Accepted after the frontend project is initialized
and verified.

---

# 5. D003 — Styling

## Status

Proposed

## Decision

Use Tailwind CSS for application styling unless setup or implementation
issues make another suitable styling approach more practical.

## Reason

Tailwind can provide a clean responsive interface quickly while keeping
the styling close to the components.

## Note

This decision becomes Accepted after styling setup is completed.

---

# 6. D004 — Backend and Database

## Status

Accepted

## Decision

Use Supabase for backend/database functionality as required by the
assignment.

Supabase will provide:

- PostgreSQL database
- Authentication
- Database access
- Row Level Security

## Reason

Supabase is explicitly required by the assignment.

---

# 7. D005 — Authentication

## Status

Accepted

## Decision

Use Supabase Authentication instead of implementing a custom
authentication system.

## Reason

The assignment requires Supabase Authentication.

Using Supabase Authentication avoids unnecessary custom password and
session-management logic.

---

# 8. D006 — No Separate Express Backend Initially

## Status

Accepted

## Decision

Do not create a separate Node.js/Express backend unless a concrete
requirement makes it necessary.

The initial application will communicate with Supabase through the
Supabase client.

## Reason

The assignment requires Supabase as the backend/database solution.

A separate Express server would add development and deployment
complexity without being necessary for the mandatory quotation workflow.

---

# 9. D007 — Database Structure

## Status

Proposed

## Decision

Use two primary tables:

- quotations
- quotation_items

The relationship will be:

```text
quotations
    │
    │ 1 : many
    ▼
quotation_items
```

## Reason

This matches the database structure suggested by the assignment and
naturally represents a quotation containing multiple products/services.

## Note

The exact columns, constraints, indexes, foreign keys, and RLS policies
will be finalized during Supabase database setup.

---

# 10. D008 — Quotation Calculation Logic

## Status

Accepted

## Decision

Quotation calculations will be implemented as deterministic application
logic and kept separate from presentation code where practical.

The formulas are:

```text
Gross Amount = Quantity × Unit Price

Discount Amount = Gross Amount × Discount / 100

Net Amount = Gross Amount − Discount Amount

Subtotal = Sum of all Net Amounts

GST = Subtotal × GST / 100

Grand Total = Subtotal + GST
```

## Reason

The assignment requires automatic calculation and provides explicit
calculation formulas.

Keeping the calculation logic isolated makes it easier to understand,
test, and maintain.

---

# 11. D009 — Client-Side Calculation

## Status

Proposed

## Decision

Quotation totals will be calculated immediately on the client as the
user changes quantity, unit price, discount, or other relevant inputs.

## Reason

The assignment requires automatic calculation.

Client-side calculation provides immediate feedback to the user.

## Important

The implementation must avoid treating displayed client-side values as
a security boundary.

Database persistence and access must still follow the application's
security rules.

## Note

The exact persistence strategy for calculated totals will be finalized
during database implementation.

---

# 12. D010 — Product Rows

## Status

Accepted

## Decision

The quotation form will maintain a dynamic collection of product/service
rows.

The user must be able to:

- Add a product
- Remove a product
- Enter product information independently for each row

## Reason

Multiple products/services are explicitly required by the assignment.

---

# 13. D011 — Validation

## Status

Accepted

## Decision

The application will validate required quotation information before
attempting to save the quotation.

Required validation includes:

- Customer name
- Valid email
- Quantity greater than 0
- Non-negative price
- At least one product
- Quotation date

## Reason

These validation requirements are explicitly specified by the
assignment.

---

# 14. D012 — Supabase Row Level Security

## Status

Proposed

## Decision

Supabase Row Level Security will be enabled and reviewed before
production deployment.

The final policies will be based on the application's authentication
model and required data-access behavior.

## Reason

Database security should not depend only on frontend checks.

## Note

Exact policies must be recorded here after they are designed and tested.

---

# 15. D013 — Secrets and Environment Variables

## Status

Accepted

## Decision

Environment-specific credentials will be stored in environment
variables.

Sensitive credentials must never be committed to GitHub.

The Supabase service-role key must never be exposed in the frontend.

## Reason

The assignment explicitly requires secure handling of credentials.

---

# 16. D014 — Git Checkpoints

## Status

Accepted

## Decision

Create Git commits at meaningful project milestones.

Examples:

```text
docs: initialize project specification
feat: initialize frontend
feat: configure supabase
feat: implement authentication
feat: implement quotation form
feat: implement quotation persistence
feat: implement quotation management
fix: resolve quotation calculation issue
chore: prepare production deployment
```

## Reason

Git checkpoints make it easier to identify regressions and safely
recover from implementation mistakes.

---

# 17. D015 — AI-Assisted Development

## Status

Accepted

## Decision

AI tools may be used throughout development as development assistants.

Potential uses include:

- Understanding technologies
- Planning implementation
- Generating implementation drafts
- Debugging
- Code review
- Writing tests
- Documentation
- Reviewing database queries
- Reviewing security considerations

AI-generated code must be reviewed and understood before being accepted.

## Reason

The goal is to use AI as a developer productivity tool rather than
blindly copying generated code.

The developer remains responsible for:

- Requirements
- Architecture
- Code correctness
- Security
- Testing
- Deployment
- Final submission

---

# 18. D016 — AI Tool Workflow

## Status

Accepted

## Decision

Different AI tools may be used for different purposes.

### ChatGPT

Use primarily for:

- Project planning
- Requirement analysis
- Architecture discussion
- Step-by-step development guidance
- Debugging
- Code review
- Testing strategy
- Final review

### Codex

Use primarily for:

- Repository-aware implementation
- Editing existing files
- Refactoring
- Implementing clearly defined features
- Running development checks where available

Codex must first be given the relevant project instructions and should
follow the project's documentation.

### Gemini

Use primarily when useful for:

- Alternative implementation ideas
- Independent review
- Comparing approaches
- Research or explanation

### Other AI Tools

Other tools may be used when they provide a clear advantage, but adding
more tools should not create unnecessary complexity.

## Rule

Do not ask multiple AI tools to independently rewrite the entire
application.

Use AI tools for specific, well-defined tasks and review the resulting
changes.

---

# 19. D017 — One Feature at a Time

## Status

Accepted

## Decision

Development will proceed feature by feature.

For each feature:

```text
Understand requirement
        ↓
Inspect current implementation
        ↓
Plan change
        ↓
Implement
        ↓
Run/test
        ↓
Review
        ↓
Commit checkpoint
        ↓
Update progress
```

## Reason

This reduces the chance of losing track of project state and makes
debugging easier.

---

# 20. D018 — No Blind AI Replacement

## Status

Accepted

## Decision

Do not allow an AI tool to replace large amounts of working code unless
there is a clear reason.

Before accepting a major generated change:

- Understand what changed
- Review affected files
- Check existing functionality
- Run the relevant tests
- Review for regressions

## Reason

Large blind rewrites can introduce hidden regressions and make the
project difficult to understand.

---

# 21. D019 — No Unnecessary Dependencies

## Status

Accepted

## Decision

Only install dependencies that provide a clear benefit to the
application.

Before adding a dependency, consider:

- Is it actually required?
- Can the requirement be handled simply without it?
- Does it introduce unnecessary complexity?
- Is it appropriate for the assignment?

## Reason

The project has a limited development window and should remain simple
and maintainable.

---

# 22. D020 — Deployment Target

## Status

Accepted

## Decision

Deploy the final application to Vercel.

## Reason

Vercel is explicitly required by the assignment.

Production environment variables must be configured in Vercel rather
than committed to the repository.

---

# 23. D021 — Bonus Features

## Status

Accepted

## Decision

Optional features will only be implemented after all mandatory
requirements are:

- Implemented
- Tested locally
- Tested in production where appropriate

Possible bonus features include:

- Edit quotation
- Search
- Filter
- PDF generation
- Print quotation
- GST selection
- Basic dashboard

## Reason

Bonus features must not put the mandatory submission at risk.

---

# 24. D022 — Scope Control

## Status

Accepted

## Decision

Do not add functionality simply because it would make the project
larger or more impressive.

Every additional feature must be evaluated against:

- Assignment requirements
- Available time
- Reliability
- Testing effort
- Deployment risk

## Reason

A smaller fully working application is preferable to a larger
unfinished application.

---

# 25. D023 — Time Management

## Status

Accepted

## Decision

The project will be planned around approximately 24 hours of practical
available time, including:

- Development
- Debugging
- Testing
- Sleep
- Meals
- Breaks
- Deployment
- Final submission preparation

The actual assignment deadline remains the 48-hour deadline specified by
Triple S Production.

## Planning Priority

```text
Mandatory functionality
        ↓
Testing
        ↓
Deployment
        ↓
README / submission
        ↓
Final safety buffer
        ↓
Bonus features
```

## Reason

The objective is to submit a reliable working project rather than use
the entire deadline for feature development.

---

# 26. D024 — Final Submission Safety Buffer

## Status

Accepted

## Decision

Reserve approximately 2–3 hours before the submission deadline for:

- Production testing
- Environment variable verification
- Deployment problems
- GitHub review
- README review
- Credential verification
- Final workflow testing
- Submission preparation

## Reason

Deployment or configuration issues can appear late in development and
must not leave the project without enough time to fix them.

---

# 27. D025 — Documentation as Project Memory

## Status

Accepted

## Decision

The project's Markdown documentation will be treated as persistent
project context.

The key documents are:

- PROJECT_SPEC.md
- ARCHITECTURE.md
- PROGRESS.md
- TEST_CHECKLIST.md
- DECISIONS.md
- AGENTS.md

They must remain consistent with the actual implementation.

## Reason

The project may be developed across a long session and with multiple
AI tools. Documentation reduces the risk of losing previous decisions
or requirements.

---

# 28. D026 — Definition of Done

## Status

Accepted

## Decision

A feature is not considered complete merely because the code exists.

A mandatory feature is complete only when:

- It is implemented.
- It works locally.
- Relevant validation is implemented.
- Relevant errors are handled.
- Relevant edge cases have been considered.
- Existing functionality still works.
- The implementation has been reviewed.
- The relevant test checklist has been completed.

## Reason

This prevents incomplete features from being incorrectly marked as
finished.

---

# 29. Future Decisions

New important decisions should be added below this section.

Each new decision should include:

- Decision number
- Status
- Decision
- Reason
- Important implementation notes if necessary