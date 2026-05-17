export function optionalString(value: string | null | undefined): string | null {
  const trimmed = (value ?? "").trim()
  return trimmed.length > 0 ? trimmed : null
}

export function exceedsLimit(value: string | null | undefined, max: number): boolean {
  return typeof value === "string" && value.length > max
}
