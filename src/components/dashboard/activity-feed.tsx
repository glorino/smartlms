import Link from "next/link";
import { BookOpen, Award, MessageSquare, Clock, UserPlus } from "lucide-react";

type ActivityType = "enrollment" | "completion" | "comment" | "reminder" | "signup";

type Activity = {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  user?: string;
  course?: string;
};

type ActivityFeedProps = {
  activities: Activity[];
  showViewAll?: boolean;
};

const activityIcons: Record<ActivityType, typeof BookOpen> = {
  enrollment: BookOpen,
  completion: Award,
  comment: MessageSquare,
  reminder: Clock,
  signup: UserPlus,
};

const activityColors: Record<ActivityType, string> = {
  enrollment: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  completion: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  comment: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  reminder: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  signup: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function ActivityFeed({ activities, showViewAll = true }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        {showViewAll && (
          <Link
            href="/dashboard/activity"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {activity.description}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {activity.user && <span>{activity.user}</span>}
                  {activity.user && activity.course && <span>•</span>}
                  {activity.course && <span>{activity.course}</span>}
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}
