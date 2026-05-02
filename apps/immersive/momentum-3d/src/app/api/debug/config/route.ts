import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

/**
 * Debug endpoint to check Facebook and environment configuration.
 * Returns configuration status without exposing sensitive values.
 */
export async function GET(req: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    const isCfPages = process.env.CF_PAGES === '1'
    
    let config = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        CF_PAGES: process.env.CF_PAGES,
        isDev,
        isCfPages,
        timestamp: new Date().toISOString()
      },
      bindings: {
        hasEnv: false,
        hasKV: false,
        hasR2: false
      },
      facebook: {
        hasAccessToken: false,
        hasPageId: false,
        hasSiteUrl: false,
        siteUrl: '',
        pageId: ''
      }
    }

    try {
      const ctx = getRequestContext<CloudflareEnv>()
      config.bindings.hasEnv = true
      
      if (ctx.env) {
        config.bindings.hasKV = !!ctx.env.POSTS_KV
        config.bindings.hasR2 = !!ctx.env.ASSETS_BUCKET
        
        config.facebook.hasAccessToken = !!ctx.env.FACEBOOK_PAGE_ACCESS_TOKEN
        config.facebook.hasPageId = !!ctx.env.FACEBOOK_PAGE_ID
        config.facebook.hasSiteUrl = !!ctx.env.SITE_URL
        
        if (ctx.env.SITE_URL) {
          config.facebook.siteUrl = ctx.env.SITE_URL
        }
        if (ctx.env.FACEBOOK_PAGE_ID) {
          config.facebook.pageId = ctx.env.FACEBOOK_PAGE_ID
        }
      }
    } catch (err) {
      config.bindings.error = String(err)
    }

    return NextResponse.json(config)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
