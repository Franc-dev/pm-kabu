// components/AssignTeam.tsx
"use client"

import { useState, useEffect } from "react"
import type { Team } from "@/src/db/schema"

interface AssignTeamProps {
  projectId: string
  currentTeamId?: string | null
  onTeamAssigned?: () => void
  onClose?: () => void
}

export function AssignTeam({ 
  projectId, 
  currentTeamId,
  onTeamAssigned,
  onClose 
}: AssignTeamProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string>(currentTeamId || '')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams')
        if (!response.ok) {
          throw new Error('Failed to fetch teams')
        }
        const data = await response.json()
        setTeams(data)
        setError(null)
      } catch (error) {
        setError('Failed to load teams')
        console.error("Error fetching teams:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/team`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: selectedTeamId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to assign team')
      }

      // Call onTeamAssigned callback
      onTeamAssigned?.()
      
      // Close the dialog
      onClose?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign team')
      console.error("Error assigning team:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label
          htmlFor="teamSelect"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Team
        </label>
        <select
          id="teamSelect"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !selectedTeamId}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Assigning...
            </>
          ) : (
            "Assign Team"
          )}
        </button>
      </div>
    </form>
  )
}