import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentCases } from "@/components/recent-cases"
import { RecentSightings } from "@/components/recent-sightings"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile?.is_verified) {
    redirect("/dashboard/pending-verification")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} profile={profile} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile.full_name}. Here's your organization overview.</p>
        </div>

        <div className="space-y-8">
          <DashboardStats userId={data.user.id} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentCases userId={data.user.id} />
            <RecentSightings userId={data.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
