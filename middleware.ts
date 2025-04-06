// middleware.ts (changed to .ts for better type safety)
import { withAuth } from "next-auth/middleware";

type Role = "admin" | "editor" | "user"; // Define your roles

interface RouteConfig {
  path: string;
  requiredRoles: Role[];
}

const routeConfigs: RouteConfig[] = [
  { path: "/admin", requiredRoles: ["admin"] },
  { path: "/editor", requiredRoles: ["admin", "editor"] },
  { path: "/dashboard", requiredRoles: ["admin", "editor", "user"] },
];

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      // Find matching route config
      const routeConfig = routeConfigs.find(config =>
        pathname.startsWith(config.path)
      );

      // If no config found, route is public
      if (!routeConfig) {
        return true;
      }

      // If no token, user is not authenticated
      if (!token) {
        return false;
      }

      // Check if user's role matches any required role
      const userRole = token.role as Role;
      return routeConfig.requiredRoles.includes(userRole);
    },
  },
});

export const config = {
  matcher: routeConfigs.map(config => `${config.path}/:path*`),
};
