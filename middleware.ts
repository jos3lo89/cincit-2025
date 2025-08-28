import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutesByRole,
  publicRoutes,
} from "./routes";

const apiAuthPrefix = "/api/auth";
const authRoutes = ["/signin"];

export default auth((req: NextAuthRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      new URL(`/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (isLoggedIn) {
    const allProtectedRoutes = Object.values(protectedRoutesByRole).flat();
    const isAccessingProtectedRoute = allProtectedRoutes.includes(
      nextUrl.pathname
    );

    if (isAccessingProtectedRoute && userRole) {
      const allowedRoutesForUser = protectedRoutesByRole[userRole] || [];
      if (!allowedRoutesForUser.includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
