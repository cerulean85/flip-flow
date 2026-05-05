export function normalizeEssayMarkdown(markdown: string) {
  return markdown
    .replace(/([^\s*])\*\*((?:'|’)[^*\n]*?)\*\*/g, "$1&ZeroWidthSpace;**$2**")
    .replace(/\*\*((?:['’"][^*\n]*?['’"]))\*\*(?=[\p{L}\p{N}_])/gu, "**$1**&ZeroWidthSpace;")
}
