export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Convert file to base64 for storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Generate filename with timestamp
    const timestamp = Date.now()
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // For static sites, we'll return the base64 data URL
    // This allows the image to be used immediately without requiring server-side file storage
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again or use the Unsplash picker.' },
      { status: 500 }
    )
  }
}
