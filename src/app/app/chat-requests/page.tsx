"use client";

import React, { useState } from "react";
import { useMyChatRequests, useRespondToChatRequest, useProfile } from "@/hooks/queries";
import { AppLayout, Loader, Toast } from "@/components/layouts";
import { Card, Badge, Button } from "@/components/ui";

export default function ChatRequestsPage() {
  const { data: requests = [], isLoading } = useMyChatRequests();
  const respondMutation = useRespondToChatRequest();
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const handleRespond = async (requestId: string, action: "accept" | "decline") => {
    try {
      await respondMutation.mutateAsync({ requestId, action });
      setToast({
        message: `Request ${action}ed!`,
        type: "success",
      });
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to respond",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" text="Loading requests..." />
        </div>
      </AppLayout>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <AppLayout
      header={
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat Requests</h1>
          <p className="text-gray-600 text-sm">
            {pendingRequests.length} pending request
            {pendingRequests.length !== 1 ? "s" : ""}
          </p>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pending Requests
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <ChatRequestCard
                  key={request.id}
                  request={request}
                  onRespond={handleRespond}
                  isLoading={respondMutation.isPending}
                />
              ))}
            </div>
          </div>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              History
            </h2>
            <div className="space-y-3">
              {processedRequests.map((request) => (
                <ChatRequestCard
                  key={request.id}
                  request={request}
                  onRespond={handleRespond}
                  isLoading={respondMutation.isPending}
                  isDisabled={true}
                />
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No chat requests yet</p>
            <p className="text-sm text-gray-500">
              Go to discover and start connecting with people!
            </p>
          </Card>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
}

interface ChatRequestCardProps {
  request: any;
  onRespond: (id: string, action: "accept" | "decline") => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

function ChatRequestCard({
  request,
  onRespond,
  isLoading,
  isDisabled,
}: ChatRequestCardProps) {
  const { data: sender } = useProfile(
    request.status === "pending" ? request.member_id : request.host_id
  );

  const statusColors = {
    pending: "bg-yellow-50 border-yellow-200",
    accepted: "bg-green-50 border-green-200",
    declined: "bg-red-50 border-red-200",
  };

  const statusBadgeVariants = {
    pending: "warning" as const,
    accepted: "success" as const,
    declined: "danger" as const,
  };

  return (
    <Card className={`${statusColors[request.status]} border`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
            {sender?.avatar_url ? (
              <img
                src={sender.avatar_url}
                alt={sender.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">
                👤
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {sender?.display_name}
            </h3>
            <p className="text-xs text-gray-600">
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge variant={statusBadgeVariants[request.status]}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </div>

      {/* Intro Text */}
      <div className="mb-4 p-3 bg-white bg-opacity-50 rounded border border-gray-200">
        <p className="text-sm text-gray-700">{request.intro_text}</p>
      </div>

      {/* Actions */}
      {request.status === "pending" && !isDisabled && (
        <div className="flex gap-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => onRespond(request.id, "decline")}
            disabled={isLoading}
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={() => onRespond(request.id, "accept")}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Accept & Chat
          </Button>
        </div>
      )}
    </Card>
  );
}