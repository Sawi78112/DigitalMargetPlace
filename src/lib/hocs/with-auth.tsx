"use client";

import { useCurrentUser } from "@/lib/hooks/use-supabase-user";
import { ComponentType, ReactElement } from "react";

interface WithAuthOptions {
  requireAuth?: boolean;
  requireEmailVerified?: boolean;
  redirectTo?: string;
  loadingComponent?: ReactElement;
}

const defaultLoadingComponent = (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-xl">Loading...</h1>
    </div>
  </div>
);

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requireAuth = true,
    requireEmailVerified = false,
    loadingComponent = defaultLoadingComponent,
  } = options;

  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useCurrentUser();

    if (loading) {
      return loadingComponent;
    }

    // If auth is required but user is not authenticated
    if (requireAuth && !user) {
      return null; // Middleware will handle redirect
    }

    // If user is authenticated but email verification is required
    if (
      requireAuth &&
      user &&
      requireEmailVerified &&
      !user.email_confirmed_at
    ) {
      return null; // Middleware will handle redirect
    }

    return <Component {...props} />;
  };
}

// Specific HOCs for common use cases
export const withRequiredAuth = <P extends object>(
  Component: ComponentType<P>
) => withAuth(Component, { requireAuth: true });

export const withRequiredEmailVerification = <P extends object>(
  Component: ComponentType<P>
) => withAuth(Component, { requireAuth: true, requireEmailVerified: true });

export const withOptionalAuth = <P extends object>(
  Component: ComponentType<P>
) => withAuth(Component, { requireAuth: false });
