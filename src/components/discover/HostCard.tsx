"use client";

import React from "react";
import { Button, Card } from "@/components/ui";
import type { Profile } from "@/types";

interface HostCardProps {
  host: Profile;
}

export default function HostCard({ host }: HostCardProps) {
  return (
    <Card hover className="cursor-pointer transform hover:scale-105 transition-transform">
      {/* Avatar */}
      <div className="w-full h-48 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-lg overflow-hidden mb-4">
        {host.avatar_url ? (
          <img
            src={host.avatar_url}
            alt={host.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            👤
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {host.display_name}
          </h3>
          {host.is_online && <span className="text-green-500">●</span>}
        </div>
        <p className="text-sm text-gray-600">{host.age} years old</p>
      </div>

      {/* Bio */}
      {host.bio && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{host.bio}</p>
      )}

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        <span className="text-yellow-500">★</span>
        <span className="text-sm font-medium text-gray-900">
          {host.avg_rating.toFixed(1)}
        </span>
        <span className="text-xs text-gray-600">
          ({host.rating_count} ratings)
        </span>
      </div>

      {/* Distance */}
      {host.distance_km && (
        <p className="text-xs text-gray-500 mb-4">
          📍 {host.distance_km.toFixed(1)} km away
        </p>
      )}

      {/* Status */}
      {host.status_message && (
        <p className="text-xs text-gray-600 italic mb-4">
          "{host.status_message}"
        </p>
      )}

      {/* Action Button */}
      <Button className="w-full" size="sm">
        💬 Send Request
      </Button>
    </Card>
  );
}