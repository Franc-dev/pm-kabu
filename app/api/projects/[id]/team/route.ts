// app/api/projects/[id]/team/route.ts
import { db } from "@/src/db/drizzle"
import { projects } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {

  try {
    const { teamId } = await request.json()
    
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      )
    }

    const { id } = await params;

    const updatedProject = await db
      .update(projects)
      .set({ 
        teamId,
        updatedAt: new Date()
      })
      .where(eq(projects.id, id))
      .returning()

    if (!updatedProject.length) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    logger.info("Project team updated successfully", {
      projectId: id,
      teamId
    })

    return NextResponse.json(updatedProject[0])
  } catch (error) {
    logger.error("Error updating project team", {
      error,
      projectId: (await params).id
    })
    
    return NextResponse.json(
      { error: "Failed to update project team" },
      { status: 500 }
    )
  }
}