import { PrismaClient } from "@prisma/client";

interface NeonProjectResult {
  neonProjectId: string;
  databaseUrl: string;
}

export async function createNeonProject(projectName: string) {
  try {
    const res = await fetch('https://console.neon.tech/api/v2/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEON_API_KEY}`,
      },
      body: JSON.stringify({
        project: {
          name: projectName,
          org_id: process.env.NEON_ORG_ID,  // some endpoints require this
          region_id: 'aws-ap-southeast-1', // choose your region
          postgres_version: '17',   // optional, specify version
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to create Neon project');
    }

    const neonProjectId = data.id;
    const databaseUrl = data.connection_uris[0].connection_uri;
    console.log('**********************************************************',databaseUrl)

    return { neonProjectId, databaseUrl };
  } catch (error) {
    console.error('Failed to create Neon project:', error);
    throw new Error('Failed to create Neon project');
  }
}

async function waitForNeonProjectReady(databaseUrl: string) {
  let attempts = 0;
  while (attempts < 10) {
    try {
      const projectPrisma = new PrismaClient({
        datasources: { db: { url: databaseUrl } }
      });
      await projectPrisma.$queryRaw`SELECT 1`;
      await projectPrisma.$disconnect();
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 2000)); // wait 2s
      attempts++;
    }
  }
  throw new Error('Neon project DB not ready in time');
}

export async function deleteNeonProject(neonProjectId: string): Promise<void> {
  try {
    const res = await fetch(`https://console.neon.tech/api/v2/projects/${neonProjectId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${process.env.NEON_API_KEY}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete Neon project");
  } catch (error) {
    console.error("Failed to delete Neon project:", error);
    throw new Error("Failed to delete Neon project");
  }
}
