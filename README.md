# Institute-OS-CITv0

🚧 **Under Active Development** 🚧

A comprehensive institute management system built with modern web technologies, designed to streamline administrative operations for educational institutions.

## 🎯 Overview

Institute-OS-CITv0 is a role-based web application that provides a unified platform for managing students, teachers, administrative staff, and institutional operations. The system features secure authentication, comprehensive user profiles, and role-based access control.

## ✨ Features

### 🔐 Authentication & Security

- **Better Auth Integration**: Modern authentication with email/password support
- **Role-Based Access Control**: Four distinct user roles (HO, INCHARGE, TEACHER, STUDENT)
- **Secure Sessions**: 7-day session persistence with enhanced security
- **Rate Limiting**: Protection against brute force attacks
- **Password Hashing**: Argon2-based secure password storage

### 👥 User Management

- **Multi-Role System**: Head Office (HO), Incharge, Teacher, and Student roles
- **Branch Management**: Multi-campus support with 6 branch locations
- **Student Profiles**: Comprehensive student information management
- **Visitor Tracking**: Visitor inquiry and lead management system
- **User Status Management**: Active, inactive, suspended, completed, and dropped statuses
- **User-Branch Assignment**: Role-based branch assignments for departmental management

### 🎨 User Interface

- **Modern Design**: Built with shadcn/ui components and Tailwind CSS
- **Dark/Light Themes**: Theme switching with next-themes
- **Responsive Layout**: Mobile-friendly interface
- **Accessibility**: WCAG-compliant design patterns

### 🛠 Technical Features

- **TypeScript**: Full type safety throughout the application
- **React 19**: Latest React features with concurrent rendering
- **Next.js 16**: App Router with server components
- **Prisma 7**: Modern ORM with SQLite database and libsql adapter
- **Real-time Updates**: Optimistic UI updates
- **Multi-Campus Architecture**: Branch-based organizational structure

## 🏗 Architecture

### Tech Stack

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

### Project Structure

```
public/
├── cit.png                     # Institute logo
└── favicon.ico                 # Website favicon

prisma/
├── migrations/                 # Database migration files
├── schema.prisma               # Prisma database schema
└── seed.ts                     # Database seeding script

src/
├── app/
│   ├── (application)/          # Protected application routes with sidebar layout
│   │   ├── account/            # User account pages
│   │   ├── ho/                 # Head Office admin interface
│   │   ├── incharge/           # Department incharge interface
│   │   ├── teacher/            # Teacher interface
│   │   ├── student/            # Student interface
│   │   └── layout.tsx          # Application layout with SidebarProvider
│   ├── (auth)/                 # Authentication routes
│   ├── api/                    # API routes
│   ├── globals.css             # Global Tailwind styles
│   └── layout.tsx              # Root layout with ThemeProvider
├── components/
│   ├── Buttons/                # Button components
│   ├── Forms/                  # Form components
│   ├── Header/                 # Header components
│   ├── Incharge/               # Incharge-related components
│   ├── Providers/              # Context providers
│   ├── Sidebar/                # Sidebar navigation
│   └── shadcnui/               # shadcn/ui components
├── hooks/                      # Custom React hooks
├── lib/
│   ├── auth.ts                 # Better Auth configuration
│   ├── auth-client.ts          # Client-side auth utilities
│   ├── authPermissions.ts      # Authentication permissions
│   ├── database/               # Database connection and utilities
│   ├── env/                    # Environment variable validation
│   ├── fonts.ts                # Font configurations
│   ├── types.ts                # TypeScript type definitions
│   ├── utils.ts                # Utility functions
│   ├── utils/                  # Additional utility functions
│   ├── zodSchema.ts            # Zod validation schemas
│   └── argon2.ts               # Password hashing utilities
└── server/                     # Server-side utilities
    └── student.ts              # Student-related server functions
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >=22.x.x
- **bun**: Package manager (required)
- **Git**: For version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MrSaikatS/institute-os-citv0.git
   cd institute-os-citv0
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:

   ```env
   # Database connection
   DATABASE_URL="file:./prisma/dev.db"

   # Better Auth configuration
   BETTER_AUTH_SECRET="your-generated-secret-here"
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_ALLOWED_ORIGINS=http://localhost:3000
   BETTER_AUTH_TELEMETRY=0
   ```

   **Important**: Generate a secure `BETTER_AUTH_SECRET` using:

   ```bash
   openssl rand -base64 32
   ```

4. **Database setup**

   ```bash
   # Run migrations
   bun prisma migrate dev

   # Generate Prisma client
   bun prisma generate

   # Seed database with test users
   bun prisma db seed
   ```

5. **Start development server**

   ```bash
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Test Users

The database seeding creates the following test users:

| Role     | Email                | Password          | Access Level | Branch Assignment |
| -------- | -------------------- | ----------------- | ------------ | ----------------- |
| HO       | ho@citindia.in       | password@ho       | Full Admin   | None (Global)     |
| INCHARGE | incharge@citindia.in | password@incharge | Department   | Dumdum (Default)  |
| TEACHER  | teacher@citindia.in  | password@teacher  | Teaching     | Dumdum (Default)  |
| STUDENT  | student@citindia.in  | password@student  | Student      | Dumdum (Default)  |

**Branch Locations Created**: Dumdum, Baduria, Barasat, Matia, Kholapota, Garia

## 📱 Available Scripts

```bash
# Development
bun dev              # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run prod         # Full production build and start

# Database
bun run migrate      # Run database migrations
bun run studio       # Open Prisma Studio
bun prisma db seed   # Seed database with test data
bun prisma studio    # Open database browser
```

## 🔧 Development

### Code Quality

- **ESLint**: Configured with Next.js and React rules
- **Prettier**: Code formatting with Tailwind plugin
- **TypeScript**: Strict type checking
- **React Compiler**: Enabled for performance optimization

### Database Management

- **Prisma Studio**: Visual database browser
- **Migrations**: Version-controlled schema changes
- **Seeding**: Automated test data creation with branch management
- **Multi-Campus Support**: Branch-based data organization

### Component Development

- **shadcn/ui**: Pre-built accessible components
- **Lucide Icons**: Consistent iconography
- **Tailwind CSS**: Utility-first styling

## 📚 Documentation

- [Database Seeding Guide](./SEED_README.md) - Detailed database setup instructions
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM guide
- [Better Auth Documentation](https://better-auth.com/docs) - Authentication system
- [Next.js Documentation](https://nextjs.org/docs) - Framework documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Better Auth** - Modern authentication solution
- **Prisma** - Next-generation ORM
- **shadcn/ui** - Beautiful and accessible UI components
- **Vercel** - Next.js deployment platform

---

⚠️ **Note**: This is currently in active development. Features and APIs may change.
