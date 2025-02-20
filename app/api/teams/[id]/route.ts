import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { teams } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { logger } from "@/lib/logger"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const team = await db.select().from(teams).where(eq(teams.id, (await params).id)).limit(1)
    if (team.length === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }
    return NextResponse.json(team[0])
  } catch (error) {
    const teamId = (await params).id || 'unknown';
    logger.error("Error fetching team", { error, teamId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const updatedTeam = await db.update(teams).set(body).where(eq(teams.id, (await params).id)).returning()
    if (updatedTeam.length === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }
    return NextResponse.json(updatedTeam[0])
  } catch (error) {
    const teamId = (await params).id || 'unknown';
    logger.error("Error updating team", { error, teamId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const deletedTeam = await db.delete(teams).where(eq(teams.id, (await params).id)).returning()
    if (deletedTeam.length === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Team deleted successfully" })
  } catch (error) {
    const teamId = (await params).id || 'unknown';
    logger.error("Error deleting team", { error, teamId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

