interface CloudflareEnv extends Record<string, unknown> {
  POSTS_KV: KVNamespace
  ASSETS_BUCKET: R2Bucket
  GEMINI_API_KEY: string
  UNSPLASH_ACCESS_KEY: string
  FACEBOOK_PAGE_ACCESS_TOKEN: string
  FACEBOOK_PAGE_ID: string
  SITE_URL: string
  SENDFOX_API_TOKEN: string
  SENDFOX_LIST_ID: string
}
