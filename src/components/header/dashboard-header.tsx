'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  heading: string
  description?: string
  backHref?: string
}

export function DashboardHeader({ heading, description, backHref }: DashboardHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {backHref && (
        <Button variant="ghost" size="icon" asChild>
          <Link href={backHref as any}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
} 