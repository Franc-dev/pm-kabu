// app/api/projects/[id]/team/route.ts
import { db } from "@/src/db/drizzle"
import { projects, teamMembers, users } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

// GET
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const projectId = (await params).id

    // First get the team ID for this project
    const project = await db
      .select({ teamId: projects.teamId })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (!project.length) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Then get team members with user details
    let members;
    if (project[0].teamId) {
      members = await db
        .select({
          id: teamMembers.id,
          userId: teamMembers.userId,
          role: teamMembers.role,
          user: {
            name: users.name,
            avatarUrl: users.avatarUrl
          }
        })
        .from(teamMembers)
        .innerJoin(users, eq(teamMembers.userId, users.id))
        .where(eq(teamMembers.teamId, project[0].teamId))
    } else {
      return NextResponse.json({ error: "teamId is null" }, { status: 400 });
    }

    logger.success('Team members fetched successfully', { memberCount: members.length })
    return NextResponse.json(members)

  } catch (error) {
    logger.error("Error fetching team members", { error })
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    )
  }
}
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