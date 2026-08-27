"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useConversation, useMessages, useSendMessage } from "@/hooks/queries";
import { AppLayout, Modal, Loader } from "@/components/layouts";
import { Button, Input, Card } from "@/components/ui";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.id as string;

  const { data: conversation, isLoading: convLoading } =
    useConversation(conversationId);
  const { data: messages = [], isLoading: messagesLoading } =
    useMessages(conversationId);
  const sendMessageMutation = useSendMessage();

  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        body: messageInput,
      });
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (convLoading || messagesLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" text="Loading chat..." />
        </div>
      </AppLayout>
    );
  }

  if (!conversation) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Conversation not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto h-full flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div
                className={`flex-1 ${
                  message.sender_id === conversation.member_id
                    ? "text-left"
                    : "text-right"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg max-w-xs ${
                    message.sender_id === conversation.member_id
                      ? "bg-gray-100 text-gray-900"
                      : "bg-primary-500 text-white"
                  }`}
                >
                  <p className="text-sm">{message.body}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            isLoading={sendMessageMutation.isPending}
            disabled={!messageInput.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}