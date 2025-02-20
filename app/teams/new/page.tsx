"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import Link from "next/link"

export default function CreateTeamPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error("Team name is required")
      return
    }
    
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create team")

      const team = await response.json()
      toast.success("Team created successfully!")
      router.push(`/teams/${team.id}`)
    } catch (error) {
      logger.error("Error creating team", { error })
      toast.error("Failed to create team")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Team
          </h1>
          <p className="text-lg text-gray-600">
            Build something amazing with your team
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Indicator */}
          <div className="w-full h-2 bg-gray-100">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ 
                width: `${
                  (formData.name ? 50 : 0) + 
                  (formData.description ? 50 : 0)
                }%` 
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Team Name Input */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Team Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                placeholder="Enter a memorable team name"
              />
            </div>

            {/* Team Description Input */}
            <div className="mb-8">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Team Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none"
                placeholder="What's your team all about? Share your mission and goals..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href="/teams"
                className="px-6 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium
                  ${
                    isSubmitting || !formData.name.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700 transform hover:-translate-y-0.5"
                  }
                  transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Team...
                  </div>
                ) : (
                  "Create Team"
                )}
              </button>
            </div>
          </form>

          {/* Tips Section */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Tips for creating a great team:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Choose a clear, descriptive name that reflects your team&apos;s purpose
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Add a detailed description to help members understand the team&apos;s goals
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}