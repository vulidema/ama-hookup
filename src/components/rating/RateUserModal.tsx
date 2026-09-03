"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useConversation, useRateUser, useProfile } from "@/hooks/queries";
import { Modal, Toast } from "@/components/layouts";
import { Button, Card } from "@/components/ui";

interface RateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

export default function RateUserModal({
  isOpen,
  onClose,
  conversationId,
}: RateUserModalProps) {
  const { data: conversation } = useConversation(conversationId);
  const rateUserMutation = useRateUser();
  const [selectedRating, setSelectedRating] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const handleRate = async (rating: number) => {
    try {
      const ratedId = conversation?.host_id || conversation?.member_id;
      await rateUserMutation.mutateAsync({
        ratedId,
        conversationId,
        rating,
      });
      setToast({ message: "Thanks for rating!", type: "success" });
      setTimeout(() => onClose(), 1500);
    } catch (error: any) {
      setToast({ message: error.message || "Failed to rate", type: "error" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate This User" size="sm">
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          How was your experience with this person?
        </p>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              className={`text-4xl transition-transform hover:scale-110 ${
                star <= selectedRating ? "text-yellow-400" : "text-gray-300"
              }`}
              disabled={rateUserMutation.isPending}
            >
              ★
            </button>
          ))}
        </div>

        {/* Feedback Text */}
        <p className="text-xs text-gray-500 text-center">
          Click a star to rate (1 = Poor, 5 = Excellent)
        </p>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="tertiary"
            onClick={onClose}
            disabled={rateUserMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>

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