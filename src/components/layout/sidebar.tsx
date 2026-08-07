"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileCheck,
  Award,
  BarChart3,
  MessageSquare,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Search,
  Video,
  Bell,
  Bookmark,
  PlusCircle,
  Users,
  DollarSign,
  Package,
  Activity,
  HelpCircle,
  LogOut,
  ClipboardCheck,
  BookMarked,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

const commonItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/onboarding", label: "Onboarding", icon: ClipboardCheck },
  { href: "/dashboard/training", label: "Training", icon: BookMarked },
  { href: "/courses", label: "Browse Courses", icon: Search },
  { href: "/dashboard/quizzes", label: "Quizzes", icon: FileCheck },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/live-classes", label: "Live Classes", icon: Video },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const instructorItems = [
  { href: "/instructor/courses", label: "My Courses", icon: Package },
  { href: "/instructor/courses/new", label: "Create Course", icon: PlusCircle },
  { href: "/instructor/students", label: "My Students", icon: Users },
  { href: "/instructor/earnings", label: "Earnings", icon: DollarSign },
  { href: "/instructor/live-classes", label: "Live Classes", icon: Video },
  { href: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
];

const adminItems = [
  { href: "/admin", label: "Admin Dashboard", icon: Shield },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/courses", label: "Manage Courses", icon: BookOpen },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/health", label: "System Health", icon: Activity },
];

function NavItem({
  item,
  isActive,
  collapsed,
}: {
  item: { href: string; label: string; icon: any };
  isActive: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-indigo-500/20 text-indigo-400"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default function Sidebar({ user }: { user?: User }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const role = user?.role || "STUDENT";
  const isInstructor = role === "INSTRUCTOR";
  const isAdmin = role === "ADMIN";

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const roleColors: Record<string, string> = {
    STUDENT: "bg-emerald-500/20 text-emerald-400",
    INSTRUCTOR: "bg-amber-500/20 text-amber-400",
    ADMIN: "bg-rose-500/20 text-rose-400",
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen border-r border-slate-700/50 bg-slate-900 transition-all duration-300 md:block",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-slate-700/50 px-4">
            <GraduationCap className="h-8 w-8 text-indigo-400 shrink-0" />
            {!collapsed && (
              <span className="text-lg font-bold text-white">SmartLMS</span>
            )}
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="border-b border-slate-700/50 p-4">
              {collapsed ? (
                <img
                  src={user.image || "/avatars/default.png"}
                  alt={user.name || "User"}
                  className="mx-auto h-10 w-10 rounded-full object-cover ring-2 ring-slate-700"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <img
                    src={user.image || "/avatars/default.png"}
                    alt={user.name || "User"}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name || "User"}
                    </p>
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                        roleColors[role] || roleColors.STUDENT
                      )}
                    >
                      {role}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {/* Common Items */}
            {commonItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                />
              );
            })}

            {/* Instructor Section */}
            {isInstructor && (
              <>
                <div className="my-3 border-t border-slate-700/50" />
                {!collapsed && (
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Instructor
                  </p>
                )}
                {instructorItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={isActive}
                      collapsed={collapsed}
                    />
                  );
                })}
              </>
            )}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="my-3 border-t border-slate-700/50" />
                {!collapsed && (
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Administration
                  </p>
                )}
                {adminItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={isActive}
                      collapsed={collapsed}
                    />
                  );
                })}
              </>
            )}

            {/* Help & Support */}
            <div className="my-3 border-t border-slate-700/50" />
            <NavItem
              item={{ href: "/help", label: "Help & Support", icon: HelpCircle }}
              isActive={pathname === "/help"}
              collapsed={collapsed}
            />
          </nav>

          {/* Collapse Toggle */}
          <div className="border-t border-slate-700/50 p-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white md:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { href: "/dashboard", label: "Home", icon: LayoutDashboard },
            { href: "/courses", label: "Courses", icon: BookOpen },
            { href: "/dashboard/quizzes", label: "Quizzes", icon: FileCheck },
            { href: "/dashboard/certificates", label: "Certs", icon: Award },
            { href: "/dashboard/settings", label: "More", icon: Settings },
          ].map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-1 text-xs",
                  isActive ? "text-indigo-600" : "text-gray-500"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
