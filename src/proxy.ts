import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const middleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return middleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - public asset folders (products/, icons, og images)
    // - any path with a file extension (treated as a static asset)
    "/((?!api|_next/static|_next/image|products|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)",
  ],
};
