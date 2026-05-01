// Cloudflare Pages Cron Trigger for scheduled post maintenance
// This file enables CRON jobs on Cloudflare Pages
// 
// IMPORTANT: This requires Cloudflare Pages Functions to be properly configured
// The CRON trigger will call this worker every hour via the wrangler.toml cron schedule

export async function onRequest(context) {
  const { request, env } = context
  
  // Check if this is a CRON trigger from Cloudflare
  const cronHeader = request.headers.get('X-Cron')
  if (!cronHeader) {
    return new Response('Not a CRON request', { status: 400 })
  }
  
  // Verify maintenance key for security
  const authHeader = request.headers.get('x-maintenance-key')
  if (authHeader !== env.MAINTENANCE_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  try {
    // Import the posts module to access maintenance logic
    const { getPublishedPosts } = await import('../src/lib/posts.ts')
    const { getMockKV } = await import('../src/lib/dev-kv.ts')
    
    // Get the KV namespace
    const kv = env.POSTS_KV
    
    // Run the maintenance logic
    const posts = await getPublishedPosts(kv, env)
    
    return new Response(JSON.stringify({
      success: true,
      cron: cronHeader,
      timestamp: new Date().toISOString(),
      publishedCount: posts.length,
      message: 'Scheduled posts promoted successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[CRON] Maintenance failed:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: 'Failed to promote scheduled posts'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
