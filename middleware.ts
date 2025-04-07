// middleware.ts
import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {Role, RouteConfig} from "@/lib/types";

const routeConfigs: RouteConfig[] = [
  // Public routes
  {
    pattern: /^\/(login|signup)?$/,
    access: "public",
    redirectIfAuthenticated: "/admin/dashboard", // Redirect logged-in users to dashboard
  },
  {
    pattern: /^\/$/,
    access: "public",
  },
  // Private routes
  {
    pattern: /^\/admin\/dashboard/,
    access: "private",
    roles: ["user", "admin"],
    redirectTo: "/unauthorized",
  },
  {
    pattern: /^\/admin\/profile/,
    access: "private",
    roles: ["user", "admin"],
    redirectTo: "/unauthorized",
  },
  {
    pattern: /^\/admin/,
    access: "private",
    roles: ["admin"],
    redirectTo: "/unauthorized",
  },
  // Catch-all for undefined routes (treat as private by default)
  {
    pattern: /.*/,
    access: "private",
    roles: ["user", "admin"],
    redirectTo: "/unauthorized",
  },
];

const hasRequiredRole = (userRole: Role | undefined, requiredRoles: Role[]): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

// Middleware using withAuth
export default withAuth(
  function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const session = req.nextauth.token; // Session data added by withAuth

    const userRole = session?.role as Role | undefined;

    // Find the matching route config
    const routeConfig = routeConfigs.find((config) => config.pattern.test(pathname));

    if (!routeConfig) {
      // Fallback: treat as private if no config matches
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Public route: allow access
    if (routeConfig.access === "public") {
      // Redirect authenticated users if specified
      if (session && routeConfig.redirectIfAuthenticated) {
        return NextResponse.redirect(new URL(routeConfig.redirectIfAuthenticated, req.url));
      }
      return NextResponse.next();
    }

    // Private route: check authentication and authorization
    if (routeConfig.access === "private") {
      // Not authenticated: redirect to login
      if (!session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Authenticated but wrong role: redirect to unauthorized
      if (routeConfig.roles && !hasRequiredRole(userRole, routeConfig.roles)) {
        return NextResponse.redirect(new URL(routeConfig.redirectTo || "/unauthorized", req.url));
      }

      // Authorized: allow access
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      // Ensure the middleware runs only if the user is authenticated (for private routes)
      authorized: () => {
        // If token exists, the user is authenticated
        // We'll handle role-based checks in the middleware itself
        return true;
      },
    },
  }
);

// Define which routes the middleware applies to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
