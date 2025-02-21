"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"

// Loading fallback component
function ResetPasswordSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="h-10 bg-gray-200 rounded-t-md animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-b-md animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

// Main form component
function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoading, startLoading, setLoadingError } = useLoading()

  // Get token from URL parameters
  const token = searchParams.get("token")

  // Redirect if no token is present
  useEffect(() => {
    if (!token) {
      logger.warn("No reset token provided")
      router.push("/auth/login")
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setLoadingError(new Error("Passwords do not match"))
      return
    }

    if (!token) {
      setLoadingError(new Error("No reset token provided"))
      return
    }

    startLoading()

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      })

      if (response.ok) {
        logger.success("Password reset successfully")
        router.push("/auth/login")
      } else {
        const error = await response.json()
        setLoadingError(new Error(error.message))
        logger.error("Password reset failed", { error: error.message })
      }
    } catch (error) {
      setLoadingError(error as Error)
      logger.error("Password reset request failed", { error })
    }
  }

  // Don't render the form if there's no token
  if (!token) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter your new password below.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? <Loader size="sm" color="white" /> : "Reset password"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

// Imported at the top with other imports
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader, useLoading } from "@/components/Loader"
import { logger } from "@/lib/logger"

// Default export wrapped in Suspense
export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  )
}