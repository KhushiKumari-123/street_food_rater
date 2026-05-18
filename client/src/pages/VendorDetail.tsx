import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ArrowLeft, MessageSquare } from "lucide-react";
import { useState } from "react";
import RatingForm from "@/components/RatingForm";

export default function VendorDetail() {
  const params = useParams();
  const vendorId = parseInt(params.id as string);
  const [showRatingForm, setShowRatingForm] = useState(false);

  const { data, isLoading } = trpc.vendors.getById.useQuery(
    vendorId || 0
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!data?.vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Vendor not found</p>
          <Link href="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { vendor, ratings, photos } = data;
  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + (r.hygiene + r.foodHandling + r.waterSource + r.wasteDisposal) / 4, 0) / ratings.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft size={20} className="mr-2" /> Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Vendor Header */}
        <Card className="bg-white shadow-lg mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{vendor.name}</h1>
                <Badge className={`${getGradeColor(vendor.grade)} text-white text-lg px-3 py-1`}>
                  Grade {vendor.grade}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-orange-600">
                  {vendor.safetyScore ? vendor.safetyScore.toFixed(1) : "N/A"}
                </div>
                <div className="text-sm text-gray-600">Safety Score / 100</div>
              </div>
            </div>

            {vendor.foodType && (
              <p className="text-lg text-gray-700 mb-3">
                <span className="font-semibold">Food Type:</span> {vendor.foodType}
              </p>
            )}

            {vendor.description && (
              <p className="text-gray-700 mb-4">{vendor.description}</p>
            )}

            {vendor.address && (
              <div className="flex items-start gap-2 text-gray-700 mb-6">
                <MapPin size={20} className="mt-1 flex-shrink-0 text-orange-600" />
                <span>{vendor.address}</span>
              </div>
            )}

            <Button
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {showRatingForm ? "Cancel" : "Rate This Vendor"}
            </Button>
          </div>
        </Card>

        {/* Rating Form */}
        {showRatingForm && (
          <Card className="bg-white shadow-lg mb-8 p-8">
            <h2 className="text-2xl font-bold mb-6">Submit Your Rating</h2>
            <RatingForm vendorId={vendorId} onSuccess={() => setShowRatingForm(false)} />
          </Card>
        )}

        {/* Ratings Section */}
        <Card className="bg-white shadow-lg mb-8 p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare size={24} />
            Ratings ({ratings.length})
          </h2>

          {ratings.length > 0 ? (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-l-4 border-orange-500 pl-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => {
                        const avgRating = Math.round((rating.hygiene + rating.foodHandling + rating.waterSource + rating.wasteDisposal) / 4);
                        return (
                          <Star
                            key={i}
                            size={16}
                            className={i < avgRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-700">{rating.comment}</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-semibold text-blue-700">{rating.hygiene}/5</span>
                      <div className="text-xs text-gray-600">Hygiene</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <span className="font-semibold text-green-700">{rating.foodHandling}/5</span>
                      <div className="text-xs text-gray-600">Food Handling</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <span className="font-semibold text-purple-700">{rating.waterSource}/5</span>
                      <div className="text-xs text-gray-600">Water Source</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded">
                      <span className="font-semibold text-orange-700">{rating.wasteDisposal}/5</span>
                      <div className="text-xs text-gray-600">Waste Disposal</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No ratings yet. Be the first to rate this vendor!</p>
          )}
        </Card>

        {/* Photos Section */}
        {photos && photos.length > 0 && (
          <Card className="bg-white shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src={photo.url}
                    alt="Vendor photo"
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
