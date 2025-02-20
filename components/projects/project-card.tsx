import Link from "next/link"
import type { Project } from "@/src/db/schema"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>{project.status}</span>
        <Link href={`/projects/${project.id}`} className="text-blue-500 hover:text-blue-600">
          View Details
        </Link>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case "planned":
      return "bg-yellow-100 text-yellow-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "on_hold":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

