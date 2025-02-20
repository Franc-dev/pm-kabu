import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { teams } from "@/src/db/schema"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const allTeams = await db.select().from(teams)
    return NextResponse.json(allTeams)
  } catch (error) {
    logger.error("Error fetching teams", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newTeam = await db.insert(teams).values(body).returning()
    return NextResponse.json(newTeam[0], { status: 201 })
  } catch (error) {
    logger.error("Error creating team", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

