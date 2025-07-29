import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DashboardHeader } from '@/components/header/dashboard-header'
import Link from 'next/link'

export default function StorePage() {
  return (
    <>
      <DashboardHeader
        description="Take full control of your store's design and vibe with our intuitive, powerful store builder."
        heading="Your Store"
        backHref="/settings"
      />

      <Tabs defaultValue="store">
        <div className="w-full">
          <TabsList>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="blogs">Blog posts</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
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
                  <Link href={"/store/create-store" as any}>
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>

                <h1 className="text-xl">Create Store</h1>
                <p className="pb-4 text-sm text-gray-700">
                  Set Up Your Online Store and Start Selling Today
                </p>

                <Button asChild>
                  <Link href={"/store/create-store" as any}>Create</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blogs">
          <Card>
            <CardContent className="space-y-2">
              <div className="flex flex-col items-center space-y-2 text-center">
                <Button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-700 hover:bg-gray-300"
                  asChild
                >
                  <Link href={"/store/blogs/add" as any}>
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>

                <h1 className="text-xl">Add Blog Post</h1>
                <p className="pb-4 text-sm text-gray-700">
                  Start Creating a New Blog Post to Share Your Insights and Expertise
                </p>

                <Button asChild>
                  <Link href={"/store/blogs/add" as any}>Add Blog Post</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains">
          <Card>
            <CardContent className="space-y-2">
              <div className="flex flex-col items-center space-y-2 text-center">
                <Button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-700 hover:bg-gray-300"
                  asChild
                >
                  <Link href={"/store/domains" as any}>
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>

                <h1 className="text-xl">Connect to existing domain</h1>
                <p className="pb-4 text-sm text-gray-700">
                  Already Have a Domain? Connect It to Your Site Here
                </p>

                <Button asChild>
                  <Link href={"/store/domains" as any}>Connect</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
} 