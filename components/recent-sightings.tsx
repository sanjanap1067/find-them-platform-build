import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User } from "lucide-react"
import Link from "next/link"

interface RecentSightingsProps {
  userId: string
}

export async function RecentSightings({ userId }: RecentSightingsProps) {
  const supabase = await createClient()

  const { data: sightings } = await supabase
    .from("sightings")
    .select(`
      *,
      missing_children!inner(
        id,
        name,
        reported_by
      )
    `)
    .eq("missing_children.reported_by", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Sightings</CardTitle>
          <CardDescription>Latest sightings reported for your cases</CardDescription>
        </div>
        <Link href="/dashboard/sightings">
          <Button variant="outline" size="sm" className="bg-transparent">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {sightings && sightings.length > 0 ? (
          <div className="space-y-4">
            {sightings.map((sighting) => (
              <div key={sighting.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{sighting.missing_children.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {sighting.reporter_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(sighting.sighting_date).toLocaleDateString()}
                      </div>
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
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {sighting.sighting_location}
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{sighting.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No sightings reported yet.</p>
            <p className="text-sm">Sightings will appear here when the public reports them for your cases.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
