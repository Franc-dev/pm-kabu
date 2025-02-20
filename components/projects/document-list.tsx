"use client"

import { useState, useEffect } from "react"
import { Loader } from "@/components/Loader"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"
import type { Document } from "@/src/db/schema"

interface DocumentListProps {
  projectId: string
}

export function DocumentList({ projectId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/documents`)
        if (!response.ok) throw new Error("Failed to fetch documents")
        const data = await response.json()
        setDocuments(data)
      } catch (error) {
        logger.error("Error fetching documents", { error, projectId })
        toast.error("Failed to load documents")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [projectId])

  if (isLoading) return <Loader size="md" />

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div key={document.id} className="bg-white p-4 rounded shadow">
          <h4 className="font-medium">{document.title}</h4>
          <p className="text-sm text-gray-600">{document.description}</p>
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            View Document
          </a>
        </div>
      ))}
    </div>
  )
}

