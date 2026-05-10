export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Calls the MiniMax `abab6.5s-chat` model to decompose a task into 12-15
 * atomic steps (each ≤2 min), using the "Deep Slice" ADHD strategy.
 * Retries up to `retries` times with exponential back-off on 429 errors.
 *
 * @param apiKey  - MiniMax API key.
 * @param task    - The user's "scary task" description.
 * @param retries - Max retry attempts on rate-limit errors (default 2).
 * @returns Ordered array of step strings.
 * @throws On non-recoverable API errors or if max retries are exceeded.
 */
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
          messages: [{ sender_type: 'USER', sender_name: 'User', text: prompt }],
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MiniMax API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = data.choices?.[0]?.message?.content || '';

      if (!text) throw new Error('Empty response from MiniMax');

      const cleaned = text.replace(/```json|```/g, '').trim();
      const steps = JSON.parse(cleaned);

      if (Array.isArray(steps) && steps.length >= 10 && steps.length <= 20) {
        return steps as string[];
      }

      // Attempt to salvage a JSON array from a partially malformed response.
      const arrMatch = cleaned.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        const parsed = JSON.parse(arrMatch[0]);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed as string[];
      }

      throw new Error('Invalid response format from MiniMax');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('429') && i < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Maps raw error messages to user-friendly strings shown in the UI.
 *
 * @param err - The caught error value.
 * @returns A concise, non-technical message.
 */
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

/**
 * Returns evidence-based inertia-breaking steps when AI providers are unavailable.
 * Detects common task categories (cleaning, writing, studying) and returns
 * task-specific step lists; falls back to universal inertia breakers otherwise.
 *
 * @param task - The user's original task string (used for keyword matching).
 * @returns Array of 12 fallback step strings.
 */
function getFallbackSteps(task: string): string[] {
  const taskLower = task.toLowerCase();

  if (taskLower.includes('clean') || taskLower.includes('room') || taskLower.includes('mess')) {
    return [
      'Pick up 5 items from the floor',
      'Throw away any obvious trash',
      'Put dirty clothes in hamper',
      'Wipe down one surface',
      'Organize one small area (like a desk)',
      'Make your bed if it\'s in the room',
      'Put away items that belong elsewhere',
      'Vacuum or sweep one section',
      'Dust one surface or area',
      'Check under furniture for lost items',
      'Open a window for fresh air',
      'Put away any clean laundry',
    ];
  }

  if (taskLower.includes('write') || taskLower.includes('essay') || taskLower.includes('article')) {
    return [
      'Open a blank document',
      'Write your main topic at the top',
      'List 3 key points you want to make',
      'Write one sentence for point 1',
      'Write one sentence for point 2',
      'Write one sentence for point 3',
      'Add an introduction sentence',
      'Add a conclusion sentence',
      'Read through what you wrote',
      'Fix any obvious errors',
      'Add one more detail to each point',
      'Save your work',
    ];
  }

  if (taskLower.includes('study') || taskLower.includes('learn') || taskLower.includes('homework')) {
    return [
      'Gather your study materials',
      'Find a quiet place to work',
      'Put your phone away',
      'Write down what you need to learn',
      'Read the first paragraph/page',
      'Highlight 3 key points',
      'Take notes on those key points',
      'Explain the concepts out loud',
      'Take a 2-minute stretch break',
      'Review what you just learned',
      'Practice recalling without looking',
      'Plan your next study session',
    ];
  }

  return [
    'Take 3 deep breaths',
    'Drink a glass of water',
    'Stand up and stretch for 30 seconds',
    'Write down the first tiny action you can take',
    'Do that one tiny action right now',
    'Set a timer for 2 minutes and start',
    'Close your eyes and visualize the first step',
    'Put your phone in another room',
    'Clear your workspace of distractions',
    'Tell yourself \'I can do this for 2 minutes\'',
    'Count backwards from 5 to 1 and start',
    'Focus on just the next 2 minutes, nothing else',
  ];
}

/**
 * POST /api/ai/atomize
 *
 * Accepts `{ task: string }` and returns `{ steps: string[], provider: string }`.
 *
 * Provider waterfall:
 * 1. **MiniMax** (`abab6.5s-chat`) — primary, with exponential retry on 429.
 * 2. **Gemini** (`gemini-1.5-flash`) — fallback when MiniMax is unavailable.
 * 3. **Static fallback** — evidence-based inertia breakers; always succeeds.
 *
 * The endpoint never returns a 5xx error to the client — the static fallback
 * guarantees a usable response even if both AI providers are down.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { task?: string };
    const { task } = body;

    if (!task) {
      return NextResponse.json({ error: 'Task required' }, { status: 400 });
    }
    if (task.length > 500) {
      return NextResponse.json({ error: 'Task too long (max 500 characters)' }, { status: 400 });
    }

    let miniMaxKey: string | undefined;
    let geminiKey: string | undefined;

    try {
      const ctx = getRequestContext<CloudflareEnv>();
      miniMaxKey = ctx.env.MINIMAX_API_KEY;
      geminiKey  = ctx.env.GEMINI_API_KEY;
    } catch {
      miniMaxKey = process.env.MINIMAX_API_KEY;
      geminiKey  = process.env.GEMINI_API_KEY;
    }

    // 1. MiniMax
    if (miniMaxKey) {
      try {
        const steps = await askMiniMax(miniMaxKey, task);
        return NextResponse.json({ steps, provider: 'minimax' });
      } catch (e) {
        console.error('[AI/Atomize] MiniMax failed:', e);
      }
    }

    // 2. Gemini
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(
          `Break "${task}" into 12-15 simple steps. Return ONLY a JSON array of strings.`
        );
        const cleaned = result.response.text().replace(/```json|```/g, '').trim();
        try {
          const steps = JSON.parse(cleaned);
          if (Array.isArray(steps) && steps.length >= 10) {
            return NextResponse.json({ steps, provider: 'gemini' });
          }
        } catch {
          // Malformed JSON — fall through to static fallback.
        }
      } catch (e) {
        console.error('[AI/Atomize] Gemini failed:', e);
      }
    }

    // 3. Static fallback — always succeeds.
    return NextResponse.json({
      steps: getFallbackSteps(task),
      provider: 'fallback',
      note: 'AI services unavailable, using evidence-based inertia breakers',
    });

  } catch (err) {
    console.error('[AI/Atomize] Request failed:', err);
    return NextResponse.json({
      steps: getFallbackSteps('this task'),
      provider: 'fallback',
      note: 'Using evidence-based inertia breakers',
    });
  }
}
