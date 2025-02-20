/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { TeamMember, User } from "@/src/db/schema"

type MemberWithUser = TeamMember & {
  user: User | null
}

export default function ManageTeamMembersPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const teamId = params.id
  const router = useRouter()
  const [members, setMembers] = useState<MemberWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isRemovingMember, setIsRemovingMember] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [teamId])

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`)
      if (!response.ok) throw new Error("Failed to fetch team members")
      const data = await response.json()
      setMembers(data.map((member: any) => ({
        ...member.team_members,
        user: member.users
      })))
    } catch (error) {
      logger.error("Error fetching team members", { error, teamId })
      toast.error("Failed to load team members")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberEmail.trim()) return

    setIsAddingMember(true)
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newMemberEmail,
          role: "member"
        }),
      })

      if (!response.ok) throw new Error("Failed to add team member")

      toast.success("Team member added successfully!")
      setNewMemberEmail("")
      fetchMembers() // Refresh the list
    } catch (error) {
      logger.error("Error adding team member", { error, teamId })
      toast.error("Failed to add team member")
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return
    if (!memberId) {
      toast.error("Invalid member ID")
      return
    }

    setIsRemovingMember(memberId)
    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove team member")

      toast.success("Team member removed successfully!")
      fetchMembers() // Refresh the list
    } catch (error) {
      logger.error("Error removing team member", { error, teamId, memberId })
      toast.error("Failed to remove team member")
    } finally {
      setIsRemovingMember(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Team
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Team Members</h1>
        </div>

        {/* Add Member Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
          <form onSubmit={handleAddMember} className="flex gap-4">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter member's email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isAddingMember || !newMemberEmail.trim()}
              className={`px-6 py-2 rounded-lg text-white font-medium
                ${isAddingMember || !newMemberEmail.trim()
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }
                transition duration-150 ease-in-out`}
            >
              {isAddingMember ? "Adding..." : "Add Member"}
            </button>
          </form>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {members.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No team members yet. Add your first member above!
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {member.user?.name?.[0] || "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {member.user?.name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {member.user?.email || "No email available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-blue-100 text-blue-800">
                      {member.role}
                    </span>
                    {member.role !== "leader" && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={isRemovingMember === member.id}
                        className={`text-red-600 hover:text-red-800 ${
                          isRemovingMember === member.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}