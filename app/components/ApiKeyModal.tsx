'use client'

import { useState } from 'react'

type Props = {
  onSave: (key: string) => void
  initialKey?: string
  isSetup?: boolean // true = màn hình setup lần đầu, false = chỉnh sửa
  onClose?: () => void
}

export default function ApiKeyModal({ onSave, initialKey = '', isSetup = false, onClose }: Props) {
  const [key, setKey] = useState(initialKey)
  const [show, setShow] = useState(false)

  const handleSave = () => {
    const trimmed = key.trim()
    if (!trimmed) return
    onSave(trimmed)
    if (onClose) onClose()
  }

  if (isSetup) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-950">
        <div className="w-full max-w-md mx-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-lg">H</div>
              <div>
                <h1 className="text-white font-bold text-lg">Hormozi Brain</h1>
                <p className="text-zinc-500 text-xs">$100M Business Advisor</p>
              </div>
            </div>

            <h2 className="text-white font-semibold text-base mb-1">Nhập OpenRouter API Key</h2>
            <p className="text-zinc-500 text-sm mb-5">
              App dùng <span className="text-orange-400">Gemini 2.5 Flash</span> qua OpenRouter.
              Lấy key miễn phí tại{' '}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer"
                className="text-orange-400 hover:underline">openrouter.ai/keys</a>
            </p>

            <div className="relative mb-4">
              <input
                type={show ? 'text' : 'password'}
                value={key}
                onChange={e => setKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="sk-or-v1-..."
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none pr-20"
              />
              <button
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                {show ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={!key.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Bắt đầu →
            </button>

            <p className="text-zinc-700 text-xs text-center mt-4">Key được lưu trong trình duyệt của bạn, không gửi đi đâu khác</p>
          </div>
        </div>
      </div>
    )
  }

  // Dạng modal popup khi đã có key và muốn chỉnh sửa
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Cập nhật API Key</h2>
          {onClose && (
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-lg leading-none">✕</button>
          )}
        </div>

        <p className="text-zinc-500 text-sm mb-4">
          OpenRouter API key —{' '}
          <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer"
            className="text-orange-400 hover:underline">lấy tại đây</a>
        </p>

        <div className="relative mb-4">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="sk-or-v1-..."
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none pr-20"
          />
          <button
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
          >
            {show ? 'Ẩn' : 'Hiện'}
          </button>
        </div>

        <div className="flex gap-2">
          {onClose && (
            <button onClick={onClose} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-xl text-sm transition-colors">
              Huỷ
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
