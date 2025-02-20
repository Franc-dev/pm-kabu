"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Loader } from "@/components/Loader"
import TaskBoard from "@/components/projects/task-board"
import { DocumentList } from "@/components/projects/document-list"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { Project } from "@/src/db/schema"
import { CalendarDays, Clock, Edit, Users, Plus, FileText, CheckSquare } from "lucide-react"

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <Loader size="lg" />
      </div>
    )

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="bg-white text-red-600 p-8 rounded-2xl shadow-2xl max-w-md">
          <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
          <p className="text-gray-600">The project may have been deleted or you may not have access.</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{project.name}</h1>
                <p className="text-xl text-gray-600 max-w-2xl">{project.description}</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Project
                </Link>
                <Link
                  href={`/projects/${project.id}/team`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Manage Team
                </Link>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <ProjectInfoCard
                icon={<CalendarDays className="h-8 w-8 text-blue-500" />}
                title="Start Date"
                value={
                  project.startDate ? new Date(project.startDate).toLocaleDateString() : new Date().toLocaleDateString()
                }
              />
              <ProjectInfoCard
                icon={<CalendarDays className="h-8 w-8 text-red-500" />}
                title="End Date"
                value={
                  project.endDate ? new Date(project.endDate).toLocaleDateString() : new Date().toLocaleDateString()
                }
              />
              <ProjectInfoCard
                icon={<Clock className="h-8 w-8 text-green-500" />}
                title="Time"
                value={
                  project.startTime && project.endTime ? `${project.startTime} - ${project.endTime}` : "Not specified"
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ProjectSection
                title="Tasks"
                icon={<CheckSquare className="h-6 w-6 text-blue-600" />}
                addLink={`/projects/${project.id}/tasks/new`}
                addText="Add Task"
              >
                <TaskBoard projectId={project.id} />
              </ProjectSection>

              <ProjectSection
                title="Documents"
                icon={<FileText className="h-6 w-6 text-green-600" />}
                addLink={`/projects/${project.id}/documents/new`}
                addText="Upload"
              >
                <DocumentList projectId={project.id} />
              </ProjectSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectInfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl shadow-lg transition duration-300 ease-in-out hover:shadow-xl transform hover:-translate-y-1">
      <div className="flex items-center">
        <div className="bg-white p-3 rounded-full mr-4 shadow-md">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function ProjectSection({
  title,
  icon,
  addLink,
  addText,
  children,
}: { title: string; icon: React.ReactNode; addLink: string; addText: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:shadow-xl">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            <h2 className="text-2xl font-bold text-gray-900 ml-3">{title}</h2>
          </div>
          <Link
            href={addLink}
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            {addText}
          </Link>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

