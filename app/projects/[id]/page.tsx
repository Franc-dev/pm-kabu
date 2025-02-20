"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Loader } from "@/components/Loader"
import TaskBoard from "@/components/projects/task-board"
import { DocumentList } from "@/components/projects/document-list"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { Project } from "@/src/db/schema"
import { CalendarDays, Clock } from "lucide-react"

export default function ProjectDetailsPage(props: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = use(props.params)
  const projectId = params.id

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) throw new Error("Failed to fetch project")
        const data = await response.json()
        setProject(data)
      } catch (error) {
        logger.error("Error fetching project", { error, projectId })
        toast.error("Failed to load project details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    )

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md">
          Project not found. The project may have been deleted or you may not have access.
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 max-w-2xl">{project.description}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/projects/${project.id}/edit`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition"
              >
                Edit Project
              </Link>
              <Link
                href={`/projects/${project.id}/team`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Manage Team
              </Link>
            </div>
          </div>

          <div className="flex justify-between items-start mt-6 space-x-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  {project.startDate !== null ? (
                    <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                  ) : (
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  {project.endDate !== null ? (
                    <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                  ) : (
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  {project.startTime !== null && project.endTime !== null ? (
                    <p className="font-medium">
                      {project.startTime} - {project.endTime}
                    </p>
                  ) : (
                    <p className="font-medium">Not specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Tasks</h2>
                  <Link
                    href={`/projects/${project.id}/tasks/new`}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                  >
                    Add Task
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <TaskBoard projectId={project.id} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Documents</h2>
                  <Link
                    href={`/projects/${project.id}/documents/new`}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                  >
                    Upload
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <DocumentList projectId={project.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}