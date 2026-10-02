"use client";

import React from "react";
import { useMyWaves } from "@/hooks/queries-extended";
import { AppLayout, Loader } from "@/components/layouts";
import { Card, Badge } from "@/components/ui";
import type { Wave } from "@/types";

export default function WavesPage() {
  const { data: waves = [], isLoading } = useMyWaves();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" text="Loading waves..." />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      header={
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waves</h1>
          <p className="text-gray-600 text-sm">
            {waves.length} wave{waves.length !== 1 ? "s" : ""} received
          </p>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {waves && waves.length > 0 ? (
          waves.map((wave: Wave) => (
            <Card key={wave.id} className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {wave.emoji}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(wave.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No waves yet</p>
            <p className="text-sm text-gray-500">
              When someone sends you a wave, it will show up here
            </p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
