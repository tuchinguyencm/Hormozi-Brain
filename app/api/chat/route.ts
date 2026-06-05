import OpenAI from 'openai'
import { routeQuestion } from '@/lib/router'
import { loadSources, buildSystemPrompt } from '@/lib/knowledge-base'

export async function POST(req: Request) {
  const { messages, revenueStage } = await req.json()

  // Ưu tiên key từ client, fallback về env var
  const clientKey = req.headers.get('x-api-key')
  const apiKey = clientKey || process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Chưa có API key. Vui lòng nhập OpenRouter API key.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
  })

  const lastMessage = messages[messages.length - 1]?.content ?? ''
  const { playbooks, transcripts } = routeQuestion(lastMessage, revenueStage)
  const sources = loadSources(playbooks, transcripts)
  const systemPrompt = buildSystemPrompt(sources)
  const sourceLabels = sources.map(s => s.label)

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'sources', sources: sourceLabels })}\n\n`))

      try {
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
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi không xác định'
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`)
        )
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
