import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { documents } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { logger } from "@/lib/logger"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const projectDocuments = await db.select().from(documents).where(eq(documents.projectId, (await params).id))
    return NextResponse.json(projectDocuments)
  } catch (error) {
    const projectId = (await params).id || 'unknown';
    logger.error("Error fetching project documents", { error, projectId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const newDocument = await db
      .insert(documents)
      .values({ ...body, projectId: (await params).id })
      .returning()
    return NextResponse.json(newDocument[0], { status: 201 })
  } catch (error) {
    const projectId = (await params).id || 'unknown';
    logger.error("Error creating project document", { error, projectId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

