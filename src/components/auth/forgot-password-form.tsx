'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { forgotPassword } from '@/lib/auth/mutations'
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/lib/auth/schemas'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success('Password reset successfully!')
      router.push('/login')
    },
    onError: (error: any) => {
      if (error.status === 422) {
        toast.error('Invalid OTP Code')
        return
      }
      toast.error(error.message || 'An error occurred')
    },
  })

  const onSubmit = (data: ForgotPasswordSchema) => {
    // Remove confirmPassword from the data sent to API
    const { confirmPassword, ...submitData } = data
    forgotPasswordMutation.mutate(submitData)
  }

  return (
    <>
      <div className="flex flex-col pb-6">
        <h1 className="text-2xl font-semibold">Create New Password</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter OTP Code"
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
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter New Password"
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
                <FormLabel>Re-enter New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter New Password"
                      className="rounded-full pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            className="w-full rounded-full font-medium text-white"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Next'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
} 