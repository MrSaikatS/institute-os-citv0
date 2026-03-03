# plan.md — institute-os-citv0 (Next.js 16 App Router)

This repo will become a multi-branch Institute Management System that replaces the institute’s Excel workflow (`New-System-27.xlsx`) with a secure web app. The Excel contains operational “tables” like Visitor leads, Admission profiles (Admission Unique ID), Deals/Installments (Month+Amount columns), Fees Year (tiered fee plan), Syllabus (Sem/Type/Course/Subject/Topic/Amount), teacher schedule/links, receipts, expenses, attendance, videos, quizzes, projects, verbal exams, reviews, examiner checklist, kits issue, and admission letter requests. [file:16]

Tech stack (fixed): Next.js 16 App Router + React 19 + TypeScript, Tailwind CSS v4 + shadcn/ui, Prisma v7 + SQLite, Better Auth, React Hook Form + Zod, React Toastify, Sharp, @node-rs/argon2. [file:16]

---

## 1) Repo-specific conventions (current structure)

Current route groups:

- `src/app/(auth)/*` for login/register/reset-password
- `src/app/(application)/*` for authenticated pages (dashboard, account settings, etc.)
- `src/app/api/*` for API routes (auth, users, upload, health)

Existing libraries:

- `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/authPermissions.ts`, `src/lib/argon2.ts`
- `src/server/actions/*` for server actions (auth, user, upload)
- Shared form patterns exist under `src/components/Forms/*` + shadcn under `src/components/shadcnui/*`

**Decision**: Keep using `(application)` as the protected area and add new modules under it:

- `src/app/(application)/students`
- `src/app/(application)/leads`
- `src/app/(application)/fees`
- `src/app/(application)/deals`
- `src/app/(application)/receipts`
- `src/app/(application)/expenses`
- `src/app/(application)/syllabus`
- `src/app/(application)/teachers`
- `src/app/(application)/attendance`
- `src/app/(application)/learning`
- `src/app/(application)/import`

---

## 2) Definition of Done (v1)

- Import `New-System-27.xlsx` idempotently (re-import doesn’t duplicate). [file:16]
- RBAC + Branch scoping enforced server-side for every business query/mutation. [file:16]
- Search student by **Admission Unique ID** and see: profile + docs URLs + branch + course/tier/sem + syllabus + teacher schedule + installments + receipts + dues + attendance + assessments + kits + videos. [file:16]
- Finance is audit-safe: receipts/expenses/adjustments are append-only (reversals instead of overwrites). [file:16]
- Export (CSV first): receipts, expenses, dues list (branch + date range). [file:16]

---

## 3) Milestones & tasks (PR-by-PR)

### Milestone 0 — Baseline hardening (PR #1)

- [ ] Add `docs/ARCHITECTURE.md` (1 page: modules, RBAC, branch scoping, import flow)
- [ ] Add `src/lib/db.ts` Prisma client singleton (don’t use custom db layer for new code; keep old untouched)
- [ ] Add `src/lib/money.ts` helpers (`toPaise`, `fromPaise`, formatting)
- [ ] Add global toast provider (if not already consistent across app)
- [ ] Add `src/lib/validators/` folder and move/alias existing zod schemas to it

Acceptance:

- Build passes CI, no functional changes.

---

### Milestone 1 — Org/Branch/RBAC foundation (PR #2)

**Why**: Excel Admission sheet includes `Branch`, so multi-branch is mandatory. [file:16]

- [ ] Prisma schema update: `Organization`, `Branch`, `UserBranchAccess`, `AuditLog`
- [ ] Add role enum (or Role table), include: SUPER_ADMIN, BRANCH_ADMIN, ACCOUNTANT, ACADEMIC_MANAGER, TEACHER, STUDENT, GUARDIAN, AUDITOR
- [ ] Add server-side guards in `src/lib/auth/guards.ts`:
  - `requireSession()`
  - `requireRole(roles)`
  - `requireBranchAccess(branchId)`
- [ ] Update existing dashboard page `src/app/(application)/dashboard` to show branch-aware stats placeholder

Acceptance:

- SUPER_ADMIN can access all branches, BRANCH_ADMIN restricted to one branch.

---

### Milestone 2 — Admissions core (PR #3–#4)

**Excel mapping**:

- Visitor sheet → leads
- Admission sheet → student master with `Admission Unique ID` and document/photo URLs [file:16]

PR #3: Leads

- [ ] Prisma: `VisitorLead` (branchId + lead fields)
- [ ] Pages:
  - `src/app/(application)/leads/page.tsx` list + filters
  - `Convert to admission` action → creates Student draft
- [ ] Server actions in `src/server/actions/leads.ts`

PR #4: Students

- [ ] Prisma: `Student`, `StudentDocument`
  - `admissionUniqueId` UNIQUE (business key) [file:16]
  - address fields (district/state/pincode/etc) [file:16]
- [ ] Pages:
  - `src/app/(application)/students/page.tsx`
  - `src/app/(application)/students/[admissionUniqueId]/page.tsx`
- [ ] Search everywhere by Admission Unique ID [file:16]
- [ ] RHF+Zod forms for create/edit Student

Acceptance:

- Create a student manually and open details by Admission Unique ID.

---

### Milestone 3 — Courses, Fee Plans, Deals (PR #5–#7)

**Excel mapping**:

- Fees Year sheet (year + course + Premium/Affordable/Standard/Normal totals) [file:16]
- Deal sheet (Admission Unique ID + CourseTrade + Month/Amount columns) [file:16]

PR #5: Course & fee plan

- [ ] Prisma: `CourseTrade`, `CourseProgram`, `FeePlanYear`, `FeePlan`
- [ ] Pages under `(application)/fees`:
  - `fee-plans` list + create year + tier totals

PR #6: Deals (installments)

- [ ] Prisma: `DealPlan`, `DealInstallment`
- [ ] UI: create deal for a student, add installments
- [ ] Validation: amounts numeric, dueDate valid, allow 0 but warn (Excel contains 0 amounts) [file:16]

PR #7: Due engine v1

- [ ] Implement due calculation helpers:
  - total due = sum(installments)
  - paid = sum(receipt allocations)
  - remaining per installment
- [ ] Show “Dues” section on student details page

Acceptance:

- Student page shows installment schedule and totals.

---

### Milestone 4 — Receipts, Expenses, Ledger (PR #8–#10)

**Excel mapping**:

- Receipt sheet, Exp sheet (expenses) [file:16]

PR #8: Finance tables

- [ ] Prisma: `Receipt`, `Expense`, `LedgerEntry`, `ReceiptAllocation`
- [ ] Money stored as integer paise (`amountPaise`) everywhere

PR #9: Receipts UI

- [ ] Pages:
  - `src/app/(application)/receipts/page.tsx` list/filter
  - `src/app/(application)/receipts/new` create form
  - `src/app/(application)/receipts/[id]/print` print-friendly
- [ ] Allocation rule: allocate to oldest unpaid installment first
- [ ] AuditLog every create/update attempt; updates should create reversal entries

PR #10: Expenses UI

- [ ] Pages:
  - `src/app/(application)/expenses/page.tsx`
  - `src/app/(application)/expenses/new`

Acceptance:

- Record receipt and see dues reduce; record expense; daily totals visible on dashboard.

---

### Milestone 5 — Syllabus + Teachers/Schedule (PR #11–#12)

**Excel mapping**:

- Syllabus sheet: Sem, Type, Course Trade, Course Name, Subject, Topic, Amount [file:16]
- Teacher sheet: assignment + class links + labs + day/time [file:16]

PR #11: Syllabus

- [ ] Prisma: `SyllabusItem` (+ ordering)
- [ ] Page: `src/app/(application)/syllabus/page.tsx`
  - filters: courseTrade, courseName, sem, type
  - show Topic + Amount metadata [file:16]

PR #12: Teachers + schedule

- [ ] Prisma: `Teacher`, `TeacherAssignment`, `ClassLink` (optional normalized table)
- [ ] Page: `src/app/(application)/teachers/page.tsx`
- [ ] Show teacher schedule section on student detail (based on course/sem)

Acceptance:

- Browse syllabus per course and see teacher schedule/links.

---

### Milestone 6 — Attendance + Learning artifacts (PR #13–#15)

**Excel mapping**:

- Staff attendance logs with login/logout + photo URL [file:16]
- Student class attendance with rating/opinion/suggestion [file:16]
- Videos, quiz, project, verbal exam sheets [file:16]

PR #13: Attendance

- [ ] Prisma: `StaffAttendanceLog`, `StudentClassAttendance`
- [ ] Page: `src/app/(application)/attendance/page.tsx`
- [ ] Teacher can add class attendance entries; branch/admin can view reports

PR #14: Videos

- [ ] Prisma: `VideoLink`
- [ ] Page: `src/app/(application)/learning/videos`

PR #15: Assessments

- [ ] Prisma: `TheoryQuiz`, `ProjectSubmission`, `VerbalExam`
- [ ] Pages: `src/app/(application)/learning/*`

Acceptance:

- Student detail page shows attendance + learning entries.

---

### Milestone 7 — Ops & quality modules (PR #16–#17)

**Excel mapping**:

- Kits issue, student reviews, examiner checklist, admission letter requests [file:16]

- [ ] Prisma: `KitIssue`, `StudentReview`, `ExaminerChecklist`, `AdmissionLetterRequest`
- [ ] Pages:
  - `src/app/(application)/kits`
  - `src/app/(application)/reviews`
  - `src/app/(application)/examiner-checklist`
  - `src/app/(application)/admission-letters`

Acceptance:

- Staff can record these workflows and filter by branch/course/student. [file:16]

---

### Milestone 8 — Excel import wizard (PR #18–#19)

This is the highest leverage feature because the institute already works inside Excel. [file:16]

PR #18: Import backend

- [ ] Add `/src/app/api/import/excel/route.ts` (multipart upload)
- [ ] Add Prisma: `ImportRun`, `ImportError`
- [ ] Implement parsers per sheet:
  - Visitor → VisitorLead [file:16]
  - Admission → Student + StudentDocument [file:16]
  - Fees Year → FeePlanYear + FeePlan [file:16]
  - Deal → DealPlan + DealInstallment [file:16]
  - Syllabus → SyllabusItem [file:16]
  - (later) Receipt/Expense/Attendance/Videos/etc

PR #19: Import UI

- [ ] `src/app/(application)/import/page.tsx` wizard:
  - upload
  - preview: counts + first N rows
  - import
  - show row-level errors

Idempotency (must):

- Student upsert by `admissionUniqueId` [file:16]
- FeePlan upsert by `(year, courseName, tier)`
- SyllabusItem upsert by `(sem, type, courseTrade, courseName, subject, topic)` [file:16]
- DealInstallment upsert by `(student, courseTrade, dueDate, amountPaise)` [file:16]

Acceptance:

- Import Excel twice → row counts stable, no duplicates.

---

### Milestone 9 — Reporting + exports + polish (PR #20)

- [ ] CSV exports:
  - receipts by branch + date range
  - expenses by branch + date range
  - dues list
- [ ] Add pagination + server-side filters to all list pages
- [ ] Ensure branch scoping on exports too
- [ ] Add basic unit tests for allocation + due logic (Vitest/Jest)

Acceptance:

- Admin can get branch-wise finance exports and dues reports. [file:16]

---

## 4) Page map (final v1)

Under `src/app/(application)/`:

- `dashboard`
- `leads`
- `students`
- `students/[admissionUniqueId]`
- `fees` (or `fee-plans`)
- `deals`
- `receipts`
- `expenses`
- `syllabus`
- `teachers`
- `attendance`
- `learning/videos`, `learning/quizzes`, `learning/projects`, `learning/verbal`
- `kits`
- `reviews`
- `examiner-checklist`
- `admission-letters`
- `import`

---

## 5) Non-negotiable rules

- Money stored as integer paise (`amountPaise`), never float.
- “Admission Unique ID” is the global business identifier and must be searchable everywhere. [file:16]
- No direct DB calls from client components.
- Every mutation must validate with Zod server-side and enforce RBAC + branch scope. [file:16]
- Finance changes must be append-only with reversal entries; never silently edit historical receipts/expenses. [file:16]
