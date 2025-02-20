/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { User, UserCircle, Calendar, Mail, Shield } from 'lucide-react';

interface Member {
  id: number;
  avatarUrl?: string;
  name: string;
  role: string;
  email: string;
  joinedAt: string;
  isVerified: boolean;
}

interface MemberListProps {
  teamId: string;
}

const MemberCard: React.FC<{ member: Member }> = ({ member }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
    <div className="flex items-start space-x-4">
      <div className="bg-blue-100 rounded-full p-3">
        {member.avatarUrl ? (
          <img 
            src={member.avatarUrl} 
            alt={member.name} 
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <UserCircle className="w-12 h-12 text-blue-500" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            member.role === 'member' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {member.role}
          </span>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span>{member.email}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Shield className="w-4 h-4 mr-2" />
            <span>{member.isVerified ? 'Verified' : 'Unverified'}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MemberList = ({ teamId }: MemberListProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  React.useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}/members`);
        if (!response.ok) throw new Error('Failed to fetch members')
        const data = await response.json()
        setMembers(data.team_members || [])
      } catch (err) {
        if (err instanceof Error) {
          setError(err)
        } else {
          setError(new Error('An unknown error occurred'))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [teamId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error loading team members: {error.message}</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members</h3>
        <p className="text-gray-600">This team doesn&apos;t have any members yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default MemberList;