// verify/VerificationComponent.tsx
"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { logger } from "@/lib/logger"

export default function VerificationComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        logger.error("No verification token provided")
        throw new Error("Verification token is missing")
      }

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          logger.success("User verified successfully")
          router.push("/dashboard")
        } else {
          const error = await response.json()
          logger.error("Verification failed", { error: error.message })
          throw new Error(error.message)
        }
      } catch (error) {
        logger.error("Verification request failed", { error })
        throw error
      }
    }

    verifyUser()
  }, [token, router])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Verifying your account</h2>
          <p className="mt-2 text-sm text-gray-600">Please wait while we verify your account.</p>
        </div>
      </div>
    </motion.div>
  )
}