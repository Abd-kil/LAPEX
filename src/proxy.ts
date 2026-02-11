import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["ar", "en"] as const;

function isSupportedLocale(value: string): value is (typeof SUPPORTED_LOCALES)[number] {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals and static files.
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Redirect `/` and any non-localized path to the default locale.
  if (!first || !isSupportedLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/ar${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next).*)"],
};

