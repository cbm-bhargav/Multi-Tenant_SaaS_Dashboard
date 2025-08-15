import { PrismaClient } from '@prisma/client';

export async function initializeProjectDatabase(databaseUrl: string) {
  const projectPrisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } }
  });

  try {
    await projectPrisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "users" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      );
    `);
    console.log('Project database initialized with User table');
  } catch (error) {
    console.error('Failed to initialize project database:', error);
    throw error;
  } finally {
    await projectPrisma.$disconnect();
  }
}
