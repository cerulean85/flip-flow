import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flip & Flow 정책",
  description: "Flip & Flow 개인정보처리방침, 이용약관, 지원 안내",
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
