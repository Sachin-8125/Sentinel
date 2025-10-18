import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  console.log("🔍 Testing Sentinel Backend Setup...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Set" : "❌ Missing"}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Set" : "❌ Missing"}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`   PORT: ${process.env.PORT || 3001}\n`);

  // Test database connection
  console.log("🗄️  Testing Database Connection...");
  try {
    await prisma.$connect();
    console.log("   ✅ Database connection successful!\n");

    // Test database query
    console.log("📊 Testing Database Query...");
    const userCount = await prisma.user.count();
    console.log(`   ✅ Users in database: ${userCount}\n`);

    // Check for tables
    console.log("🔧 Checking Database Tables...");
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    ` as any[];

    const expectedTables = ["users", "health_readings", "system_readings", "alerts", "audit_logs"];
    const existingTables = tables.map((t: any) => t.table_name);

    expectedTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} - MISSING`);
      }
    });

  } catch (error) {
    console.log("   ❌ Database connection failed!");
    console.error("   Error:", error instanceof Error ? error.message : error);
    console.log("\n💡 Solutions:");
    console.log("   1. Check your DATABASE_URL in .env file");
    console.log("   2. Ensure your Neon database is active");
    console.log("   3. Run: npx prisma migrate deploy");
    console.log("   4. Run: npx prisma generate\n");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n✨ All checks passed! Backend is ready to run.");
  console.log("🚀 Start the server with: bun run src/index.ts\n");
}

testConnection();
