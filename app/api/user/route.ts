// app/api/user/route.ts
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { logger } from "@/lib/logger"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/src/db/drizzle"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ isAuthenticated: false })
    }

    const decoded = await verifyToken(token)
    
    if (!decoded?.userId || typeof decoded.userId !== 'string') {
      return NextResponse.json({ isAuthenticated: false })
    }

    const user = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1)

    if (!user.length) {
      return NextResponse.json({ isAuthenticated: false })
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name
      }
    })
  } catch (error) {
    logger.error("Error fetching user info", { error })
    return NextResponse.json({ isAuthenticated: false })
  }
}