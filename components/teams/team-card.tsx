import Link from "next/link"
import type { Team } from "@/src/db/schema"

interface TeamCardProps {
  team: Team
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
      <p className="text-gray-600 mb-4">{team.description}</p>
      <Link href={`/teams/${team.id}`} className="text-blue-500 hover:text-blue-600">
        View Team
      </Link>
    </div>
  )
}

