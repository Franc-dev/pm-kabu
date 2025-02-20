// ProjectDetails.tsx (create this as a new file)
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader } from "@/components/Loader"
import  TaskBoard  from "@/components/projects/task-board"
import { DocumentList } from "@/components/projects/document-list"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { Project } from "@/src/db/schema"

interface ProjectDetailsProps {
  id: string
}

export function ProjectDetails({ id }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        toast.error("Invalid project ID")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/projects/${id}`)
        if (!response.ok) throw new Error("Failed to fetch project")
        const data = await response.json()
        setProject(data)
      } catch (error) {
        logger.error("Error fetching project", { error, projectId: id })
        toast.error("Failed to load project details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (isLoading) return <Loader size="lg" />
  if (!project) return <div>Project not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
          <TaskBoard projectId={project.id} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Documents</h2>
          <DocumentList projectId={project.id} />
        </div>
      </div>
      <div className="mt-8">
        <Link
          href={`/projects/${project.id}/tasks`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
        >
          View All Tasks
        </Link>
        <Link
          href={`/projects/${project.id}/documents`}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          View All Documents
        </Link>
      </div>
    </div>
  )
}