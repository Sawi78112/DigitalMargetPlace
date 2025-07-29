import { AppSidebar } from './_components/app-sidebar'
import { Header } from '@/components/header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AuthGuard } from './middleware'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="h-screen overflow-hidden">
        <SidebarProvider className="bg-secondary border-r-0 h-full">
          <AppSidebar />
          <div className="mx-6 my-4 flex w-full flex-1 flex-col space-y-4 overflow-hidden">
            <Header />
            <main className="h-full flex-1 space-y-4 rounded-xl bg-white p-6 overflow-auto">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </AuthGuard>
  )
} 