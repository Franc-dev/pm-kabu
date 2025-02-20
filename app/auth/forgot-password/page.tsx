"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { logger } from "@/lib/logger"
import Loader, { useLoading } from "@/components/Loader"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { isLoading, startLoading, setLoadingError } = useLoading()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startLoading()

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        logger.success("Password reset email sent", { email })
        router.push("/auth/reset-password")
      } else {
        const error = await response.json()
        setLoadingError(new Error(error.message))
        logger.error("Forgot password request failed", { email, error: error.message })
      }
    } catch (error) {
      setLoadingError(error as Error)
      logger.error("Forgot password request failed", { email, error })
    }
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? <Loader size="sm" color="white" /> : "Send reset link"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

