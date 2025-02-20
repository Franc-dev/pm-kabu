import { NextResponse } from "next/server"
import { signToken } from "@/lib/auth/jwt"
import { logger } from "@/lib/logger"
import { users } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/src/db/drizzle"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user.length) {
      logger.warn("Login attempt with non-existent email", { email })
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].hashedPassword)

    if (!isPasswordValid) {
      logger.warn("Login attempt with invalid password", { email })
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = await signToken({ userId: user[0].id, email: user[0].email })

    logger.info("User logged in successfully", { email })
    return NextResponse.json({ token })
  } catch (error) {
    logger.error("Login error", { error })
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

