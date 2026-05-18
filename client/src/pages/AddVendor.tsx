import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function AddVendor() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    foodType: "",
    description: "",
    address: "",
    latitude: 0,
    longitude: 0,
  });

  const createVendor = trpc.vendors.create.useMutation({
    onSuccess: (result) => {
      alert("Vendor submitted successfully! It will be reviewed by admins.");
      navigate("/");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.latitude || !formData.longitude) {
      alert("Please fill in all required fields");
      return;
    }
    createVendor.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-2">
              <ArrowLeft size={20} className="mr-2" /> Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-white shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Vendor</h1>
          <p className="text-gray-600 mb-8">Help us build a safer street food community by adding a vendor</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vendor Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vendor Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Raj's Samosa Corner"
                required
              />
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Type
              </label>
              <Input
                type="text"
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                placeholder="e.g., Samosas, Chaat, Biryani"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about this vendor..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address or landmark"
              />
            </div>

            {/* Location */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-4">
                <MapPin size={16} className="inline mr-2" />
                Note: In a full app, you would use Google Maps to set the location. For now, please enter coordinates.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <Input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 28.7041"
                    step="0.0001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <Input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 77.1025"
                    step="0.0001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={createVendor.isPending}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                {createVendor.isPending ? "Submitting..." : "Submit Vendor"}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Submitted vendors will be reviewed by administrators before appearing on the map.
          </p>
        </Card>
      </main>
    </div>
  );
}
