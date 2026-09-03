"use client";

import React, { useState } from "react";
import { useMyProfile, useSendChatRequest, useProfile } from "@/hooks/queries";
import { Modal, Toast } from "@/components/layouts";
import { Button, Input, Textarea } from "@/components/ui";

interface ChatRequestModalProps {
  hostId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatRequestModal({
  hostId,
  isOpen,
  onClose,
}: ChatRequestModalProps) {
  const { data: profile } = useMyProfile();
  const { data: host } = useProfile(hostId);
  const sendRequestMutation = useSendChatRequest();

  const [introText, setIntroText] = useState("");
  const [error, setError] = useState("");

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!introText.trim()) {
      setError("Please write an introduction");
      return;
    }

    try {
      await sendRequestMutation.mutateAsync({
        hostId,
        introText,
      });
      onClose();
      setIntroText("");
    } catch (err: any) {
      setError(err.message || "Failed to send request");
    }
  };

  const creditCost = 1;
  const hasEnoughCredits = (profile?.credit_balance || 0) >= creditCost;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Chat Request" size="md">
      <form onSubmit={handleSendRequest} className="space-y-4">
        {/* Host Info */}
        {host && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              You're sending a request to <strong>{host.display_name}</strong>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              This will cost <strong>{creditCost} credit</strong>
            </p>
          </div>
        )}

        {/* Credit Check */}
        {!hasEnoughCredits && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Insufficient credits. You have {profile?.credit_balance || 0} credit
              {profile?.credit_balance !== 1 ? "s" : ""}.
            </p>
          </div>
        )}

        {/* Intro Text */}
        <Textarea
          label="Your Introduction"
          placeholder="Tell them a bit about yourself. Why would they want to chat with you?"
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
          maxLength={500}
          disabled={sendRequestMutation.isPending}
          required
        />
        <p className="text-xs text-gray-500">
          {introText.length}/500 characters
        </p>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="tertiary"
            onClick={onClose}
            disabled={sendRequestMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={sendRequestMutation.isPending}
            disabled={!hasEnoughCredits || !introText.trim()}
          >
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}