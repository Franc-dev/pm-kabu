"use client"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Loader } from "@/components/Loader"
import MemberList from "@/components/teams/enhanced-member-list" // Update this import path
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { Team } from "@/src/db/schema"
import { Users } from "lucide-react" // Add this import

export default function TeamDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const teamId = params.id
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}`)
        if (!response.ok) throw new Error("Failed to fetch team")
        const data = await response.json()
        setTeam(data)
      } catch (error) {
        logger.error("Error fetching team", { error, teamId })
        toast.error("Failed to load team details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeam()
  }, [teamId])

  if (isLoading) return <Loader size="lg" />
  if (!team) return <div>Team not found</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
        <p className="text-gray-600">{team.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold">Team Members</h2>
          </div>
          
          <Link
            href={`/teams/${team.id}/members`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Manage Members
          </Link>
        </div>

        <MemberList teamId={team.id} />
      </div>
    </div>
  )
}