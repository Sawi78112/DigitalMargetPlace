"use client";

import { withRequiredAuth } from "@/lib/hocs/with-auth";

function AuthGuardComponent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const AuthGuard = withRequiredAuth(AuthGuardComponent);
