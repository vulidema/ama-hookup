"use client";

import React, { useState, useEffect } from "react";
import { useMyProfile, useActiveHostsFeed } from "@/hooks/queries";
import { AppLayout, Loader } from "@/components/layouts";
import { Card, Badge } from "@/components/ui";
import DiscoverFeed from "@/components/discover/DiscoverFeed";
import HostCard from "@/components/discover/HostCard";

export default function DiscoverPage() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState("");

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setGeoError("Please enable location to discover hosts");
        }
      );
    }
  }, []);

  const { data: hosts, isLoading: hostsLoading } = useActiveHostsFeed(
    location?.lat || 0,
    location?.lng || 0,
    50
  );

  if (profileLoading || hostsLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" text="Loading hosts..." />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please complete your profile first</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      header={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
            <p className="text-gray-600 text-sm">
              {hosts?.length || 0} hosts available nearby
            </p>
          </div>
          <div className="flex items-center gap-2">
            {profile?.credit_balance !== undefined && (
              <Badge variant="primary">
                💳 {profile.credit_balance} credits
              </Badge>
            )}
          </div>
        </div>
      }
    >
      {geoError && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          {geoError}
        </div>
      )}

      {hosts && hosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hosts.map((host) => (
            <HostCard key={host.id} host={host} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-4">No hosts available in your area</p>
          <p className="text-sm text-gray-500">
            Check back later or expand your search radius
          </p>
        </Card>
      )}
    </AppLayout>
  );
}