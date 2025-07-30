"use client";

import { useCurrentUser } from "@/lib/hooks/use-supabase-user";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseAuthGuardOptions {
  requireValidSession?: boolean;
  requireEmailVerified?: boolean;
  onInvalidSession?: () => void;
  onUnverifiedEmail?: () => void;
}

interface AuthGuardState {
  isLoading: boolean;
  isValid: boolean;
  user: any;
  hasValidSession: boolean;
}

export function useAuthGuard(
  options: UseAuthGuardOptions = {}
): AuthGuardState {
  const {
    requireValidSession = false,
    requireEmailVerified = false,
    onInvalidSession,
    onUnverifiedEmail,
  } = options;

  const { user, loading } = useCurrentUser();
  const [hasValidSession, setHasValidSession] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(requireValidSession);

  useEffect(() => {
    if (!requireValidSession) {
      setSessionLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          setHasValidSession(false);
          onInvalidSession?.();
        } else {
          setHasValidSession(true);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setHasValidSession(false);
        onInvalidSession?.();
      } finally {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, [requireValidSession, onInvalidSession]);

  useEffect(() => {
    if (user && requireEmailVerified && !user.email_confirmed_at) {
      onUnverifiedEmail?.();
    }
  }, [user, requireEmailVerified, onUnverifiedEmail]);

  const isLoading = loading || sessionLoading;
  const isValid =
    (!requireValidSession || hasValidSession) &&
    (!requireEmailVerified || Boolean(user?.email_confirmed_at));

  return {
    isLoading,
    isValid,
    user,
    hasValidSession,
  };
}

// Specific hooks for common patterns
export function useRequireAuth() {
  return useAuthGuard();
}

export function useRequireValidSession() {
  return useAuthGuard({
    requireValidSession: true,
    onInvalidSession: () => {
      toast.error("Invalid or expired session");
      // Let middleware handle redirect
    },
  });
}

export function useRequireEmailVerification() {
  return useAuthGuard({
    requireEmailVerified: true,
    onUnverifiedEmail: () => {
      // Let middleware handle redirect
    },
  });
}
