"use client"

import { useState, useEffect } from "react"
import { Loader } from "@/components/Loader"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { TeamMember } from "@/src/db/schema"

interface MemberListProps {
  teamId: string
}

export function MemberList({ teamId }: MemberListProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}/members`)
        if (!response.ok) throw new Error("Failed to fetch team members")
        const data = await response.json()
        setMembers(data)
      } catch (error) {
        logger.error("Error fetching team members", { error, teamId })
        toast.error("Failed to load team members")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [teamId])

  if (isLoading) return <Loader size="md" />

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">{member.userId}</h4>
          <p className="text-sm text-gray-600">{member.role}</p>
        </div>
      ))}
    </div>
  )
}

