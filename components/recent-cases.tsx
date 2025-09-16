import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface RecentCasesProps {
  userId: string
}

export async function RecentCases({ userId }: RecentCasesProps) {
  const supabase = await createClient()

  const { data: cases } = await supabase
    .from("missing_children")
    .select("*")
    .eq("reported_by", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Cases</CardTitle>
          <CardDescription>Your organization's latest missing children cases</CardDescription>
        </div>
        <Link href="/dashboard/cases">
          <Button variant="outline" size="sm" className="bg-transparent">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {cases && cases.length > 0 ? (
          <div className="space-y-4">
            {cases.map((child) => (
              <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {child.photo_url ? (
                      <img
                        src={child.photo_url || "/placeholder.svg"}
                        alt={child.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Photo</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{child.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span>Age {child.age}</span>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(child.last_seen_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {child.last_seen_location.split(",")[0]}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={child.status === "active" ? "destructive" : "secondary"}>{child.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No cases reported yet.</p>
            <Link href="/dashboard/cases/new">
              <Button className="mt-2" size="sm">
                Report First Case
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
