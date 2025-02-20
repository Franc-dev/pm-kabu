import { NextResponse } from "next/server"
import { db } from "@/src/db/drizzle"
import { teamMembers, users } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { logger } from "@/lib/logger"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const members = await db
      .select({
        team_members: teamMembers,
        users: users
      })
      .from(teamMembers)
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, (await params).id))

    return NextResponse.json(members)
  } catch (error) {
    const teamId = (await params).id || 'unknown'
    logger.error("Error fetching team members", { error, teamId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { email, role } = body
    
    // First, find or create the user
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then(results => results[0])

    if (!user) {
      // If user doesn't exist, create a temporary user account
      // Note: You might want to adjust this based on your user registration flow
      user = await db
        .insert(users)
        .values({
          email: email,
          name: email.split('@')[0], // Use email prefix as temporary name
          role: 'student', // Default role - adjust as needed
          hashedPassword: '', // You'll need to handle this based on your auth strategy
          isVerified: false
        })
        .returning()
        .then(results => results[0])
    }

    // Now create the team member with the user ID
    const newMember = await db
      .insert(teamMembers)
      .values({
        teamId: (await params).id,
        userId: user.id,
        role: role
      })
      .returning()

    // Fetch the complete member data with user information
    const memberWithUser = await db
      .select({
        team_members: teamMembers,
        users: users
      })
      .from(teamMembers)
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.id, newMember[0].id))
      .then(results => results[0])

    logger.info("Team member added successfully", { teamMember: memberWithUser })
    return NextResponse.json(memberWithUser, { status: 201 })
  } catch (error) {
    const teamId = (await params).id || 'unknown'
    logger.error("Error adding team member", { error, teamId })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}