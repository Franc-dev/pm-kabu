"use client"

import { useState } from "react"
import { logger } from "@/lib/logger"
import toast from "react-hot-toast"

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      return result
    } catch (error) {
      logger.error("Error uploading file", { error })
      toast.error("Failed to upload file")
      throw error
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return { uploadFile, isUploading, progress }
}

export default useFileUpload

