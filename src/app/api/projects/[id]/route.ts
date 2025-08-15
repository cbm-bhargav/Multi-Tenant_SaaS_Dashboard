// src/app/api/projects/[id]/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getProjectPrismaClient } from '@/app/lib/prisma';
import type { User, CreateUserRequest } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const projectId = Number(id);
    if (isNaN(projectId)) return NextResponse.json([], { status: 200 });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return NextResponse.json([], { status: 200 });

    const projectPrisma = getProjectPrismaClient(project.databaseUrl);

    // Since your tables don't have createdAt/created_at columns, 
    // we'll use CURRENT_TIMESTAMP as a fallback
    const users = await projectPrisma.$queryRaw<any[]>`
      SELECT 
        id, 
        name, 
        email,
        CURRENT_TIMESTAMP as "createdAt"
      FROM "users"
      ORDER BY id DESC
    `;

    console.log('Users fetched:', users);
    return NextResponse.json(users ?? []);
    
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<User | { error: string }>> {
  try {
    const { id } = await params;
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

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const projectPrisma = getProjectPrismaClient(project.databaseUrl);
    const user = await projectPrisma.$queryRaw<any[]>`
      INSERT INTO "users" ("name", "email")
      VALUES (${body.name}, ${body.email})
      RETURNING *, CURRENT_TIMESTAMP as "createdAt"
    `;

    console.log('User created:', user[0]);
    return NextResponse.json(user[0]);
    
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}