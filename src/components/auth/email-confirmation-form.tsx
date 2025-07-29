'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { emailConfirmation, emailConfirmationRequest } from '@/lib/auth/mutations'
import { emailConfirmationSchema, type EmailConfirmationSchema } from '@/lib/auth/schemas'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

export function EmailConfirmationForm() {
  const router = useRouter()
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const form = useForm<EmailConfirmationSchema>({
    resolver: zodResolver(emailConfirmationSchema),
    defaultValues: {
      code: '',
    },
  })

  const emailConfirmationMutation = useMutation({
    mutationKey: ['email-confirmation'],
    mutationFn: emailConfirmation,
    onSuccess: () => {
      toast.success('Email verified successfully')
      router.push('/sign-up-complete')
    },
    onError: (error: any) => {
      if (error.status === 422) {
        toast.error(error.fieldErrors?.code || 'Invalid OTP code')
        return
      }
      if (error.status === 404) {
        toast.error('Please request new email OTP')
        return
      }
      toast.error(error.message || 'An error occurred')
    },
  })

  const emailConfirmationRequestMutation = useMutation({
    mutationKey: ['email-confirmation-request'],
    mutationFn: emailConfirmationRequest,
    onSuccess: () => {
      toast.success('New email otp has been sent to your email')
    },
    onError: (error: any) => {
      toast.error(error.message || 'An error occurred')
    },
  })

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newDigits = [...codeDigits]
    newDigits[index] = value
    setCodeDigits(newDigits)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Update form value
    form.setValue('code', newDigits.join(''))
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData?.getData('text') || ''
    const chars = paste.trim().slice(0, 6).split('')
    
    const newDigits = ['', '', '', '', '', '']
    for (let i = 0; i < 6; i++) {
      newDigits[i] = chars[i] || ''
    }
    
    setCodeDigits(newDigits)
    form.setValue('code', newDigits.join(''))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (codeDigits.includes('')) {
      toast.error('Please enter all 6 digits.')
      return
    }
    emailConfirmationMutation.mutate({ code: codeDigits.join('') })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Authentication</h1>
          <p className="mt-1 text-sm text-neutral-500">We sent authentication to</p>
        </div>

        <FormField
          control={form.control}
          name="code"
          render={() => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex gap-3">
                  {Array(6).fill(0).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el
                      }}
                      type="text"
                      maxLength={1}
                      value={codeDigits[i]}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className="size-10 rounded-full border border-gray-300 text-center text-xl focus:ring-2 focus:ring-blue-500 lg:size-12"
                    />
                  ))}
                </div>
              </FormControl>
              <div className="mt-2 text-center">
                <FormMessage className="text-xs text-red-500" />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={emailConfirmationMutation.isPending}
          className="flex w-full rounded-full font-medium text-white"
        >
          {emailConfirmationMutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>

        <div className="text-center text-sm">
          Didn't receive an email?{' '}
          <Button
            type="button"
            onClick={() => emailConfirmationRequestMutation.mutate()}
            variant="link"
            className="text-sm font-medium p-0 h-auto"
          >
            Request new code
          </Button>
        </div>
      </form>
    </Form>
  )
} 