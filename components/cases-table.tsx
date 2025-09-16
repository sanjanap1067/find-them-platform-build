import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MapPin, Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface CasesTableProps {
  userId: string
  searchParams: {
    q?: string
    status?: string
    page?: string
  }
}

export async function CasesTable({ userId, searchParams }: CasesTableProps) {
  const supabase = await createClient()

  // Build query
  let query = supabase.from("missing_children").select("*").eq("reported_by", userId)

  // Apply filters
  if (searchParams.q) {
    query = query.or(
      `name.ilike.%${searchParams.q}%,case_number.ilike.%${searchParams.q}%,last_seen_location.ilike.%${searchParams.q}%`,
    )
  }

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status)
  }

  const { data: cases, error } = await query.order("created_at", { ascending: false })

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Error loading cases. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Cases</CardTitle>
        <CardDescription>
          {cases?.length || 0} {cases?.length === 1 ? "case" : "cases"} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cases && cases.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Child</TableHead>
                  <TableHead>Case #</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sightings</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
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
                          <p className="font-medium">{child.name}</p>
                          <p className="text-sm text-gray-600">
                            {child.gender} • Age {child.age}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{child.case_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(child.last_seen_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {child.last_seen_location.split(",")[0]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          child.status === "active" ? "destructive" : child.status === "found" ? "default" : "secondary"
                        }
                      >
                        {child.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>0</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/cases/${child.id}`}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No cases found matching your criteria.</p>
            <Link href="/dashboard/cases/new">
              <Button>Report First Case</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
