"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Trash2,
  Camera,
  Save,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    quizResults: true,
    certificates: true,
    marketing: false,
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: (session.user as any).name || "",
        email: (session.user as any).email || "",
      });
    }
    setLoading(false);
  }, [session]);

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/auth/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      if (res.ok) {
        await updateSession({ user: { name: profile.name, email: profile.email } });
      }
    } catch {
      // handle error
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveNotifications = async () => {
    try {
      const res = await fetch("/api/auth/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      });
      if (res.ok) {
        toast.success("Notification preferences saved");
      } else {
        toast.error("Failed to save preferences");
      }
    } catch {
      toast.error("Failed to save preferences");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      if (res.ok) {
        setSaved(true);
        setPasswords({ current: "", new: "", confirm: "" });
        toast.success("Password changed successfully");
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error("Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account preferences
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          Settings saved successfully!
        </div>
      )}

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="mr-1.5 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-1.5 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="mr-1.5 h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-1.5 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="account">
            <Trash2 className="mr-1.5 h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and avatar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">
                    {profile.name.split(" ").map((n) => n[0]).join("") || "U"}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow-md ring-2 ring-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{profile.name || "User"}</p>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Change avatar
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!file.type.startsWith("image/")) {
                      toast.error("Please select an image file");
                      return;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("File size must be under 5MB");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      toast.success("Avatar updated (preview only)");
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  icon={<User className="h-4 w-4" />}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  General Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { key: "email" as const, label: "Email notifications", desc: "Receive notifications via email" },
                    { key: "push" as const, label: "Push notifications", desc: "Receive browser push notifications" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          notifications[item.key] ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                            notifications[item.key]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Activity Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { key: "courseUpdates" as const, label: "Course updates", desc: "New lessons, announcements, and changes" },
                    { key: "quizResults" as const, label: "Quiz results", desc: "When quiz scores are available" },
                    { key: "certificates" as const, label: "Certificates", desc: "When you earn a new certificate" },
                    { key: "marketing" as const, label: "Marketing emails", desc: "Tips, promotions, and new features" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          notifications[item.key] ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                            notifications[item.key]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account stays secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  label="Current Password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, current: e.target.value }))
                  }
                  icon={<Lock className="h-4 w-4" />}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, new: e.target.value }))
                  }
                  icon={<Lock className="h-4 w-4" />}
                />
                <Input
                  label="Confirm New Password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
                  }
                  icon={<Lock className="h-4 w-4" />}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="rounded border-gray-300"
                />
                Show passwords
              </label>
              <div className="flex justify-end">
                <Button onClick={handleChangePassword}>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Choose your preferred theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "light" as const, label: "Light", icon: Sun, desc: "Light mode" },
                  { value: "dark" as const, label: "Dark", icon: Moon, desc: "Dark mode" },
                  { value: "system" as const, label: "System", icon: Monitor, desc: "Follow system" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors ${
                      theme === option.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <option.icon
                      className={`h-8 w-8 ${
                        theme === option.value ? "text-indigo-600" : "text-gray-400"
                      }`}
                    />
                    <div className="text-center">
                      <p className={`text-sm font-medium ${
                        theme === option.value ? "text-indigo-600" : "text-gray-900"
                      }`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="text-sm font-semibold text-red-800">
                  Delete Account
                </h3>
                <p className="mt-1 text-sm text-red-600">
                  Once you delete your account, there is no going back. All your data,
                  courses, progress, and certificates will be permanently removed.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4"
                  onClick={async () => {
                    if (
                      confirm(
                        "Are you sure you want to delete your account? This action cannot be undone."
                      )
                    ) {
                      try {
                        const res = await fetch("/api/auth/delete-account", {
                          method: "DELETE",
                        });
                        if (res.ok) {
                          toast.success("Account deleted successfully");
                          window.location.href = "/";
                        } else {
                          toast.error("Failed to delete account");
                        }
                      } catch {
                        toast.error("Failed to delete account");
                      }
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
