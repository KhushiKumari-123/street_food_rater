import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Search } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const { data: vendors, isLoading } = trpc.vendors.list.useQuery(
    selectedGrade ? { search, grade: selectedGrade } : { search }
  );

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-500";
      case "B":
        return "bg-blue-500";
      case "C":
        return "bg-yellow-500";
      case "D":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-orange-600">🍲 Street Food Safety Rater</h1>
          <p className="text-gray-600 mt-1">Rate and review street food vendors in your area</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Search vendors by name or food type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link href="/add-vendor">
              <Button className="bg-orange-600 hover:bg-orange-700">
                + Add Vendor
              </Button>
            </Link>
          </div>

          {/* Grade Filter */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 self-center">Filter by Grade:</span>
            {["A", "B", "C", "D"].map((grade) => (
              <Button
                key={grade}
                variant={selectedGrade === grade ? "default" : "outline"}
                onClick={() => setSelectedGrade(selectedGrade === grade ? null : grade)}
                className={`${
                  selectedGrade === grade
                    ? getGradeColor(grade) + " text-white"
                    : ""
                }`}
              >
                Grade {grade}
              </Button>
            ))}
          </div>
        </div>

        {/* Vendors Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading vendors...</p>
          </div>
        ) : vendors && vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <a href={`/vendor/${vendor.id}`} className="block">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex-1">{vendor.name}</h3>
                      <Badge className={`${getGradeColor(vendor.grade)} text-white text-lg px-3 py-1`}>
                        {vendor.grade}
                      </Badge>
                    </div>

                    {vendor.foodType && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Type:</span> {vendor.foodType}
                      </p>
                    )}

                    {vendor.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {vendor.description}
                      </p>
                    )}

                    {vendor.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{vendor.address}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={18} />
                        <span className="font-semibold text-gray-800">
                          {vendor.safetyScore ? vendor.safetyScore.toFixed(1) : "N/A"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">/ 100</span>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No vendors found. Be the first to add one!</p>
            <Link href="/add-vendor">
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                Add First Vendor
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
