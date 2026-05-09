import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  const isPublicPage =
    req.nextUrl.pathname === "/" ||
    ["/privacy", "/terms", "/support", "/mobile-help"].some((path) =>
      req.nextUrl.pathname.startsWith(path)
    )

  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return Response.redirect(new URL("/login", req.url))
  }
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|sw.js|manifest.webmanifest|favicon.ico).*)"],
}
