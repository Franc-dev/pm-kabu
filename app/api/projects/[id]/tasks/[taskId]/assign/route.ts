import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { tasks, teamMembers } from "@/src/db/schema"
import { eq, and } from "drizzle-orm"
import { logger } from "@/lib/logger"

// API route for assigning tasks
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params
    const body = await request.json()
    const { assigneeId } = body

    // Verify the assignee is part of the project's team
    const teamMember = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.userId, assigneeId),
          eq(teamMembers.teamId, id)
        )
      )
      .limit(1)

    if (teamMember.length === 0) {
      return NextResponse.json(
        { error: "Assignee must be a team member" },
        { status: 400 }
      )
    }

    const updatedTask = await db
      .update(tasks)
      .set({ assigneeId })
      .where(eq(tasks.id, taskId))
      .returning()

    if (updatedTask.length === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedTask[0])
  } catch (error) {
    logger.error("Error assigning task", { error })
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
