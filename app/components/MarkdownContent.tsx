'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import type { Components } from 'react-markdown'

type Props = {
  content: string
  dim?: boolean // dùng cho content viewer (chữ nhỏ hơn)
}

export default function MarkdownContent({ content, dim = false }: Props) {
  const base = dim ? 'text-zinc-300' : 'text-zinc-100'

  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-xl font-bold text-white mt-6 mb-3 leading-tight first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-base font-bold text-white mt-5 mb-2 leading-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-sm font-semibold text-orange-300 mt-4 mb-1.5 leading-tight">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-sm font-semibold text-zinc-200 mt-3 mb-1">{children}</h4>
    ),
    p: ({ children }) => (
      <p className={`${base} text-sm leading-7 mb-3 last:mb-0`}>{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-zinc-300">{children}</em>
    ),
    ul: ({ children }) => (
      <ul className="my-3 space-y-1.5 pl-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-3 space-y-1.5 pl-1 list-decimal list-inside">{children}</ol>
    ),
    li: ({ children }) => (
      <li className={`${base} text-sm leading-6 flex gap-2`}>
        <span className="text-orange-400 shrink-0 mt-0.5">•</span>
        <span>{children}</span>
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-orange-500 pl-4 my-3 text-zinc-400 italic text-sm">
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const isBlock = className?.includes('language-')
      if (isBlock) {
        return (
          <div className="my-3 rounded-xl overflow-hidden border border-zinc-800">
            <div className="bg-zinc-900 px-3 py-1.5 text-xs text-zinc-500 border-b border-zinc-800 font-mono">
              {className?.replace('language-', '') || 'code'}
            </div>
            <pre className="bg-zinc-950 px-4 py-3 overflow-x-auto">
              <code className="text-orange-200 text-xs leading-relaxed font-mono">{children}</code>
            </pre>
          </div>
        )
      }
      return (
        <code className="bg-zinc-800 text-orange-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
          {children}
        </code>
      )
    },
    pre: ({ children }) => <>{children}</>,
    hr: () => <hr className="border-zinc-800 my-4" />,
    table: ({ children }) => (
      <div className="my-3 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-xs">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-zinc-900 border-b border-zinc-800">{children}</thead>
    ),
    tbody: ({ children }) => <tbody className="divide-y divide-zinc-800/50">{children}</tbody>,
    tr: ({ children }) => <tr className="hover:bg-zinc-900/50 transition-colors">{children}</tr>,
    th: ({ children }) => (
      <th className="px-3 py-2 text-left text-zinc-300 font-semibold">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 text-zinc-400">{children}</td>
    ),
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors">
        {children}
      </a>
    ),
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}
