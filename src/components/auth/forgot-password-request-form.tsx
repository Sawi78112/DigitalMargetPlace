"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { forgotPasswordRequest } from "@/lib/auth/mutations";
import {
  forgotPasswordRequestSchema,
  type ForgotPasswordRequestSchema,
} from "@/lib/auth/schemas";

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

export function ForgotPasswordRequestForm() {
  const router = useRouter();

  const form = useForm<ForgotPasswordRequestSchema>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordRequestMutation = useMutation({
    mutationKey: ["forgot-password-request"],
    mutationFn: forgotPasswordRequest,
    onSuccess: (data) => {
      toast.success("Password reset email has been sent to your email");
      // Don't redirect, just show success message
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send reset email");
    },
  });

  const onSubmit = (data: ForgotPasswordRequestSchema) => {
    forgotPasswordRequestMutation.mutate(data);
  };

  return (
    <>
      <div className="flex flex-col pb-6">
        <h1 className="text-2xl font-semibold text-grayCustom">
          Forgot Password
        </h1>
        <p className="text-grayCustom1 text-sm">
          Please input your email address below to request a reset password link
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-1 text-grayCustom">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter Email Address"
                    className="rounded-full h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-full text-white bg-gradient-to-r from-[#0EBCE8] to-[#005FBD] h-12"
            disabled={forgotPasswordRequestMutation.isPending}
          >
            {forgotPasswordRequestMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
