"use client";

import React, { useState } from "react";
import { useAdminUsers } from "@/hooks/queries";
import { Card, Button, Badge, Loader, Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import SuspendUserModal from "./modals/SuspendUserModal";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [suspendUserId, setSuspendUserId] = useState<string | null>(null);
  const { data: users = [], isLoading } = useAdminUsers(search);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search users by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{user.display_name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex gap-2 mt-2">
                {user.status === "suspended" && (
                  <Badge variant="danger">Suspended</Badge>
                )}
                {user.email_verified && (
                  <Badge variant="success">Verified</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setSuspendUserId(user.id)}
                disabled={user.status === "suspended"}
              >
                {user.status === "suspended" ? "Suspended" : "Suspend"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {suspendUserId && (
        <SuspendUserModal
          userId={suspendUserId}
          isOpen={!!suspendUserId}
          onClose={() => setSuspendUserId(null)}
        />
      )}
    </div>
  );
}
