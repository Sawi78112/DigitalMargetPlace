import type {
  EmailConfirmationSchema,
  ForgotPasswordRequestSchema,
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
} from "./schemas";
import { createClient } from "@/lib/supabase/client";
import type { AuthResponse, User } from "@supabase/supabase-js";

// Supabase auth result types
export interface AuthResult {
  user: User | null;
  session: any;
}

export interface ForgotPasswordRequestResult {
  message: string;
}

export async function login(data: LoginSchema): Promise<AuthResult> {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: authData.user,
    session: authData.session,
  };
}

export async function register(data: RegisterSchema): Promise<AuthResult> {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        username: data.username,
      },
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: authData.user,
    session: authData.session,
  };
}

// Request password reset email
export async function forgotPasswordRequest(
  data: ForgotPasswordRequestSchema
): Promise<ForgotPasswordRequestResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${window.location.origin}/forgot-password/reset`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Password reset email sent. Please check your inbox.",
  };
}

// Update password (used in reset password flow)
export async function forgotPassword(
  data: ForgotPasswordSchema
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

// Verify email confirmation with OTP code
export async function emailConfirmation(
  data: EmailConfirmationSchema
): Promise<AuthResult> {
  const supabase = createClient();

  // Get the user's email from current session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("No user email found");
  }

  const { data: authData, error } = await supabase.auth.verifyOtp({
    email: user.email,
    token: data.code,
    type: "email",
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: authData.user,
    session: authData.session,
  };
}

// Request new email confirmation (resend confirmation email)
export async function emailConfirmationRequest(
  email?: string
): Promise<{ message: string }> {
  const supabase = createClient();

  let userEmail = email;

  // If no email provided, get from current user
  if (!userEmail) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      throw new Error("No user email found");
    }

    userEmail = user.email;
  }

  // Resend confirmation email
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: userEmail,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Confirmation email sent. Please check your inbox.",
  };
}

export async function logout(): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
