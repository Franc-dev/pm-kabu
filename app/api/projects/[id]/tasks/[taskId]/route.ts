import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { tasks } from "@/src/db/schema"
import { eq, and } from "drizzle-orm"
import { logger } from "@/lib/logger"

export async function GET(request: Request, { params }: { params: Promise<{ projectId: string; taskId: string }> }) {
  try {
    const { projectId, taskId } = await params
    const task = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.id, taskId)))
      .limit(1)

    if (task.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task[0])
  } catch (error) {
    logger.error("Error fetching task", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ projectId: string; taskId: string }> }) {
  try {
    const { projectId, taskId } = await params
    const body = await request.json()

    const updatedTask = await db
      .update(tasks)
      .set(body)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.id, taskId)))
      .returning()

    if (updatedTask.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(updatedTask[0])
  } catch (error) {
    logger.error("Error updating task", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ projectId: string; taskId: string }> }) {
  try {
    const { projectId, taskId } = await params
    const deletedTask = await db
      .delete(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.id, taskId)))
      .returning()

    if (deletedTask.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    logger.error("Error deleting task", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

