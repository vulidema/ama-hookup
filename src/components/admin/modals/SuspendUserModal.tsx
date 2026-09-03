"use client";

import React, { useState } from "react";
import { useSuspendUser } from "@/hooks/mutations";
import { Modal, Button, Input, Textarea } from "@/components/ui";

interface SuspendUserModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SuspendUserModal({
  userId,
  isOpen,
  onClose,
}: SuspendUserModalProps) {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("7");
  const suspendMutation = useSuspendUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await suspendMutation.mutateAsync({
        userId,
        reason,
        duration: parseInt(duration),
      });
      onClose();
    } catch (error) {
      console.error("Failed to suspend user:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Duration (days)
          </label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            max="365"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Reason
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain the reason for suspension..."
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="tertiary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={suspendMutation.isPending}
          >
            Suspend User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
