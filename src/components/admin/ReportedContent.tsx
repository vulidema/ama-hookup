"use client";

import React, { useState } from "react";
import { useReportedContent, useResolveReport } from "@/hooks/queries";
import { Card, Button, Badge, Loader } from "@/components/ui";

export default function ReportedContent() {
  const [filter, setFilter] = useState<"pending" | "resolved" | "all">("pending");
  const { data: reports = [], isLoading } = useReportedContent(filter);
  const resolveReportMutation = useResolveReport();

  const handleResolve = async (reportId: string, action: "dismiss" | "remove" | "suspend") => {
    try {
      await resolveReportMutation.mutateAsync({
        reportId,
        action,
      });
    } catch (error) {
      console.error("Failed to resolve report:", error);
    }
  };

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
        {(["pending", "resolved", "all"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "primary" : "tertiary"}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <Card key={report.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={report.status === "pending" ? "warning" : "success"}>
                    {report.status}
                  </Badge>
                  <span className="text-sm text-gray-600">{report.reason}</span>
                </div>
                <p className="text-gray-900 font-semibold">{report.content_snippet}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Reported by: {report.reporter_name}
                </p>
              </div>
              {report.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => handleResolve(report.id, "dismiss")}
                  >
                    Dismiss
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleResolve(report.id, "remove")}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
