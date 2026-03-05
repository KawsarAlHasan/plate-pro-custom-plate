import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "nl"];
const defaultLocale = "en";

function getLocaleFromCookie(request) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  return cookieLocale && locales.includes(cookieLocale) ? cookieLocale : null;
}

function getLocaleFromHeaders(request) {
  const negotiator = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") || "",
    },
  });
  const languages = negotiator.languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/_next", "/api", "/images", "/favicon.ico"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", locale);
    return response;
  }

  const locale =
    getLocaleFromCookie(request) ||
    getLocaleFromHeaders(request) ||
    defaultLocale;

  const newUrl = new URL(`/${locale}${pathname}`, request.url);

  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl, 308);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
