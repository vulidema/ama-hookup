"use client";

import React, { useMemo } from "react";
import { useAdminStats } from "@/hooks/queries";
import { Card, Loader } from "@/components/ui";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminStats() {
  const { data: stats, isLoading } = useAdminStats();

  const userGrowthData = useMemo(
    () => stats?.user_growth_7d || [],
    [stats?.user_growth_7d]
  );

  const conversionMetrics = useMemo(
    () => stats?.conversion_metrics || {},
    [stats?.conversion_metrics]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-gray-600 text-sm font-medium">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats?.total_users.toLocaleString()}
          </p>
          <p className="text-green-600 text-sm mt-1">+{stats?.users_this_month} this month</p>
        </Card>

        <Card className="p-6">
          <p className="text-gray-600 text-sm font-medium">Active Conversations</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats?.active_conversations.toLocaleString()}
          </p>
          <p className="text-blue-600 text-sm mt-1">{stats?.response_rate}% response rate</p>
        </Card>

        <Card className="p-6">
          <p className="text-gray-600 text-sm font-medium">Reported Content</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats?.reported_content_count}
          </p>
          <p className="text-orange-600 text-sm mt-1">{stats?.pending_reports} pending</p>
        </Card>

        <Card className="p-6">
          <p className="text-gray-600 text-sm font-medium">System Health</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.system_health}%</p>
          <p className="text-gray-600 text-sm mt-1">All systems operational</p>
        </Card>
      </div>

      {/* Charts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth (7 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Signup → Profile</p>
            <p className="text-2xl font-bold text-gray-900">{conversionMetrics.signup_to_profile}%</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Profile → Match</p>
            <p className="text-2xl font-bold text-gray-900">{conversionMetrics.profile_to_match}%</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Match → Message</p>
            <p className="text-2xl font-bold text-gray-900">{conversionMetrics.match_to_message}%</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Message → Meetup</p>
            <p className="text-2xl font-bold text-gray-900">{conversionMetrics.message_to_meetup}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
