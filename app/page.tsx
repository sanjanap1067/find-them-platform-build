import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Heart, Users, Shield } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // Get recent cases for display
  const { data: recentCases } = await supabase
    .from("missing_children")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">FindThem</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-600 hover:text-blue-600 transition-colors">
              Search
            </Link>
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
            <Link href="/auth/register">
              <Button size="sm">Register NGO</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Help Bring Missing Children Home</h2>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            A trusted platform connecting NGOs, police, and communities to locate missing children safely and
            efficiently.
          </p>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <Input placeholder="Search by name, location, or case number..." className="flex-1 h-12 text-lg" />
              <Button size="lg" className="h-12 px-8">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
              <div className="text-gray-600">Children Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">156</div>
              <div className="text-gray-600">Active NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
              <div className="text-gray-600">Police Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Cases */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Recent Missing Children</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help us find these children by sharing their information or reporting any sightings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentCases?.map((child) => (
              <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 relative">
                  {child.photo_url ? (
                    <img
                      src={child.photo_url || "/placeholder.svg"}
                      alt={child.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Photo Available
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{child.name}</CardTitle>
                  <CardDescription>
                    Age: {child.age} • Last seen: {new Date(child.last_seen_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{child.last_seen_location}</p>
                  <Link href={`/case/${child.id}`}>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/search">
              <Button size="lg">View All Cases</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How FindThem Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects verified organizations with the community to maximize search efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Verified Organizations</h4>
              <p className="text-gray-600">
                Only verified NGOs and police departments can post missing children cases, ensuring authenticity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Community Involvement</h4>
              <p className="text-gray-600">
                Anyone can search cases and report sightings, expanding the search network exponentially.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Safe & Secure</h4>
              <p className="text-gray-600">
                All data is protected with enterprise-grade security, and sensitive information is carefully managed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6" />
                <span className="text-xl font-bold">FindThem</span>
              </div>
              <p className="text-gray-400">Connecting communities to bring missing children home safely.</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">For Public</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/search" className="hover:text-white transition-colors">
                    Search Cases
                  </Link>
                </li>
                <li>
                  <Link href="/report" className="hover:text-white transition-colors">
                    Report Sighting
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white transition-colors">
                    Safety Tips
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">For Organizations</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/auth/register" className="hover:text-white transition-colors">
                    Register NGO
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-white transition-colors">
                    Verification Process
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FindThem. All rights reserved. Built with care for missing children and their families.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
