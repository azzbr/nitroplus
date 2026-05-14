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
    // - favicon.ico (favicon file)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
