import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { tasks, users } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { logger } from "@/lib/logger"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const result = await params;
  logger.info("Fetching tasks for project", { params })
 const id = result.id;
     logger.info("Fetching tasks for project", { id })
    try {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      if (!uuidRegex.test(id)) {
        return NextResponse.json(
          { error: "Invalid project ID format" },
          { status: 400 }
        )
      }
  
      // Query tasks with assignee relation
      const projectTasks = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          status: tasks.status,
          priority: tasks.priority,
          dueDate: tasks.dueDate,
          projectId: tasks.projectId,
          assigneeId: tasks.assigneeId,
          createdAt: tasks.createdAt,
          updatedAt: tasks.updatedAt,
          assignee: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl
          }
        })
        .from(tasks)
        .leftJoin(users, eq(tasks.assigneeId, users.id))
        .where(eq(tasks.projectId, id))
        .orderBy(tasks.createdAt)

        logger.info("Fetched tasks for project", { tasks: projectTasks })
  
      return NextResponse.json(projectTasks)
    } catch (error) {
      // Log the actual error details
      logger.error("Error fetching project tasks", { 
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        projectId: id 
      })
  
      // Return a 500 response
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 }
      )
    }
  }

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await params;
    const id = result.id;
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.status || !body.priority) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate status and priority enums
    const validStatuses = ['planned', 'in_progress', 'completed', 'on_hold']
    const validPriorities = ['low', 'medium', 'high', 'urgent']

    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      )
    }

    if (!validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      )
    }

    // Handle date conversion
    const dueDate = body.dueDate ? new Date(body.dueDate) : null
    if (dueDate && isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid due date format" },
        { status: 400 }
      )
    }

    // Create task with only the fields we want
    const taskData = {
      title: body.title,
      description: body.description || null,
      status: body.status,
      priority: body.priority,
      dueDate: dueDate,
      projectId: id,
      assigneeId: body.assigneeId || null
    }

    const newTask = await db
      .insert(tasks)
      .values(taskData)
      .returning()

    logger.info("Task created successfully", { taskId: newTask[0].id })
    return NextResponse.json(newTask[0])
  } catch (error) {
    logger.error("Error creating task", { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
