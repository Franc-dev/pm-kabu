import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { users } from "@/src/db/schema"
import { eq, and, gt } from "drizzle-orm"
import { db } from "@/src/db/drizzle"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { password, token } = await req.json()

    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.resetToken, token), gt(users.resetTokenExpiry, new Date())))
      .limit(1)

    if (!user.length) {
      logger.warn("Password reset attempt with invalid or expired token")
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db
      .update(users)
      .set({
        hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(users.id, user[0].id))

    logger.info("Password reset successfully", { userId: user[0].id })
    return NextResponse.json({ message: "Password reset successful" })
  } catch (error) {
    logger.error("Password reset error", { error })
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

