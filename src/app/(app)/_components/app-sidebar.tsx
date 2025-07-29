'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { 
  Home,
  Store,
  ShoppingBag,
  Users,
  Mail,
  Workflow,
  CircleDollarSign,
  TrendingUp,
  Library,
  Settings,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Products', 
    url: '/products',
    icon: Store,
  },
  {
    title: 'Store',
    url: '/store', 
    icon: ShoppingBag,
  },
  {
    title: 'Collaborators',
    url: '/collaborators',
    icon: Users,
  },
  {
    title: 'Checkout',
    url: '/checkout',
    icon: ShoppingBag,
  },
  {
    title: 'Emails',
    url: '/emails',
    icon: Mail,
  },
  {
    title: 'Workflows',
    url: '/workflows',
    icon: Workflow,
  },
  {
    title: 'Sales',
    url: '/sales',
    icon: CircleDollarSign,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: TrendingUp,
  },
  {
    title: 'Payouts',
    url: '/payouts', 
    icon: CircleDollarSign,
  },
  {
    title: 'Library',
    url: '/library',
    icon: Library,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="!w-[300px] mt-4 ml-4 flex h-[calc(100vh-32px)] flex-col justify-between rounded-md bg-white py-6">
      <SidebarHeader className="mb-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/home"
                className="text-muted-foreground flex h-10 items-center justify-center text-xl font-medium"
              >
                LOGO
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.url)
                return (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={link.url}
                        className={cn(
                          "h-8 flex items-center gap-3 rounded-full px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 w-full data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600",
                          isActive && "bg-blue-50 text-blue-600"
                        )}
                      >
                        <link.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{link.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600",
                pathname.startsWith('/settings') && "bg-blue-50 text-blue-600"
              )}
            >
              <Link href="/settings" className="flex w-full items-center gap-3">
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600">
              <Link href="/help" className="flex w-full items-center gap-3">
                <BookOpen className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
} 