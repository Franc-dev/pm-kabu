/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Loader2, X, Search, UserPlus } from 'lucide-react';

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  user: {
    name: string;
    avatarUrl?: string;
  }
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  currentAssigneeId?: string;
  onAssign: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const AssignmentModal = ({ 
  isOpen, 
  onClose, 
  teamMembers, 
  currentAssigneeId,
  onAssign,
  isLoading 
}: AssignmentModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredMembers = teamMembers.filter(member => 
    member.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Assign Task</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredMembers.map((member) => (
              <button
                key={member.userId}
                onClick={() => onAssign(member.userId)}
                disabled={isLoading}
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
                {currentAssigneeId === member.userId && (
                  <span className="text-blue-600 text-sm">Assigned</span>
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
              onClick={() => onAssign('')}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
            >
              Unassign
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;