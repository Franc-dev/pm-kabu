import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { logger } from "@/lib/logger"

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/teams",
  "/projects"
]

// Define public routes that don't need authentication
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/",
  "/favicon.ico",
  "/api",
  "/images",
  "/public",
  "/_next",  // Next.js internal routes
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".ico",
  ".svg",
  ".mp4",
  ".webp",
  ".pdf",
  ".css",
  ".js",
  ".json"
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // First check if it's a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get("token")
    logger.debug("Checking authentication", { token, path: pathname })
    
    if (!token) {
      logger.warn("Unauthorized access attempt", { path: pathname })
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }
  
  // Then check if it's a public route
  if (publicRoutes.some(route => 
    pathname.startsWith(route) || 
    pathname.endsWith(route)
  )) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/(.*)'  // Match all routes and let middleware function handle routing
  ]
}