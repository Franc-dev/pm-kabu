import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/src/db/drizzle"
import { documents } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { logger } from "@/lib/logger"
import jwt from "jsonwebtoken"
import { getCloudinaryUrl } from "@/utils/cloudinary"

// Helper function to decode JWT
function decodeToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
    return decoded
  } catch (error) {
    logger.error("Error decoding JWT", { error })
    return null
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const projectDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.projectId, (await params).id))
    return NextResponse.json(projectDocuments)
  } catch (error) {
    const projectId = (await params).id || "unknown"
    logger.error("Error fetching project documents", { error, projectId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    logger.info("Creating project document", { body })

    // Get the token from cookies
    const cookieStore = cookies()
    const token = (await cookieStore).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Decode the token to get the user ID
    const decodedToken = decodeToken(token)
    logger.info("Decoded token", { decodedToken })
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const newDocument = await db
      .insert(documents)
      .values({
        ...body,
        projectId: (await params).id,
        status: "draft",
        uploaderId: decodedToken.userId,
        fileType: body.fileType,
        fileUrl: getCloudinaryUrl(body.fileUrl, body.fileType)
        
      })
      .returning()
      logger.info("Created new project document", { newDocument })
    return NextResponse.json(newDocument[0], { status: 201 })
  } catch (error) {
    const projectId = (await params).id || "unknown"
    logger.error("Error creating project document", { error, projectId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

