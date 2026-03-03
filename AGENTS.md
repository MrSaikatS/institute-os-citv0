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
