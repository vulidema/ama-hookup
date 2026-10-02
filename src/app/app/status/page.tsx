"use client";

import React, { useState } from "react";
import { useMyProfile, useSetStatusMessage } from "@/hooks/queries";
import { useSetStatusMessage as useSetStatusMessageExt } from "@/hooks/queries-extended";
import { AppLayout, Toast } from "@/components/layouts";
import { Card, Button, Input } from "@/components/ui";

export default function StatusPage() {
  const { data: profile, isLoading } = useMyProfile();
  const setStatusMutation = useSetStatusMessageExt();
  const [statusMessage, setStatusMessage] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  React.useEffect(() => {
    if (profile?.status_message) {
      setStatusMessage(profile.status_message);
    }
  }, [profile]);

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setStatusMutation.mutateAsync(statusMessage || null);
      setToast({
        message: "Status updated!",
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
          <h1 className="text-2xl font-bold text-gray-900">Status Message</h1>
          <p className="text-gray-600 text-sm">Let people know what you're up to</p>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSaveStatus} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                What's on your mind?
              </label>
              <textarea
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                maxLength={100}
                placeholder="E.g., 'Free for chat tonight!'"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                {statusMessage.length}/100 characters
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                isLoading={setStatusMutation.isPending}
              >
                Save Status
              </Button>
              {statusMessage && (
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setStatusMessage("")}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
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
