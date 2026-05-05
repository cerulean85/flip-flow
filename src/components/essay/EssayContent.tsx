import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { normalizeEssayMarkdown } from "@/lib/markdown"

interface Props {
  markdown: string
  className?: string
}

export default function EssayContent({ markdown, className = "" }: Props) {
  const normalizedMarkdown = normalizeEssayMarkdown(markdown)

  if (!normalizedMarkdown.trim()) {
    return (
      <p className={`text-sm text-gray-400 italic dark:text-zinc-500 ${className}`}>
        내용이 비어 있습니다.
      </p>
    )
  }

  return (
    <div className={`text-base leading-relaxed text-gray-800 dark:text-zinc-200 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 mb-3 text-2xl font-bold text-gray-900 dark:text-zinc-100">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-2 text-xl font-bold text-gray-900 dark:text-zinc-100">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900 dark:text-zinc-100">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-zinc-100">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-gray-700 dark:text-zinc-300">{children}</em>,
          ul: ({ children }) => <ul className="mb-4 list-inside list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 list-inside list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-gray-800 dark:text-zinc-200">{children}</li>,
          code: ({ children }) => (
            <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-xl bg-gray-100 p-4 text-sm dark:bg-zinc-800">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-4 border-blue-300 pl-4 italic text-gray-600 dark:border-blue-700 dark:text-zinc-400">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-6 border-gray-200 dark:border-zinc-800" />,
          del: ({ children }) => (
            <del className="text-gray-400 dark:text-zinc-500">{children}</del>
          ),
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-gray-200 dark:border-zinc-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-zinc-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-gray-100 px-3 py-2 dark:border-zinc-800">{children}</td>
          ),
        }}
      >
        {normalizedMarkdown}
      </ReactMarkdown>
    </div>
  )
}
