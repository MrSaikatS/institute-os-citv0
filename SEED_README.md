# Database Seeding Guide

This document explains how to use the Prisma seed file for your Institute OS application.

## Overview

The seed file creates comprehensive test data for your Institute OS application:

- **HO** (Head Office Admin): `ho@citindia.in` - Full system administration access
- **INCHARGE** (Department Incharge): `incharge@citindia.in` - Department-level management
- **TEACHER**: `teacher@citindia.in` - Teaching staff access
- **STUDENT**: `student@citindia.in` - Student access with complete profile

Additionally, it creates **6 Branch locations** for multi-campus institute management.

All users use different passwords for each role (see Test Users table below)

## Features

✅ **Better Auth Integration**: Uses the same password hashing as your authentication system  
✅ **Role-Based Users**: Creates users for all four roles  
✅ **Student Profile**: Automatically creates a comprehensive student profile for the STUDENT user  
✅ **Branch Management**: Creates 6 branch locations (Dumdum, Baduria, Barasat, Matia, Kholapota, Garia)  
✅ **User-Branch Assignment**: Assigns INCHARGE and TEACHER users to default branch (Dumdum)  
✅ **Idempotent**: Can be run multiple times without creating duplicates  
✅ **Proper Relations**: Creates User, Account, StudentProfile, and Branch records correctly  
✅ **Prisma v7 Compatible**: Uses libsql adapter and modern seeding practices

## Running the Seed

### First Time Setup

```bash
# Install dependencies (bun is required for TypeScript execution)
# Note: This project uses bun as the package manager

# Run database migrations (creates tables)
bun prisma migrate dev

# Generate Prisma client
bun prisma generate

# Run the seed
bun prisma db seed
```

### Regular Usage

```bash
# Run seed (safe to run multiple times)
bun prisma db seed

# Reset database and reseed (if needed)
bun prisma migrate reset --force
bun prisma db seed
```

## Test Users

| Role     | Email                | Password          | Student Profile     | Branch Assignment |
| -------- | -------------------- | ----------------- | ------------------- | ----------------- |
| HO       | ho@citindia.in       | password@ho       | No                  | None (Global)     |
| INCHARGE | incharge@citindia.in | password@incharge | No                  | Dumdum (Default)  |
| TEACHER  | teacher@citindia.in  | password@teacher  | No                  | Dumdum (Default)  |
| STUDENT  | student@citindia.in  | password@student  | Yes (ACTIVE status) | Dumdum (Default)  |

## Branch Locations Created

| Branch Name | Code | Description                        |
| ----------- | ---- | ---------------------------------- |
| Dumdum      | DUM  | Default branch (assigned to users) |
| Baduria     | BAD  | Additional branch location         |
| Barasat     | BAR  | Additional branch location         |
| Matia       | MAT  | Additional branch location         |
| Kholapota   | KHO  | Additional branch location         |
| Garia       | GAR  | Additional branch location         |

## File Structure

```
prisma/
├── schema.prisma          # Database schema
├── migrations/            # Database migrations
├── seed.ts               # Seed file (creates test users)
└── dev.db                # SQLite database file
```

## Technical Details

### Password Hashing

- Uses the same `hashPasswordFunction` from `src/lib/argon2.ts`
- Compatible with Better Auth authentication system
- All passwords are hashed with Argon2 using your app's secret

### Database Relations

- **User**: Main user record with role assignment and optional branch assignment
- **Account**: Better Auth authentication record with hashed password
- **StudentProfile**: Extended profile data for STUDENT role users with branch assignment
- **Branch**: Institute branch locations with unique names and codes
- **Visitor**: Visitor inquiry and lead management records (not seeded)

### Branch Management

The seed creates a comprehensive multi-campus setup:

- **6 Branch Locations**: Dumdum, Baduria, Barasat, Matia, Kholapota, Garia
- **Default Branch**: Dumdum (assigned to INCHARGE, TEACHER, and STUDENT users)
- **Branch Codes**: Unique 3-letter codes for each branch (DUM, BAD, BAR, MAT, KHO, GAR)
- **Branch Relations**: Users and StudentProfiles can be assigned to specific branches

### Student Profile Details

The STUDENT user gets a comprehensive profile with:

- **Status**: ACTIVE
- **Personal Info**: Official name, date of birth (2000-01-01), gender, religion, category
- **Family Info**: Guardian name, father's/mother's names and occupations, sources of income
- **Contact**: Complete address with landmark, post office, PIN code, district, state
- **Academic**: Last qualification (High School), occupation (Student)
- **Identity**: Aadhar number (123456789012)
- **Branch Assignment**: Assigned to Dumdum branch

### Seed Configuration

- **Configured in**: `prisma.config.ts` with seed command: `bun prisma/seed.ts`
- **Runtime**: Uses `bun` for TypeScript execution (not tsx)
- **Adapter**: PrismaLibSql adapter matching main application
- **Environment**: Loads environment variables from `.env` file
- **Best Practices**: Follows Prisma v7 seeding patterns with proper error handling
- **Idempotent Design**: Uses `upsert` operations to prevent duplicates on re-runs

### Seeding Process

1. **Branch Creation**: Creates 6 branch locations first
2. **User Creation**: Creates users with role assignments and branch relationships
3. **Account Creation**: Creates Better Auth accounts with hashed passwords
4. **Profile Creation**: Creates comprehensive student profile for STUDENT user
5. **Summary Display**: Shows total users and role distribution

## Troubleshooting

### "no such table" Error

```bash
# Run migrations first
bun prisma migrate dev
```

### Environment Variables

Ensure your `.env` file contains:

```env
DATABASE_URL="file:./prisma/dev.db"
BETTER_AUTH_SECRET="your-secret-here"
```

## Verification

After seeding, you can verify the data works by:

1. **Start Application**: `bun dev`
2. **Login Testing**: Test each role with their credentials
3. **Role Verification**: Confirm role-based navigation and permissions work
4. **Database Inspection**: Use Prisma Studio to inspect data:

```bash
# Open database browser
bun prisma studio

# Or use the custom script
bun run studio
```

**Expected Data Verification**:

- **Users**: 4 total users (1 per role)
- **Branches**: 6 branch locations
- **Student Profile**: 1 comprehensive profile for STUDENT user
- **Accounts**: 4 Better Auth accounts with hashed passwords

## Security Notes

⚠️ **Development Only**: These seed users are for development/testing only  
⚠️ **Default Passwords**: Each role has a different password (password@ho, password@incharge, etc.) - change before deploying to production  
⚠️ **Email Verified**: All seed users have `emailVerified: true` for testing convenience  
⚠️ **Student Data**: The student profile contains sample PII data for testing only  
⚠️ **Branch Data**: Branch locations are sample data - update with real institute locations  
⚠️ **Auth Secret**: Always use a securely generated `BETTER_AUTH_SECRET` in production
