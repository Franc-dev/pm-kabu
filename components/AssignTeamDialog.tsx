/* eslint-disable react/jsx-no-undef */
// components/AssignTeamDialog.tsx
"use client"

import { useState } from 'react'
import { AssignTeam } from './AssignTeam'

interface AssignTeamDialogProps {
  projectId: string
  currentTeamId?: string | null
  onTeamAssigned?: () => void
  trigger?: React.ReactNode
}

export function AssignTeamDialog({ 
  projectId, 
  currentTeamId,
  onTeamAssigned,
  trigger 
}: AssignTeamDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleTeamAssigned = () => {
    onTeamAssigned?.()
    handleClose()
  }

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <button 
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Assign Team
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleClose} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    Assign Team to Project
                  </h3>
                  <AssignTeam 
                    projectId={projectId} 
                    currentTeamId={currentTeamId}
                    onTeamAssigned={handleTeamAssigned}
                    onClose={handleClose}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}