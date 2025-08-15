// api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { createNeonProject } from '@/app/lib/neon';
import { initializeProjectDatabase } from '@/app/lib/project-init';
import type { CreateProjectRequest, Project } from '@/types';
import { Console } from 'console';

export async function GET(): Promise<NextResponse<Project[] | { error: string }>> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<Project | { error: string }>> {
  try {
    const body: CreateProjectRequest = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Create Neon project
    const { neonProjectId, databaseUrl } = await createNeonProject(body.name);

    // Store in master database
    const project = await prisma.project.create({
      data: {
        name: body.name,
        databaseUrl,
      },
    });

    // Initialize project database with User table
    await initializeProjectDatabase(databaseUrl);

    // ✅ Return full project object
    return NextResponse.json(project); // project already has id, name, neonProjectId, databaseUrl, createdAt, updatedAt
  } catch (error) {
    console.error('Project creation failed:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

