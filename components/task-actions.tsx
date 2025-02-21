/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react'
import { Check, UserPlus, Loader2, X } from 'lucide-react'

interface TeamMember {
  id: string
  userId: string
  role: string
  user: {
    name: string
    avatarUrl?: string
  }
}

interface TaskActionsProps {
  taskId: string
  id: string
  currentStatus: string
  currentAssigneeId?: string
  teamMembers: TeamMember[]
  onUpdate?: () => void
}

export default function TaskActions({
  taskId,
  id,
  currentStatus,
  currentAssigneeId,
  teamMembers,
  onUpdate
}: TaskActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState('')
  const [loadingAssignee, setLoadingAssignee] = useState('')
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setShowStatusDropdown(false)
      return
    }
    
    setLoadingStatus(newStatus)
    try {
      const response = await fetch(
        `/api/projects/${id}/tasks/${taskId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        }
      )

      if (!response.ok) throw new Error('Failed to update status')
      setShowStatusDropdown(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingStatus('')
    }
  }

  const handleAssign = async (assigneeId: string) => {
    if (assigneeId === currentAssigneeId) {
      setShowAssignModal(false)
      return
    }
    
    setLoadingAssignee(assigneeId)
    try {
      const response = await fetch(
        `/api/projects/${id}/tasks/${taskId}/assign`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assigneeId })
        }
      )

      if (!response.ok) throw new Error('Failed to assign task')
      if (onUpdate) onUpdate()
      setShowAssignModal(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingAssignee('')
    }
  }

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' }
  ]

  const filteredMembers = teamMembers.filter(member => 
    member.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setShowStatusDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-lg p-4 space-y-4 shadow">
      {/* Status Dropdown */}
      <div className="relative dropdown-container">
        <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          disabled={isLoading}
          className="w-full px-4 py-2 text-left border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
        >
          <span className="capitalize">{currentStatus.replace('_', ' ')}</span>
          {loadingStatus && <Loader2 className="w-4 h-4 animate-spin" />}
        </button>
        
        {showStatusDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                  loadingStatus === status.value ? 'bg-gray-50' : ''
                } ${currentStatus === status.value ? 'bg-blue-50' : ''}`}
                disabled={loadingStatus === status.value}
              >
                <div className="flex items-center justify-between">
                  <span>{status.label}</span>
                  {loadingStatus === status.value && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Section */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Assigned to</label>
        <button
          onClick={() => setShowAssignModal(true)}
          className="w-full px-4 py-2 text-left border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {teamMembers.find(m => m.userId === currentAssigneeId)?.user.name || 'Unassigned'}
          </span>
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex space-x-2">
        <button
          disabled={loadingStatus === 'completed'}
          onClick={() => handleStatusChange('completed')}
          className={`flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 flex-1 ${
            loadingStatus === 'completed' ? 'bg-gray-50' : ''
          }`}
        >
          {loadingStatus === 'completed' ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          Complete
        </button>
        <button
          disabled={loadingStatus === 'in_progress'}
          onClick={() => handleStatusChange('in_progress')}
          className={`flex items-center justify-center px-4 py-2 border rounded-md hover:bg-gray-50 flex-1 ${
            loadingStatus === 'in_progress' ? 'bg-gray-50' : ''
          }`}
        >
          {loadingStatus === 'in_progress' ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          Start
        </button>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 max-w-full mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Assign Task</h2>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="max-h-64 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <button
                    key={member.userId}
                    onClick={() => handleAssign(member.userId)}
                    disabled={loadingAssignee === member.userId}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between rounded-lg ${
                      currentAssigneeId === member.userId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.user.avatarUrl ? (
                          <img
                            src={member.user.avatarUrl}
                            alt={member.user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {member.user.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{member.user.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{member.role}</div>
                      </div>
                    </div>
                    {loadingAssignee === member.userId && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </button>
                ))}

                {filteredMembers.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No team members found
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleAssign('')}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
                >
                  Unassign
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}