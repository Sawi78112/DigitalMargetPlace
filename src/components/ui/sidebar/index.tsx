'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        ref={ref}
        className={cn('flex min-h-screen', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = 'SidebarProvider'

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      'flex h-full w-64 flex-col border-r bg-background',
      className
    )}
    {...props}
  />
))
Sidebar.displayName = 'Sidebar'

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-1 flex-col gap-2 p-4', className)}
    {...props}
  />
))
SidebarContent.displayName = 'SidebarContent'

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-b p-4', className)}
    {...props}
  />
))
SidebarHeader.displayName = 'SidebarHeader'

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t p-4', className)}
    {...props}
  />
))
SidebarFooter.displayName = 'SidebarFooter'

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('', className)}
    {...props}
  />
))
SidebarGroup.displayName = 'SidebarGroup'

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('', className)}
    {...props}
  />
))
SidebarGroupContent.displayName = 'SidebarGroupContent'

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-col gap-1', className)}
    {...props}
  />
))
SidebarMenu.displayName = 'SidebarMenu'

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('', className)}
    {...props}
  />
))
SidebarMenuItem.displayName = 'SidebarMenuItem'

export const SidebarMenuButton = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean
  }
>(({ className, asChild = false, children, ...props }, ref) => {
  if (asChild) {
    return (
      <div className={cn('', className)}>
        {children}
      </div>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
SidebarMenuButton.displayName = 'SidebarMenuButton'

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-1 flex-col', className)}
    {...props}
  />
))
SidebarInset.displayName = 'SidebarInset'

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
} 