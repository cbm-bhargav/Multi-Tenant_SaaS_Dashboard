// app/lib/project-init.ts
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { getProjectPrismaClient } from './prisma';

export async function initializeProjectDatabase(databaseUrl: string) {
  console.log('🔧 Initializing project database...');
  console.log('📍 Database URL:', databaseUrl);
  
  const schemaTemplatePath = path.join(process.cwd(), "prisma/projectSchema.prisma");
  const tempSchemaPath = path.join(process.cwd(), `prisma/temp-schema-${Date.now()}.prisma`);

  // Verify template schema exists
  if (!fs.existsSync(schemaTemplatePath)) {
    throw new Error(`Template schema not found at: ${schemaTemplatePath}`);
  }

  try {
    // Read and update the schema content
    const schemaContent = fs.readFileSync(schemaTemplatePath, "utf-8");
    console.log('📄 Original schema template read successfully');
    
    // Replace the database URL in the schema
    const updatedSchema = schemaContent.replace(
      'env("PROJECT_DATABASE_URL")',
      `"${databaseUrl}"`
    );
    
    // Write temporary schema file
    fs.writeFileSync(tempSchemaPath, updatedSchema);
    console.log('📝 Temporary schema file created:', tempSchemaPath);

    // Run prisma db push with better error handling
    console.log('🚀 Running prisma db push...');
    execSync(`npx prisma db push --schema "${tempSchemaPath}" --force-reset --accept-data-loss`, {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl, // Ensure the environment variable is set
      },
    });

    // Verify table was created by querying it
    console.log('🔍 Verifying User table creation...');
    const projectPrisma = getProjectPrismaClient(databaseUrl);
    
    // Test the connection and table existence
    await projectPrisma.user.findMany({ take: 1 });
    console.log('✅ User table verified successfully');

    // Perform the verification check immediately after initialization
    const isVerified = await verifyDatabaseInitialization(databaseUrl);
    if (!isVerified) {
      throw new Error('Database verification failed after initialization');
    }

    console.log("✅ Project database initialized and verified with User table");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize project database:", error);
    
    // If prisma db push failed, try a fallback approach with raw SQL
    console.log('🔄 Attempting fallback initialization with raw SQL...');
    // await initializeDatabaseWithRawSQL(databaseUrl);
    throw error;
  } finally {
    // Cleanup temporary file
    if (fs.existsSync(tempSchemaPath)) {
      fs.unlinkSync(tempSchemaPath);
      console.log('🧹 Temporary schema file cleaned up');
    }
  }
}

// Helper function to verify database initialization
export async function verifyDatabaseInitialization(databaseUrl: string): Promise<boolean> {
  try {
    const projectPrisma = getProjectPrismaClient(databaseUrl);
    await projectPrisma.user.findMany({ take: 1 });
    console.log('✅ Database verification successful');
    return true;
  } catch (error) {
    console.log('❌ Database verification failed:', error);
    return false;
  }
}