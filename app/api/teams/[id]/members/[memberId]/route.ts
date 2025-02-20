import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { teamMembers } from "@/src/db/schema"
import { eq, and } from "drizzle-orm"
import { logger } from "@/lib/logger"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id: teamId, memberId } = await params
    const deletedMember = await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.id, memberId)
        )
      )
      .returning()

    if (deletedMember.length === 0) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Team member removed successfully" })
  } catch (error) {
    const { id: teamId, memberId } = await params
    logger.error("Error removing team member", { error, teamId, memberId })
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}