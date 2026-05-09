import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import LandingHome from "@/components/landing/LandingHome"
import { getRequestLocale } from "@/lib/i18n"
import { landingContent } from "@/lib/landing"

const appHosts = new Set(["flip-flow.dycdyp.com", "www.flip-flow.dycdyp.com"])

function getAppBaseUrl(host: string | undefined) {
  if (!host) return "https://flip-flow.dycdyp.com"

  return host === "localhost" || host === "127.0.0.1"
    ? ""
    : "https://flip-flow.dycdyp.com"
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale(await headers())
  return landingContent[locale].metadata
}

export default async function HomePage() {
  const headersList = await headers()
  const host = headersList.get("host")?.split(":")[0].toLowerCase()

  if (host && appHosts.has(host)) {
    redirect("/dashboard")
  }

  return (
    <LandingHome
      locale={getRequestLocale(headersList)}
      appBaseUrl={getAppBaseUrl(host)}
    />
  )
}
