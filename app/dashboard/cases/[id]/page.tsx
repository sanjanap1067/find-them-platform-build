import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { CaseDetails } from "@/components/case-details"
import { CaseSightings } from "@/components/case-sightings"
import { CaseActions } from "@/components/case-actions"

interface CaseDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile?.is_verified) {
    redirect("/dashboard/pending-verification")
  }

  // Get case details
  const { data: caseData, error: caseError } = await supabase
    .from("missing_children")
    .select("*")
    .eq("id", id)
    .eq("reported_by", data.user.id)
    .single()

  if (caseError || !caseData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={data.user} profile={profile} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CaseDetails caseData={caseData} />
            <CaseSightings caseId={id} />
          </div>
          <div>
            <CaseActions caseData={caseData} />
          </div>
        </div>
      </div>
    </div>
  )
}
