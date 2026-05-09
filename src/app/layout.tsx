import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { headers } from "next/headers"
import Script from "next/script"
import Providers from "@/components/Providers"
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const adsenseAccount = "ca-pub-2703512740946569"

export const metadata: Metadata = {
  title: "Flip & Flow",
  description: "Your personal flashcard learning app",
  manifest: "/manifest.webmanifest",
  other: {
    "google-adsense-account": adsenseAccount,
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Flip & Flow" },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestLocale = (await headers()).get("x-flip-flow-locale") ?? undefined
  const locale: Locale = isLocale(requestLocale) ? requestLocale : defaultLocale

  return (
    <html lang={locale} className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <Providers locale={locale}>{children}</Providers>
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseAccount}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
