import { Suspense } from "react"
import { ReportSightingForm } from "@/components/report-sighting-form"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Phone } from "lucide-react"
import Link from "next/link"

interface ReportPageProps {
  searchParams: Promise<{
    case_id?: string
  }>
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FindThem</span>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="sm">
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Sighting</h1>
          <p className="text-gray-600">
            Your report could be the key to bringing a missing child home safely. Every detail matters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Suspense fallback={<div>Loading form...</div>}>
              <ReportSightingForm caseId={params.case_id} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="font-semibold text-red-900">Emergency?</h3>
              </div>
              <p className="text-red-800 text-sm mb-3">
                If this is an emergency or you see the child right now, call 911 immediately.
              </p>
              <div className="flex items-center text-red-800 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <span className="font-semibold">911</span>
              </div>
            </div>

            {/* Safety Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Safety First</h3>
              </div>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Do not approach the child directly</li>
                <li>• Do not confront any adults with the child</li>
                <li>• Observe from a safe distance</li>
                <li>• Contact authorities immediately</li>
                <li>• Provide as much detail as possible</li>
              </ul>
            </div>

            {/* What to Include */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">What to Include</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Exact location and time</li>
                <li>• Description of the child's appearance</li>
                <li>• Who the child was with</li>
                <li>• Direction they were heading</li>
                <li>• Any photos (if safe to take)</li>
                <li>• Vehicle descriptions if applicable</li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Privacy & Security</h3>
              <p className="text-gray-700 text-sm">
                Your report will be shared with relevant authorities and the reporting organization. Your contact
                information is kept confidential and used only for follow-up if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
