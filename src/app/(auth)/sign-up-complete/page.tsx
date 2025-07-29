import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignUpCompletePage() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="bg-muted relative flex h-20 w-20 items-center justify-center rounded-full">
        <Check className="h-8 w-8 text-green-500" />
      </div>

      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-xl font-semibold">Signup Complete!</h1>
        <p className="text-muted-foreground text-sm">You have successfully created your account.</p>
      </div>

      <Button asChild className="w-full rounded-full font-medium text-white">
        <Link href="/login">Next</Link>
      </Button>
    </div>
  )
} 