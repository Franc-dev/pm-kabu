"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader } from "@/components/Loader"
import { ProjectCard } from "@/components/projects/project-card"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 relative">
      <Image
        src="https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="opacity-10"
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Projects</h1>
          <Link
            href="/projects/new"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Create New Project
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="transform transition duration-300 hover:scale-105">
              <ProjectCard project={project} />
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

