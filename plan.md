# plan.md — institute-os-citv0 (Single institute, multi-branch)

Institute Management System (IMS) with:

- Student management
- Teacher management
- Learning management (LMS)
- Accounts (fees, invoices, payments, expenses)
- Branch management

Stack (fixed): Next.js 16 App Router + React 19 + TS, Tailwind v4 + shadcn/ui, Prisma v7 + SQLite, Better Auth, RHF + Zod, React Toastify, Sharp, @node-rs/argon2.

---

## 1) Current repo structure (keep)

- Auth routes: `src/app/(auth)/*`
- Protected area: `src/app/(application)/*` (use this for all IMS modules)
- APIs: `src/app/api/*` (use for upload/import/report downloads if needed)
- Server actions: `src/server/actions/*`
- Existing auth libs: `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/authPermissions.ts`, `src/lib/argon2.ts`
- UI: shadcn components under `src/components/shadcnui/*`, internal components under `src/components/*`

Decision: keep `(application)` layout and add modules beneath it.

---

## 2) Definition of Done (v1)

- Multi-branch:
  - Every business record includes `branchId`.
  - Every read/write is branch-scoped server-side.
- RBAC:
  - Permissions enforced server-side (server actions + route handlers).
- Student lifecycle:
  - Student → enrollment in course/batch → attendance → assessments → completion/drop.
- Accounts:
  - Fee plan → invoice/dues → payments/receipts → refunds/adjustments.
  - Audit-safe: avoid deleting finance history; use adjustments/reversals.
- LMS:
  - Courses + syllabus/topics + content + assignments/quizzes + submissions.
- Reports:
  - Dues list, collections by date range, expenses by date range, attendance report.
- Export:
  - CSV export for receipts/expenses/dues.

---

## 3) Roles & access model

Single institute, multi-branch. Roles:

- SUPER_ADMIN (all branches)
- BRANCH_ADMIN (one branch)
- ACCOUNTANT (finance + reports within branch)
- ACADEMIC_MANAGER (courses/syllabus/batches/teachers; read-only finance)
- TEACHER (assigned batches, attendance, assessments)
- STUDENT/GUARDIAN (portal)
- AUDITOR (read-only)

Rule: Branch is enforced by:

- `User.branchId` (default branch) + optional `UserBranchAccess` for multi-branch staff later.
- Guards must be used in every server action / API handler.

---

## 4) Milestones (PR-by-PR)

### Milestone 0 — Baseline hardening (PR #1)

- [ ] Add Prisma singleton: `src/lib/db.ts`
- [ ] Add validators folder: `src/lib/validators/*` (Zod schemas)
- [ ] Add money helper: `src/lib/money.ts` (integer paise)
- [ ] Standardize toast usage (React Toastify)
- [ ] Add `docs/ARCHITECTURE.md` (1 page: modules + branch scoping + RBAC strategy)

Acceptance: no functional changes; new scaffolding ready.

---

### Milestone 1 — Branch + RBAC foundation (PR #2)

Prisma:

- [ ] `Branch` table (name/code/address/status)
- [ ] Extend `User` with `role` and `branchId` (default)
- [ ] Optional: `UserBranchAccess` (future-proof staff who work in multiple branches)
- [ ] `AuditLog` table for sensitive mutations (especially finance)

Auth:

- [ ] Better Auth integration remains the base for sessions (don’t replace). (See Better Auth Next.js integration docs.)
- [ ] Implement guards in `src/lib/auth/guards.ts`:
  - `requireSession()`
  - `requireRole(roles)`
  - `requireBranchAccess(branchId)` (SUPER_ADMIN bypass)

Acceptance: branch scoping works for all newly added pages/actions.

---

### Milestone 2 — Students + enrollments (PR #3–#4)

PR #3: Student master

- [ ] Prisma: `Student`, `Guardian` (optional), `StudentDocument`
- [ ] Pages:
  - `src/app/(application)/students/page.tsx` (list/filter)
  - `src/app/(application)/students/[id]/page.tsx` (detail)
- [ ] Forms: RHF + Zod + server actions (double-validate)

PR #4: Enrollment

- [ ] Prisma: `Course`, `Batch`, `Enrollment`
- [ ] Enroll a student into a batch (branch-scoped)

Acceptance: student created + enrolled and visible in batch roster.

---

### Milestone 3 — Teacher + academic structure (PR #5–#6)

- [ ] Prisma: `Teacher`, `TeacherAssignment` (teacher ↔ batch ↔ subject/topic scope)
- [ ] Pages:
  - `src/app/(application)/teachers/*`
  - `src/app/(application)/batches/*` (rosters + teacher assignments)
- [ ] Syllabus model:
  - `SyllabusTopic` with ordering, type (theory/practical), optional duration

Acceptance: academic manager can configure batches, teachers, syllabus.

---

### Milestone 4 — Accounts (PR #7–#10)

Prisma (minimum):

- [ ] `FeePlan` (per course/batch + total + optional installment template)
- [ ] `Invoice`, `InvoiceLine`
- [ ] `Payment` (receipt)
- [ ] `PaymentAllocation` (payment → invoice/lines)
- [ ] `Expense`
- [ ] `FinanceAdjustment` (for corrections; keep history)

Rules:

- [ ] Money in paise only
- [ ] No hard deletes for receipts/payments; corrections via adjustments/reversals
- [ ] AuditLog all finance mutations

Pages:

- [ ] `src/app/(application)/fees/*` (fee plans)
- [ ] `src/app/(application)/invoices/*`
- [ ] `src/app/(application)/payments/*`
- [ ] `src/app/(application)/expenses/*`
- [ ] `src/app/(application)/reports/*` (basic)

Acceptance: accountant can generate invoices, record payments, see dues.

---

### Milestone 5 — Attendance + assessments (PR #11–#12)

- [ ] Prisma: `ClassSession`, `StudentAttendance`
- [ ] Prisma: `Assignment`, `Submission`, `Quiz`, `QuizAttempt`, `Marks`
- [ ] Pages under:
  - `src/app/(application)/attendance/*`
  - `src/app/(application)/assessments/*`

Acceptance: teacher can record attendance and marks; student can view.

---

### Milestone 6 — LMS content + progress (PR #13)

- [ ] `ContentUnit` per syllabus topic (link/file/text)
- [ ] Progress computation per enrollment

Acceptance: LMS content visible and progress shown per student.

---

### Milestone 7 — Exports + polish (PR #14)

- [ ] CSV export endpoints for receipts/expenses/dues (branch + date range)
- [ ] Pagination + server filtering on all lists
- [ ] Tests:
  - allocation logic (invoice/payments)
  - branch guard behaviors

Acceptance: reports/export reliable.

---

## 5) UI approach (shadcn)

- Use shadcn DataTable pattern for all lists (server-side filtering/pagination).
- Use shadcn Dialog/Sheet for create/edit flows.
- Keep state in URL query params for tables when possible.

(Reference: shadcn Data Table guide.)

---

## 6) Non-negotiables

- Branch scoping enforced server-side everywhere.
- RHF+Zod on client and Zod re-validation on server.
- Finance history is append-only; avoid mutating past payments silently.
- Keep schema portable (SQLite now, Postgres later).
