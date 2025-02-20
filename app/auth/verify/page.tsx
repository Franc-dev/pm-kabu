"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader, useLoading } from "@/components/Loader"
import { logger } from "@/lib/logger"

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState("")
  const router = useRouter()
  const { isLoading, startLoading, setLoadingError } = useLoading()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startLoading()

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationCode }),
      })

      if (response.ok) {
        logger.success("User verified successfully")
        router.push("/dashboard")
      } else {
        const error = await response.json()
        setLoadingError(new Error(error.message))
        logger.error("Verification failed", { error: error.message })
      }
    } catch (error) {
      setLoadingError(error as Error)
      logger.error("Verification request failed", { error })
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the verification code sent to your email.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="verification-code" className="sr-only">
                Verification Code
              </label>
              <input
                id="verification-code"
                name="verificationCode"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? <Loader size="sm" color="white" /> : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

