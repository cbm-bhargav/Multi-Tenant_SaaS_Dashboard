// // api/projects/[id]/users/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/app/lib/prisma';
// import { getProjectPrismaClient } from '@/app/lib/prisma';
// import type { User, CreateUserRequest } from '@/types';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse> {
//   try {
//     const projectId = Number(params.id); // ✅ Now TypeScript knows `params.id` exists
//     if (isNaN(projectId)) return NextResponse.json([], { status: 200 });

//     const project = await prisma.project.findUnique({ where: { id: projectId } });
//     if (!project) return NextResponse.json([], { status: 200 });

//     const projectPrisma = getProjectPrismaClient(project.databaseUrl);

//     // Use correct column name
 
//     const users = await projectPrisma.$queryRaw<User[]>`
//       SELECT 
//         id, 
//         name, 
//         email, 
//         "createdAt"
//       FROM "users"
//     `;

//     console.log(users)

//     return NextResponse.json(users ?? []);
//   } catch (error) {
//     console.error('Failed to fetch users:', error);
//     return NextResponse.json([], { status: 200 });
//   }
// }

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } } // ✅ Type params
// ): Promise<NextResponse<User | { error: string }>> {
//   try {
//     const { id } = params;
//     const body: CreateUserRequest = await request.json();
    
//     if (!body.name || !body.email) {
//       return NextResponse.json(
//         { error: 'Name and email are required' },
//         { status: 400 }
//       );
//     }

//     const projectId = Number(id);
//     if (isNaN(projectId)) {
//       return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
//     }
//     // Get project from master DB
//     const project = await prisma.project.findUnique({
//       where: { id: projectId },
//     });

//     if (!project) {
//       return NextResponse.json(
//         { error: 'Project not found' },
//         { status: 404 }
//       );
//     }

//     // Create user in project DB
//     const projectPrisma = getProjectPrismaClient(project.databaseUrl);
//     const user = await projectPrisma.$queryRaw<User[]>`
//       INSERT INTO "users" ("name", "email")
//       VALUES (${body.name}, ${body.email})
//       RETURNING *
//     `;

//     return NextResponse.json(user[0]);
//   } catch (error) {
//     console.error('Failed to create user:', error);
//     return NextResponse.json(
//       { error: 'Failed to create user' },
//       { status: 500 }
//     );
//   }
// }
// app/api/projects/[id]/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getProjectPrismaClient } from '@/app/lib/prisma';
import type { User, CreateUserRequest } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const projectId = Number(params.id);
    if (isNaN(projectId)) return NextResponse.json([], { status: 200 });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return NextResponse.json([], { status: 200 });

    const projectPrisma = getProjectPrismaClient(project.databaseUrl);

    // First, let's check what columns actually exist
    try {
      // Try with createdAt first (camelCase)
      const users = await projectPrisma.$queryRaw<User[]>`
        SELECT 
          id, 
          name, 
          email, 
          "createdAt"
        FROM "users"
      `;
      console.log('Users with createdAt:', users);
      return NextResponse.json(users ?? []);
    } catch (error) {
      console.log('createdAt failed, trying created_at:', error);
      
      try {
        // Try with created_at (snake_case)
        const users = await projectPrisma.$queryRaw<any[]>`
          SELECT 
            id, 
            name, 
            email, 
            created_at as "createdAt"
          FROM "users"
        `;
        console.log('Users with created_at:', users);
        return NextResponse.json(users ?? []);
      } catch (error2) {
        console.log('created_at failed, trying without timestamp:', error2);
        
        try {
          // Try without any timestamp column
          const users = await projectPrisma.$queryRaw<any[]>`
            SELECT 
              id, 
              name, 
              email,
              CURRENT_TIMESTAMP as "createdAt"
            FROM "users"
          `;
          console.log('Users without timestamp column:', users);
          return NextResponse.json(users ?? []);
        } catch (error3) {
          console.log('All queries failed:', error3);
          return NextResponse.json([], { status: 200 });
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<User | { error: string }>> {
  try {
    const { id } = params;
    const body: CreateUserRequest = await request.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const projectId = Number(id);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // Get project from master DB
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create user in project DB - try different approaches
    const projectPrisma = getProjectPrismaClient(project.databaseUrl);
    
    try {
      // Try with createdAt column
      const user = await projectPrisma.$queryRaw<User[]>`
        INSERT INTO "users" ("name", "email", "createdAt")
        VALUES (${body.name}, ${body.email}, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      return NextResponse.json(user[0]);
    } catch (error) {
      console.log('Insert with createdAt failed, trying created_at:', error);
      
      try {
        // Try with created_at column
        const user = await projectPrisma.$queryRaw<any[]>`
          INSERT INTO "users" ("name", "email", "created_at")
          VALUES (${body.name}, ${body.email}, CURRENT_TIMESTAMP)
          RETURNING *, created_at as "createdAt"
        `;
        return NextResponse.json(user[0]);
      } catch (error2) {
        console.log('Insert with created_at failed, trying without timestamp:', error2);
        
        try {
          // Try without timestamp column
          const user = await projectPrisma.$queryRaw<any[]>`
            INSERT INTO "users" ("name", "email")
            VALUES (${body.name}, ${body.email})
            RETURNING *, CURRENT_TIMESTAMP as "createdAt"
          `;
          return NextResponse.json(user[0]);
        } catch (error3) {
          throw error3; // Re-throw the final error
        }
      }
    }
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}