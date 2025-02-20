import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/src/db/drizzle"
import { sendEmail } from "@/lib/smtp"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user.length) {
      logger.warn("Forgot password attempt with non-existent email", { email })
      return NextResponse.json({ message: "If the email exists, a reset link has been sent" })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    await db.update(users).set({ resetToken, resetTokenExpiry }).where(eq(users.id, user[0].id))

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

    await sendEmail(
      email,
      "Reset your password",
      `Please click this link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
    )

    logger.info("Password reset requested", { email })
    return NextResponse.json({ message: "If the email exists, a reset link has been sent" })
  } catch (error) {
    logger.error("Forgot password error", { error })
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

