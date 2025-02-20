"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader } from "@/components/Loader"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { Project } from "@/src/db/schema"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) throw new Error("Failed to fetch projects")
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        logger.error("Error fetching projects", { error })
        toast.error("Failed to load projects")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" />
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <Image
        src="https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="opacity-10"
      />
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Projects</h1>
          <Link
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Project
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xl">
                      {project.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {project.createdAt !== null ? new Date(project.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                >
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
        {projects.length === 0 && (
          <div className="text-center py-12 bg-white bg-opacity-80 rounded-lg shadow-lg">
            <p className="text-xl text-gray-600">No projects found. Create your first project!</p>
          </div>
        )}
      </div>
    </div>
  )
}
