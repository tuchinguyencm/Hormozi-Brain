'use client'

import type { FileItem } from '@/app/api/content/route'
import MarkdownContent from './MarkdownContent'

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
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <h2 className="text-sm font-semibold text-white truncate">{file.label}</h2>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">{file.path}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="w-4 h-4 border-2 border-zinc-600 border-t-orange-500 rounded-full animate-spin inline-block" />
            Đang tải...
          </div>
        ) : file.ext === 'md' ? (
          <MarkdownContent content={content} dim />
        ) : (
          <pre className="text-xs text-zinc-400 whitespace-pre-wrap leading-7 font-mono">{content}</pre>
        )}
      </div>
    </div>
  )
}
