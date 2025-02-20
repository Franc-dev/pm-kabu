/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import  DocumentUpload from "@/components/projects/document-upload"
import { Loader } from "@/components/Loader"
import toast from "react-hot-toast"
import type { Document } from "@/src/db/schema"

export default function NewDocumentPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState<Document | null>(null)
  const params = use(props.params)
  const projectId = params.id

  const handleUploadComplete = (document: Document) => {
    setUploadedDocument(document)
    toast.success("Document uploaded successfully")
  }

  const handleFinish = () => {
    router.push(`/projects/${projectId}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload New Document</h1>

          <DocumentUpload projectId={projectId} onUploadComplete={handleUploadComplete} />

          {isSubmitting && (
            <div className="mt-4 flex items-center justify-center">
              <Loader size="md" />
              <span className="ml-2 text-gray-600">Uploading document...</span>
            </div>
          )}

          {uploadedDocument && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Uploaded Document</h2>
              <div className="bg-gray-100 p-4 rounded">
                <p>
                  <strong>Title:</strong> {uploadedDocument.title}
                </p>
                <p>
                  <strong>Type:</strong> {uploadedDocument.fileType}
                </p>
                <p>
                  <strong>Size:</strong> {uploadedDocument.size} bytes
                </p>
                <a
                  href={uploadedDocument.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Document
                </a>
              </div>
              <button
                onClick={handleFinish}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Finish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

