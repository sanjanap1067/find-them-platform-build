import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { NewCaseForm } from "@/components/new-case-form"

export default async function NewCasePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile?.is_verified) {
    redirect("/dashboard/pending-verification")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} profile={profile} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report New Missing Child Case</h1>
          <p className="text-gray-600">
            Please provide as much detail as possible. This information will be made public to help locate the child.
          </p>
        </div>

        <NewCaseForm userId={data.user.id} />
      </div>
    </div>
  )
}
