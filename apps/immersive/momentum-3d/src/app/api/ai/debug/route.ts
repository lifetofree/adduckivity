import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const envKey = process.env.GEMINI_API_KEY ? 'SET' : 'NOT_SET';
  let cloudflareKey = 'NOT_AVAILABLE';
  
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages');
    const ctx = getRequestContext();
    cloudflareKey = ctx.env.GEMINI_API_KEY ? 'SET' : 'NOT_SET';
  } catch (e) {
    cloudflareKey = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    envKey,
    cloudflareKey,
    timestamp: new Date().toISOString(),
  });
}
