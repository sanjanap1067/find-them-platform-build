"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Share2, Edit, Archive, CheckCircle, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CaseActionsProps {
  caseData: any
}

export function CaseActions({ caseData }: CaseActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("missing_children").update({ status: newStatus }).eq("id", caseData.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full bg-transparent" variant="outline" className="bg-transparent">
            <Edit className="h-4 w-4 mr-2" />
            Edit Case Details
          </Button>
          <Button className="w-full bg-transparent" variant="outline" className="bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Share Case
          </Button>
          <Button className="w-full bg-transparent" variant="outline" className="bg-transparent">
            <Archive className="h-4 w-4 mr-2" />
            Archive Case
          </Button>
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Status</CardTitle>
          <CardDescription>Change the case status based on new developments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select defaultValue={caseData.status} onValueChange={handleStatusUpdate} disabled={isUpdating}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active - Still Missing</SelectItem>
              <SelectItem value="found">Found - Child Located</SelectItem>
              <SelectItem value="closed">Closed - Case Resolved</SelectItem>
            </SelectContent>
          </Select>

          {caseData.status === "active" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                <p className="text-orange-800 text-sm">Case is active and visible to the public</p>
              </div>
            </div>
          )}

          {caseData.status === "found" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <p className="text-green-800 text-sm">Child has been found and is safe</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Case Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Case Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Days since reported:</span>
            <span className="font-medium">
              {Math.floor((Date.now() - new Date(caseData.created_at).getTime()) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total sightings:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Verified sightings:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Public views:</span>
            <span className="font-medium">-</span>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-lg text-red-900">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <p className="text-red-800 font-medium">Local Police: 911</p>
            <p className="text-red-700">National Center for Missing Children</p>
            <p className="text-red-700">1-800-THE-LOST (1-800-843-5678)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
