import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import LandingHome from "@/components/landing/LandingHome"
import { getRequestLocale } from "@/lib/i18n"
import { landingContent } from "@/lib/landing"
import { getAppBaseUrl, isAppHost } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale(await headers())
  return landingContent[locale].metadata
}

export default async function HomePage() {
  const headersList = await headers()
  const host = headersList.get("host")

  if (isAppHost(host)) {
    redirect("/dashboard")
  }

  return (
    <LandingHome
      locale={getRequestLocale(headersList)}
      appBaseUrl={getAppBaseUrl(host)}
    />
  )
}
