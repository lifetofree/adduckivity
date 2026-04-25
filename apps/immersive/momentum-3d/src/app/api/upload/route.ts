export const runtime = 'edge'

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Direct image upload is not available. Use the Unsplash picker to add cover images.' },
    { status: 501 }
  )
}
