/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { Loader } from "@/components/Loader"
import { logger } from "@/lib/logger"
import { Eye, Download, FileText } from "lucide-react"
import toast from "react-hot-toast"
import DocumentPreviewModal from "./document-preview"
import { getCloudinaryUrl, getFileTypeFromUrl } from "@/utils/cloudinary"
import type { Document } from "@/src/db/schema"

interface DocumentListProps {
  projectId: string
}

export function DocumentList({ projectId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/documents`)
        if (!response.ok) throw new Error("Failed to fetch documents")
        const data = await response.json()
        
        // Fix URLs for all documents
        const fixedData = data.map((doc: { fileUrl: string; fileType: any }) => ({
          ...doc,
          fileUrl: getCloudinaryUrl(doc.fileUrl, doc.fileType || getFileTypeFromUrl(doc.fileUrl))
        }))
        
        setDocuments(fixedData)
      } catch (error) {
        logger.error("Error fetching documents", { error, projectId })
        toast.error("Failed to load documents")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [projectId])

  const handlePreview = (document: Document) => {
    const fixedDocument = {
      ...document,
      fileUrl: getCloudinaryUrl(document.fileUrl, document.fileType || getFileTypeFromUrl(document.fileUrl))
    }
    setSelectedDocument(fixedDocument)
  }
  
  const handleDownload = async (doc: Document) => {
    try {
      // Fetch the file
      const response = await fetch(doc.fileUrl)
      const blob = await response.blob()
  
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob)
  
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = url
      link.download = doc.title || 'document.pdf' // Use document title or fallback
  
      // Append to body, click, and cleanup
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
  
    } catch (error) {
      logger.error("Error downloading document", { error, documentId: doc.id })
      toast.error("Failed to download document")
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
         <Loader size="md" />
      </div>
    )
  }
  return (
    <>
      <div className="space-y-4">
        {documents.map((document) => (
          <div key={document.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">{document.title}</h4>
                  <p className="text-sm text-gray-600">{document.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(document)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Preview"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDownload(document)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DocumentPreviewModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        documentUrl={selectedDocument?.fileUrl || ''}
        documentTitle={selectedDocument?.title || ''}
      />
    </>
  )
}