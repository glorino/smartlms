"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GroupMember {
  userId: string;
  name: string;
  strengths: string[];
  role: string;
}

interface StudyGroup {
  name: string;
  members: GroupMember[];
  rationale: string;
}

interface StudyGroupsProps {
  courseId: string;
  courseName?: string;
  className?: string;
}

export default function StudyGroups({ courseId, courseName, className }: StudyGroupsProps) {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [generated, setGenerated] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`/api/ai/study-groups?courseId=${courseId}`);
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Fetch groups error:", err);
      return null;
    }
  };

  const generateGroups = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/study-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate study groups");
      }

      const data = await res.json();
      setGroups(data.groups || []);
      setGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate study groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadGroups = async () => {
      const data = await fetchGroups();
      if (data?.groups && data.groups.length > 0) {
        setGroups(data.groups);
        setGenerated(true);
      }
    };
    loadGroups();
  }, [courseId]);

  const toggleGroup = (index: number) => {
    setExpandedGroup(expandedGroup === index ? null : index);
  };

  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Study Groups</h3>
            <p className="text-sm text-gray-500">
              {generated
                ? `${groups.length} groups formed`
                : "Optimized groups based on learning profiles"}
            </p>
          </div>
        </div>
        <Button
          onClick={generateGroups}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          size="sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {generated ? "Regenerate" : "Find Study Group"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
          <p className="text-sm text-gray-500">Analyzing learning profiles...</p>
          <p className="text-xs text-gray-400">Creating optimal study groups</p>
        </div>
      )}

      {!loading && groups.length === 0 && generated && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No study groups could be formed.</p>
          <p className="text-sm text-gray-400 mt-1">
            More students need to enroll to form study groups.
          </p>
        </div>
      )}

      {!loading && groups.length > 0 && (
        <div className="space-y-3">
          {groups.map((group, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors"
            >
              <button
                onClick={() => toggleGroup(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{group.name}</h4>
                    <p className="text-xs text-gray-500">
                      {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {expandedGroup === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedGroup === index && (
                <div className="px-4 pb-4 border-t border-gray-50">
                  <p className="text-sm text-gray-600 mt-3 mb-4">{group.rationale}</p>
                  
                  <div className="space-y-2">
                    {group.members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                              {member.role}
                            </span>
                          </div>
                          {member.strengths.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.strengths.slice(0, 3).map((strength, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !generated && groups.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No study groups yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Click &quot;Find Study Group&quot; to create AI-optimized groups based on learning profiles.
          </p>
        </div>
      )}
    </div>
  );
}
