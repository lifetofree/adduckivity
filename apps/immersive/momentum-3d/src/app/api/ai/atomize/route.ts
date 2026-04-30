export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

// MiniMax API integration
async function askMiniMax(apiKey: string, task: string, retries = 2): Promise<string[]> {
  const prompt = `Act as a "Task Atomizer" for a user with ADHD/Executive Dysfunction.
The goal is to lower activation energy.

Task to break down: "${task}"

RULES:
1. Return exactly 12-15 steps.
2. Every step MUST be executable in under 2 minutes.
3. Use the "Deep Slice" strategy: Focus on the immediate physical actions to break inertia, not necessarily finishing the entire project.
4. Keep language extremely simple and non-threatening.

Return ONLY a JSON array of strings. Example: ["Open the website", "Find the login button", ...]`;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'abab6.5s-chat',
          messages: [
            {
              sender_type: 'USER',
              sender_name: 'User',
              text: prompt,
            }
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MiniMax API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as {
        choices?: Array<{
          messages?: Array<{
            text?: string;
          }>;
        }>;
      };
      const text = data.choices?.[0]?.messages?.[0]?.text || '';

      if (!text) {
        throw new Error('Empty response from MiniMax');
      }

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

      throw new Error('Invalid response format from MiniMax');
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

    // Try MiniMax first (primary)
    let miniMaxKey: string | undefined = process.env.MINIMAX_API_KEY;
    if (!miniMaxKey && process.env.NODE_ENV !== 'development') {
      try {
        const ctx = getRequestContext<CloudflareEnv>();
        miniMaxKey = ctx.env.MINIMAX_API_KEY;
      } catch (e) {
        // MiniMax not available in context
      }
    }

    if (miniMaxKey) {
      console.log('[AI/Atomize] Using MiniMax');
      const steps = await askMiniMax(miniMaxKey, task);
      return NextResponse.json({ steps, provider: 'minimax' });
    }

    // Fallback to Gemini if MiniMax not configured
    let geminiKey: string | undefined = process.env.GEMINI_API_KEY;
    if (!geminiKey && process.env.NODE_ENV !== 'development') {
      try {
        const ctx = getRequestContext<CloudflareEnv>();
        geminiKey = ctx.env.GEMINI_API_KEY;
      } catch (e) {
        console.error('[AI/Atomize] Failed to get Cloudflare context:', e);
      }
    }

    if (geminiKey) {
      console.log('[AI/Atomize] Using Gemini (fallback)');
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiKey);
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

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, '').trim();
      const steps = JSON.parse(cleaned);

      if (Array.isArray(steps) && steps.length >= 10 && steps.length <= 20) {
        return NextResponse.json({ steps, provider: 'gemini' });
      }

      // Try to extract array from malformed response
      const arrMatch = cleaned.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        const parsed = JSON.parse(arrMatch[0]);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return NextResponse.json({ steps: parsed, provider: 'gemini' });
        }
      }

      throw new Error('Invalid response format from AI');
    }

    console.error('[AI/Atomize] No AI provider configured');
    return NextResponse.json({
      error: 'AI service temporarily unavailable'
    }, { status: 500 });
  } catch (err) {
    console.error('[AI/Atomize] Request failed:', err);
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}
