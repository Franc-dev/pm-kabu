import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { logger } from "@/lib/logger"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64File = Buffer.from(buffer).toString("base64")
    const dataURI = `data:${file.type};base64,${base64File}`

    // In route.ts (upload)
const result = await new Promise((resolve, reject) => {
  cloudinary.uploader.upload(
    dataURI,
    {
      resource_type: "raw", // This is crucial for PDFs
      folder: "project-management",
      use_filename: true,
      unique_filename: true,
      delivery_type: "attachment", // Add this line
    },
    (error, result) => {
      if (error) reject(error)
      else {
        // Check if result is defined
        if (!result) {
          reject(new Error('Upload failed: result is undefined'));
          return;
        }
        // Check if result is defined before accessing its properties
        if (!result) {
          reject(new Error('Upload failed: result is undefined'));
          return;
        }
        // Construct the correct URL for raw files
        const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${result.public_id}`
        resolve({ ...result, secure_url: url })
      }
    },
  )
})

    return NextResponse.json(result)
  } catch (error) {
    logger.error("Error uploading file to Cloudinary", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
