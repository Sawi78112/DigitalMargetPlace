import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DashboardHeader } from '@/components/header/dashboard-header'
import Link from 'next/link'

export default function CollaboratorsPage() {
  return (
    <>
      <DashboardHeader
        description=""
        heading="Your Store"
        backHref="/settings"
      />

      <Tabs defaultValue="collaborators">
        <div className="w-full">
          <TabsList>
            <TabsTrigger value="store">Products</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="store">
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

                <h1 className="text-xl">Add Products</h1>
                <p className="pb-4 text-sm text-gray-700">
                  Turn your creativity into profit by adding and selling your digital products effortlessly.
                </p>

                <Button asChild>
                  <Link href={"#" as any}>Add Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaborators">
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

                <h1 className="text-xl">Add Collaborators</h1>
                <p className="pb-4 text-sm text-gray-700">
                  Selling digital products is even better with a team! Invite collaborators to help you manage, create, and sell your landing pages, templates, or digital assets effortlessly.
                </p>

                <Button asChild>
                  <Link href={"#" as any}>Add Collaborators</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
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

                <h1 className="text-xl">Connect to existing domain</h1>
                <p className="pb-4 text-sm text-gray-700">
                  Already Have a Domain? Connect It to Your Site Here
                </p>

                <Button asChild>
                  <Link href={"#" as any}>Connect</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
} 