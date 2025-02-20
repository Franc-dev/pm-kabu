import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { projects, ProjectStatuses } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { logger } from "@/lib/logger"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await db.select().from(projects).where(eq(projects.id, id)).limit(1)

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project[0])
  } catch (error) {
    logger.error("Error fetching project", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    logger.info("Creating project", { id })

  const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }
    
    if (!body.status || !ProjectStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Valid project status is required" }, { status: 400 })
    }
    
    if (!body.teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 })
    }

    logger.info("Creating project", { body })

    const newProject = await db.insert(projects).values(body).returning()
    return NextResponse.json(newProject[0])
  } catch (error) {
    logger.error("Error creating project", { error })
    // Check for foreign key violation
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updatedProject = await db.update(projects).set(body).where(eq(projects.id, id)).returning()

    if (updatedProject.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProject[0])
  } catch (error) {
    logger.error("Error updating project", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deletedProject = await db.delete(projects).where(eq(projects.id, id)).returning()

    if (deletedProject.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    logger.error("Error deleting project", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}


