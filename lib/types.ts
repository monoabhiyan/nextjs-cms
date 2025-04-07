export type Role = "user" | "admin" | "guest";

export type RouteConfig = {
  pattern: RegExp; // Regex to match the route
  access: "public" | "private"; // Public or private route
  roles?: Role[]; // Required roles (if private)
  redirectTo?: string; // Custom redirect if unauthorized
  redirectIfAuthenticated?: string;
}

export type Children = Readonly<{ children: React.ReactNode }>
