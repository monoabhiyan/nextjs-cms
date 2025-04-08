import { SafeActionResult, ValidationErrors } from "next-safe-action";
import { z } from "zod";

export type Role = "user" | "admin" | "guest";

export type RouteConfig = {
  pattern: RegExp; // Regex to match the route
  access: "public" | "private"; // Public or private route
  roles?: Role[]; // Required roles (if private)
  redirectTo?: string; // Custom redirect if unauthorized
  redirectIfAuthenticated?: string;
};

export type Children = Readonly<{ children: React.ReactNode }>;

export type ActionResult<T extends z.Schema> = SafeActionResult<
  string,
  T,
  readonly [],
  ValidationErrors<T>,
  never
>;

export type ActionSuccess<T extends z.Schema> = {
  data: T;
  serverError: undefined;
  validationErrors: ValidationErrors<T>;
};
