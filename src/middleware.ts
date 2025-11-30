import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/_next/", "/favicon", "/images", "/api", "/public"];

const LOCALES = ["mn", "en", "ko"];
const DEFAULT_LOCALE = "mn";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static/public files
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Already includes a locale
  const hasLocale = LOCALES.some((locale) => pathname.startsWith(`/${locale}`));
  if (hasLocale) return NextResponse.next();

  // Redirect → /mn/... if no locale is present
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api routes
     * - static files
     * - Next.js internals
     */
    "/((?!api|_next|.*\\..*).*)",
  ],
};
