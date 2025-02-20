import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { users } from "@/src/db/schema"
import { db } from "@/src/db/drizzle"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    const user = await db.select().from(users).where(eq(users.verificationToken, token)).limit(1)

    if (!user.length) {
      logger.warn("Verification attempt with invalid token")
      return NextResponse.json({ message: "Invalid verification token" }, { status: 400 })
    }

    await db.update(users).set({ isVerified: true, verificationToken: null }).where(eq(users.id, user[0].id))

    logger.info("User verified successfully", { userId: user[0].id })
    return NextResponse.json({ message: "Verification successful" })
  } catch (error) {
    logger.error("Verification error", { error })
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

