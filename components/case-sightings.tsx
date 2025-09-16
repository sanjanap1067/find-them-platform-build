import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Phone, Mail } from "lucide-react"

interface CaseSightingsProps {
  caseId: string
}

export async function CaseSightings({ caseId }: CaseSightingsProps) {
  const supabase = await createClient()

  const { data: sightings } = await supabase
    .from("sightings")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sightings ({sightings?.length || 0})</CardTitle>
        <CardDescription>Reports from the public about this missing child</CardDescription>
      </CardHeader>
      <CardContent>
        {sightings && sightings.length > 0 ? (
          <div className="space-y-4">
            {sightings.map((sighting) => (
              <div key={sighting.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {sighting.reporter_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Sighted: {new Date(sighting.sighting_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Reported: {new Date(sighting.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {sighting.sighting_location}
                    </div>
                  </div>
                  <Badge
                    variant={
                      sighting.status === "verified"
                        ? "default"
                        : sighting.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {sighting.status}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-3">{sighting.description}</p>

                {sighting.photo_url && (
                  <div className="mb-3">
                    <img
                      src={sighting.photo_url || "/placeholder.svg"}
                      alt="Sighting photo"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {sighting.reporter_phone && (
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {sighting.reporter_phone}
                      </div>
                    )}
                    {sighting.reporter_email && (
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {sighting.reporter_email}
                      </div>
                    )}
                  </div>
                  <div className="space-x-2">
                    {sighting.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Mark as Verified
                        </Button>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Dismiss
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No sightings reported yet.</p>
            <p className="text-sm">Sightings will appear here when the public reports them.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
