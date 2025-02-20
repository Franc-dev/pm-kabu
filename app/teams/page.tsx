"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader } from "@/components/Loader"
import { TeamCard } from "@/components/teams/team-card"
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

  if (isLoading) return <Loader size="lg" />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Link href="/teams/create" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Create New Team
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}

