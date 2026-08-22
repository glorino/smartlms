"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const roles = [
  { value: "STUDENT", label: "Student" },
  { value: "INSTRUCTOR", label: "Instructor" },
  { value: "ADMIN", label: "Admin" },
];

export default function AdminNewUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (res.ok) {
        toast.success("User created successfully!");
        router.push("/admin/users");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create user");
      }
    } catch {
      toast.error("Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="mt-1 text-gray-600">Create a new user account on the platform</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Fill in the information below to create a new user</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="gap-2" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                {saving ? "Creating..." : "Create User"}
              </Button>
              <Link href="/admin/users">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
