import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { users } from "@/src/db/schema"
import { db } from "@/src/db/drizzle"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { sendEmail } from "@/lib/smtp"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (existingUser.length) {
      logger.warn("Registration attempt with existing email", { email })
      return NextResponse.json({ message: "Email already in use" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = crypto.randomBytes(32).toString("hex")

    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        isVerified:true,
        hashedPassword,
        role: "student",
      })
      .returning({ id: users.id })

    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verificationToken}`

    await sendEmail(
      email,
      "Verify your email",
      `Please click this link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
    )

    logger.info("User registered successfully", { email })
    return NextResponse.json({ userId: newUser[0].id })
  } catch (error) {
    logger.error("Registration error", { error })
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
