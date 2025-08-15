import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Dynamic Prisma clients for project databases
const projectClients = new Map<string, PrismaClient>();

export function getProjectPrismaClient(databaseUrl: string): PrismaClient {
  if (!projectClients.has(databaseUrl)) {
    const client = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    projectClients.set(databaseUrl, client);
  }
  return projectClients.get(databaseUrl)!;
}

export async function disconnectProjectClient(databaseUrl: string): Promise<void> {
  const client = projectClients.get(databaseUrl);
  if (client) {
    await client.$disconnect();
    projectClients.delete(databaseUrl);
  }
}