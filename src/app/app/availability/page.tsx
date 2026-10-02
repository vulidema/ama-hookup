"use client";

import React, { useState } from "react";
import { useMyProfile, useSetOnlineStatus } from "@/hooks/queries";
import { useSetOnlineStatus as useSetOnlineStatusExt } from "@/hooks/queries-extended";
import { AppLayout, Toast } from "@/components/layouts";
import { Card, Badge, Button } from "@/components/ui";

export default function AvailabilityPage() {
  const { data: profile, isLoading } = useMyProfile();
  const setStatusMutation = useSetOnlineStatusExt();
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const handleToggleStatus = async () => {
    try {
      const newStatus = !(profile?.is_online ?? false);
      await setStatusMutation.mutateAsync(newStatus);
      setToast({
        message: `You are now ${newStatus ? "online" : "offline"}!`,
        type: "success",
      });
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to update status",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      header={
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-600 text-sm">Let people know when you're available</p>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Online Status</h2>
              <p className="text-gray-600 text-sm">Show that you're available for chat</p>
            </div>
            <div className="flex items-center gap-3">
              {profile?.is_online && <Badge variant="success">Online</Badge>}
              <Button
                variant={profile?.is_online ? "danger" : "primary"}
                onClick={handleToggleStatus}
                isLoading={setStatusMutation.isPending}
              >
                {profile?.is_online ? "Go Offline" : "Go Online"}
              </Button>
            </div>
          </div>
        </Card>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
