"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
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

export default function InstructorEarningsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);
  const [pending, setPending] = useState(0);
  const [withdrawn, setWithdrawn] = useState(0);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch("/api/instructor/earnings");
        if (res.ok) {
           const data = await res.json();
          const e = data.earnings || {};
          setTotalEarnings(e.totalEarnings || 0);
          setThisMonth(e.thisMonth || 0);
          setPending(e.pending || 0);
          setWithdrawn(e.withdrawn || 0);
          setMonthlyData(e.monthlyData || []);
          setTransactions(e.transactions || []);
        }
      } catch {
        // Use empty state
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  const maxMonthly = Math.max(...monthlyData.map((m) => m.amount), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="mt-1 text-gray-600">Track your revenue and payouts</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => {
          const csv = ["Month,Amount", ...monthlyData.map(m => `${m.month},${m.amount}`)].join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = "earnings-report.csv";
          document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        }}>
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
                  {loading ? "—" : `₦${totalEarnings.toLocaleString()}`}
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
                  {loading ? "—" : `₦${thisMonth.toLocaleString()}`}
                </p>
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
                  ₦{pending.toLocaleString()}
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
                  ₦{withdrawn.toLocaleString()}
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
                {monthlyData.map((item) => (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                      ₦{item.amount.toLocaleString()}
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
              {loading ? (
                <div className="flex justify-center py-8 text-gray-400">Loading...</div>
              ) : transactions.length === 0 ? (
                <div className="flex justify-center py-8 text-gray-400">No transactions yet</div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
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
                          {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toFixed(2)}
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
              )}
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
                <Button variant="outline" className="w-full gap-2" onClick={() => toast("Payout method setup is not yet available. Please check back soon.", { icon: "🚧" })}>
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
                <Button className="w-full" onClick={() => toast("Payout settings are not yet available. This feature is under development.", { icon: "🚧" })}>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
