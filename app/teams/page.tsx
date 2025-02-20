"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader } from "@/components/Loader"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { Team } from "@/src/db/schema"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams")
        if (!response.ok) throw new Error("Failed to fetch teams")
        const data = await response.json()
        setTeams(data)
      } catch (error) {
        logger.error("Error fetching teams", { error })
        toast.error("Failed to load teams")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center m-auto min-h-64">
         <Loader size="md" />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Teams</h1>
          <Link
            href="/teams/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Team 
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xl">
                      {team.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.description}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Team Members
                </div>
                <Link
                  href={`/teams/${team.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                >
                  View Team
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

