import { type NextRequest, NextResponse } from "next/server"
import createIntlMiddleware from "next-intl/middleware"
import { createServerClient } from "@supabase/ssr"
import { routing } from "@/i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

const PUBLIC_PATHS = ["/sign-in"]

export async function middleware(request: NextRequest) {
  // 1. Resolve locale and let next-intl handle redirects/rewrites first.
  const response = intlMiddleware(request)

  // 2. Refresh Supabase session against the response cookies, then gate
  //    protected routes for unauthenticated users.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          ),
      },
    },
  )
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const localeMatch = pathname.match(/^\/(zh-CN|en)(\/.*)?$/)
  const pathWithoutLocale = localeMatch ? (localeMatch[2] ?? "/") : pathname
  const locale = localeMatch?.[1] ?? "zh-CN"

  const isPublic = PUBLIC_PATHS.some((p) => pathWithoutLocale.startsWith(p))
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/sign-in`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
