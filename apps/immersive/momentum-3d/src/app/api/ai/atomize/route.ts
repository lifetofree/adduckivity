export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  const body = await req.json() as { task?: string };
  const { task } = body;
  if (!task) return NextResponse.json({ error: 'Task required' }, { status: 400 });

  const env = getRequestContext<CloudflareEnv>().env;
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Act as a "Task Atomizer" for a user with ADHD/Executive Dysfunction.
    The goal is to lower activation energy.
    
    Task to break down: "${task}"
    
    RULES:
    1. Return exactly 12-15 steps.
    2. Every step MUST be executable in under 2 minutes.
    3. Use the "Deep Slice" strategy: Focus on the immediate physical actions to break inertia, not necessarily finishing the entire project.
    4. Keep language extremely simple and non-threatening.
    
    Return ONLY a JSON array of strings. Example: ["Open the website", "Find the login button", ...]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const steps = JSON.parse(cleaned);
    return NextResponse.json({ steps });
  } catch (err) {
    console.error('[AI/Atomize] Error:', err);
    return NextResponse.json({ error: 'Failed to atomize' }, { status: 500 });
  }
}
