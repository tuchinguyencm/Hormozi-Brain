'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { FileItem } from '@/app/api/content/route'

type Props = {
  file: FileItem | null
  content: string
  loading: boolean
}

export default function ContentViewer({ file, content, loading }: Props) {
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl">📖</div>
        <p className="text-zinc-500 text-sm">Chọn một tài liệu bên trái để xem nội dung</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <h2 className="text-sm font-semibold text-white truncate">{file.label}</h2>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">{file.path}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="w-4 h-4 border-2 border-zinc-600 border-t-orange-500 rounded-full animate-spin inline-block" />
            Đang tải...
          </div>
        ) : file.ext === 'md' ? (
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-orange-300 prose-headings:font-bold
            prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-li:text-zinc-300
            prose-strong:text-white
            prose-code:text-orange-300 prose-code:bg-zinc-900 prose-code:px-1 prose-code:rounded
            prose-blockquote:border-orange-500 prose-blockquote:text-zinc-400
            prose-hr:border-zinc-800
            prose-table:text-xs prose-th:text-zinc-300 prose-td:text-zinc-400
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono">{content}</pre>
        )}
      </div>
    </div>
  )
}
