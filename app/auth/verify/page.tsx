"use client"

import { JSX, Suspense } from "react"
import VerificationComponent from "@/components/VerificationComponent"
import { Loader } from "@/components/Loader"
import ErrorBoundary from "@/components/ErrorBoundary"

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-extrabold text-red-600">Verification Failed</h2>
          <p className="mt-2 text-sm text-gray-600">{error.message}</p>
          <button
            onClick={resetErrorBoundary}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 text-center">
              <Loader size="lg" />
              <p className="mt-4 text-gray-600">Verifying your account...</p>
            </div>
          </div>
        }
      >
        <VerificationComponent />
      </Suspense>
    </ErrorBoundary>
  )
}