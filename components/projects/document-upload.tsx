"use client"

import type React from "react"

import { useState } from "react"
import { useFileUpload } from "@/hooks/useFileUpload"
import { Loader } from "@/components/Loader"
import toast from "react-hot-toast"

interface DocumentUploadProps {
  projectId: string
  onUploadComplete: (document: any) => void
}

export function DocumentUpload({ projectId, onUploadComplete }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { uploadFile, isUploading, progress } = useFileUpload()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      const uploadResult = await uploadFile(selectedFile)

      const response = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedFile.name,
          fileUrl: uploadResult.secure_url,
          fileType: selectedFile.type,
          size: selectedFile.size,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create document")
      }

      const newDocument = await response.json()
      onUploadComplete(newDocument)
      toast.success("Document uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload document")
    }
  }

  return (
    <div className="mt-4">
      <input type="file" onChange={handleFileChange} className="mb-2" disabled={isUploading} />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isUploading ? <Loader size="sm" color="white" /> : "Upload"}
      </button>
      {isUploading && (
        <div className="mt-2">
          <progress value={progress} max="100" className="w-full" />
          <p className="text-sm text-gray-600">{progress}% uploaded</p>
        </div>
      )}
    </div>
  )
}

