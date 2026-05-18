import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: pendingVendors, isLoading, refetch } = trpc.admin.getPendingVendors.useQuery();
  
  const approveVendor = trpc.vendors.approve.useMutation({
    onSuccess: () => {
      refetch();
      alert("Vendor approved!");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  const rejectVendor = trpc.vendors.reject.useMutation({
    onSuccess: () => {
      refetch();
      alert("Vendor rejected!");
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading pending vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Review and approve street food vendors</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingVendors?.length || 0}</p>
              </div>
              <AlertCircle size={32} className="text-yellow-600" />
            </div>
          </Card>
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-3xl font-bold text-blue-600">-</p>
              </div>
              <CheckCircle size={32} className="text-blue-600" />
            </div>
          </Card>
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">-</p>
              </div>
              <XCircle size={32} className="text-red-600" />
            </div>
          </Card>
        </div>

        {/* Pending Vendors List */}
        <Card className="bg-white shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Pending Vendor Approvals</h2>

          {pendingVendors && pendingVendors.length > 0 ? (
            <div className="space-y-4">
              {pendingVendors.map((vendor) => (
                <div key={vendor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{vendor.name}</h3>
                      
                      {vendor.foodType && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Food Type:</span> {vendor.foodType}
                        </p>
                      )}

                      {vendor.description && (
                        <p className="text-sm text-gray-700 mb-3">{vendor.description}</p>
                      )}

                      {vendor.address && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                          <span>{vendor.address}</span>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(vendor.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <Badge className="bg-yellow-500 text-white">Pending</Badge>
                  </div>

                  {/* Coordinates */}
                  <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span> {vendor.latitude.toFixed(4)}, {vendor.longitude.toFixed(4)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => rejectVendor.mutate(vendor.id)}
                      disabled={rejectVendor.isPending}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => approveVendor.mutate(vendor.id)}
                      disabled={approveVendor.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <p className="text-gray-600 text-lg">No pending vendors to review!</p>
              <p className="text-gray-500 mt-2">All vendors have been approved.</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
