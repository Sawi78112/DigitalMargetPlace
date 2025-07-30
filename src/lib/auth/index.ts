export * from "./hooks";
export * from "./login-form";
export * from "./register-form";
export { useCurrentUser } from "@/lib/hooks/use-supabase-user";

// Export Supabase auth functions
export {
  login,
  register,
  logout,
  forgotPasswordRequest,
  forgotPassword,
} from "./mutations";
export {
  loginSchema,
  registerSchema,
  forgotPasswordRequestSchema,
  forgotPasswordSchema,
} from "./schemas";
