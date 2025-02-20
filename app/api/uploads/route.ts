/* eslint-disable @typescript-eslint/no-explicit-any */
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

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          resource_type: "auto",
          folder: "project-management",
        },
        (error: any, result: unknown) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error("Error uploading file", { error })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

