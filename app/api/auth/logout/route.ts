// app/api/auth/logout/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { logger } from "@/lib/logger"

export async function POST() {
  try {
    // Remove the token cookie
    (await cookies()).delete("token")

    logger.info("User logged out successfully")
    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    logger.error("Logout error", { error })
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}