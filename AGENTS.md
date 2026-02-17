# Project Structure

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui
- **Database**: Prisma 7 with SQLite
- **Authentication**: Better Auth
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui, Lucide React icons
- **Theming**: next-themes
- **Notifications**: React Toastify
- **Image Processing**: Sharp
- **Password Hashing**: @node-rs/argon2

## Database Schema

- **User**: Core user model with roles (HO, INCHARGE, TEACHER, STUDENT), email verification, ban management
- **Session**: Authentication sessions with IP tracking
- **Account**: OAuth and credential accounts
- **Verification**: Email verification tokens
- **StudentProfile**: Student-specific data with status tracking (ACTIVE, INACTIVE, SUSPENDED, COMPLETED, DROPPED)

## Project Structure

```
src/
├── app/
│   ├── (application)/          # Protected application routes with sidebar layout
│   │   ├── account/            # User account pages
│   │   └── layout.tsx          # Application layout with SidebarProvider
│   ├── (auth)/                 # Authentication routes
│   ├── api/                    # API routes
│   ├── globals.css             # Global Tailwind styles
│   └── layout.tsx              # Root layout with ThemeProvider
├── components/
│   ├── Buttons/                # Button components
│   ├── Forms/                  # Form components
│   ├── Header/                 # Header components
│   └── Providers/              # Context providers (e.g., ThemeProvider)
├── hooks/                      # Custom React hooks
└── lib/
    ├── auth.ts                 # Better Auth configuration
    ├── auth-client.ts          # Client-side auth utilities
    ├── database/               # Database connection and utilities
    ├── env/                    # Environment variable validation
    ├── fonts.ts                # Font configurations
    ├── types.ts                # TypeScript type definitions
    ├── utils.ts                # Utility functions
    ├── zodSchema.ts            # Zod validation schemas
    └── argon2.ts               # Password hashing utilities
```

## Configuration Files

- **prisma/schema.prisma**: Database schema definition
- **tailwind.config.js**: Tailwind CSS configuration
- **next.config.ts**: Next.js configuration
- **components.json**: shadcn/ui configuration
- **eslint.config.mjs**: ESLint configuration
- **tsconfig.json**: TypeScript configuration
