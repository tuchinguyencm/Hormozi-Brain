'use client'

import { useState, useEffect } from 'react'
import type { Category, FileItem } from '@/app/api/content/route'
import ContentViewer from './ContentViewer'
import ChatInterface from './ChatInterface'

export default function MainLayout() {
  const [categories, setCategories] = useState<Category[]>([])
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['playbooks']))
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [content, setContent] = useState<string>('')
  const [loadingContent, setLoadingContent] = useState(false)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => setCategories(d.categories))
  }, [])

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectFile = async (file: FileItem) => {
    setSelectedFile(file)
    setLoadingContent(true)
    setContent('')
    const res = await fetch(`/api/content/read?path=${encodeURIComponent(file.path)}`)
    const data = await res.json()
    setContent(data.content ?? '')
    setLoadingContent(false)
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">

      {/* Panel 1a — File List */}
      <div className="w-56 shrink-0 border-r border-zinc-800 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-xs font-bold">H</div>
            <span className="font-semibold text-sm text-white">Hormozi Brain</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {categories.map(cat => (
            <div key={cat.id}>
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 uppercase tracking-wider"
              >
                <span>{cat.label}</span>
                <span className="text-zinc-600">{openCategories.has(cat.id) ? '▾' : '▸'}</span>
              </button>
              {openCategories.has(cat.id) && (
                <div className="mb-1">
                  {cat.files.map(file => (
                    <button
                      key={file.id}
                      onClick={() => selectFile(file)}
                      className={`w-full text-left px-4 py-1.5 text-xs truncate transition-colors ${
                        selectedFile?.id === file.id
                          ? 'bg-orange-500/20 text-orange-300 border-r-2 border-orange-500'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      {file.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Panel 1b — Content Viewer */}
      <div className="flex-1 min-w-0 border-r border-zinc-800 flex flex-col overflow-hidden">
        <ContentViewer file={selectedFile} content={content} loading={loadingContent} />
      </div>

      {/* Panel 2 — Chat */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <ChatInterface />
      </div>

    </div>
  )
}
