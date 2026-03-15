# Database Seeding Guide

This document explains how to use the Prisma seed file for your Institute OS application.

## Overview

The seed file creates one user for each role in your application:

- **HO** (Head Office Admin): `ho@citindia.in`
- **INCHARGE** (Department Incharge): `incharge@citindia.in`
- **TEACHER**: `teacher@citindia.in`
- **STUDENT**: `student@citindia.in`

All users use different passwords for each role (see Test Users table below)

## Features

✅ **Better Auth Integration**: Uses the same password hashing as your authentication system  
✅ **Role-Based Users**: Creates users for all four roles  
✅ **Student Profile**: Automatically creates a student profile for the STUDENT user  
✅ **Idempotent**: Can be run multiple times without creating duplicates  
✅ **Proper Relations**: Creates User, Account, and StudentProfile records correctly

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

| Role     | Email                | Password          | Student Profile     |
| -------- | -------------------- | ----------------- | ------------------- |
| HO       | ho@citindia.in       | password@ho       | No                  |
| INCHARGE | incharge@citindia.in | password@incharge | No                  |
| TEACHER  | teacher@citindia.in  | password@teacher  | No                  |
| STUDENT  | student@citindia.in  | password@student  | Yes (ACTIVE status) |

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

- **User**: Main user record with role assignment
- **Account**: Better Auth authentication record with hashed password
- **StudentProfile**: Extended profile data for STUDENT role users

### Student Profile Details

The STUDENT user gets a comprehensive profile with:

- **Status**: ACTIVE
- **Personal Info**: Official name, date of birth (2000-01-01), gender, religion, category
- **Family Info**: Guardian name, father's/mother's names and occupations
- **Contact**: Address with landmark, post office, PIN code, district, state
- **Academic**: Branch (Computer Science), last qualification (High School)
- **Identity**: Aadhar number (123456789012)

### Seed Configuration

- Configured in `prisma.config.ts` with seed command: `bun prisma/seed.ts`
- Uses `bun` for TypeScript execution (not tsx)
- Follows Prisma v7 seeding best practices with libsql adapter

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

1. Starting your application: `bun dev`
2. Logging in with any of the test users
3. Checking that role-based permissions work correctly

## Security Notes

⚠️ **Development Only**: These seed users are for development/testing only  
⚠️ **Default Passwords**: Each role has a different password (password@ho, password@incharge, etc.) - change before deploying to production  
⚠️ **Email Verified**: All seed users have `emailVerified: true` for testing  
⚠️ **Student Data**: The student profile contains sample PII data for testing only
