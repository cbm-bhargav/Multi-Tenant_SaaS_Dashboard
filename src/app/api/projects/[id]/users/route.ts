//src/app/api/projects/[id]/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getProjectPrismaClient } from "@/app/lib/prisma";
import type { User, CreateUserRequest } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Await params in Next.js 15+
    const { id } = await params;
    const projectId = Number(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json([], { status: 200 });
    }

    const project = await prisma.project.findUnique({ 
      where: { id: projectId } 
    });
    
    if (!project) {
      return NextResponse.json([], { status: 200 });
    }

    const projectPrisma = getProjectPrismaClient(project.databaseUrl);

    const users = await projectPrisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<User | { error: string }>> {
  try {
    // Await params in Next.js 15+
    const { id } = await params;
    const body: CreateUserRequest = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const projectId = Number(id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" }, 
        { status: 400 }
      );
    }

    // Get project from master DB
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    console.log('Connecting to project DB:', project.databaseUrl);
    const projectPrisma = getProjectPrismaClient(project.databaseUrl);

    // Create user (database should already be initialized when project was created)
    const user = await projectPrisma.user.create({
      data: {
        name: body.name,
        email: body.email,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<User | { error: string }>> {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const projectId = Number(id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const projectPrisma = getProjectPrismaClient(project.databaseUrl);

    const updatedUser = await projectPrisma.user.update({
      where: { id: body.userId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const projectId = Number(id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const projectPrisma = getProjectPrismaClient(project.databaseUrl);

    await projectPrisma.user.delete({
      where: { id: Number(userId) },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}