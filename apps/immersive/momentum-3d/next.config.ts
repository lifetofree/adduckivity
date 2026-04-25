import type { NextConfig } from 'next'
import { setupDevPlatform } from '@cloudflare/next-on-pages'

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
}

export default nextConfig
