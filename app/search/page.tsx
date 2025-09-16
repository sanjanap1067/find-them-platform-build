import { Suspense } from "react"
import { SearchFilters } from "@/components/search-filters"
import { SearchResults } from "@/components/search-results"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import Link from "next/link"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    age_min?: string
    age_max?: string
    gender?: string
    location?: string
    date_from?: string
    date_to?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FindThem</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/report" className="text-gray-600 hover:text-blue-600 transition-colors">
                Report Sighting
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Missing Children</h1>
          <p className="text-gray-600">
            Search through active missing children cases. Every search helps expand awareness.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form method="GET" action="/search" className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, location, or case number..."
                defaultValue={params.q}
                name="q"
                className="h-12 text-lg"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <Suspense fallback={<div>Loading filters...</div>}>
                <SearchFilters searchParams={params} />
              </Suspense>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading results...</div>}>
              <SearchResults searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
