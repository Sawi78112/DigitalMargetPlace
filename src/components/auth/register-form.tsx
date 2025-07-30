'use client'

import { useState } from 'react'
import {
  Camera,
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
  UserRound,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { register } from '@/lib/auth/mutations'
import { registerSchema, type RegisterSchema } from '@/lib/auth/schemas'
import { auth } from '@/lib/api'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: register,
    onSuccess: (data) => {
      // Match Svelte logic exactly - only get token and token_expiry
      const { token, token_expiry } = data
      auth.setToken(token, new Date(token_expiry))
      router.push('/u/email-confirmation')
    },
  })

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(data)
  }

  return (
    <>
      <div className="flex flex-col pb-6">
        <h1 className="pb-1 text-[20px] text-grayCustom font-semibold">Sign Up</h1>
        <p className="text-grayCustom1 text-sm">
          Please upload your photo and input required informations below
        </p>
      </div>

      <div className="bg-muted relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <UserRound className="text-muted-foreground h-8 w-8" />

        <label
          htmlFor="file-upload"
          className="absolute right-0 bottom-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white bg-gradient-to-r from-[#0EBCE8] to-[#005FBD]"
          title="Upload Photo"
        >
          <Camera className="h-4 w-4" />
        </label>

        <input id="file-upload" type="file" className="hidden" accept="image/*" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-1 text-grayCustom">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Full Name"
                    className="rounded-full h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-1 text-grayCustom">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Username"
                    className="rounded-full h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pb-1 text-grayCustom">Email Address</FormLabel>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-grayCustom">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter Password"
                      className="rounded-full pr-10 h-12"
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

          {registerMutation.isPaused && (
            <Alert variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>You are offline</AlertTitle>
              <AlertDescription>Please connect to the internet.</AlertDescription>
            </Alert>
          )}

          {registerMutation.isError && (
            <Alert variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>Registration failed</AlertTitle>
              <AlertDescription>Please check your information and try again.</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full rounded-full text-white bg-gradient-to-r from-[#0EBCE8] to-[#005FBD] h-12"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              'Next'
            )}
          </Button>
        </form>
      </Form>

      <div className="pt-6 text-center text-sm">
        Already have an account?{' '}
        <Button variant="link" className="text-sm font-medium p-0 h-auto" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </>
  )
} 