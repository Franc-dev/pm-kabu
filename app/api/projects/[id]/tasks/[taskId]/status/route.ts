import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { logger } from "@/lib/logger"
import { ProjectStatuses, tasks } from "@/src/db/schema";
import { eq } from "drizzle-orm";


// API route for updating task status
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ projectId: string; taskId: string }> }
  ) {
    try {
      const { taskId } = await params
      const body = await request.json()
      const { status } = body
  
      if (!status || !ProjectStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        )
      }
  
      const updatedTask = await db
        .update(tasks)
        .set({ status })
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
      logger.error("Error updating task status", { error })
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      )
    }
  }