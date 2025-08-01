import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/components/header/dashboard-header'
import Link from 'next/link'

export default function SecurityPage() {
  return (
    <>
      <DashboardHeader
        description=""
        heading="Complete Your Profile"
        backHref="/settings"
      />

      <p className="mt-4 text-gray-700">
        Complete your profile by filling in all the necessary details, such as your personal information, preferences, and interests, to help ensure that you get the most personalized experience and connect with others more effectively.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* Tax Information */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">Incomplete</span>
            <div>
              <div className="font-semibold text-gray-900">Tax Information</div>
              <div className="text-sm text-gray-600 mt-1">Get Charged the right amount of tax on your earnings.</div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-medium"
              asChild
            >
              <Link href="#">Complete Now</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">Incomplete</span>
            <div>
              <div className="font-semibold text-gray-900">Payment Method</div>
              <div className="text-sm text-gray-600 mt-1">Let us know where you would like your earnings paid.</div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-medium"
              asChild
            >
              <Link href="#">Complete Now</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Trader Declaration */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">Incomplete</span>
            <div>
              <div className="font-semibold text-gray-900">Trader Declaration</div>
              <div className="text-sm text-gray-600 mt-1">We need to understand if you’re operating as Trader on our platform.</div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-medium"
              asChild
            >
              <Link href="#">Complete Now</Link>
            </Button>
          </CardContent>
        </Card>

        {/* ID Check */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">Incomplete</span>
            <div>
              <div className="font-semibold text-gray-900">ID Check</div>
              <div className="text-sm text-gray-600 mt-1">It is critical for us to confirm the identities of our authors.</div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-medium"
              asChild
            >
              <Link href="#">Complete Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}