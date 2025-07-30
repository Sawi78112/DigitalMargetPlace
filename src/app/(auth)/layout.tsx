export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-muted relative flex h-screen items-center justify-center gap-x-4 lg:grid lg:max-w-none lg:grid-cols-2 lg:p-4">
      <div className="bg-muted relative hidden h-full flex-col overflow-hidden rounded-md p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-[url('/img/dmp-bg.jpg')] bg-cover bg-right bg-no-repeat"></div>
      </div>
      
      <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-white px-4 lg:px-8">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </div>
    </div>
  )
} 