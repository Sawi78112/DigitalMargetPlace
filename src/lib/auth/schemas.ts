import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Type your email here'),
  password: z.string().min(1, { message: 'Type your password here' })
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  full_name: z.string().min(3, 'Type your full name here'),
  username: z.string().min(1, 'Type your username here'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' })
})

export type ForgotPasswordRequestSchema = z.infer<typeof forgotPasswordRequestSchema>

export const forgotPasswordSchema = z
  .object({
    code: z.string().length(6, {
      message: 'Email Confirmation OTP must be at least 6 characters'
    }),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export const emailConfirmationSchema = z.object({
  code: z.string().length(6, {
    message: 'Email Confirmation OTP must be at least 6 characters'
  })
})

export type EmailConfirmationSchema = z.infer<typeof emailConfirmationSchema> 