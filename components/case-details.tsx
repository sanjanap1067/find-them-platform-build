import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User } from "lucide-react"

interface CaseDetailsProps {
  caseData: any
}

export function CaseDetails({ caseData }: CaseDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{caseData.name}</CardTitle>
            <CardDescription className="text-lg">
              {caseData.gender} • Age {caseData.age}
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge
              variant={
                caseData.status === "active" ? "destructive" : caseData.status === "found" ? "default" : "secondary"
              }
              className="mb-2"
            >
              {caseData.status}
            </Badge>
            <p className="text-sm text-gray-600">Case #{caseData.case_number}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photos */}
        <div>
          <h3 className="font-semibold mb-3">Photos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseData.photo_url ? (
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={caseData.photo_url || "/placeholder.svg"}
                  alt={caseData.name}
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

            {caseData.additional_photos?.map((photo: string, index: number) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`${caseData.name} - Photo ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Last Seen Information */}
        <div className="space-y-3">
          <h3 className="font-semibold">Last Seen Information</h3>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-3" />
            <span>{new Date(caseData.last_seen_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-3" />
            <span>{caseData.last_seen_location}</span>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-3">Physical Description</h3>
          <p className="text-gray-700 leading-relaxed">{caseData.description}</p>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h3 className="font-semibold mb-3">Contact Information</h3>
          <p className="text-gray-700">{caseData.contact_info}</p>
        </div>

        <Separator />

        {/* Case Timeline */}
        <div>
          <h3 className="font-semibold mb-3">Case Timeline</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              <span>Case created: {new Date(caseData.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              <span>Last updated: {new Date(caseData.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
