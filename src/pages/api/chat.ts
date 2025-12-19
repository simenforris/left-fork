// app/api/chat/route.ts (Next.js)
// or src/routes/api/chat.ts (TanStack Start)
import { chat, toStreamResponse } from '@tanstack/ai';
import { openai } from '@tanstack/ai-openai';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async function POST({ request }) {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'OPENAI_API_KEY not configured',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { messages, conversationId } = await request.json();

  try {
    // Create a streaming chat response
    const stream = chat({
      adapter: openai(),
      messages,
      model: 'gpt-5.1',
      conversationId,
    });

    // Convert stream to HTTP response
    return toStreamResponse(stream);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
