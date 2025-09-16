"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ReportSightingFormProps {
  caseId?: string
}

export function ReportSightingForm({ caseId }: ReportSightingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    case_id: caseId || "",
    reporter_name: "",
    reporter_phone: "",
    reporter_email: "",
    sighting_date: "",
    sighting_location: "",
    description: "",
    photo_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: submitError } = await supabase.from("sightings").insert({
        case_id: formData.case_id,
        reporter_name: formData.reporter_name,
        reporter_phone: formData.reporter_phone,
        reporter_email: formData.reporter_email,
        sighting_date: formData.sighting_date,
        sighting_location: formData.sighting_location,
        description: formData.description,
        photo_url: formData.photo_url || null,
        status: "pending",
      })

      if (submitError) throw submitError

      setSuccess(true)
      setTimeout(() => {
        router.push("/search")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <CardTitle className="text-green-900">Report Submitted Successfully</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-800 mb-4">
            Thank you for your report. It has been submitted to the relevant authorities and will be reviewed promptly.
          </p>
          <p className="text-green-700 text-sm">You will be redirected to the search page in a few seconds...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sighting Report Form</CardTitle>
        <CardDescription>
          Please provide as much detail as possible. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Case Selection */}
          <div>
            <Label htmlFor="case_id">Missing Child Case *</Label>
            <Select
              value={formData.case_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, case_id: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a case or search by name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="case1">John Doe - Age 8</SelectItem>
                <SelectItem value="case2">Jane Smith - Age 12</SelectItem>
                {/* This would be populated dynamically */}
              </SelectContent>
            </Select>
          </div>

          {/* Reporter Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reporter_name">Your Name *</Label>
              <Input
                id="reporter_name"
                value={formData.reporter_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, reporter_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="reporter_phone">Phone Number *</Label>
              <Input
                id="reporter_phone"
                type="tel"
                value={formData.reporter_phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, reporter_phone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reporter_email">Email Address</Label>
            <Input
              id="reporter_email"
              type="email"
              value={formData.reporter_email}
              onChange={(e) => setFormData((prev) => ({ ...prev, reporter_email: e.target.value }))}
            />
          </div>

          {/* Sighting Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sighting_date">Date of Sighting *</Label>
              <Input
                id="sighting_date"
                type="date"
                value={formData.sighting_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, sighting_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="sighting_location">Location *</Label>
              <Input
                id="sighting_location"
                placeholder="Street address, city, landmarks"
                value={formData.sighting_location}
                onChange={(e) => setFormData((prev) => ({ ...prev, sighting_location: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what you saw: the child's appearance, who they were with, what they were doing, direction they were heading, etc."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={5}
              required
            />
          </div>

          <div>
            <Label htmlFor="photo_url">Photo URL (if available)</Label>
            <Input
              id="photo_url"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.photo_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, photo_url: e.target.value }))}
            />
            <p className="text-sm text-gray-600 mt-1">
              If you have photos, upload them to a service like Imgur and paste the link here.
            </p>
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? "Submitting Report..." : "Submit Sighting Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
