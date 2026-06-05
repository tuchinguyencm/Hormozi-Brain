'use client'

import { useState, useRef, useEffect } from 'react'
import { STAGE_OPTIONS, PLAYBOOK_LABELS, STAGE_LABELS } from '@/lib/router'

type Message = {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

const ALL_SOURCES = {
  ...PLAYBOOK_LABELS,
  ...Object.fromEntries(Object.entries(STAGE_LABELS).map(([k, v]) => [k, v])),
}

const QUICK_PROMPTS = [
  { label: '💰 Tạo Grand Slam Offer', text: 'Dùng framework Pricing và Fast Cash của Hormozi, giúp tôi tạo một Grand Slam Offer cho business của tôi. Tôi đang charge $2,000/tháng.' },
  { label: '📞 Script bán hàng', text: 'Đọc playbook Closing và viết cho tôi một discovery call script 15 phút để bán dịch vụ $5,000+' },
  { label: '📢 Hook quảng cáo', text: 'Dùng playbook GOATed Ads và Hooks, viết 5 Facebook ad hooks cho chương trình coaching kinh doanh' },
  { label: '🔄 Giữ chân khách hàng', text: 'Đọc playbook Retention và Lifetime Value. Khách hàng coaching của tôi thường rời đi sau 3 tháng. Cho tôi plan để double LTV.' },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [revenueStage, setRevenueStage] = useState('')
  const [activeSources, setActiveSources] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim()
    if (!content || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setActiveSources([])

    const assistantMessage: Message = { role: 'assistant', content: '', sources: [] }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          revenueStage,
        }),
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = JSON.parse(line.slice(6))

          if (data.type === 'sources') {
            setActiveSources(data.sources)
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                sources: data.sources,
              }
              return updated
            })
          } else if (data.type === 'text') {
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + data.text,
              }
              return updated
            })
          }
        }
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: 'Lỗi kết nối. Kiểm tra lại API key và thử lại.',
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">H</div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">Hormozi Brain</h1>
            <p className="text-zinc-500 text-xs mt-0.5">$100M Business Advisor</p>
          </div>
        </div>
        <select
          value={revenueStage}
          onChange={e => setRevenueStage(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
        >
          {STAGE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Hỏi bất cứ điều gì về kinh doanh</h2>
              <p className="text-zinc-500 max-w-md">Tôi được lập trình theo framework $100M của Alex Hormozi. Hỏi về offer, sales, ads, retention, scaling...</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p.label}
                  onClick={() => sendMessage(p.text)}
                  className="text-left bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 transition-all text-sm text-zinc-300"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold shrink-0 mt-1">H</div>
            )}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {msg.sources.map(s => (
                    <span key={s} className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      📚 {s}
                    </span>
                  ))}
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-white rounded-tr-sm'
                    : 'bg-zinc-900 text-zinc-100 rounded-tl-sm border border-zinc-800'
                }`}
              >
                {msg.content}
                {msg.role === 'assistant' && loading && i === messages.length - 1 && msg.content === '' && (
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs shrink-0 mt-1">U</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 px-4 py-4 shrink-0">
        {activeSources.length > 0 && !loading && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activeSources.map(s => (
              <span key={s} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi về offer, sales, ads, scaling... (Enter để gửi, Shift+Enter xuống dòng)"
            rows={2}
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 resize-none focus:outline-none transition-colors"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors shrink-0"
          >
            {loading ? '...' : 'Gửi →'}
          </button>
        </div>
        <p className="text-zinc-700 text-xs mt-2 text-center">Dựa trên framework $100M của Alex Hormozi</p>
      </div>
    </div>
  )
}
