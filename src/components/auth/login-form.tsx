"use client";

import { useState } from "react";
import { CircleAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login } from "@/lib/auth/mutations";
import { loginSchema, type LoginSchema } from "@/lib/auth/schemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      if (data.session) {
        toast.success("Login successful!");
        router.push("/home");
      } else {
        toast.error("Please check your email to confirm your account.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <div className="flex flex-col pb-6">
        <h1 className="text-2xl font-semibold">Sign In</h1>
        <p className="text-muted-foreground text-sm">Welcome back!</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-1">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter Email Address"
                    className="rounded-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
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

          <div className="flex items-center justify-between text-sm">
            <Label className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <span>Remember Me</span>
            </Label>
            <Button variant="link" className="text-sm p-0 h-auto" asChild>
              <Link href="/forgot-password/request">Forgot Password?</Link>
            </Button>
          </div>

          {loginMutation.isPaused && (
            <Alert variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>You are offline</AlertTitle>
              <AlertDescription>
                Please connect to the internet.
              </AlertDescription>
            </Alert>
          )}

          {loginMutation.isError && (
            <Alert variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>Email or password is incorrect</AlertTitle>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full rounded-full text-white"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or Register with
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="outline" type="button" className="w-full rounded-full">
          <Icons.google className="mr-2 size-4" />
          Sign Up with Google
        </Button>
        <Button variant="outline" type="button" className="w-full rounded-full">
          <Icons.apple className="mr-2 size-4" />
          Sign Up with Apple
        </Button>
      </div>

      <div className="pt-6 text-center text-sm">
        Don't have an account?{" "}
        <Button
          variant="link"
          className="text-sm font-medium p-0 h-auto"
          asChild
        >
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    </>
  );
}
