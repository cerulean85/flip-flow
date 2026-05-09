import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import LandingHome from "@/components/landing/LandingHome"
import { isLocale } from "@/lib/i18n"
import { landingContent } from "@/lib/landing"
import { getAppBaseUrl, isAppHost } from "@/lib/site"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  return {
    ...landingContent[locale].metadata,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ko: "/ko",
        en: "/en",
      },
    },
  }
}

export default async function LocalizedHomePage({ params }: Props) {
  const [{ locale }, headersList] = await Promise.all([params, headers()])

  if (!isLocale(locale)) {
    notFound()
  }

  const host = headersList.get("host")

  if (isAppHost(host)) {
    redirect("/dashboard")
  }

  return <LandingHome locale={locale} appBaseUrl={getAppBaseUrl(host)} />
}
