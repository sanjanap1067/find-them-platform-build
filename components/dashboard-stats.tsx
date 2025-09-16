import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Eye, CheckCircle, Clock } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  // Get stats for the user's organization
  const [{ count: totalCases }, { count: activeCases }, { count: resolvedCases }, { count: totalSightings }] =
    await Promise.all([
      supabase.from("missing_children").select("*", { count: "exact", head: true }).eq("reported_by", userId),
      supabase
        .from("missing_children")
        .select("*", { count: "exact", head: true })
        .eq("reported_by", userId)
        .eq("status", "active"),
      supabase
        .from("missing_children")
        .select("*", { count: "exact", head: true })
        .eq("reported_by", userId)
        .eq("status", "found"),
      supabase
        .from("sightings")
        .select("*, missing_children!inner(*)", { count: "exact", head: true })
        .eq("missing_children.reported_by", userId),
    ])

  const stats = [
    {
      title: "Total Cases",
      value: totalCases || 0,
      description: "All cases reported by your organization",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Cases",
      value: activeCases || 0,
      description: "Currently active missing children cases",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Resolved Cases",
      value: resolvedCases || 0,
      description: "Children successfully found",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Sightings",
      value: totalSightings || 0,
      description: "Sightings reported for your cases",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`w-8 h-8 ${stat.bgColor} rounded-full flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <CardDescription className="text-xs">{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
