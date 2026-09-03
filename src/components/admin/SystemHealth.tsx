"use client";

import React from "react";
import { useSystemHealth } from "@/hooks/queries";
import { Card, Badge, Loader } from "@/components/ui";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function SystemHealth() {
  const { data: health, isLoading } = useSystemHealth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  const getStatusIcon = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "critical":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return <Badge variant="success">Healthy</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      case "critical":
        return <Badge variant="danger">Critical</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall System Status</h3>
        <div className="flex items-center gap-4">
          {getStatusIcon(health?.overall_status || "healthy")}
          <div>
            <p className="text-2xl font-bold text-gray-900">{health?.uptime}%</p>
            <p className="text-gray-600 text-sm">System uptime</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {health?.services?.map((service) => (
          <Card key={service.name} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900">{service.name}</p>
              {getStatusBadge(service.status)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Response Time</span>
                <span className="text-gray-900 font-medium">{service.response_time}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Error Rate</span>
                <span className="text-gray-900 font-medium">{service.error_rate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: `${100 - service.error_rate}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
