"use client";

import React, { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { AppLayout } from "@/components/layouts";
import { Button, Card, Badge } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStats from "@/components/admin/AdminStats";
import UserManagement from "@/components/admin/UserManagement";
import ReportedContent from "@/components/admin/ReportedContent";
import SystemHealth from "@/components/admin/SystemHealth";
import AuditLogs from "@/components/admin/AuditLogs";

export default function AdminPage() {
  const { isAdmin, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading admin panel...</p>
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold">Access Denied</p>
          <p className="text-gray-600 mt-2">
            You do not have permission to access the admin panel.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Badge variant="danger">Admin</Badge>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportedContent />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemHealth />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
