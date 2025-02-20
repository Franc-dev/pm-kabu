import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"
import { logger } from "@/lib/logger"

// Define the paths that require authentication
const protectedPaths = ["/autohrs"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path should be protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (!isProtectedPath) {
    // If it's not a protected path, allow the request to proceed
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get("token")?.value

  if (!token) {
    logger.warn("No token found for protected path", { pathname })
    // Redirect to login if there's no token
    const encodedPath = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/auth/login?from=${encodedPath}`, request.url))
  }

  try {
    // Verify the token
    const payload = await verifyToken(token)

    if (!payload) {
      logger.warn("Token verification returned null payload", { token })
      throw new Error("Invalid token payload")
    }

    // Check if the payload has the expected structure
    if (typeof payload.id !== "number" || typeof payload.email !== "string" || typeof payload.role !== "string") {
      logger.warn("Token payload has unexpected structure", { payload })
      throw new Error("Invalid token structure")
    }

    // Add user info to headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.id.toString())
    requestHeaders.set("x-user-email", payload.email)
    requestHeaders.set("x-user-role", payload.role)

    // Continue with the request
    logger.info("User authenticated for protected path", { pathname, userId: payload.id, role: payload.role })
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    logger.error("Token verification failed", { error: error, pathname, token })
    // Token is invalid - redirect to login
    const response = NextResponse.redirect(new URL("/auth/login", request.url))

    // Clear the invalid token
    response.cookies.delete("token")

    return response
  }
}

// Update the matcher to include all routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

