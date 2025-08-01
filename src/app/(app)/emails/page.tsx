import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DashboardHeader } from '@/components/header/dashboard-header'
import Link from 'next/link'

export default function EmailsPage() {
  return (
    <>
      <DashboardHeader
        description=""
        heading="Emails"
        backHref="/settings"
      />

      <Tabs defaultValue="emails">
        <div className="w-full">
          <TabsList>
            <TabsTrigger value="emails">Email Updates</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="emails">
          <Card>
            <CardContent className="space-y-2">
              <div className="flex flex-col items-center space-y-2 text-center">
                <Button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-700 hover:bg-gray-300"
                  asChild
                >
                  <Link href={"#" as any}>
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>

                <h1 className="text-xl">New Email Update</h1>
                <Button asChild>
                  <Link href={"#" as any}>Add</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        
      </Tabs>
    </>
  )
} 