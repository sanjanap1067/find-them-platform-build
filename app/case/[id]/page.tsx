import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, Phone, Mail, Share2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CasePageProps {
  params: Promise<{ id: string }>
}

export default async function CasePage({ params }: CasePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: child, error } = await supabase
    .from("missing_children")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (error || !child) {
    notFound()
  }

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
            <div className="flex items-center space-x-4">
              <Link href="/search">
                <Button variant="outline" size="sm">
                  Back to Search
                </Button>
              </Link>
              <Button size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Child Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{child.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {child.gender} • Age {child.age}
                    </CardDescription>
                  </div>
                  <Badge variant="destructive" className="text-sm">
                    Missing
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>Last seen: {new Date(child.last_seen_date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{child.last_seen_location}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-3" />
                  <span>Case #{child.case_number}</span>
                </div>

                <Separator />

                {child.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{child.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {child.photo_url ? (
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={child.photo_url || "/placeholder.svg"}
                        alt={child.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <User className="h-16 w-16 mx-auto mb-2" />
                        <p>No photo available</p>
                      </div>
                    </div>
                  )}

                  {child.additional_photos?.map((photo: string, index: number) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`${child.name} - Photo ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Sighting */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <CardTitle className="text-orange-900">Seen This Child?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-orange-800 mb-4 text-sm">
                  If you have seen this child or have any information, please report it immediately.
                </p>
                <Link href={`/report?case_id=${child.id}`}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Report Sighting</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {child.contact_info && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Reporting Organization</h4>
                    <p className="text-sm text-gray-600">{child.contact_info}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Emergency: 911</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>tips@findthem.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900 text-sm">Safety Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 text-xs leading-relaxed">
                  If you see this child, do not approach directly. Contact local authorities immediately. Your safety
                  and the child's safety are the top priority.
                </p>
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Help Spread the Word</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 mb-3">Share this case to help expand the search network.</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
