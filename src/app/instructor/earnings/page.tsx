"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CreditCard,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Settings,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: string;
  type: "sale" | "payout" | "refund";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "processing";
}

const mockTransactions: Transaction[] = [
  { id: "1", type: "sale", description: "Course Sale - Web Development Bootcamp", amount: 49.99, date: "2026-08-07", status: "completed" },
  { id: "2", type: "sale", description: "Course Sale - React Masterclass", amount: 79.99, date: "2026-08-06", status: "completed" },
  { id: "3", type: "payout", description: "Monthly Payout - July 2026", amount: -2450.00, date: "2026-08-01", status: "completed" },
  { id: "4", type: "sale", description: "Course Sale - UI/UX Design", amount: 39.99, date: "2026-07-30", status: "completed" },
  { id: "5", type: "sale", description: "Course Sale - DevOps Computing", amount: 59.99, date: "2026-07-28", status: "completed" },
  { id: "6", type: "refund", description: "Refund - Web Development Bootcamp", amount: -49.99, date: "2026-07-25", status: "completed" },
  { id: "7", type: "sale", description: "Course Sale - React Masterclass", amount: 79.99, date: "2026-07-22", status: "completed" },
  { id: "8", type: "sale", description: "Course Sale - UI/UX Design", amount: 39.99, date: "2026-07-20", status: "pending" },
];

const monthlyEarnings = [
  { month: "Mar", amount: 3200 },
  { month: "Apr", amount: 4100 },
  { month: "May", amount: 3800 },
  { month: "Jun", amount: 5200 },
  { month: "Jul", amount: 4800 },
  { month: "Aug", amount: 2150 },
];

const maxMonthly = Math.max(...monthlyEarnings.map((m) => m.amount));

export default function InstructorEarningsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalEarnings = 42910;
  const thisMonth = 2150;
  const pending = 39.99;
  const withdrawn = 15000;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="mt-1 text-gray-600">Track your revenue and payouts</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  ${totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-blue-500 p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  ${thisMonth.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </div>
              </div>
              <div className="rounded-xl bg-emerald-500 p-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  ${pending.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl bg-amber-500 p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Withdrawn</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  ${withdrawn.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-rose-500 p-3">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payout">Payout Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly earnings for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-64">
                {monthlyEarnings.map((item) => (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                      ${item.amount.toLocaleString()}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-300"
                      style={{
                        height: `${(item.amount / maxMonthly) * 180}px`,
                      }}
                    />
                    <span className="text-xs text-gray-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                  >
                    <div
                      className={`rounded-xl p-3 ${
                        tx.type === "sale"
                          ? "bg-emerald-500"
                          : tx.type === "refund"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {tx.type === "sale" ? (
                        <ArrowUpRight className="h-5 w-5 text-white" />
                      ) : tx.type === "refund" ? (
                        <ArrowDownRight className="h-5 w-5 text-white" />
                      ) : (
                        <Wallet className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          tx.amount > 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          tx.status === "completed"
                            ? "success"
                            : tx.status === "pending"
                            ? "warning"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payout">
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Payout Method
                </CardTitle>
                <CardDescription>Manage your payout preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">Bank Account</p>
                        <p className="text-sm text-gray-500">**** **** **** 4242</p>
                      </div>
                    </div>
                    <Badge variant="success">Default</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Payout Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
                <CardDescription>Configure automatic payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Frequency</label>
                  <select className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary focus:outline-none">
                    <option>Monthly (1st of each month)</option>
                    <option>Bi-weekly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Minimum Payout</label>
                  <Input type="number" placeholder="50.00" defaultValue="50.00" />
                </div>
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


