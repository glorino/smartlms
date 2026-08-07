"use client";

import { useState } from "react";
import {
  Users,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Shield,
  MoreVertical,
  UserCheck,
  UserX,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

type User = {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Instructor" | "Admin";
  enrolledCourses: number;
  joinedDate: string;
  status: "active" | "inactive";
};

const mockUsers: User[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", role: "Instructor", enrolledCourses: 0, joinedDate: "2024-01-15", status: "active" },
  { id: "2", name: "Mike Chen", email: "mike@example.com", role: "Student", enrolledCourses: 5, joinedDate: "2024-03-22", status: "active" },
  { id: "3", name: "Emily Davis", email: "emily@example.com", role: "Student", enrolledCourses: 3, joinedDate: "2024-05-10", status: "active" },
  { id: "4", name: "Alex Wilson", email: "alex@example.com", role: "Admin", enrolledCourses: 0, joinedDate: "2023-11-01", status: "active" },
  { id: "5", name: "Jordan Lee", email: "jordan@example.com", role: "Student", enrolledCourses: 7, joinedDate: "2024-02-28", status: "active" },
  { id: "6", name: "Chris Brown", email: "chris@example.com", role: "Instructor", enrolledCourses: 0, joinedDate: "2024-04-05", status: "inactive" },
  { id: "7", name: "Dr. Lisa Wang", email: "lisa@example.com", role: "Instructor", enrolledCourses: 0, joinedDate: "2023-09-18", status: "active" },
  { id: "8", name: "Tom Anderson", email: "tom@example.com", role: "Student", enrolledCourses: 2, joinedDate: "2024-06-12", status: "active" },
];

const roleColors = {
  Student: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Instructor: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Admin: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const roleIcons = {
  Student: Users,
  Instructor: Shield,
  Admin: Shield,
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleExport = () => {
    console.log("Export users");
  };

  const handleDeactivate = (id: string) => {
    if (confirm("Are you sure you want to deactivate this user?")) {
      console.log("Deactivate user:", id);
    }
  };

  const handleEditRole = (id: string) => {
    console.log("Edit role for user:", id);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">User</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Role</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Courses</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Joined</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredUsers.map((user) => {
                      const RoleIcon = roleIcons[user.role];
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role]}`}>
                              <RoleIcon className="h-3 w-3" />
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {user.enrolledCourses}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            {user.joinedDate}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.status === "active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}>
                              {user.status === "active" ? (
                                <UserCheck className="h-3 w-3" />
                              ) : (
                                <UserX className="h-3 w-3" />
                              )}
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {openMenuId === user.id && (
                                <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                  <button
                                    onClick={() => handleEditRole(user.id)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                  >
                                    <Shield className="h-4 w-4" />
                                    Edit Role
                                  </button>
                                  <button
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                  >
                                    <Users className="h-4 w-4" />
                                    View Profile
                                  </button>
                                  <button
                                    onClick={() => handleDeactivate(user.id)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                  >
                                    <UserX className="h-4 w-4" />
                                    Deactivate
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No users found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
