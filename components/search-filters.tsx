"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface SearchFiltersProps {
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

export function SearchFilters({ searchParams }: SearchFiltersProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const [filters, setFilters] = useState({
    age_min: searchParams.age_min || "",
    age_max: searchParams.age_max || "",
    gender: searchParams.gender || "",
    location: searchParams.location || "",
    date_from: searchParams.date_from || "",
    date_to: searchParams.date_to || "",
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams(currentSearchParams.toString())

    // Add current search query
    if (searchParams.q) {
      params.set("q", searchParams.q)
    }

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      age_min: "",
      age_max: "",
      gender: "",
      location: "",
      date_from: "",
      date_to: "",
    })

    const params = new URLSearchParams()
    if (searchParams.q) {
      params.set("q", searchParams.q)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Age Range */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Age Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={filters.age_min}
            onChange={(e) => handleFilterChange("age_min", e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Max"
            type="number"
            value={filters.age_max}
            onChange={(e) => handleFilterChange("age_max", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Gender</Label>
        <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
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

      {/* Location */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Location</Label>
        <Input
          placeholder="City, state, or region"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        />
      </div>

      {/* Date Range */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Last Seen Date</Label>
        <div className="space-y-2">
          <Input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange("date_from", e.target.value)}
            className="text-sm"
          />
          <Input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange("date_to", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
          Clear All
        </Button>
      </div>
    </div>
  )
}
