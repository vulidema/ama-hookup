"use client";

import React, { useState } from "react";
import { useAuditLogs } from "@/hooks/queries";
import { Card, Badge, Loader, Input } from "@/components/ui";
import { CalendarIcon } from "lucide-react";

export default function AuditLogs() {
  const [filter, setFilter] = useState<"all" | "user" | "content" | "system">("all");
  const { data: logs = [], isLoading } = useAuditLogs(filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  const getActionBadge = (action: string) => {
    const typeMap: Record<string, "success" | "warning" | "danger" | "primary"> = {
      user_created: "success",
      user_updated: "primary",
      user_suspended: "danger",
      content_removed: "danger",
      report_resolved: "success",
    };
    return typeMap[action] || "primary";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-6">
        {(["all", "user", "content", "system"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {logs.map((log) => (
          <Card key={log.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getActionBadge(log.action)}>
                    {log.action}
                  </Badge>
                  <span className="text-sm text-gray-600">{log.admin_name}</span>
                </div>
                <p className="text-gray-900 text-sm">{log.description}</p>
              </div>
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <CalendarIcon className="w-4 h-4" />
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
