import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { getLocaleFromAcceptLanguage, isLocale } from "@/lib/i18n"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  const [, firstSegment] = req.nextUrl.pathname.split("/")
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value
  const locale = isLocale(firstSegment)
    ? firstSegment
    : isLocale(cookieLocale)
      ? cookieLocale
    : getLocaleFromAcceptLanguage(req.headers.get("accept-language"))
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-flip-flow-locale", locale)
  const isPublicPage =
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname === "/ko" ||
    req.nextUrl.pathname === "/en" ||
    req.nextUrl.pathname === "/ads.txt" ||
    ["/privacy", "/terms", "/support", "/mobile-help"].some((path) =>
      req.nextUrl.pathname.startsWith(path)
    )

  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return Response.redirect(new URL("/login", req.url))
  }
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|icons|images|ads.txt|sw.js|manifest.webmanifest|favicon.ico).*)",
  ],
}
