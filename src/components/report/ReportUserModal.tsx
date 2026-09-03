"use client";

import React, { useState } from "react";
import { useProfile } from "@/hooks/queries";
import { useReportUser } from "@/hooks/credit-report";
import { Modal, Toast } from "@/components/layouts";
import { Button, Input, Textarea } from "@/components/ui";

interface ReportUserModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

type ReportReason = "harassment" | "inappropriate" | "scam" | "other";

export default function ReportUserModal({
  userId,
  isOpen,
  onClose,
}: ReportUserModalProps) {
  const { data: user } = useProfile(userId);
  const reportUserMutation = useReportUser();

  const [reason, setReason] = useState<ReportReason>("harassment");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await reportUserMutation.mutateAsync({
        reportedId: userId,
        reason,
        details: details || undefined,
      });
      setToast({
        message: "Report submitted. Thank you for helping keep AMA Hookup safe.",
        type: "success",
      });
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {user && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              You're reporting <strong>{user.display_name}</strong>
            </p>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Report *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as ReportReason)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="harassment">Harassment or threatening behavior</option>
            <option value="inappropriate">Inappropriate or offensive content</option>
            <option value="scam">Scam or fraud</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Details */}
        <Textarea
          label="Details (Optional)"
          placeholder="Please provide any additional details about the issue"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          maxLength={1000}
          disabled={reportUserMutation.isPending}
          rows={4}
        />
        <p className="text-xs text-gray-500">
          {details.length}/1000 characters
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Notice */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-xs">
          <p className="font-medium mb-1">⚠️ Important</p>
          <p>
            False reports may result in account suspension. We take reports
            seriously and will investigate.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="tertiary"
            onClick={onClose}
            disabled={reportUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={reportUserMutation.isPending}
            variant="danger"
          >
            Submit Report
          </Button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Modal>
  );
}