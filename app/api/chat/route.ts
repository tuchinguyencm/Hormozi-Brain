import OpenAI from 'openai'
import { routeQuestion } from '@/lib/router'
import { loadSources, buildSystemPrompt } from '@/lib/knowledge-base'

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  const { messages, revenueStage } = await req.json()
  const lastMessage = messages[messages.length - 1]?.content ?? ''

  const { playbooks, transcripts } = routeQuestion(lastMessage, revenueStage)
  const sources = loadSources(playbooks, transcripts)
  const systemPrompt = buildSystemPrompt(sources)
  const sourceLabels = sources.map(s => s.label)

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'sources', sources: sourceLabels })}\n\n`))

      const openrouterStream = await client.chat.completions.create({
        model: 'google/gemini-2.5-flash',
        max_tokens: 2048,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ],
      })

      for await (const chunk of openrouterStream) {
        const text = chunk.choices[0]?.delta?.content
        if (text) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'text', text })}\n\n`)
          )
        }
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
