"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { forgotPassword } from "@/lib/auth/mutations";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/auth/schemas";
import { useRequireValidSession } from "@/lib/hooks/use-auth-guard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use the new auth guard pattern
  const { isLoading: authLoading, isValid: hasValidSession } =
    useRequireValidSession();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Password updated successfully!");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update password");
    },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    resetPasswordMutation.mutate(data);
  };

  // Show loading while checking session
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl">Verifying session...</h1>
        </div>
      </div>
    );
  }

  // If session is invalid, don't render form (middleware will redirect)
  if (!hasValidSession) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col pb-6">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="rounded-full pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="rounded-full pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full rounded-full"
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
