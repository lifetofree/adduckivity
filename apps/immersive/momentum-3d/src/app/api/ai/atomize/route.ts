export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function askAtomize(apiKey: string, task: string, retries = 2): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
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

  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, '').trim();
      const steps = JSON.parse(cleaned);
      
      if (Array.isArray(steps) && steps.length >= 10 && steps.length <= 20) {
        return steps as string[];
      }
      
      // Try to extract array from malformed response
      const arrMatch = cleaned.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        const parsed = JSON.parse(arrMatch[0]);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return parsed as string[];
        }
      }
      
      // If we get here, parsing failed but request succeeded
      throw new Error('Invalid response format from AI');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('429') && i < retries) {
        const waitTime = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw err;
    }
  }
  
  throw new Error('Max retries exceeded');
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')) {
    return 'AI is thinking too hard. Please wait 10-20 seconds and try again.';
  }
  if (msg.includes('API_KEY') || msg.includes('API key')) {
    return 'AI not configured - check API key';
  }
  if (msg.includes('Max retries exceeded')) {
    return 'Service temporarily busy - please try again';
  }
  return 'Failed to atomize task';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { task?: string };
    const { task } = body;
    
    if (!task) {
      return NextResponse.json({ error: 'Task required' }, { status: 400 });
    }

    const apiKey = process.env.NODE_ENV === 'development'
      ? process.env.GEMINI_API_KEY || ''
      : getRequestContext<CloudflareEnv>().env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('[AI/Atomize] API key not configured');
      return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
    }

    const steps = await askAtomize(apiKey, task);
    return NextResponse.json({ steps });
  } catch (err) {
    console.error('[AI/Atomize] Error:', err);
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}
