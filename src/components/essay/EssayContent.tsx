"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { normalizeEssayMarkdown } from "@/lib/markdown"
import { useLocale } from "@/components/LocaleProvider"

interface Props {
  markdown: string
  className?: string
}

export default function EssayContent({ markdown, className = "" }: Props) {
  const { messages } = useLocale()
  const normalizedMarkdown = normalizeEssayMarkdown(markdown)

  if (!normalizedMarkdown.trim()) {
    return (
      <p className={`text-sm text-text-subtle italic ${className}`}>
        {messages.essay.emptyContent}
      </p>
    )
  }

  return (
    <div className={`text-base leading-relaxed text-text ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 mb-3 text-2xl font-bold text-text">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-2 text-xl font-bold text-text">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-lg font-semibold text-text">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-text">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
          ul: ({ children }) => <ul className="mb-4 list-inside list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 list-inside list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-text">{children}</li>,
          code: ({ children }) => (
            <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-sm text-primary-soft-text dark:bg-blue-900">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-xl bg-surface-muted p-4 text-sm">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-4 border-blue-300 pl-4 italic text-text-muted dark:border-blue-700">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-link underline hover:text-primary-soft-text"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-6 border-border" />,
          del: ({ children }) => (
            <del className="text-text-subtle">{children}</del>
          ),
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-border">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold text-text">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border px-3 py-2">{children}</td>
          ),
        }}
      >
        {normalizedMarkdown}
      </ReactMarkdown>
    </div>
  )
}
