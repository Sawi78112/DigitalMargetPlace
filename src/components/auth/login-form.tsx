'use client'

import { useState } from 'react'
import { CircleAlert, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { login } from '@/lib/auth/mutations'
import { loginSchema, type LoginSchema } from '@/lib/auth/schemas'
import { auth } from '@/lib/api'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/icons'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (data) => {
      // Match Svelte logic exactly - only get token and token_expiry
      const { token, token_expiry } = data
      auth.setToken(token, new Date(token_expiry))
      router.push('/home')
    },
  })

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data)
  }

  return (
    <>  
      <div className="flex flex-col pb-6">
        <h1 className="text-2xl font-semibold text-grayCustom">Sign In</h1>
        <p className="text-grayCustom1 text-sm">Welcome back!</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex items-center justify-between text-sm">
            <Label className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-[#E7E7E7]" />
              <span className="text-grayCustom1">Remember Me</span>
            </Label>
            <Button variant="link" className="text-sm p-0 h-auto" asChild>
              <Link href="/forgot-password/request" className="bg-gradient-to-r from-[#0EBCE8] to-[#005FBD] bg-clip-text text-transparent">Forgot Password?</Link>
            </Button>
          </div>

          {loginMutation.isPaused && (
            <Alert variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>You are offline</AlertTitle>
              <AlertDescription>Please connect to the internet.</AlertDescription>
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
            className="w-full rounded-full text-white bg-gradient-to-r from-[#0EBCE8] to-[#005FBD] h-12"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Next'
            )}
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-sm text-grayCustom1">Or Register with</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="outline" type="button" className="w-full relative rounded-full h-[42px] text-grayCustom1 justify-center">
          <Icons.google className="absolute left-4 top-1/2 -translate-y-1/2 size-4" />
          Sign Up with Google
        </Button>
        <Button variant="outline" type="button" className="w-full relative rounded-full h-[42px] text-grayCustom1 justify-center">
          <Icons.apple className="absolute left-4 top-1/2 -translate-y-1/2 size-4" />
          Sign Up with Apple
        </Button>
      </div>

      <div className="pt-6 text-center text-sm">
        Don't have an account?{' '}
        <Button variant="link" className="text-sm font-medium p-0 h-auto" asChild>
          <Link href="/register" className="bg-gradient-to-r from-[#0EBCE8] to-[#005FBD] bg-clip-text text-transparent">Sign Up</Link>
        </Button>
      </div>
    </>
  )
} 