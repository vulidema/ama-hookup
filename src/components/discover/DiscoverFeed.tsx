"use client";

import React from "react";
import type { Profile } from "@/types";

interface DiscoverFeedProps {
  hosts: Profile[];
  isLoading: boolean;
}

export default function DiscoverFeed({ hosts, isLoading }: DiscoverFeedProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-96 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {hosts && hosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hosts.map((host) => (
            <div key={host.id} className="text-center">
              <p>{host.display_name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No hosts available right now</p>
        </div>
      )}
    </div>
  );
}