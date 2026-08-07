import { type LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  color?: string;
};

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
  },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/30",
  },
};

export default function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = "blue",
}: StatsCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className={`rounded-lg p-2.5 ${colors.iconBg}`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        {change && trend && (
          <span
            className={`ml-2 inline-flex items-center text-sm font-medium ${
              trend === "up" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="mr-0.5 h-4 w-4" />
            ) : (
              <ArrowDownRight className="mr-0.5 h-4 w-4" />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
