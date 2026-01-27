import { NextResponse } from "next/server";

export async function proxy(request) {
  try {
    const token = request.cookies.get("token")?.value;
    const pathname = request.nextUrl.pathname;

    const protectedRoutes = ["/shapes"];

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtected && !token) {
      return NextResponse.redirect(
        new URL("/auth/signin", request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.error();
  }
}

export const config = {
  matcher: ["/shapes"],
};
