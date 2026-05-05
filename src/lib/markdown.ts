export function normalizeEssayMarkdown(markdown: string) {
  return markdown.replace(/([^\s*])\*\*((?:'|’)[^*\n]*?)\*\*/g, "$1&ZeroWidthSpace;**$2**")
}
