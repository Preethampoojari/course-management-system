import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

const isAdminRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/create-course(.*)",
  "/roles(.*)",
]);

const rolesRoute = createRouteMatcher(["/roles(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Allow ALL API routes without auth
  if (pathname.startsWith("/api")) {
    return;
  }

  if (
    rolesRoute(req) &&
    (await auth()).sessionClaims?.metadata.role === "moderator"
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  if (
    isAdminRoute(req) &&
    (await auth()).sessionClaims?.metadata.role !== "admin" &&
    (await auth()).sessionClaims?.metadata.role !== "moderator"
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Protect all routes except static files & API
    "/((?!_next|.*\\..*).*)",
  ],
};
