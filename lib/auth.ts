import { randomBytes } from "crypto"
import * as jose from "jose"
import { cookies } from "next/headers"
import { logger } from '@/lib/logger'

export interface JWTPayload {
  userId: number
  email: string
  role: string
  iat?: number
  exp?: number
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  if (!token) {
    logger.warn('Attempted to verify null/empty token')
    return null
  }

  try {
    logger.debug('Verifying JWT token', { tokenLength: token.length })
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    
    if (typeof payload.userId === 'number' && 
        typeof payload.email === 'string' && 
        typeof payload.role === 'string') {
      logger.success('Token verified successfully', {
        userId: payload.userId,
        role: payload.role,
        expiresAt: new Date(payload.exp! * 1000).toISOString()
      })
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp
      }
    }
    
    logger.error('Invalid token payload structure', {
      hasUserId: typeof payload.userId === 'number',
      hasEmail: typeof payload.email === 'string',
      hasRole: typeof payload.role === 'string'
    })
    return null
  } catch (error) {
    logger.error('Token verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return null
  }
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  
  if (!token) {
    logger.debug('No auth token found in cookies')
  } else {
    logger.debug('Auth token retrieved from cookies', { 
      tokenPresent: true,
      tokenLength: token.length 
    })
  }
  
  return token
}

export function generateTemporaryPassword(length = 10): string {
  logger.info('Generating temporary password', { length })
  const password = randomBytes(length).toString("hex").slice(0, length)
  logger.debug('Temporary password generated', { 
    passwordLength: password.length,
    isHexOnly: /^[0-9a-f]+$/.test(password)
  })
  return password
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  logger.debug('Attempting to get current user')
  const token = await getAuthToken()
  
  if (!token) {
    logger.info('No user token available')
    return null
  }
  
  const user = await verifyToken(token)
  if (user) {
    logger.info('Current user retrieved', { 
      userId: user.userId,
      role: user.role
    })
  } else {
    logger.warn('Failed to retrieve current user with provided token')
  }
  
  return user
}