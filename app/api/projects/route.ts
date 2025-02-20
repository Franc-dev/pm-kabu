import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { projects } from "@/src/db/schema"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const allProjects = await db.select().from(projects)
    return NextResponse.json(allProjects)
  } catch (error) {
    logger.error("Error fetching projects", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.status) {
      return NextResponse.json(
        { error: "Name and status are required" },
        { status: 400 }
      )
    }

    // Convert dates and times to timestamps
    const startDateTime = body.startDate && body.startTime 
      ? new Date(`${body.startDate}T${body.startTime}`)
      : null

    const endDateTime = body.endDate && body.endTime
      ? new Date(`${body.endDate}T${body.endTime}`)
      : null

    // Prepare project data
    const projectData = {
      name: body.name,
      description: body.description,
      status: body.status,
      teamId: body.teamId || null, // Make teamId optional
      startDate: startDateTime,
      endDate: endDateTime,
      startTime: body.startTime || null,
      endTime: body.endTime || null,
    }

    const newProject = await db.insert(projects).values(projectData).returning()
    return NextResponse.json(newProject[0], { status: 201 })
  } catch (error) {
    logger.error("Error creating project", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

