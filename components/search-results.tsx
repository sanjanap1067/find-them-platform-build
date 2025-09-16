import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User } from "lucide-react"
import Link from "next/link"

interface SearchResultsProps {
  searchParams: {
    q?: string
    age_min?: string
    age_max?: string
    gender?: string
    location?: string
    date_from?: string
    date_to?: string
  }
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  const supabase = await createClient()

  // Build query
  let query = supabase.from("missing_children").select("*").eq("status", "active")

  // Apply search filters
  if (searchParams.q) {
    query = query.or(
      `name.ilike.%${searchParams.q}%,last_seen_location.ilike.%${searchParams.q}%,case_number.ilike.%${searchParams.q}%`,
    )
  }

  if (searchParams.age_min) {
    query = query.gte("age", Number.parseInt(searchParams.age_min))
  }

  if (searchParams.age_max) {
    query = query.lte("age", Number.parseInt(searchParams.age_max))
  }

  if (searchParams.gender) {
    query = query.eq("gender", searchParams.gender)
  }

  if (searchParams.location) {
    query = query.ilike("last_seen_location", `%${searchParams.location}%`)
  }

  if (searchParams.date_from) {
    query = query.gte("last_seen_date", searchParams.date_from)
  }

  if (searchParams.date_to) {
    query = query.lte("last_seen_date", searchParams.date_to)
  }

  const { data: cases, error } = await query.order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading search results. Please try again.</p>
      </div>
    )
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search terms or filters to find more results.</p>
          <Link href="/search">
            <Button variant="outline">Clear Search</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {cases.length} {cases.length === 1 ? "case" : "cases"} found
        </h2>
        <div className="text-sm text-gray-600">Showing results for active missing children cases</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((child) => (
          <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-200 relative">
              {child.photo_url ? (
                <img
                  src={child.photo_url || "/placeholder.svg"}
                  alt={child.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="h-16 w-16" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Badge variant="destructive">Missing</Badge>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{child.name}</CardTitle>
                  <CardDescription className="text-base">
                    {child.gender} • Age {child.age}
                  </CardDescription>
                </div>
                <div className="text-xs text-gray-500">Case #{child.case_number}</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Last seen: {new Date(child.last_seen_date).toLocaleDateString()}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {child.last_seen_location}
              </div>

              {child.description && <p className="text-sm text-gray-700 line-clamp-2">{child.description}</p>}

              <div className="flex gap-2 pt-2">
                <Link href={`/case/${child.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
                <Link href={`/report?case_id=${child.id}`} className="flex-1">
                  <Button className="w-full">Report Sighting</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {cases.length >= 20 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
      )}
    </div>
  )
}
