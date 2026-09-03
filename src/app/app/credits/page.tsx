"use client";

import React, { useState } from "react";
import { useCreditBalance, useCreditTransactions } from "@/hooks/credit-report";
import { AppLayout, Loader } from "@/components/layouts";
import { Card, Badge } from "@/components/ui";

export default function CreditsPage() {
  const { data: balance, isLoading: balanceLoading } = useCreditBalance();
  const { data: transactions = [], isLoading: transactionsLoading } =
    useCreditTransactions();

  if (balanceLoading || transactionsLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" text="Loading credits..." />
        </div>
      </AppLayout>
    );
  }

  const expiryDate = balance?.credits_expire_at
    ? new Date(balance.credits_expire_at)
    : null;
  const isExpired = expiryDate && expiryDate < new Date();

  return (
    <AppLayout
      header={
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credits</h1>
          <p className="text-gray-600 text-sm">Manage your account credits</p>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Credit Balance Card */}
        <Card className="bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">Available Credits</p>
            <p className="text-5xl font-bold text-primary-500 mb-4">
              {balance?.credit_balance || 0}
            </p>
            {expiryDate && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Expires on {expiryDate.toLocaleDateString()}
                </p>
                {isExpired && (
                  <Badge variant="danger">Expired</Badge>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Info */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            How Credits Work
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900">💬 Chat Requests</p>
              <p>Each chat request costs 1 credit</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">📝 Signup Bonus</p>
              <p>Get 500 free credits when you sign up</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">⏰ Expiration</p>
              <p>
                Credits expire at the end of the year. Use them or lose them!
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-900">🔄 Refunds</p>
              <p>
                If a host declines your request, you get your credit back
              </p>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Transaction History
            </h2>
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.reason}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      transaction.delta > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.delta > 0 ? "+" : ""}{transaction.delta}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {transactions.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No transactions yet</p>
            <p className="text-sm text-gray-500">
              Start sending chat requests to use your credits
            </p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}