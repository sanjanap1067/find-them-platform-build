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

interface NewCaseFormProps {
  userId: string
}

export function NewCaseForm({ userId }: NewCaseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    description: "",
    last_seen_date: "",
    last_seen_location: "",
    photo_url: "",
    additional_photos: [] as string[],
    contact_info: "",
  })

  const generateCaseNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `MC${timestamp}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const caseNumber = generateCaseNumber()

      const { data, error: submitError } = await supabase.from("missing_children").insert({
        case_number: caseNumber,
        name: formData.name,
        age: Number.parseInt(formData.age),
        gender: formData.gender,
        description: formData.description,
        last_seen_date: formData.last_seen_date,
        last_seen_location: formData.last_seen_location,
        photo_url: formData.photo_url || null,
        additional_photos: formData.additional_photos.length > 0 ? formData.additional_photos : null,
        contact_info: formData.contact_info,
        reported_by: userId,
        status: "active",
      })

      if (submitError) throw submitError

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/cases")
      }, 2000)
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
            <CardTitle className="text-green-900">Case Reported Successfully</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-800 mb-4">
            The missing child case has been created and is now active on the platform. The public can now search for and
            report sightings.
          </p>
          <p className="text-green-700 text-sm">Redirecting to cases management...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Child Information</CardTitle>
        <CardDescription>
          All information will be made public to help locate the child. Please ensure accuracy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="18"
                  value={formData.age}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Last Seen Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Last Seen Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="last_seen_date">Last Seen Date *</Label>
                <Input
                  id="last_seen_date"
                  type="date"
                  value={formData.last_seen_date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, last_seen_date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_seen_location">Last Seen Location *</Label>
                <Input
                  id="last_seen_location"
                  placeholder="Street address, city, state"
                  value={formData.last_seen_location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, last_seen_location: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Physical Description *</Label>
            <Textarea
              id="description"
              placeholder="Height, weight, hair color, eye color, clothing last seen wearing, distinguishing features, etc."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Photos</h3>
            <div>
              <Label htmlFor="photo_url">Primary Photo URL</Label>
              <Input
                id="photo_url"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.photo_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, photo_url: e.target.value }))}
              />
              <p className="text-sm text-gray-600 mt-1">
                Upload photos to a service like Imgur and paste the direct link here.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <Label htmlFor="contact_info">Contact Information *</Label>
            <Textarea
              id="contact_info"
              placeholder="Organization name, phone number, email, or other contact details for the public"
              value={formData.contact_info}
              onChange={(e) => setFormData((prev) => ({ ...prev, contact_info: e.target.value }))}
              rows={3}
              required
            />
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Important Notice</h4>
                <p className="text-blue-800 text-sm">
                  This information will be made public on the FindThem platform to help locate the missing child. Please
                  ensure all details are accurate and appropriate for public viewing.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? "Creating Case..." : "Create Missing Child Case"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
