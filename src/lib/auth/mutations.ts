import type {
  EmailConfirmationSchema,
  ForgotPasswordRequestSchema,
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema
} from './schemas'
import { api } from '@/lib/api'

// Match Svelte types exactly - AuthResult only has token and token_expiry
export interface AuthResult {
  token: string
  token_expiry: string
}

export interface ForgotPasswordRequestResult {
  message: string
  id: string
}

export async function login(data: LoginSchema): Promise<AuthResult> {
  return await api<AuthResult>({
    url: '/login',
    method: 'POST',
    data
  })
}

export async function register(data: RegisterSchema): Promise<AuthResult> {
  return await api<AuthResult>({
    url: '/register',
    method: 'POST',
    data
  })
}

export async function forgotPasswordRequest(data: ForgotPasswordRequestSchema): Promise<ForgotPasswordRequestResult> {
  return await api<ForgotPasswordRequestResult>({
    url: '/forgot-password/request',
    method: 'POST',
    data
  })
}

export async function forgotPassword(data: Omit<ForgotPasswordSchema, 'confirmPassword'>): Promise<void> {
  const searchParams = new URLSearchParams(window.location.search)
  const id = searchParams.get('id')

  return await api({
    url: '/forgot-password',
    method: 'POST',
    data: {
      ...data,
      id
    }
  })
}

export async function emailConfirmation(data: EmailConfirmationSchema): Promise<AuthResult> {
  return await api<AuthResult>({
    url: '/email-confirmation',
    method: 'POST',
    data: {
      ...data
    }
  })
}

export async function emailConfirmationRequest(): Promise<AuthResult> {
  return await api<AuthResult>({
    url: '/email-confirmation/request',
    method: 'POST'
  })
} 