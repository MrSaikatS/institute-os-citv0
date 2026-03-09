import { PrismaLibSql } from "@prisma/adapter-libsql";
import "dotenv/config";
import { PrismaClient, Role, StudentStatus } from "../generated/prisma/client";
import { hashPasswordFunction } from "../src/lib/argon2";
import { serverEnv } from "../src/lib/env/serverEnv";

// Initialize Prisma Client with the same adapter as the main application
const adapter = new PrismaLibSql({
  url: serverEnv.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Seed data for each role
const seedUsers = [
  {
    role: Role.HO,
    name: "Head Office Admin",
    email: "ho@citindia.in",
    password: "password@ho",
    // HO users don't typically have student profiles
  },
  {
    role: Role.INCHARGE,
    name: "Department Incharge",
    email: "incharge@citindia.in",
    password: "password@incharge",
  },
  {
    role: Role.TEACHER,
    name: "Teacher User",
    email: "teacher@citindia.in",
    password: "password@teacher",
  },
  {
    role: Role.STUDENT,
    name: "Student User",
    email: "student@citindia.in",
    password: "password@student",
    // Student profile data
    studentProfile: {
      status: StudentStatus.ACTIVE,
      officialName: "Student User",
      occupation: "Student",
      guardianName: "Parent Guardian",
      sourcesOfIncome: "Family Support",
      sourcesOfIncomeDetails: "Family provides financial support",
      fathersName: "Father Name",
      fathersOccupation: "Father Occupation",
      mothersName: "Mother Name",
      mothersOccupation: "Mother Occupation",
      dateOfBirth: new Date("2000-01-01"),
      lastQualification: "High School",
      otherQualification: null,
      address: "123 Student Street",
      landmark: "Near College",
      postOffice: "College Post",
      pinCode: "123456",
      district: "Education District",
      state: "Learning State",
      gender: "Other",
      religion: "Not Specified",
      category: "General",
      branch: "Computer Science",
      aadharNumber: "123456789012",
    },
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Create users for each role
    for (const userData of seedUsers) {
      console.log(`👤 Creating ${userData.role} user: ${userData.email}`);

      // Hash the password using Better Auth's hash function
      const hashedPassword = await hashPasswordFunction(userData.password);

      // Create or update the user
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name,
          role: userData.role,
          emailVerified: true, // Mark as verified for testing
          updatedAt: new Date(),
        },
        create: {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          emailVerified: true, // Mark as verified for testing
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create or update the account for Better Auth authentication
      const account = await prisma.account.upsert({
        where: {
          providerId_accountId: {
            providerId: "credential", // Better Auth uses "credential" for email/password
            accountId: user.id,
          },
        },
        update: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        create: {
          providerId: "credential", // Better Auth uses "credential" for email/password
          accountId: user.id,
          password: hashedPassword,
          user: {
            connect: { id: user.id },
          },
          createdAt: new Date(),
        },
      });

      console.log(
        `  🔐 Created/updated auth account for ${user.email} (ID: ${account.id})`,
      );

      // Create student profile if this is a student user
      if (userData.role === Role.STUDENT && userData.studentProfile) {
        const studentProfile = await prisma.studentProfile.upsert({
          where: { userId: user.id },
          update: {
            ...userData.studentProfile,
          },
          create: {
            ...userData.studentProfile,
            userId: user.id,
          },
        });

        console.log(
          `  📚 Created student profile for ${user.email} (ID: ${studentProfile.id})`,
        );
      }

      console.log(`  ✅ Created/updated user: ${user.email} (${user.role})`);
    }

    // Display summary
    const totalUsers = await prisma.user.count();
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    console.log("\n📊 Seeding Summary:");
    console.log(`  Total users: ${totalUsers}`);
    usersByRole.forEach((group) => {
      console.log(`  ${group.role}: ${group._count.role} users`);
    });

    console.log("\n🎉 Database seeding completed successfully!");

    // Display login information for testing
    console.log("\n🔑 Test User Credentials:");
    console.log("  All users use password: password123");
    seedUsers.forEach((user) => {
      console.log(`  ${user.role}: ${user.email}`);
    });
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .then(async () => {
    console.log("🔌 Disconnecting from database...");
    await prisma.$disconnect();
    console.log("✅ Disconnected successfully");
  })
  .catch(async (e) => {
    console.error("💥 Fatal error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
